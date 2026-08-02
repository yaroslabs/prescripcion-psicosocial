import { DIMENSION_CODIGOS } from './dimensionCodigos.js';

/**
 * Convierte el valor de una celda de riesgo a texto, exactamente como viene
 * (sin redondear ni reformatear), agregando '%' solo si el valor original no
 * lo trae ya incluido, seguido de "riesgo alto"/"riesgo medio" según
 * corresponda. Celdas vacías/ausentes devuelven '' (sin agregar la etiqueta).
 */
function formatearPorcentaje(valor, etiqueta) {
  if (valor === undefined || valor === null) return '';
  const texto = String(valor).trim();
  if (texto === '') return '';
  const porcentaje = texto.includes('%') ? texto : `${texto}%`;
  return `${porcentaje} riesgo ${etiqueta}`;
}

/**
 * A partir de una fila del Excel de generación masiva, arma
 * { [dimensionId]: { alto, medio } } para las 12 dimensiones, leyendo el
 * valor exacto de las columnas "Alto {codigo}" / "Medio {codigo}".
 */
export function calcularRiesgoPorDimension(row) {
  const riesgoPorDimension = {};
  for (const { codigo, dimensionId } of DIMENSION_CODIGOS) {
    riesgoPorDimension[dimensionId] = {
      alto: formatearPorcentaje(row[`Alto ${codigo}`], 'alto'),
      medio: formatearPorcentaje(row[`Medio ${codigo}`], 'medio'),
    };
  }
  return riesgoPorDimension;
}
