# Contenido para presentación del proyecto

## Diapositiva 1 — Portada

- Control de asistencia: MVP Etapa I.
- Integración de Competencias II.
- Integrantes, sección, sede y fecha: completar antes de entregar.

## Diapositiva 2 — Problema

- Empresa de 25 personas dedicada a productos químicos.
- Necesidad de registrar asistencia y disponer de datos verificables.
- Ocho requerimientos oficiales.

## Diapositiva 3 — Alcance

- Login, usuarios, entrada y salida.
- Reportes de atrasos, salidas anticipadas e inasistencias.
- API de empleados por estado.
- Fuera de alcance: turnos, remuneraciones, exportaciones y dashboard.

## Diapositiva 4 — Solución técnica

- Node.js 20, Express, MySQL 8.4, HTML/CSS y Docker Compose.
- POO sencilla y SQL parametrizado.
- Contraseñas protegidas mediante `scrypt`.

## Diapositiva 5 — Modelo de datos

- `usuarios`: identidad, acceso, perfil y estado.
- `marcaciones`: usuario, acción, fecha y hora.
- Clave foránea y restricción de una entrada/salida por usuario y día.

## Diapositiva 6 — Flujo principal

- Administrador gestiona usuarios y consulta reportes.
- Empleado inicia sesión y registra entrada/salida.
- AP-01 consulta empleados sin modificar datos.

## Diapositiva 7 — Reportes

- RE-01: posterior a 09:30.
- RE-02: anterior a 17:30.
- RE-03: usuario activo sin marcaciones en la fecha.
- Insertar únicamente capturas reales obtenidas durante la demostración.

## Diapositiva 8 — Pruebas

- Unitarias: 15/15 en el último run histórico registrado.
- Integración MySQL: 3/3 en el run histórico `35303900433`.
- Aclarar que Docker local y recorrido manual deben ejecutarse antes de presentar.

## Diapositiva 9 — Trazabilidad y calidad

- Cada requisito se vincula con ruta, código y prueba.
- Validaciones, consultas parametrizadas y secretos fuera de Git.
- Sin funcionalidades fuera del alcance académico.

## Diapositiva 10 — Demostración y cierre

- Login administrador y gestión de usuarios.
- Login empleado y marcación.
- Reportes y API.
- Limitaciones reales y aprendizajes.
