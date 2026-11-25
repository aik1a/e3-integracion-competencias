const Usuario = require('../models/Usuario');
const { crearHash, verificarPassword } = require('./passwordService');

function normalizarDatos(datos) {
  return {
    identificador: String(datos.identificador || '').trim(),
    nombre: String(datos.nombre || '').trim(),
    correo: String(datos.correo || '').trim().toLowerCase(),
    perfil: String(datos.perfil || ''),
    estado: String(datos.estado || 'Activo')
  };
}

function validarCorreo(correo) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    throw new Error('El correo no tiene un formato válido');
  }
}

function normalizarFiltroEstado(estado) {
  const filtro = String(estado || '').trim().toLowerCase();
  if (!['activo', 'inactivo', 'todos'].includes(filtro)) {
    throw new Error('El estado debe ser activo, inactivo o todos');
  }
  return filtro;
}

class UsuarioService {
  constructor(pool) {
    this.pool = pool;
  }

  async autenticar(correo, password) {
    const correoNormalizado = String(correo || '').trim().toLowerCase();
    const [filas] = await this.pool.execute(
      `SELECT id, identificador, nombre, correo, password_hash, perfil, estado
         FROM usuarios WHERE correo = ?`,
      [correoNormalizado]
    );
    const usuario = filas[0];
    if (!usuario || usuario.estado !== 'Activo' ||
        !(await verificarPassword(password, usuario.password_hash))) {
      throw new Error('Correo o contraseña incorrectos, o usuario inactivo');
    }
    return usuario;
  }

  async listar() {
    const [filas] = await this.pool.execute(
      `SELECT id, identificador, nombre, correo, perfil, estado
         FROM usuarios ORDER BY nombre, identificador`
    );
    return filas;
  }

  async listarEmpleadosPorEstado(estado) {
    const filtro = normalizarFiltroEstado(estado);
    const parametros = [];
    let condicion = '';
    if (filtro !== 'todos') {
      condicion = 'WHERE estado = ?';
      parametros.push(filtro === 'activo' ? 'Activo' : 'Inactivo');
    }
    const [filas] = await this.pool.execute(
      `SELECT id, nombre, correo, estado FROM usuarios ${condicion} ORDER BY nombre, id`,
      parametros
    );
    return filas;
  }

  async obtenerPorId(id) {
    const [filas] = await this.pool.execute(
      `SELECT id, identificador, nombre, correo, perfil, estado
         FROM usuarios WHERE id = ?`,
      [id]
    );
    if (!filas[0]) throw new Error('Usuario no encontrado');
    return filas[0];
  }

  async crear(datos) {
    const usuario = new Usuario(normalizarDatos(datos));
    validarCorreo(usuario.correo);
    const passwordHash = await crearHash(datos.password);
    try {
      const [resultado] = await this.pool.execute(
        `INSERT INTO usuarios
          (identificador, nombre, correo, password_hash, perfil, estado)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [usuario.identificador, usuario.nombre, usuario.correo, passwordHash,
          usuario.perfil, usuario.estado]
      );
      return resultado.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new Error('El identificador o correo ya está registrado');
      throw error;
    }
  }

  async actualizar(id, datos) {
    await this.obtenerPorId(id);
    const usuario = new Usuario(normalizarDatos(datos));
    validarCorreo(usuario.correo);
    const campos = ['identificador = ?', 'nombre = ?', 'correo = ?', 'perfil = ?', 'estado = ?'];
    const valores = [usuario.identificador, usuario.nombre, usuario.correo, usuario.perfil, usuario.estado];
    if (datos.password) {
      campos.push('password_hash = ?');
      valores.push(await crearHash(datos.password));
    }
    valores.push(id);
    try {
      await this.pool.execute(`UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`, valores);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new Error('El identificador o correo ya está registrado');
      throw error;
    }
  }

  async desactivar(id) {
    const [resultado] = await this.pool.execute(
      `UPDATE usuarios SET estado = 'Inactivo' WHERE id = ? AND estado = 'Activo'`,
      [id]
    );
    if (resultado.affectedRows === 0) throw new Error('Usuario no encontrado o ya inactivo');
  }

  async eliminar(id) {
    try {
      const [resultado] = await this.pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
      if (resultado.affectedRows === 0) throw new Error('Usuario no encontrado');
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
        throw new Error('No se puede eliminar: el usuario tiene marcaciones históricas. Puede Desactivar para conservar el historial.');
      }
      throw error;
    }
  }
}

module.exports = { UsuarioService, normalizarDatos, validarCorreo, normalizarFiltroEstado };
