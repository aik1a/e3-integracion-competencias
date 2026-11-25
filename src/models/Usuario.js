const PERFILES = ['administrador', 'empleado'];
const ESTADOS = ['Activo', 'Inactivo'];

class Usuario {
  constructor({ identificador, nombre, correo, perfil, estado = 'Activo' }) {
    if (!identificador || !nombre || !correo) {
      throw new Error('Identificador, nombre y correo son obligatorios');
    }

    if (!PERFILES.includes(perfil)) {
      throw new Error('El perfil debe ser administrador o empleado');
    }

    if (!ESTADOS.includes(estado)) {
      throw new Error('El estado debe ser Activo o Inactivo');
    }

    this.identificador = identificador;
    this.nombre = nombre;
    this.correo = correo;
    this.perfil = perfil;
    this.estado = estado;
  }

  estaActivo() {
    return this.estado === 'Activo';
  }
}

module.exports = Usuario;
