import test from 'node:test';
import assert from 'node:assert/strict';
import { filasAaSnapshot } from './medidasExcelFormato.js';
import { crearSnapshotDesdeOficial } from './defaultMedidasSource.js';

const COL_ID = 'ID Dimensión';
const COL_NOMBRE = 'Dimensión';
const COL_MEDIDA = 'Medida';

test('archivo vacio lanza error', () => {
  assert.throws(() => filasAaSnapshot([], crearSnapshotDesdeOficial()), /vacío/);
});

test('archivo sin las columnas esperadas lanza error', () => {
  assert.throws(
    () => filasAaSnapshot([{ Foo: 'bar' }], crearSnapshotDesdeOficial()),
    /columnas esperadas/
  );
});

test('fila con id de dimension desconocido se omite con advertencia', () => {
  const filas = [
    { [COL_ID]: 'no_existe', [COL_NOMBRE]: 'Lo que sea', [COL_MEDIDA]: 'Texto' },
    { [COL_ID]: 'carga_trabajo', [COL_NOMBRE]: 'Carga de Trabajo', [COL_MEDIDA]: 'Medida valida' },
  ];
  const { snapshot, advertencias } = filasAaSnapshot(filas, crearSnapshotDesdeOficial());
  assert.equal(advertencias.length, 1);
  assert.match(advertencias[0], /no_existe/);
  assert.deepEqual(snapshot.medidasPorDimension.carga_trabajo, [
    { dimension: 'Carga de Trabajo', medida: 'Medida valida' },
  ]);
});

test('fila de politica_rpsl actualiza solo el texto, no la dimension', () => {
  const base = crearSnapshotDesdeOficial();
  const filas = [
    { [COL_ID]: 'politica_rpsl', [COL_NOMBRE]: 'Nombre que se ignora', [COL_MEDIDA]: 'Nueva politica' },
  ];
  const { snapshot } = filasAaSnapshot(filas, base);
  assert.equal(snapshot.politicaRPSL.medida, 'Nueva politica');
  assert.equal(snapshot.politicaRPSL.dimension, base.politicaRPSL.dimension);
});

test('si el archivo no trae politica_rpsl, se conserva la del snapshot actual', () => {
  const base = crearSnapshotDesdeOficial();
  const filas = [{ [COL_ID]: 'carga_trabajo', [COL_NOMBRE]: 'Carga de Trabajo', [COL_MEDIDA]: 'X' }];
  const { snapshot } = filasAaSnapshot(filas, base);
  assert.deepEqual(snapshot.politicaRPSL, base.politicaRPSL);
});

test('dimensiones ausentes en el archivo quedan con lista vacia (medidas eliminadas)', () => {
  const filas = [{ [COL_ID]: 'carga_trabajo', [COL_NOMBRE]: 'Carga de Trabajo', [COL_MEDIDA]: 'Unica' }];
  const { snapshot } = filasAaSnapshot(filas, crearSnapshotDesdeOficial());
  assert.deepEqual(snapshot.medidasPorDimension.conflicto_rol, []);
});

test('filas con medida vacia se descartan', () => {
  const filas = [{ [COL_ID]: 'carga_trabajo', [COL_NOMBRE]: 'Carga de Trabajo', [COL_MEDIDA]: '   ' }];
  assert.throws(() => filasAaSnapshot(filas, crearSnapshotDesdeOficial()), /ninguna medida válida/);
});

test('roundtrip: exportar el catalogo oficial e importarlo de vuelta da el mismo resultado', () => {
  const oficial = crearSnapshotDesdeOficial();
  const filas = [];
  for (const [id, medidas] of Object.entries(oficial.medidasPorDimension)) {
    for (const m of medidas) {
      filas.push({ [COL_ID]: id, [COL_NOMBRE]: m.dimension, [COL_MEDIDA]: m.medida });
    }
  }
  filas.push({
    [COL_ID]: 'politica_rpsl',
    [COL_NOMBRE]: oficial.politicaRPSL.dimension,
    [COL_MEDIDA]: oficial.politicaRPSL.medida,
  });

  const { snapshot } = filasAaSnapshot(filas, oficial);
  assert.deepEqual(snapshot, oficial);
});
