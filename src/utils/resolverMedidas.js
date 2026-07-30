import { defaultMedidasSource } from './defaultMedidasSource.js';

/**
 * Resuelve la lista de medidas a incluir en el documento, a partir de las
 * dimensiones seleccionadas y la fuente de medidas indicada (por defecto, el
 * catálogo oficial).
 *
 * @param {{ dimensionesSeleccionadas?: string[], politicaRPSL?: string }} seleccion
 * @param {import('./medidasSource.js').MedidasSource} [source]
 * @returns {{dimensionId: string, dimensionNombre: string, medida: string, origen: string}[]}
 */
export function resolverMedidas(
  { dimensionesSeleccionadas = [], politicaRPSL },
  source = defaultMedidasSource
) {
  const resolved = [];

  for (const id of dimensionesSeleccionadas) {
    for (const m of source.getMedidasPorDimension(id)) {
      resolved.push({
        dimensionId: id,
        dimensionNombre: m.dimension,
        medida: m.medida,
        origen: source.origen,
      });
    }
  }

  if (politicaRPSL === 'si') {
    const politica = source.getPoliticaRPSL();
    resolved.push({
      dimensionId: 'politica_rpsl',
      dimensionNombre: politica.dimension,
      medida: politica.medida,
      origen: source.origen,
    });
  }

  return resolved;
}
