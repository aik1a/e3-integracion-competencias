const express = require('express');
const { obtenerPool } = require('./db/connection');
const { UsuarioService } = require('./services/usuarioService');
const { AsistenciaService } = require('./services/asistenciaService');
const { ReporteService, validarFecha } = require('./services/reporteService');
const SessionStore = require('./services/sessionStore');
const pages = require('./views/pages');

function leerCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').filter(Boolean).map((cookie) => {
    const [nombre, ...valor] = cookie.trim().split('=');
    return [nombre, decodeURIComponent(valor.join('='))];
  }));
}

function fechaActualChile() {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const valores = Object.fromEntries(partes.map(({ type, value }) => [type, value]));
  return `${valores.year}-${valores.month}-${valores.day}`;
}

function crearApp({ pool = obtenerPool(), sesiones = new SessionStore() } = {}) {
  const app = express();
  const usuarios = new UsuarioService(pool);
  const asistencia = new AsistenciaService(pool);
  const reportes = new ReporteService(pool);
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static('src/public'));
  app.use((req, res, next) => {
    req.tokenSesion = leerCookies(req).sesion;
    req.usuario = sesiones.obtener(req.tokenSesion);
    next();
  });

  function requiereSesion(req, res, next) {
    if (!req.usuario) return res.redirect('/login');
    next();
  }
  function requiereAdministrador(req, res, next) {
    if (!req.usuario) return res.redirect('/login');
    if (req.usuario.perfil !== 'administrador') return res.status(403).send('Acceso restringido al administrador');
    next();
  }

  app.get('/salud', (req, res) => res.status(200).json({ estado: 'ok' }));
  app.get('/', (req, res) => {
    if (!req.usuario) return res.redirect('/login');
    res.redirect(req.usuario.perfil === 'administrador' ? '/usuarios' : '/asistencia');
  });
  app.get('/login', (req, res) => res.send(pages.login()));
  app.post('/login', async (req, res) => {
    try {
      const usuario = await usuarios.autenticar(req.body.correo, req.body.password);
      const token = sesiones.crear(usuario);
      res.setHeader('Set-Cookie', `sesion=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`);
      res.redirect(usuario.perfil === 'administrador' ? '/usuarios' : '/asistencia');
    } catch (error) {
      res.status(401).send(pages.login(error.message));
    }
  });
  app.post('/logout', (req, res) => {
    sesiones.eliminar(req.tokenSesion);
    res.setHeader('Set-Cookie', 'sesion=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
    res.redirect('/login');
  });

  app.get('/asistencia', requiereSesion, async (req, res, next) => {
    if (req.usuario.perfil !== 'empleado') return res.status(403).send('La marcación corresponde al perfil empleado');
    try {
      res.send(pages.asistencia(req.usuario, await asistencia.listarHoy(req.usuario.id), req.query.exito, req.query.error));
    } catch (error) { next(error); }
  });
  app.post('/asistencia/marcar', requiereSesion, async (req, res) => {
    if (req.usuario.perfil !== 'empleado') return res.status(403).send('La marcación corresponde al perfil empleado');
    try {
      await asistencia.registrar(req.usuario.id, req.body.accion);
      res.redirect(`/asistencia?exito=${encodeURIComponent(`${req.body.accion} registrada correctamente`)}`);
    } catch (error) {
      res.redirect(`/asistencia?error=${encodeURIComponent(error.message)}`);
    }
  });

  app.get('/usuarios', requiereAdministrador, async (req, res, next) => {
    try {
      res.send(pages.listaUsuarios(req.usuario, await usuarios.listar(), req.query.exito, req.query.error));
    } catch (error) { next(error); }
  });

  app.get('/reportes', requiereAdministrador, async (req, res, next) => {
    const fecha = req.query.fecha || '';
    if (!fecha) return res.send(pages.reportes(req.usuario, fechaActualChile(), {}, '', false));
    try {
      validarFecha(fecha);
      const [atrasos, salidasAnticipadas, inasistencias] = await Promise.all([
        reportes.listarAtrasos(fecha),
        reportes.listarSalidasAnticipadas(fecha),
        reportes.listarInasistencias(fecha)
      ]);
      res.send(pages.reportes(req.usuario, fecha, { atrasos, salidasAnticipadas, inasistencias }));
    } catch (error) {
      if (/fecha/.test(error.message)) return res.status(400).send(pages.reportes(req.usuario, fecha, {}, error.message));
      next(error);
    }
  });

  app.get('/api/empleados', async (req, res) => {
    try {
      res.json(await usuarios.listarEmpleadosPorEstado(req.query.estado));
    } catch (error) {
      if (/estado/.test(error.message)) return res.status(400).json({ error: error.message });
      throw error;
    }
  });
  app.get('/usuarios/nuevo', requiereAdministrador, (req, res) => res.send(pages.formularioUsuario(req.usuario)));
  app.post('/usuarios', requiereAdministrador, async (req, res) => {
    try {
      await usuarios.crear(req.body);
      res.redirect('/usuarios?exito=Usuario%20creado%20correctamente');
    } catch (error) {
      res.status(400).send(pages.formularioUsuario(req.usuario, req.body, error.message));
    }
  });
  app.get('/usuarios/:id/editar', requiereAdministrador, async (req, res, next) => {
    try {
      res.send(pages.formularioUsuario(req.usuario, await usuarios.obtenerPorId(req.params.id)));
    } catch (error) { next(error); }
  });
  app.post('/usuarios/:id', requiereAdministrador, async (req, res) => {
    try {
      await usuarios.actualizar(req.params.id, req.body);
      res.redirect('/usuarios?exito=Usuario%20modificado%20correctamente');
    } catch (error) {
      res.status(400).send(pages.formularioUsuario(req.usuario, { ...req.body, id: req.params.id }, error.message));
    }
  });
  app.post('/usuarios/:id/desactivar', requiereAdministrador, async (req, res) => {
    try {
      await usuarios.desactivar(req.params.id);
      res.redirect('/usuarios?exito=Usuario%20desactivado%20correctamente');
    } catch (error) {
      res.redirect(`/usuarios?error=${encodeURIComponent(error.message)}`);
    }
  });
  app.post('/usuarios/:id/eliminar', requiereAdministrador, async (req, res) => {
    try {
      await usuarios.eliminar(req.params.id);
      res.redirect('/usuarios?exito=Usuario%20eliminado%20correctamente');
    } catch (error) {
      res.redirect(`/usuarios?error=${encodeURIComponent(error.message)}`);
    }
  });

  app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) return next(error);
    res.status(500).send('Ocurrió un error al procesar la solicitud');
  });
  return app;
}

const app = crearApp();
module.exports = app;
module.exports.crearApp = crearApp;
