# Informe de empleabilidad — borrador verificable

> Completar nombres, sección, fecha y experiencias personales reales antes de entregar. No sustituir los campos pendientes con hechos inventados.

## Por qué es un problema complicado

El proyecto combina reglas de negocio, persistencia relacional, perfiles de acceso, interfaz web, API y evidencia académica. Los ocho requerimientos dependen entre sí: un error en usuarios o marcaciones afecta el acceso, los reportes y la API. Además, la solución debe ser demostrable y comprensible sin ampliar el alcance.

## Estrategia de análisis

Se aplicó un proceso deductivo:

1. partir de las fuentes institucionales;
2. convertir cada requisito en una aceptación mínima;
3. separar el trabajo por dependencias técnicas;
4. implementar y probar por fases;
5. vincular cada requisito con código, ruta y prueba;
6. detener ampliaciones no autorizadas.

## Posibles causas del problema

1. **Registro manual o disperso:** dificulta confirmar horarios y reconstruir la asistencia.
2. **Reglas no automatizadas:** calcular atrasos, salidas anticipadas e inasistencias manualmente favorece errores.
3. **Datos sin estructura común:** impide filtrar empleados y reutilizar información mediante una API.

## Soluciones consideradas

- Mantener registros manuales: menor costo inicial, pero conserva errores y baja trazabilidad.
- Usar planillas: ordena datos, pero no resuelve adecuadamente autenticación, reglas y concurrencia.
- Construir un MVP web con MySQL: integra usuarios, marcaciones, reportes y consulta API en una solución acotada.

## Solución seleccionada

Se seleccionó el MVP web porque satisface directamente los ocho requerimientos, centraliza la información y permite pruebas reproducibles. Node.js, Express, MySQL y Docker Compose mantienen una arquitectura pequeña que el equipo puede explicar.

## Acciones preventivas

- Mantener restricciones de base de datos para duplicados y relaciones.
- Ejecutar pruebas unitarias e integración antes de integrar cada fase.
- Conservar secretos fuera de Git y usar solo datos ficticios.
- Mantener trazabilidad entre requisito, código y prueba.

## Beneficios de metas comunes

1. Reduce interpretaciones contradictorias del alcance.
2. Permite priorizar dependencias y distribuir trabajo.
3. Facilita revisar objetivamente si la entrega está completa.

## Acciones para comunicación efectiva

1. Registrar decisiones técnicas en documentos compartidos.
2. Informar resultados de pruebas y bloqueos con evidencia.
3. Revisar cambios mediante ramas y commits identificables.

## Acciones para coordinación y compromiso

1. Trabajar por fases con una sola fuente de verdad.
2. No iniciar una fase hasta integrar y revisar la anterior.
3. Entregar un handoff con archivos, pruebas, pendientes y limitaciones.

## Validación personal pendiente

El equipo debe confirmar cuáles acciones anteriores reflejan su experiencia real y añadir ejemplos concretos de colaboración. También debe incorporar, si están disponibles, las orientaciones del Aula Virtual sobre trabajo colaborativo y resolución de problemas.
