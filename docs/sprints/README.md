# Fases de desarrollo

Cada archivo define una fase académica y también funciona como contrato de ejecución para el agente de código. Solo una fase puede estar `En curso`.

## Orden obligatorio

| Orden | Rama | Resultado principal |
| --- | --- | --- |
| Sprint 00 | `sprint/00-base-clases` | Proyecto mínimo, clases iniciales, documento de requerimientos y plan de pruebas preparado. |
| Sprint 01 | `sprint/01-base-datos` | Modelo relacional, `schema.sql`, datos ficticios mínimos y conexión MySQL. |
| Sprint 02 | `sprint/02-nucleo-funcional` | Login, usuarios y entrada/salida con pruebas. |
| Sprint 03 | `sprint/03-reportes-api` | RE-01, RE-02, RE-03 y AP-01 con pruebas de integración. |
| Sprint 04 | `sprint/04-entrega` | Correcciones, evidencias, trazabilidad final, README, plan de pruebas completo y material de entrega. |

No se crea la rama del sprint siguiente hasta que la fase actual haya sido revisada e integrada a `main`.

## Cómo trabaja el agente dentro de un sprint

Cada sprint se divide en bloques pequeños y secuenciales. El agente trabaja esos bloques en la misma rama del sprint; no crea una rama por cada bloque.

Flujo:

1. leer `AGENTS.md`;
2. leer `docs/project/ESPECIFICACION_CANONICA.md`;
3. leer el archivo del sprint activo;
4. comprobar rama, `HEAD` y árbol limpio;
5. ejecutar los bloques del sprint en orden;
6. probar;
7. revisar diff y alcance;
8. actualizar `Resultado` con hechos reales;
9. hacer push;
10. detenerse y entregar handoff.

`task/*` queda reservado para una tarea que el orquestador declare paralela, riesgosa o claramente separable. En condiciones normales no se usa.

## Regla de tamaño

Un bloque debe producir un resultado verificable y pequeño, pero no se fragmenta artificialmente el proyecto. No se crean capas, patrones, documentos o ramas adicionales solo para aparentar mayor proceso.

## Archivos de fase

- [`sprint-00-base-documental.md`](sprint-00-base-documental.md)
- [`sprint-01-base-de-datos.md`](sprint-01-base-de-datos.md)
- [`sprint-02-nucleo-funcional.md`](sprint-02-nucleo-funcional.md)
- [`sprint-03-reportes-api.md`](sprint-03-reportes-api.md)
- [`sprint-04-entrega.md`](sprint-04-entrega.md)
- [`PLANTILLA.md`](PLANTILLA.md)
