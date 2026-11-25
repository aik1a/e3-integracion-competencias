const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('schema SQL contiene el modelo y las restricciones del Sprint 01', () => {
  const schema = fs.readFileSync(
    path.join(__dirname, '..', 'database', 'schema.sql'),
    'utf8'
  );

  assert.match(schema, /CREATE TABLE usuarios/i);
  assert.match(schema, /CREATE TABLE marcaciones/i);
  assert.match(schema, /UNIQUE \(correo\)/i);
  assert.match(schema, /ENUM\('administrador', 'empleado'\)/i);
  assert.match(schema, /ENUM\('Activo', 'Inactivo'\)/i);
  assert.match(schema, /ENUM\('entrada', 'salida'\)/i);
  assert.match(schema, /CHECK \(perfil IN \('administrador', 'empleado'\)\)/i);
  assert.match(schema, /CHECK \(estado IN \('Activo', 'Inactivo'\)\)/i);
  assert.match(schema, /CHECK \(accion IN \('entrada', 'salida'\)\)/i);
  assert.match(schema, /FOREIGN KEY \(usuario_id\) REFERENCES usuarios \(id\)/i);
  assert.match(schema, /UNIQUE \(usuario_id, fecha, accion\)/i);
});
