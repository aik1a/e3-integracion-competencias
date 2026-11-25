function escapar(valor) {
  return String(valor ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function pagina(titulo, contenido, usuario) {
  const navegacion = usuario ? `<nav><span>${escapar(usuario.nombre)} (${escapar(usuario.perfil)})</span>
    ${usuario.perfil === 'administrador' ? '<a href="/usuarios">Usuarios</a><a href="/reportes">Reportes</a>' : '<a href="/asistencia">Asistencia</a>'}
    <form action="/logout" method="post"><button type="submit">Cerrar sesión</button></form></nav>` : '';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapar(titulo)}</title>
    <link rel="stylesheet" href="/styles.css"></head><body><main>${navegacion}<h1>${escapar(titulo)}</h1>${contenido}</main></body></html>`;
}

function mensaje(texto, tipo = 'ok') {
  return texto ? `<p class="mensaje ${tipo}">${escapar(texto)}</p>` : '';
}

function formatearFecha(fecha) {
  const valor = fecha instanceof Date
    ? `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
    : String(fecha);
  return /^\d{4}-\d{2}-\d{2}$/.test(valor)
    ? `${valor.slice(8, 10)}-${valor.slice(5, 7)}-${valor.slice(0, 4)}`
    : valor;
}

function formatearFechaHora(fechaHora) {
  if (fechaHora instanceof Date) {
    const fecha = `${fechaHora.getFullYear()}-${String(fechaHora.getMonth() + 1).padStart(2, '0')}-${String(fechaHora.getDate()).padStart(2, '0')}`;
    const hora = [fechaHora.getHours(), fechaHora.getMinutes(), fechaHora.getSeconds()]
      .map((valor) => String(valor).padStart(2, '0')).join(':');
    return `${fecha} ${hora}`;
  }
  return String(fechaHora).slice(0, 19);
}

function login(error = '') {
  return pagina('Control de asistencia', `${mensaje(error, 'error')}
    <form action="/login" method="post" class="tarjeta">
      <label>Correo<input name="correo" type="email" required autocomplete="username"></label>
      <label>Contraseña<input name="password" type="password" required autocomplete="current-password"></label>
      <button type="submit">Ingresar</button></form>`);
}

function asistencia(usuario, marcaciones, exito = '', error = '') {
  const filas = marcaciones.length
    ? marcaciones.map((m) => `<li><strong>${escapar(m.accion)}</strong> — ${escapar(formatearFechaHora(m.fecha_hora))}</li>`).join('')
    : '<li>No hay marcaciones registradas hoy.</li>';
  return pagina('Registrar asistencia', `${mensaje(exito)}${mensaje(error, 'error')}
    <section class="tarjeta"><div class="acciones">
      <form action="/asistencia/marcar" method="post"><input type="hidden" name="accion" value="entrada"><button>Registrar entrada</button></form>
      <form action="/asistencia/marcar" method="post"><input type="hidden" name="accion" value="salida"><button>Registrar salida</button></form>
    </div><h2>Marcaciones de hoy</h2><ul>${filas}</ul></section>`, usuario);
}

function listaUsuarios(usuario, usuarios, exito = '', error = '') {
  const filas = usuarios.map((item) => `<tr><td>${escapar(item.identificador)}</td><td>${escapar(item.nombre)}</td>
    <td>${escapar(item.correo)}</td><td>${escapar(item.perfil)}</td><td>${escapar(item.estado)}</td>
    <td><a href="/usuarios/${item.id}/editar">Editar</a>
    ${item.estado === 'Activo' ? `<form class="en-linea" action="/usuarios/${item.id}/desactivar" method="post" onsubmit="return confirm('¿Desactivar este usuario? No podrá ingresar y su historial se conservará.');"><button class="secundario">Desactivar</button></form>` : ''}
    <form class="en-linea" action="/usuarios/${item.id}/eliminar" method="post" onsubmit="return confirm('¿Eliminar este usuario definitivamente? Esta acción es irreversible.');"><button class="secundario">Eliminar</button></form></td></tr>`).join('');
  return pagina('Gestión de usuarios', `${mensaje(exito)}${mensaje(error, 'error')}
    <p><a class="boton" href="/usuarios/nuevo">Crear usuario</a></p><div class="tabla"><table>
    <thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Perfil</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${filas}</tbody></table></div>`, usuario);
}

function formularioUsuario(usuarioSesion, usuario = {}, error = '') {
  const editando = Boolean(usuario.id);
  return pagina(editando ? 'Modificar usuario' : 'Crear usuario', `${mensaje(error, 'error')}
    <form action="${editando ? `/usuarios/${usuario.id}` : '/usuarios'}" method="post" class="tarjeta">
      <label>Identificador<input name="identificador" required value="${escapar(usuario.identificador)}"></label>
      <label>Nombre<input name="nombre" required value="${escapar(usuario.nombre)}"></label>
      <label>Correo<input name="correo" type="email" required value="${escapar(usuario.correo)}"></label>
      <label>Perfil<select name="perfil"><option value="empleado" ${usuario.perfil === 'empleado' ? 'selected' : ''}>Empleado</option><option value="administrador" ${usuario.perfil === 'administrador' ? 'selected' : ''}>Administrador</option></select></label>
      <label>Estado<select name="estado"><option value="Activo" ${usuario.estado !== 'Inactivo' ? 'selected' : ''}>Activo</option><option value="Inactivo" ${usuario.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option></select></label>
      <label>Contraseña ${editando ? '(dejar vacía para conservar)' : ''}<input name="password" type="password" ${editando ? '' : 'required'} minlength="8"></label>
      <button type="submit">${editando ? 'Guardar cambios' : 'Crear usuario'}</button></form>`, usuarioSesion);
}

function tablaReporte(filas, incluirHora) {
  const encabezadoHora = incluirHora ? '<th>Hora</th>' : '';
  const cuerpo = filas.length
    ? filas.map((fila) => `<tr><td>${escapar(fila.identificador)}</td><td>${escapar(fila.nombre)}</td>
      <td>${escapar(formatearFecha(fila.fecha))}</td>${incluirHora ? `<td>${escapar(fila.hora)}</td>` : ''}</tr>`).join('')
    : `<tr><td colspan="${incluirHora ? 4 : 3}">Sin resultados para la fecha consultada.</td></tr>`;
  return `<div class="tabla"><table><thead><tr><th>Identificador</th><th>Nombre</th><th>Fecha</th>${encabezadoHora}</tr></thead>
    <tbody>${cuerpo}</tbody></table></div>`;
}

function reportes(usuario, fecha = '', resultados = {}, error = '', consultado = Boolean(fecha && !error)) {
  return pagina('Reportes de asistencia', `${mensaje(error, 'error')}
    <form action="/reportes" method="get" class="tarjeta formulario-reporte">
      <label>Fecha<input name="fecha" type="date" required value="${escapar(fecha)}"></label>
      <button type="submit">Consultar reportes</button>
    </form>
    ${consultado ? `<section><h2>Reporte de atrasos</h2>${tablaReporte(resultados.atrasos || [], true)}</section>
    <section><h2>Reporte de salidas anticipadas</h2>${tablaReporte(resultados.salidasAnticipadas || [], true)}</section>
    <section><h2>Reporte de inasistencias</h2>${tablaReporte(resultados.inasistencias || [], false)}</section>` : ''}`, usuario);
}

module.exports = { login, asistencia, listaUsuarios, formularioUsuario, reportes };
