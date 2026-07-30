import test from 'node:test';
import assert from 'node:assert/strict';
import { resolverMedidas } from './resolverMedidas.js';
import { DIMENSIONES, MEDIDAS_POR_DIMENSION, POLITICA_RPSL } from './medidas.js';

// Reconstruye el comportamiento actual (pre-refactor) de generateDoc.js
// para usarlo como referencia de comparación.
function resolverComoAntes({ dimensionesSeleccionadas = [], politicaRPSL }) {
  const medidas = [];
  for (const id of dimensionesSeleccionadas) {
    for (const m of (MEDIDAS_POR_DIMENSION[id] ?? [])) {
      medidas.push({ dimension: m.dimension, medida: m.medida });
    }
  }
  if (politicaRPSL === 'si') {
    medidas.push({ dimension: POLITICA_RPSL.dimension, medida: POLITICA_RPSL.medida });
  }
  return medidas;
}

function comoAntes(resolved) {
  return resolved.map((r) => ({ dimension: r.dimensionNombre, medida: r.medida }));
}

test('todas las dimensiones seleccionadas, sin politica', () => {
  const ids = DIMENSIONES.map((d) => d.id);
  const resultado = resolverMedidas({ dimensionesSeleccionadas: ids, politicaRPSL: 'no' });
  assert.deepEqual(comoAntes(resultado), resolverComoAntes({ dimensionesSeleccionadas: ids, politicaRPSL: 'no' }));
  assert.ok(resultado.every((r) => r.origen === 'catalogo'));
});

test('subconjunto de dimensiones + politica activada', () => {
  const seleccion = { dimensionesSeleccionadas: ['carga_trabajo', 'conflicto_rol', 'vulnerabilidad'], politicaRPSL: 'si' };
  const resultado = resolverMedidas(seleccion);
  assert.deepEqual(comoAntes(resultado), resolverComoAntes(seleccion));
  const ultima = resultado[resultado.length - 1];
  assert.equal(ultima.dimensionId, 'politica_rpsl');
  assert.equal(ultima.medida, POLITICA_RPSL.medida);
});

test('sin dimensiones seleccionadas, con politica (caso modo masivo)', () => {
  const resultado = resolverMedidas({ dimensionesSeleccionadas: [], politicaRPSL: 'si' });
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].dimensionId, 'politica_rpsl');
});

test('id de dimension desconocido no rompe y no agrega filas', () => {
  const resultado = resolverMedidas({ dimensionesSeleccionadas: ['no_existe'], politicaRPSL: 'no' });
  assert.deepEqual(resultado, []);
});
