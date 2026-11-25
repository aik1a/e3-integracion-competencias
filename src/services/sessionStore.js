const { randomBytes } = require('node:crypto');

class SessionStore {
  constructor() {
    this.sesiones = new Map();
  }

  crear(usuario) {
    const token = randomBytes(32).toString('hex');
    this.sesiones.set(token, { id: usuario.id, nombre: usuario.nombre, perfil: usuario.perfil });
    return token;
  }

  obtener(token) {
    return token ? this.sesiones.get(token) : undefined;
  }

  eliminar(token) {
    if (token) this.sesiones.delete(token);
  }
}

module.exports = SessionStore;
