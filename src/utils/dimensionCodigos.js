/**
 * Mapeo entre las siglas cortas del cuestionario CEAL-SM/SUSESO (usadas como
 * encabezados de columna en los Excel de generación masiva y de preguntas
 * por dimensión) y los IDs internos de dimensión definidos en medidas.js.
 */
export const DIMENSION_CODIGOS = [
  { codigo: 'CT', dimensionId: 'carga_trabajo' },
  { codigo: 'EM', dimensionId: 'exigencias_emocionales' },
  { codigo: 'DP', dimensionId: 'desarrollo_profesional' },
  { codigo: 'RC', dimensionId: 'reconocimiento_claridad_rol' },
  { codigo: 'CR', dimensionId: 'conflicto_rol' },
  { codigo: 'QL', dimensionId: 'calidad_liderazgo' },
  { codigo: 'CM', dimensionId: 'companerismo' },
  { codigo: 'IT', dimensionId: 'inseguridad_condiciones' },
  { codigo: 'TV', dimensionId: 'equilibrio_trabajo_vida' },
  { codigo: 'CJ', dimensionId: 'confianza_justicia' },
  { codigo: 'VU', dimensionId: 'vulnerabilidad' },
  { codigo: 'VA', dimensionId: 'violencia_acoso' },
];
