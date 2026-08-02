import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularRiesgoPorDimension } from './riesgoDimensiones.js';

test('usa el valor exacto de la celda, sin redondear, y agrega la etiqueta de riesgo', () => {
  const row = { 'Alto CJ': 62.5, 'Medio CJ': 18 };
  const resultado = calcularRiesgoPorDimension(row);
  assert.equal(resultado.confianza_justicia.alto, '62.5% riesgo alto');
  assert.equal(resultado.confianza_justicia.medio, '18% riesgo medio');
});

test('no agrega % si el valor original ya lo trae, pero sí agrega la etiqueta', () => {
  const row = { 'Alto VA': '75%', 'Medio VA': '10%' };
  const resultado = calcularRiesgoPorDimension(row);
  assert.equal(resultado.violencia_acoso.alto, '75% riesgo alto');
  assert.equal(resultado.violencia_acoso.medio, '10% riesgo medio');
});

test('celdas vacías o ausentes devuelven cadena vacía (sin etiqueta)', () => {
  const row = { 'Alto CT': '', 'Medio CT': undefined };
  const resultado = calcularRiesgoPorDimension(row);
  assert.equal(resultado.carga_trabajo.alto, '');
  assert.equal(resultado.carga_trabajo.medio, '');
});

test('devuelve las 12 dimensiones aunque la fila solo traiga algunas columnas', () => {
  const resultado = calcularRiesgoPorDimension({ 'Alto CT': 55 });
  assert.equal(Object.keys(resultado).length, 12);
  assert.equal(resultado.carga_trabajo.alto, '55% riesgo alto');
  assert.equal(resultado.vulnerabilidad.alto, '');
});
