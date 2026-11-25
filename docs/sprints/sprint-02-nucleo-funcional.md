# Sprint 02 — Núcleo funcional

**Estado:** Cerrado e integrado en `main`
**Rama:** `sprint/02-nucleo-funcional`

## Objetivo

Implementar el núcleo usable del MVP: acceso con correo y contraseña, administración mínima de usuarios y registro de entrada/salida con persistencia MySQL.

## Fuentes y requerimientos

- CA-01.
- GU-01, GU-02 y GU-03.
- Pauta 1.4 — Avance #3.
- `docs/project/ESPECIFICACION_CANONICA.md`.

## Precondiciones

- Sprint 01 aprobado e integrado a `main`.
- Base de datos reproducible y conexión comprobada.
- Docker Compose funcional.

## Bloques de trabajo

1. **Acceso y sesión mínima**
   - login con correo y contraseña;
   - hash de contraseña y sesión tradicional;
   - diferenciar administrador y empleado;
   - impedir ingreso de usuarios inactivos.

2. **Gestión de usuarios**
   - GU-01: crear usuario con datos mínimos y validaciones previsibles;
   - GU-02: modificar datos permitidos de un usuario existente;
   - GU-03: desactivar lógicamente al usuario, conservando su historial;
   - restringir estas operaciones al administrador.

3. **Control de asistencia**
   - permitir una entrada y una salida por fecha;
   - guardar identificador, acción, fecha y hora;
   - rechazar salida sin entrada previa;
   - rechazar marcación repetida;
   - mostrar confirmación o error comprensible.

4. **Interfaz funcional mínima**
   - pantalla de login;
   - pantalla simple para entrada/salida del empleado;
   - pantallas o formularios simples para gestión de usuarios del administrador;
   - navegación suficiente para demostrar el flujo, sin sistema de diseño ni acabado avanzado.

5. **Pruebas y evidencia**
   - unitarias para reglas de marcación y validaciones principales;
   - integración mínima para acceso, persistencia y operaciones de usuario;
   - recorrido manual del flujo principal;
   - registrar resultados reales y evidencia.

## Incluido

- login;
- sesiones y roles mínimos;
- GU-01, GU-02 y GU-03;
- CA-01;
- pantallas necesarias para demostrar estos requisitos;
- pruebas unitarias e integración mínima.

## Fuera de alcance

- RE-01, RE-02 y RE-03;
- AP-01;
- recuperación de contraseña;
- verificación de correo;
- permisos configurables;
- edición de marcaciones;
- turnos, feriados o calendarios;
- rediseño visual avanzado.

## Archivos o áreas esperadas

```text
src/routes/
src/services/
src/db/
src/views/ o src/public/
tests/
docs/academico/plan-pruebas.md
```

No se obliga a crear controllers, repositories u otras capas si no son necesarias para mantener el código entendible.

## Criterios de aceptación

- un usuario existente puede iniciar sesión con credenciales válidas;
- un usuario inactivo no puede ingresar;
- solo el administrador gestiona usuarios;
- crear, modificar y desactivar usuarios persiste correctamente;
- un empleado puede registrar una entrada y después una salida válida;
- las secuencias inválidas definidas por la especificación se rechazan;
- las contraseñas no se guardan en texto plano;
- las pantallas permiten demostrar los cuatro requerimientos asignados;
- las pruebas acordadas fueron realmente ejecutadas.

## Pruebas y evidencia

Como mínimo cubrir:

- login correcto e incorrecto;
- usuario inexistente o inactivo;
- crear, modificar y desactivar usuario;
- restricción de rol administrador;
- entrada válida;
- salida válida;
- salida sin entrada;
- entrada o salida repetida;
- persistencia real en MySQL.

## Condiciones de parada

Detenerse si una solución exige adelantar reportes/API, crear permisos avanzados o cambiar decisiones canónicas del flujo de asistencia.

## Handoff obligatorio

Informar rama, último commit, requisitos completados, pantallas disponibles, pruebas ejecutadas y fallos/limitaciones reales. Hacer push y detenerse; no hacer merge a `main`.

## Resultado

Se completaron los cinco bloques del sprint:

- acceso con correo, contraseña protegida mediante `scrypt`, sesión tradicional y separación de perfiles;
- creación, modificación y desactivación lógica de usuarios restringidas al administrador;
- entrada y salida persistidas en MySQL con rechazo de salida sin entrada y marcaciones repetidas;
- pantallas mínimas de login, asistencia, lista, creación y modificación de usuarios;
- datos ficticios reproducibles, pruebas unitarias e integración HTTP con MySQL.

Validaciones realizadas:

- `npm test`: 11 pruebas correctas y 0 fallos, tanto localmente como en GitHub Actions;
- `npm run test:db`: 2 pruebas correctas y 0 fallos en MySQL 8.4 mediante GitHub Actions;
- workflow `Sprint 02 - Validacion funcional MySQL`, run `35119603201`: exitoso con Node 20.20.2;
- arranque del servidor, conexión MySQL y respuesta de `/login`: correctos en el workflow;
- `npm audit --audit-level=high`: 0 vulnerabilidades después de actualizar `mysql2` a `3.24.4`.

Limitaciones reales:

- las sesiones se almacenan en memoria y se pierden al reiniciar el proceso, suficiente para este MVP académico;
- el recorrido visual manual con navegador continúa pendiente: el navegador remoto no puede acceder al servidor local del checkout y el entorno local no dispone de Docker/MySQL. El flujo equivalente sí se comprobó por HTTP contra MySQL real en la prueba de integración.

No se implementaron reportes, API ni requisitos de Sprint 03.

## Cierre e integración

- Commit final integrado de Sprint 02: `a19be2348da0b8832c99c6d5dd8ff49eb49b5d32`.
- Validación final previa al merge: workflow `Sprint 02 - Validacion funcional MySQL`, run `35125177534`, commit `a19be2348da0b8832c99c6d5dd8ff49eb49b5d32`, resultado `success`.
- Commit de merge en `main`: `25b12881be7f53e72abaaf7a867ab2c76fff77c2`.
