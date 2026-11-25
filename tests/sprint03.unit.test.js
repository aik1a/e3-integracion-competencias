const test = require('node:test');
const assert = require('node:assert/strict');

const {
  esAtraso,
  esSalidaAnticipada,
  validarFecha
} = require('../src/services/reporteService');
const { normalizarFiltroEstado } = require('../src/services/usuarioService');

test('RE-01 considera 09:30 puntual y 09:31 atraso', () => {
  assert.equal(esAtraso('09:30:00'), false);
  assert.equal(esAtraso('09:31:00'), true);
});

test('RE-02 considera 17:29 salida anticipada y 17:30 puntual', () => {
  assert.equal(esSalidaAnticipada('17:29:00'), true);
  assert.equal(esSalidaAnticipada('17:30:00'), false);
});

test('los reportes validan fechas reales en formato AAAA-MM-DD', () => {
  assert.equal(validarFecha('2026-09-18'), '2026-09-18');
  assert.throws(() => validarFecha('2026-02-30'), /no es válida/);
  assert.throws(() => validarFecha('18-09-2026'), /formato/);
});

test('AP-01 acepta activo, inactivo y todos, y rechaza otro filtro', () => {
  assert.equal(normalizarFiltroEstado('ACTIVO'), 'activo');
  assert.equal(normalizarFiltroEstado('inactivo'), 'inactivo');
  assert.equal(normalizarFiltroEstado(' todos '), 'todos');
  assert.throws(() => normalizarFiltroEstado('suspendido'), /activo, inactivo o todos/);
});
