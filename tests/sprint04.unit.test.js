const test = require('node:test');
const assert = require('node:assert/strict');
const pages = require('../src/views/pages');
const { UsuarioService } = require('../src/services/usuarioService');

const admin = { nombre: 'Administración', perfil: 'administrador' };
const empleado = {
  id: 42, identificador: 'EMP-42', nombre: 'Empleado', correo: 'empleado@example.test',
  perfil: 'empleado', estado: 'Activo'
};

test('QA-004 presenta las tres fechas humanas y conserva el input técnico', () => {
  const html = pages.reportes(admin, '2026-09-18', {
    atrasos: [{ ...empleado, fecha: '2026-09-18', hora: '09:31:00' }],
    salidasAnticipadas: [{ ...empleado, fecha: new Date(2026, 8, 18), hora: '17:29:00' }],
    inasistencias: [{ ...empleado, fecha: '2026-09-18' }]
  });
  assert.equal((html.match(/<td>18-09-2026<\/td>/g) || []).length, 3);
  assert.match(html, /type="date" required value="2026-09-18"/);
  assert.doesNotMatch(html, /GMT|UTC|Fri Sep/);
});

test('QA-001 muestra fecha y hora local de marcaciones, también si el driver entrega Date', () => {
  const html = pages.asistencia(empleado, [
    { accion: 'entrada', fecha_hora: '2026-09-18 09:31:00' },
    { accion: 'salida', fecha_hora: new Date(2026, 8, 18, 17, 29, 0) }
  ]);
  assert.match(html, /2026-09-18 09:31:00/);
  assert.match(html, /2026-09-18 17:29:00/);
  assert.doesNotMatch(html, /GMT|UTC/);
});

test('QA-005, QA-006 y QA-008 muestran confirmaciones y acciones distintas', () => {
  const html = pages.listaUsuarios(admin, [empleado]);
  assert.match(html, /action="\/usuarios\/42\/desactivar"[^>]*onsubmit="return confirm\('[^']*historial se conservará/);
  assert.match(html, /action="\/usuarios\/42\/eliminar"[^>]*onsubmit="return confirm\('[^']*irreversible/);
  assert.match(html, /<button class="secundario">Desactivar<\/button>/);
  assert.match(html, /<button class="secundario">Eliminar<\/button>/);
  // Al cancelar confirm(), el navegador no envía el formulario.
  assert.equal((html.match(/return confirm\(/g) || []).length, 2);
});

test('QA-006 elimina físicamente por identificador y QA-007 traduce la restricción', async () => {
  const consultas = [];
  const service = new UsuarioService({ execute: async (sql, params) => {
    consultas.push([sql, params]);
    return [{ affectedRows: 1 }];
  } });
  await service.eliminar(42);
  assert.deepEqual(consultas, [['DELETE FROM usuarios WHERE id = ?', [42]]]);

  const protegido = new UsuarioService({ execute: async () => {
    throw Object.assign(new Error('foreign key'), { code: 'ER_ROW_IS_REFERENCED_2' });
  } });
  await assert.rejects(protegido.eliminar(42), /marcaciones históricas.*Desactivar.*conservar el historial/);
});
