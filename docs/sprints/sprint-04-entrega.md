# Sprint 04 — Entrega

**Estado:** Cierre técnico aprobado — entrega académica externa pendiente
**Rama:** `sprint/04-entrega`

## Objetivo

Congelar funcionalidad, corregir defectos relevantes y preparar exclusivamente las evidencias y entregables exigidos para la evaluación de la Etapa I.

## Fuentes y requerimientos

- Rúbrica Etapa 1.
- Evaluación práctica semana 6.
- Formato institucional del plan de pruebas.
- Evaluación de empleabilidad.
- Los ocho requerimientos oficiales.
- `docs/project/ESPECIFICACION_CANONICA.md`.

## Precondiciones

- Sprint 03 aprobado e integrado a `main`.
- Los ocho requerimientos fueron validados en la rama mediante el run final indicado en Resultado.
- No existen nuevas funciones autorizadas para esta etapa.

## Regla de feature freeze

Desde el inicio de este sprint:

- no se agregan funciones nuevas;
- no se cambia el stack;
- no se rediseña la arquitectura;
- no se hace refactorización estética amplia;
- solo se corrigen defectos, se completan pruebas, evidencias y documentación obligatoria.

La incorporación de **Eliminar** como operación distinta de **Desactivar** fue una corrección de cumplimiento de GU-03, no una ampliación funcional: el documento docente exige literalmente eliminar usuarios y la implementación anterior solo realizaba baja lógica.

## Decisiones de QA autorizadas

### Correcciones obligatorias antes del cierre

1. **Zona horaria bloqueante:** se detectó que las marcaciones en Docker se guardaban o interpretaban en UTC. La aplicación y MySQL deben trabajar coherentemente con `America/Santiago`, incluyendo `NOW()`, `CURDATE()`, el día generado de la marcación y las comparaciones horarias. El defecto afecta CA-01 y puede alterar RE-01, RE-02 y RE-03.
2. **Presentación de fechas:** las fechas de los resultados de Reportes se mostraban como objeto `Date` o texto GMT crudo. Deben mostrarse en formato humano `dd-mm-aaaa`, sin cambiar el formato técnico `AAAA-MM-DD` del control de búsqueda ni de las consultas internas.
3. **GU-03:** mantener **Desactivar** como baja lógica y agregar **Eliminar** como borrado físico real. Ambas acciones deben solicitar confirmación. **Eliminar** debe advertir que es irreversible y, si existen marcaciones históricas, debe rechazarse con un mensaje que indique que el usuario puede desactivarse para conservar el historial. La protección debe respetar la relación actual `marcaciones.usuario_id` con `ON DELETE RESTRICT`.

Los tres defectos quedaron corregidos y validados en la rama. El CODE FREEZE técnico corresponde a `b5baa96f6fa70fa68dc926f7ff90ceddb74a6336`; GitHub Actions run `36467694142` terminó `success` sobre ese SHA con `TZ=America/Santiago`, `npm test` 19/19 y `npm run test:db` 4/4, sin fallos ni omisiones.

### Parche UX final antes del CODE FREEZE

- Se precarga en Reportes la fecha actual calculada con `America/Santiago`, sin ejecutar la consulta automáticamente. La consulta se realiza solo al pulsar «Consultar reportes».
- Es una mejora de bajo riesgo y no un requisito docente obligatorio; no forma parte de las correcciones bloqueantes del cierre.

### Decisión de dominio pendiente

- La aparición de `Administrador demo` en el reporte de inasistencias queda pendiente de revisión. No se modifica ni se registra como bug confirmado hasta decidir si el perfil administrador pertenece al universo de RE-03.

## Bloques de trabajo

1. **QA de los ocho requerimientos**
   - recorrer CA-01, GU-01, GU-02, GU-03, RE-01, RE-02, RE-03 y AP-01;
   - corregir únicamente fallos que afecten requisitos, ejecución o demostración;
   - registrar limitaciones reales que no impidan el alcance docente.

