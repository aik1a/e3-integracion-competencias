const test = require('node:test');
const assert = require('node:assert/strict');
const mysql = require('mysql2/promise');

require('dotenv').config({ quiet: true });
const { crearApp } = require('../src/app');
const { crearHash } = require('../src/services/passwordService');

function configuracionDb() {
  return { host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'control_asistencia', user: process.env.DB_USER || 'app',
    password: process.env.DB_PASSWORD || '' };
}

async function solicitud(baseUrl, ruta, opciones = {}, cookie = '') {
  return fetch(`${baseUrl}${ruta}`, { redirect: 'manual', ...opciones,
    headers: { 'content-type': 'application/x-www-form-urlencoded', ...(cookie ? { cookie } : {}), ...(opciones.headers || {}) } });
}

test('Sprint 02 integra acceso, usuarios, roles y marcaciones con MySQL', async (t) => {
  const pool = mysql.createPool(configuracionDb());
  const marca = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const correoAdmin = `admin-${marca}@example.test`;
  const correoEmpleado = `empleado-${marca}@example.test`;
  const ids = [];
  t.after(async () => {
    if (ids.length) {
      await pool.query('DELETE FROM marcaciones WHERE usuario_id IN (?)', [ids]);
      await pool.query('DELETE FROM usuarios WHERE id IN (?)', [ids]);
    }
    await pool.end();
  });

  const [admin] = await pool.execute(
    `INSERT INTO usuarios (identificador, nombre, correo, password_hash, perfil, estado)
     VALUES (?, ?, ?, ?, 'administrador', 'Activo')`,
    [`ADM-${marca}`, 'Admin integración', correoAdmin, await crearHash('AdminTest123')]
  );
  ids.push(admin.insertId);
  const app = crearApp({ pool });
  const servidor = app.listen(0);
  t.after(() => servidor.close());
  await new Promise((resolve) => servidor.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${servidor.address().port}`;

  const loginIncorrecto = await solicitud(baseUrl, '/login', { method: 'POST', body: new URLSearchParams({ correo: correoAdmin, password: 'mala' }) });
  assert.equal(loginIncorrecto.status, 401);
  const loginAdmin = await solicitud(baseUrl, '/login', { method: 'POST', body: new URLSearchParams({ correo: correoAdmin, password: 'AdminTest123' }) });
  assert.equal(loginAdmin.status, 302);
  const cookieAdmin = loginAdmin.headers.get('set-cookie').split(';')[0];
  const pantallaUsuarios = await solicitud(baseUrl, '/usuarios', { method: 'GET' }, cookieAdmin);
  assert.equal(pantallaUsuarios.status, 200);
  assert.match(await pantallaUsuarios.text(), /Gestión de usuarios/);

  const crear = await solicitud(baseUrl, '/usuarios', { method: 'POST', body: new URLSearchParams({
    identificador: `EMP-${marca}`, nombre: 'Empleado integración', correo: correoEmpleado,
    password: 'Empleado123', perfil: 'empleado', estado: 'Activo' }) }, cookieAdmin);
  assert.equal(crear.status, 302);
  const [empleados] = await pool.execute('SELECT id, password_hash FROM usuarios WHERE correo = ?', [correoEmpleado]);
  assert.equal(empleados.length, 1);
  assert.notEqual(empleados[0].password_hash, 'Empleado123');
  const empleadoId = empleados[0].id;
  ids.push(empleadoId);

  const modificar = await solicitud(baseUrl, `/usuarios/${empleadoId}`, { method: 'POST', body: new URLSearchParams({
    identificador: `EMP-${marca}`, nombre: 'Empleado modificado', correo: correoEmpleado,
    perfil: 'empleado', estado: 'Activo' }) }, cookieAdmin);
  assert.equal(modificar.status, 302);
  const loginEmpleado = await solicitud(baseUrl, '/login', { method: 'POST', body: new URLSearchParams({ correo: correoEmpleado, password: 'Empleado123' }) });
  assert.equal(loginEmpleado.status, 302);
  const cookieEmpleado = loginEmpleado.headers.get('set-cookie').split(';')[0];
  assert.equal((await solicitud(baseUrl, '/usuarios', { method: 'GET' }, cookieEmpleado)).status, 403);
  const pantallaAsistencia = await solicitud(baseUrl, '/asistencia', { method: 'GET' }, cookieEmpleado);
  assert.equal(pantallaAsistencia.status, 200);
  const htmlAsistencia = await pantallaAsistencia.text();
  assert.match(htmlAsistencia, /Registrar entrada/);
  assert.match(htmlAsistencia, /Registrar salida/);

  const salidaSinEntrada = await solicitud(baseUrl, '/asistencia/marcar', { method: 'POST', body: new URLSearchParams({ accion: 'salida' }) }, cookieEmpleado);
  assert.match(salidaSinEntrada.headers.get('location'), /sin%20entrada%20previa/);
  const entrada = await solicitud(baseUrl, '/asistencia/marcar', { method: 'POST', body: new URLSearchParams({ accion: 'entrada' }) }, cookieEmpleado);
  assert.match(entrada.headers.get('location'), /registrada%20correctamente/);
  const entradaRepetida = await solicitud(baseUrl, '/asistencia/marcar', { method: 'POST', body: new URLSearchParams({ accion: 'entrada' }) }, cookieEmpleado);
  assert.match(entradaRepetida.headers.get('location'), /ya%20fue%20registrada/);
  const salida = await solicitud(baseUrl, '/asistencia/marcar', { method: 'POST', body: new URLSearchParams({ accion: 'salida' }) }, cookieEmpleado);
  assert.match(salida.headers.get('location'), /registrada%20correctamente/);
  const [marcaciones] = await pool.execute('SELECT accion FROM marcaciones WHERE usuario_id = ? ORDER BY fecha_hora', [empleadoId]);
  assert.deepEqual(marcaciones.map((item) => item.accion), ['entrada', 'salida']);

  assert.equal((await solicitud(baseUrl, `/usuarios/${empleadoId}/desactivar`, { method: 'POST', body: '' }, cookieAdmin)).status, 302);
  const loginInactivo = await solicitud(baseUrl, '/login', { method: 'POST', body: new URLSearchParams({ correo: correoEmpleado, password: 'Empleado123' }) });
  assert.equal(loginInactivo.status, 401);
});
