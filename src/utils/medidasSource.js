/**
 * @typedef {{id: string, nombre: string}} Dimension
 * @typedef {{dimension: string, medida: string}} MedidaCruda
 *
 * @typedef {Object} MedidasSource
 * @property {() => Dimension[]} getDimensiones
 * @property {(dimensionId: string) => MedidaCruda[]} getMedidasPorDimension
 * @property {() => MedidaCruda} getPoliticaRPSL
 * @property {string} origen
 */

export {};
