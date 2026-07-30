import { DIMENSIONES } from './medidas.js';
import { defaultMedidasSource } from './defaultMedidasSource.js';
import { leerMedidasPersonalizadas } from './medidasPersonalizadasStorage.js';

/**
 * Construye una MedidasSource a partir de una "instantánea" de medidas
 * personalizadas (misma forma que se guarda en localStorage). Las dimensiones
 * (ids y nombres) no son personalizables, solo el texto/orden de las medidas
 * dentro de cada una.
 *
 * @param {{medidasPorDimension: Record<string, {dimension:string, medida:string}[]>, politicaRPSL: {dimension:string, medida:string}}} data
 * @returns {import('./medidasSource.js').MedidasSource}
 */
export function crearCustomMedidasSource(data) {
  return {
    origen: 'personalizada',
    getDimensiones: () => DIMENSIONES,
    getMedidasPorDimension: (dimensionId) => data.medidasPorDimension[dimensionId] ?? [],
    getPoliticaRPSL: () => data.politicaRPSL,
  };
}

/**
 * Decide qué fuente de medidas usar: si hay una personalización válida guardada
 * en localStorage se usa automáticamente; si no, el catálogo oficial.
 *
 * @returns {import('./medidasSource.js').MedidasSource}
 */
export function obtenerFuenteActiva() {
  const data = leerMedidasPersonalizadas();
  return data ? crearCustomMedidasSource(data) : defaultMedidasSource;
}
