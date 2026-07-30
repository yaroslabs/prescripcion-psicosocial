import { DIMENSIONES, MEDIDAS_POR_DIMENSION, POLITICA_RPSL } from './medidas.js';

/** @type {import('./medidasSource.js').MedidasSource} */
export const defaultMedidasSource = {
  origen: 'catalogo',
  getDimensiones: () => DIMENSIONES,
  getMedidasPorDimension: (dimensionId) => MEDIDAS_POR_DIMENSION[dimensionId] ?? [],
  getPoliticaRPSL: () => POLITICA_RPSL,
};

/**
 * Copia el catálogo oficial completo a la forma de "instantánea" editable
 * (la misma que se guarda en localStorage), para usar como punto de partida
 * la primera vez que se abre el editor de medidas personalizadas.
 */
export function crearSnapshotDesdeOficial() {
  return {
    medidasPorDimension: Object.fromEntries(
      DIMENSIONES.map((d) => [d.id, (MEDIDAS_POR_DIMENSION[d.id] ?? []).map((m) => ({ ...m }))])
    ),
    politicaRPSL: { ...POLITICA_RPSL },
  };
}
