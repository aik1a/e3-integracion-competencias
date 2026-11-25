const { randomBytes, scrypt: scryptCallback, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(scryptCallback);

async function crearHash(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres');
  }

  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}

async function verificarPassword(password, passwordHash) {
  if (typeof password !== 'string' || typeof passwordHash !== 'string') return false;
  const [salt, hashHex, extra] = passwordHash.split(':');
  if (!salt || !hashHex || extra || !/^[0-9a-f]{128}$/i.test(hashHex)) return false;

  const hashGuardado = Buffer.from(hashHex, 'hex');
  const hashIngresado = await scrypt(password, salt, hashGuardado.length);
  return timingSafeEqual(hashGuardado, hashIngresado);
}

module.exports = { crearHash, verificarPassword };