2. **Plan de pruebas final**
   - completar `docs/academico/plan-pruebas.md` con resultados obtenidos reales;
   - incluir número/nombre de caso, módulo, entrada, esperado, obtenido y Correcto/Fallo;
   - adjuntar o referenciar evidencias simples: consola, capturas o reporte automático;
   - completar conclusión y observaciones.

3. **Trazabilidad requisito → código → prueba**
   - crear o completar una tabla de entrega que identifique, para cada ID oficial, los archivos/rutas principales donde está implementado y la prueba asociada;
   - esta trazabilidad cubre la necesidad de que el código de cada requerimiento sea claramente identificable;
   - no duplicar el código en ocho scripts independientes salvo instrucción expresa del docente.

4. **Documentación interna y externa mínima**
   - revisar nombres y comentarios necesarios en el código;
   - completar README con requisitos previos, variables, arranque, Docker Compose, ejecución de pruebas y recorrido básico de demostración;
   - no generar documentación empresarial adicional.

5. **Evidencias académicas y presentación**
   - organizar evidencias de actividades 1.2 a 1.5;
   - dejar disponible el script final de base de datos;
   - preparar contenido necesario para PPT del proyecto;
   - preparar el informe de empleabilidad con los puntos exigidos por la rúbrica.

6. **Prueba de entrega limpia**
   - comprobar que el proyecto pueda levantarse siguiendo el README;
   - ejecutar las pruebas automáticas;
   - comprobar MySQL y Docker Compose;
   - revisar secretos, archivos accidentales y estado Git;
   - realizar una demostración manual completa.

## Incluido

- correcciones de defectos relevantes;
- ejecución final de pruebas;
- plan de pruebas completo;
- evidencias 1.2 a 1.5;
- trazabilidad de los ocho requerimientos;
- README final;
- script de base de datos definitivo;
- material de PPT e informe de empleabilidad requeridos;
- instrucciones de ejecución y demostración.

## Fuera de alcance

- nuevas funcionalidades;
- rediseño visual;
- nuevas APIs;
- exportaciones;
- despliegue productivo;
- CI/CD complejo;
- refactorizaciones sin impacto en la rúbrica;
- mejoras pensadas para una etapa futura.

## Archivos o áreas esperadas

```text
README.md
docs/academico/requerimientos.md
docs/academico/plan-pruebas.md
docs/academico/trazabilidad-entrega.md
docs/academico/evidencias/
database/schema.sql
```

La presentación puede mantenerse fuera del código fuente si el formato final del Aula Virtual lo exige; el repositorio debe conservar al menos el contenido y evidencia necesaria para reconstruir la entrega.

## Criterios de aceptación

- los ocho requerimientos se demuestran sobre una instalación reproducible;
- `docker compose up` o las instrucciones equivalentes documentadas funcionan desde un entorno limpio razonable;
- las pruebas automáticas acordadas pasan o los fallos reales están documentados;
- el plan de pruebas usa el formato solicitado por el docente y contiene resultados reales;
- cada requisito tiene código y prueba claramente localizables;
- README contiene instrucciones suficientes;
- no hay secretos ni credenciales reales en Git;
- los entregables de semana 6 están preparados;
- no se agregó funcionalidad fuera de alcance.

## Pruebas y evidencia

Ejecutar y registrar:

- arranque completo;
- inicialización MySQL;
- login;
- gestión de usuarios;
- entrada/salida;
- tres reportes;
- AP-01;
- suite automática;
- recorrido manual de demostración;
- revisión final contra rúbrica.

## Condiciones de parada

Detenerse si una corrección exige rediseñar arquitectura, agregar una función nueva o interpretar una ambigüedad docente que cambie el alcance.

## Handoff obligatorio

Informar rama, último commit, fallos corregidos, pruebas ejecutadas, entregables preparados, limitaciones conocidas y estado de la demostración. Hacer push y detenerse; no hacer merge a `main` sin revisión final.

## Resultado

### Bloques completados

