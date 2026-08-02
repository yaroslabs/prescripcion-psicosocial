import test from 'node:test';
import assert from 'node:assert/strict';
import {
  excelSerialToDate,
  formatearFechaUTC,
  formatearFechaLocal,
  formatearFechaISO,
  parsearFechaISOLocal,
  sumarAnios,
} from './fechas.js';

test('sumarAnios agrega N años sin mutar la fecha original', () => {
  const original = new Date(2026, 0, 15); // 15-ene-2026 local
  const resultado = sumarAnios(original, 1);
  assert.equal(resultado.getFullYear(), 2027);
  assert.equal(resultado.getMonth(), 0);
  assert.equal(resultado.getDate(), 15);
  assert.equal(original.getFullYear(), 2026); // no se mutó
});

test('formatearFechaISO / parsearFechaISOLocal hacen round-trip sin corrimiento de día', () => {
  const fecha = new Date(2026, 7, 1); // 1-ago-2026 local
  const iso = formatearFechaISO(fecha);
  assert.equal(iso, '2026-08-01');
  const reconstruida = parsearFechaISOLocal(iso);
  assert.equal(reconstruida.getFullYear(), 2026);
  assert.equal(reconstruida.getMonth(), 7);
  assert.equal(reconstruida.getDate(), 1);
});

test('formatearFechaLocal usa componentes locales con el separador indicado', () => {
  const fecha = new Date(2026, 0, 5); // 5-ene-2026 local
  assert.equal(formatearFechaLocal(fecha), '05-01-2026');
  assert.equal(formatearFechaLocal(fecha, '/'), '05/01/2026');
});

test('formatearFechaUTC usa componentes UTC (fechas parseadas de Excel)', () => {
  const fecha = excelSerialToDate(44927); // 01-01-2023 en el epoch de Excel
  assert.equal(formatearFechaUTC(fecha), '01/01/2023');
});
