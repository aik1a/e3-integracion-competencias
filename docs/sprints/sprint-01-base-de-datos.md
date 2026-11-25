# Sprint 01 — Base de datos

**Estado:** Listo para revisión
**Rama:** `sprint/01-base-datos`

## Objetivo

Construir la persistencia mínima del MVP: modelo relacional, script MySQL reproducible, datos ficticios mínimos, conexión desde la aplicación y ejecución reproducible con Docker Compose.

## Fuentes y requerimientos

- Pauta 1.3 — Avance #2.
- Datos necesarios para CA-01, GU-01, GU-02, GU-03, RE-01, RE-02, RE-03 y AP-01.
- `docs/project/ESPECIFICACION_CANONICA.md`.

## Precondiciones

- Sprint 00 aprobado e integrado a `main`.
- Proyecto base ejecutable.
- Documento de requerimientos y plan de pruebas creados.

## Bloques de trabajo

1. **Modelo relacional mínimo**
   - definir únicamente tablas y relaciones necesarias para usuarios y marcaciones;
   - permitir rol, estado, correo único y contraseña protegida;
   - permitir registrar usuario, tipo de marcación, fecha y hora;
   - documentar brevemente el modelo sin agregar módulos futuros.

2. **Script SQL reproducible**
   - crear `database/schema.sql`;
   - incluir claves, restricciones y tipos necesarios;
   - crear datos ficticios mínimos en un archivo separado solo si ayudan a demostrar o probar el sistema.

3. **Conexión de aplicación**
   - configurar conexión MySQL con variables de entorno;
   - usar SQL directo y parametrizado;
   - comprobar una operación simple de lectura o conexión.

4. **Docker Compose mínimo**
   - aplicación + MySQL únicamente;
   - permitir levantar el entorno siguiendo instrucciones breves;
   - no añadir proxy, cache, servicios cloud ni contenedores auxiliares.

5. **Pruebas y evidencia**
   - ejecutar el schema desde cero;
   - comprobar tablas y restricciones principales;
   - comprobar conexión de la aplicación a MySQL;
   - registrar resultados reales en el plan de pruebas cuando corresponda.

## Incluido

- modelo relacional mínimo;
- `schema.sql` ejecutable desde cero;
- datos ficticios mínimos si son útiles;
- conexión básica de la aplicación;
- Docker Compose con aplicación y MySQL.

## Fuera de alcance

- pantallas funcionales de usuarios;
- CRUD completo;
- login completo;
- reglas de entrada/salida;
- reportes;
- AP-01;
- optimización avanzada de consultas;
- ORM.

## Archivos o áreas esperadas

```text
database/schema.sql
database/seed.sql        # solo si se justifica
src/db/
docker-compose.yml       # o compose.yml
Dockerfile
.env.example
README.md                 # solo instrucciones necesarias para ejecutar
```

No se crean capas adicionales si la conexión puede mantenerse simple.

## Criterios de aceptación

- el script crea la base desde cero sin errores;
- el modelo soporta los ocho requerimientos sin tablas ajenas al alcance;
- correo puede ser único y el estado permite Activo/Inactivo;
- las marcaciones permiten identificar usuario, acción, fecha y hora;
- la aplicación se conecta a MySQL usando variables de entorno;
- Docker Compose levanta aplicación y MySQL;
- los datos de prueba no contienen información real.

## Pruebas y evidencia

Registrar comandos realmente ejecutados y resultados de:

- creación limpia de base;
- inspección de tablas/restricciones;
- conexión aplicación ↔ MySQL;
- arranque con Docker Compose.

## Condiciones de parada

Detenerse si el modelo requiere una decisión funcional no definida en la especificación o si aparece la necesidad de agregar entidades fuera del caso.

## Handoff obligatorio

Informar rama, último commit, modelo creado, scripts ejecutados, pruebas reales y cualquier limitación. Hacer push y detenerse; no hacer merge a `main`.

## Resultado

- Bloque 1 completado: modelo relacional mínimo con `usuarios` y `marcaciones`; no se agregaron entidades ajenas al caso.
- Bloque 2 completado: `database/schema.sql` crea la base y ambas tablas desde cero. No se agregó `seed.sql` porque una lectura `SELECT 1` permite comprobar la conexión sin conservar datos ficticios.
- Restricciones implementadas: claves primarias, identificador y correo únicos, clave foránea de marcaciones a usuarios, valores permitidos para perfil/estado/acción y máximo una marcación de cada acción por usuario y fecha.
- Bloque 3 completado: conexión Node.js mediante `mysql2`, variables de entorno y consulta directa `SELECT 1 AS conectado`. La prueba de integración usa consultas parametrizadas para toda entrada variable.
- Bloque 4 completado: `compose.yml` contiene únicamente aplicación y MySQL; `Dockerfile` instala y arranca la aplicación.
- Bloque 5 implementado y parcialmente verificado: existe prueba de estructura del schema y prueba de integración para conexión, tablas, claves, valores permitidos, correo único, clave foránea y marcación duplicada.
- `npm install`: primer intento falló porque npm no pudo crear `/root/.npm`; segundo intento con `NPM_CONFIG_CACHE=/tmp/sprint01-npm-cache` fue correcto, con 79 paquetes instalados. La repetición final indicó dependencias al día.
- `npm test`: correcto; 6 pruebas ejecutadas, 6 correctas y 0 fallos. Se conservaron las 5 pruebas anteriores y se añadió una comprobación estructural del schema.
- `docker compose config`: ejecutado; no pudo iniciarse porque el entorno no contiene el binario `docker` (`docker: command not found`, código 127).
- Validación auxiliar de `compose.yml` con `python3` y PyYAML: correcta; YAML válido con exactamente los servicios `app` y `mysql`. Esta comprobación no sustituye `docker compose config`.
- `docker compose up --build`: ejecutado; no pudo iniciarse por la misma ausencia de Docker (código 127).
- `npm run test:db`: ejecutado; 1 prueba, 0 correctas y 1 fallo por `ECONNREFUSED 127.0.0.1:3306`, ya que no existe servidor MySQL ni Docker en el entorno.
- `npm start`: ejecutado; la aplicación rechazó correctamente el arranque al no poder conectar con MySQL (`ECONNREFUSED 127.0.0.1:3306`).
- La limitación del entorno local quedó resuelta mediante el workflow `Sprint 01 - Validacion MySQL`, usado únicamente como entorno reproducible de pruebas de este sprint. No es infraestructura productiva ni un pipeline de despliegue.
- GitHub Actions run `35058288461`: correcto. MySQL 8.4 inició en limpio; `database/schema.sql` se aplicó sin errores; `npm test` obtuvo 6/6 pruebas correctas; `npm run test:db` obtuvo 1/1 prueba correcta y comprobó conexión, tablas y restricciones principales; la aplicación inició, respondió en `/salud` y confirmó la conexión con MySQL antes de cerrarse de forma controlada.
- Advertencias no bloqueantes del run: `npm ci` informó una vulnerabilidad de severidad alta en el árbol de dependencias; GitHub informó la obsolescencia del runtime interno Node 20 usado por `actions/checkout@v4` y `actions/setup-node@v4`. El proyecto fue configurado y probado con Node 20.20.2.
- Alcance confirmado: no se implementaron login, CRUD, reglas funcionales de marcación, reportes, AP-01, pantallas ni trabajo de Sprint 02 o posteriores.