1. QA de CA-01, GU-01, GU-02, GU-03, RE-01, RE-02, RE-03 y AP-01; los defectos de títulos, zona horaria, fecha visible y GU-03 quedaron corregidos y cubiertos por las pruebas finales.
2. Plan de pruebas completado con casos de integración, evidencia histórica separada y estado real de las verificaciones de esta fase.
3. Trazabilidad requisito → código → ruta → prueba creada en `docs/academico/trazabilidad-entrega.md`.
4. README completado con requisitos previos, variables, ejecución local, Docker Compose, pruebas y recorrido de demostración.
5. Evidencias 1.2 a 1.5 organizadas; contenido de PPT e informe de empleabilidad preparados como material reconstruible.

### Prueba de entrega limpia

6. GitHub Actions validó las suites, schema/seed y arranque sobre el CODE FREEZE. El responsable informó además Docker Compose local operativo (`app` iniciada, `mysql` healthy, `npm test` 19/19, `npm run test:db` 4/4, `NOW()` y `CURDATE()` coherentes con Chile) y un recorrido manual general satisfactorio. Las capturas manuales, si existen, son evidencia externa y no se incorporaron al repositorio.

### Pruebas y estado real

- Validación final verificada en GitHub: workflow `Sprint 03 - Reportes y API MySQL`, run `36467694142`, rama `sprint/04-entrega`, SHA `b5baa96f6fa70fa68dc926f7ff90ceddb74a6336`, conclusión `success`.
- En ese run: `npm test` 19/19 y `npm run test:db` 4/4, con 0 fallos y 0 omitidas en ambas suites. QA-001 a QA-008 quedaron cubiertas en las pruebas unitarias y de integración; el paso de schema/seed y el de arranque/conexión MySQL terminaron correctamente. La prueba HTTP de `/reportes` cubre fecha de Chile precargada sin resultados automáticos y fecha consultada conservada.
- Validación Docker Compose local, informada por el responsable del proyecto: aplicación levantada, MySQL `healthy`, `npm test` 19/19, `npm run test:db` 4/4 y `NOW()`/`CURDATE()` coherentes con `America/Santiago`. No fue ejecutada por este agente.
- Recorrido manual general satisfactorio, informado por el responsable del proyecto. No se recibieron capturas ni desglose de acciones manuales individuales para adjuntar en el repositorio.
- Evidencia histórica separada: run `35686264057` (`success`) ejecutó `fb6d3965c5acddd94d461218bfa0c42bb6a0c127`; los runs `35058288461`, `35119603201`, `35300816939` y `35303900433` corresponden a fases anteriores. Ninguno sustituye el run final.

### Defectos y correcciones

Se corrigieron previamente los tres títulos visibles de reportes. En este cierre se fijó `TZ=America/Santiago` para app y MySQL en Compose; la conexión de la app obtiene cadenas de fecha/hora sin conversión implícita del driver, mientras `NOW()`, `CURDATE()` y la fecha generada operan sobre el día del servidor MySQL en Chile. Los reportes entregan fecha técnica `AAAA-MM-DD` y la vista la presenta como `dd-mm-aaaa`. Se agregó borrado físico protegido por la clave foránea existente, con confirmación separada de Desactivar. Se añadieron pruebas unitarias y una integración para los ocho casos QA.

### Entregables preparados

- plan final de pruebas;
- trazabilidad de ocho requisitos;
- README de ejecución y demostración;
- índice de evidencias 1.2 a 1.5;
- contenido para presentación;
- borrador verificable del informe de empleabilidad;
- referencia al script definitivo `database/schema.sql`.

### Limitaciones y pendientes

- El CODE FREEZE técnico de Sprint 04 está aprobado. La entrega académica completa aún requiere datos personales/institucionales, validación de experiencias reales del informe de empleabilidad y formatos finales ZIP, PPT y documentos del Aula Virtual.
- El recorrido manual fue informado por el responsable; las capturas no están en este repositorio. El run automatizado no acredita por sí solo clics o cancelaciones de confirmaciones en un navegador.
- Los registros históricos que se hubieran guardado con hora UTC requieren evaluación antes de interpretar sus fechas; este parche no los migra.
- La inclusión de `Administrador demo` en RE-03 sigue como decisión de dominio pendiente, sin tratarla como fallo confirmado.

En este cierre documental no se modificó funcionalidad, no se inició otra fase y no se hizo merge a `main`.
