import test from 'node:test';
import assert from 'node:assert/strict';

// localStorage no existe en node:test por defecto; se simula un mock mínimo
// suficiente para leer/escribir/borrar una clave, igual que el navegador.
function crearLocalStorageMock() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
}
globalThis.localStorage = crearLocalStorageMock();

const { leerExplicaciones, guardarExplicaciones, borrarExplicaciones } =
  await import('./explicacionesStorage.js');

test('leerExplicaciones devuelve {} si no hay nada guardado', () => {
  assert.deepEqual(leerExplicaciones(), {});
});

test('guardar y leer hacen round-trip correctamente', () => {
  const data = { carga_trabajo: 'Texto de prueba', vulnerabilidad: 'Otro texto' };
  guardarExplicaciones(data);
  assert.deepEqual(leerExplicaciones(), data);
});

test('borrarExplicaciones limpia el estado guardado', () => {
  guardarExplicaciones({ carga_trabajo: 'x' });
  borrarExplicaciones();
  assert.deepEqual(leerExplicaciones(), {});
});

test('contenido corrupto en localStorage no rompe, devuelve {}', () => {
  localStorage.setItem('explicacionesPorDimension', '{not json');
  assert.deepEqual(leerExplicaciones(), {});
});

test('contenido con forma incorrecta (array) se descarta', () => {
  localStorage.setItem('explicacionesPorDimension', JSON.stringify(['no', 'es', 'un', 'objeto']));
  assert.deepEqual(leerExplicaciones(), {});
});
