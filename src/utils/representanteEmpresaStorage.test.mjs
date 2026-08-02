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

const { leerRepresentanteEmpresa, guardarRepresentanteEmpresa, borrarRepresentanteEmpresa } =
  await import('./representanteEmpresaStorage.js');

const VACIO = { nombre: '', apellidoPaterno: '', apellidoMaterno: '', rut: '', email: '' };

test('leerRepresentanteEmpresa devuelve valores vacíos si no hay nada guardado', () => {
  assert.deepEqual(leerRepresentanteEmpresa(), VACIO);
});

test('guardar y leer hacen round-trip correctamente', () => {
  const data = { nombre: 'Ana', apellidoPaterno: 'Soto', apellidoMaterno: 'Ríos', rut: '11.111.111-1', email: 'ana@x.cl' };
  guardarRepresentanteEmpresa(data);
  assert.deepEqual(leerRepresentanteEmpresa(), data);
});

test('borrarRepresentanteEmpresa restaura los valores vacíos', () => {
  guardarRepresentanteEmpresa({ nombre: 'X', apellidoPaterno: 'Y', apellidoMaterno: 'Z', rut: 'R', email: 'E' });
  borrarRepresentanteEmpresa();
  assert.deepEqual(leerRepresentanteEmpresa(), VACIO);
});

test('contenido con forma incorrecta (campo faltante) se descarta', () => {
  localStorage.setItem('representanteEmpresa', JSON.stringify({ nombre: 'Solo esto' }));
  assert.deepEqual(leerRepresentanteEmpresa(), VACIO);
});
