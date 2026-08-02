import test from 'node:test';
import assert from 'node:assert/strict';

function crearLocalStorageMock() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
}
globalThis.localStorage = crearLocalStorageMock();

const { leerResponsables, guardarResponsables, borrarResponsables } =
  await import('./responsablesStorage.js');

test('leerResponsables devuelve valores vacíos si no hay nada guardado', () => {
  assert.deepEqual(leerResponsables(), { responsableMonitoreo: '', dptoResponsable: '' });
});

test('guardar y leer hacen round-trip correctamente', () => {
  const data = { responsableMonitoreo: 'Juan Pérez', dptoResponsable: 'Prevención de Riesgos' };
  guardarResponsables(data);
  assert.deepEqual(leerResponsables(), data);
});

test('borrarResponsables restaura los valores vacíos', () => {
  guardarResponsables({ responsableMonitoreo: 'X', dptoResponsable: 'Y' });
  borrarResponsables();
  assert.deepEqual(leerResponsables(), { responsableMonitoreo: '', dptoResponsable: '' });
});

test('contenido con forma incorrecta se descarta', () => {
  localStorage.setItem('responsablesMonitoreo', JSON.stringify({ responsableMonitoreo: 'X' }));
  assert.deepEqual(leerResponsables(), { responsableMonitoreo: '', dptoResponsable: '' });
});
