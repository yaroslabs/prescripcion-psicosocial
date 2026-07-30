import test from 'node:test';
import assert from 'node:assert/strict';

function crearLocalStorageFake() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
}

globalThis.localStorage = crearLocalStorageFake();

const {
  leerMedidasPersonalizadas,
  guardarMedidasPersonalizadas,
  borrarMedidasPersonalizadas,
} = await import('./medidasPersonalizadasStorage.js');
const { crearCustomMedidasSource, obtenerFuenteActiva } = await import('./customMedidasSource.js');

const SNAPSHOT_EJEMPLO = {
  medidasPorDimension: {
    carga_trabajo: [{ dimension: 'Carga de Trabajo', medida: 'Medida personalizada 1' }],
  },
  politicaRPSL: { dimension: 'Política RPSL', medida: 'Medida de politica personalizada' },
};

test('leerMedidasPersonalizadas devuelve null si no hay nada guardado', () => {
  borrarMedidasPersonalizadas();
  assert.equal(leerMedidasPersonalizadas(), null);
});

test('guardar y leer hacen round-trip correctamente', () => {
  guardarMedidasPersonalizadas(SNAPSHOT_EJEMPLO);
  assert.deepEqual(leerMedidasPersonalizadas(), SNAPSHOT_EJEMPLO);
  borrarMedidasPersonalizadas();
});

test('contenido corrupto en localStorage no rompe, devuelve null', () => {
  localStorage.setItem('medidasPersonalizadas', '{ esto no es json valido');
  assert.equal(leerMedidasPersonalizadas(), null);
  localStorage.removeItem('medidasPersonalizadas');
});

test('contenido con forma incorrecta se descarta', () => {
  localStorage.setItem('medidasPersonalizadas', JSON.stringify({ foo: 'bar' }));
  assert.equal(leerMedidasPersonalizadas(), null);
  localStorage.removeItem('medidasPersonalizadas');
});

test('borrarMedidasPersonalizadas restaura el estado sin personalizacion', () => {
  guardarMedidasPersonalizadas(SNAPSHOT_EJEMPLO);
  borrarMedidasPersonalizadas();
  assert.equal(leerMedidasPersonalizadas(), null);
});

test('obtenerFuenteActiva devuelve el catalogo oficial si no hay personalizacion', () => {
  borrarMedidasPersonalizadas();
  const source = obtenerFuenteActiva();
  assert.equal(source.origen, 'catalogo');
});

test('obtenerFuenteActiva devuelve la fuente personalizada automaticamente si existe', () => {
  guardarMedidasPersonalizadas(SNAPSHOT_EJEMPLO);
  const source = obtenerFuenteActiva();
  assert.equal(source.origen, 'personalizada');
  assert.deepEqual(source.getMedidasPorDimension('carga_trabajo'), SNAPSHOT_EJEMPLO.medidasPorDimension.carga_trabajo);
  assert.equal(source.getMedidasPorDimension('conflicto_rol').length, 0);
  assert.equal(source.getPoliticaRPSL().medida, SNAPSHOT_EJEMPLO.politicaRPSL.medida);
  borrarMedidasPersonalizadas();
});

test('crearCustomMedidasSource usa DIMENSIONES oficiales (no personalizables)', () => {
  const source = crearCustomMedidasSource(SNAPSHOT_EJEMPLO);
  assert.ok(source.getDimensiones().some((d) => d.id === 'carga_trabajo'));
  assert.equal(source.getDimensiones().length, 12);
});
