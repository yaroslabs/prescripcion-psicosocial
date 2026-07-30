import { DIMENSIONES } from './medidas.js';

export const COL_ID = 'ID Dimensión';
export const COL_NOMBRE = 'Dimensión';
export const COL_MEDIDA = 'Medida';
export const ID_POLITICA = 'politica_rpsl';

const IDS_VALIDOS = new Set([...DIMENSIONES.map((d) => d.id), ID_POLITICA]);

/**
 * Convierte una instantánea de medidas en filas planas para exportar a Excel,
 * agrupadas por dimensión en el orden oficial, con la política RPSL al final.
 */
export function snapshotAFilas(snapshot) {
  const filas = [];

  for (const d of DIMENSIONES) {
    const medidas = snapshot.medidasPorDimension[d.id] ?? [];
    for (const m of medidas) {
      filas.push({ [COL_ID]: d.id, [COL_NOMBRE]: d.nombre, [COL_MEDIDA]: m.medida });
    }
  }

  filas.push({
    [COL_ID]: ID_POLITICA,
    [COL_NOMBRE]: snapshot.politicaRPSL.dimension,
    [COL_MEDIDA]: snapshot.politicaRPSL.medida,
  });

  return filas;
}

/**
 * Convierte filas ya parseadas (arreglo de objetos por fila, como los que
 * entrega XLSX.utils.sheet_to_json) en una instantánea de medidas.
 * Función pura, sin dependencias del navegador — así se puede testear sola.
 *
 * @param {Record<string, unknown>[]} filas
 * @param {{medidasPorDimension: object, politicaRPSL: {dimension:string, medida:string}}} snapshotActual
 *   Se usa como base para la política RPSL si el archivo no trae esa fila.
 */
export function filasAaSnapshot(filas, snapshotActual) {
  if (filas.length === 0) {
    throw new Error('El archivo está vacío o no tiene el formato esperado.');
  }
  const primera = filas[0];
  if (!(COL_ID in primera) || !(COL_MEDIDA in primera)) {
    throw new Error(
      `El archivo no tiene las columnas esperadas ("${COL_ID}", "${COL_NOMBRE}", "${COL_MEDIDA}").`
    );
  }

  const medidasPorDimension = Object.fromEntries(DIMENSIONES.map((d) => [d.id, []]));
  let politicaRPSL = snapshotActual.politicaRPSL;
  const advertencias = [];
  let filasValidas = 0;

  filas.forEach((fila, i) => {
    const id = String(fila[COL_ID] ?? '').trim();
    const texto = String(fila[COL_MEDIDA] ?? '').trim();

    if (!id) return;
    if (!IDS_VALIDOS.has(id)) {
      advertencias.push(`Fila ${i + 2}: dimensión desconocida "${id}", se omitió.`);
      return;
    }
    if (!texto) return;

    if (id === ID_POLITICA) {
      politicaRPSL = { ...politicaRPSL, medida: texto };
    } else {
      const nombreDimension = DIMENSIONES.find((d) => d.id === id)?.nombre ?? '';
      medidasPorDimension[id].push({ dimension: nombreDimension, medida: texto });
    }
    filasValidas++;
  });

  if (filasValidas === 0) {
    throw new Error('No se encontró ninguna medida válida en el archivo.');
  }

  return { snapshot: { medidasPorDimension, politicaRPSL }, advertencias };
}
