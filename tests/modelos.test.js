const test = require('node:test');
const assert = require('node:assert/strict');

const Marcacion = require('../src/models/Marcacion');
const Usuario = require('../src/models/Usuario');

test('Usuario representa un empleado activo', () => {
  const usuario = new Usuario({
    identificador: 'EMP-001',
    nombre: 'Ana Pérez',
    correo: 'ana@example.com',
    perfil: 'empleado'
  });

  assert.equal(usuario.estaActivo(), true);
  assert.equal(usuario.perfil, 'empleado');
});

test('Usuario rechaza perfiles ajenos al caso', () => {
  assert.throws(
    () => new Usuario({
      identificador: 'EMP-002',
      nombre: 'Luis Soto',
      correo: 'luis@example.com',
      perfil: 'supervisor'
    }),
    /administrador o empleado/
  );
});

test('Marcacion representa una entrada con fecha y hora', () => {
  const marcacion = new Marcacion({
    usuarioIdentificador: 'EMP-001',
    accion: 'entrada',
    fechaHora: '2026-09-13T09:20:00-03:00'
  });

  assert.equal(marcacion.accion, 'entrada');
  assert.ok(marcacion.fechaHora instanceof Date);
});

test('Marcacion rechaza acciones distintas de entrada o salida', () => {
  assert.throws(
    () => new Marcacion({ usuarioIdentificador: 'EMP-001', accion: 'pausa' }),
    /entrada o salida/
  );
});
