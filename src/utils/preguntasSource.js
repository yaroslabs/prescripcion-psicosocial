import * as XLSX from 'xlsx';
import preguntasUrl from '../assets/Preguntas_CEAL-SM_SUSESO_por_Dimension.xlsx?url';

// Códigos de columna "Dimensión (Código)" tal como vienen en este Excel en
// particular. No son los mismos que DIMENSION_CODIGOS (usados para las
// columnas "Alto {codigo}"/"Medio {codigo}" del Excel de generación masiva):
// aquí Compañerismo usa "CO" en vez de "CM". Además este archivo no trae
// ninguna fila para "Reconocimiento y Claridad de Rol" — esa dimensión queda
// sin preguntas hasta que se agreguen al Excel de origen.
const CODIGO_A_DIMENSION_ID = {
  CT: 'carga_trabajo',
  EM: 'exigencias_emocionales',
  DP: 'desarrollo_profesional',
  RC: 'reconocimiento_claridad_rol',
  CR: 'conflicto_rol',
  QL: 'calidad_liderazgo',
  CO: 'companerismo',
  IT: 'inseguridad_condiciones',
  TV: 'equilibrio_trabajo_vida',
  CJ: 'confianza_justicia',
  VU: 'vulnerabilidad',
  VA: 'violencia_acoso',
};

let cachedPromise = null;

async function cargarPreguntasPorDimension() {
  const response = await fetch(preguntasUrl);
  const arrayBuffer = await response.arrayBuffer();
  const wb = XLSX.read(arrayBuffer, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

  const preguntasPorDimension = {};
  for (const row of rows) {
    const codigo = String(row['Dimensión (Código)'] ?? '').trim();
    const dimensionId = CODIGO_A_DIMENSION_ID[codigo];
    if (!dimensionId) continue;

    const pregunta = String(row['Pregunta'] ?? '').trim();
    if (!pregunta) continue;

    preguntasPorDimension[dimensionId] = preguntasPorDimension[dimensionId]
      ? `${preguntasPorDimension[dimensionId]}\n${pregunta}`
      : pregunta;
  }
  return preguntasPorDimension;
}

/**
 * Devuelve un mapa { [dimensionId]: 'pregunta1\npregunta2\n...' } armado a
 * partir de Preguntas_CEAL-SM_SUSESO_por_Dimension.xlsx. El archivo se lee y
 * parsea una sola vez (se cachea la promesa a nivel de módulo) para no
 * releerlo en cada matriz generada durante la generación masiva.
 */
export function obtenerPreguntasPorDimension() {
  if (!cachedPromise) {
    cachedPromise = cargarPreguntasPorDimension().catch((err) => {
      cachedPromise = null;
      throw err;
    });
  }
  return cachedPromise;
}
