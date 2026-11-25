const test = require('node:test');
const assert = require('node:assert/strict');

const { crearHash, verificarPassword } = require('../src/services/passwordService');
const { validarSecuencia } = require('../src/services/asistenciaService');
const { normalizarDatos, validarCorreo } = require('../src/services/usuarioService');

test('PU-005 valida una contraseña protegida y rechaza otra', async () => {
  const hash = await crearHash('ClaveSegura123');
  assert.notEqual(hash, 'ClaveSegura123');
  assert.equal(await verificarPassword('ClaveSegura123', hash), true);
  assert.equal(await verificarPassword('Incorrecta123', hash), false);
});

test('validaciones principales normalizan correo y rechazan formato inválido', () => {
  const datos = normalizarDatos({ correo: ' ANA@EXAMPLE.COM ', perfil: 'empleado' });
  assert.equal(datos.correo, 'ana@example.com');
  assert.throws(() => validarCorreo('correo-invalido'), /formato válido/);
});

test('PU-006 rechaza una salida sin entrada previa', () => {
  assert.throws(() => validarSecuencia([], 'salida'), /sin entrada previa/);
});

test('acepta entrada y luego salida', () => {
  assert.doesNotThrow(() => validarSecuencia([], 'entrada'));
  assert.doesNotThrow(() => validarSecuencia(['entrada'], 'salida'));
});

test('rechaza entrada o salida repetida', () => {
  assert.throws(() => validarSecuencia(['entrada'], 'entrada'), /ya fue registrada/);
  assert.throws(() => validarSecuencia(['entrada', 'salida'], 'salida'), /ya fue registrada/);
});
