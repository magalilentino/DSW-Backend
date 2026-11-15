# Evidencia de ejecución de los tests — Backend

**Fecha de ejecución:** 15/11/2026
**Entorno:** Windows 11, Node.js 24.15.0, pnpm 10.7.0, MySQL local

## Resumen

| Tipo | Comando | Tests | Resultado |
|---|---|---|---|
| Unitarios | `pnpm test` | 10 | ✅ 10 pasan, 0 fallan |
| Integración | `pnpm run build` + `pnpm run test:integration` | 1 | ✅ 1 pasa, 0 fallan |

## Qué prueba cada test

### Unitarios

No necesitan base de datos: prueban funciones de validación y sanitización de forma aislada.

| Archivo | Test | Qué verifica |
|---|---|---|
| `sanatizeMarca.test.ts` | sanitizeMarcaInput debería crear sanitizedInput correctamente | El middleware arma `sanitizedInput` solo con los campos permitidos de una marca. |
| `turnosHoy.test.ts` | debería devolver 401 si no hay usuario logueado | Consultar los turnos del día sin usuario devuelve 401. |
| `turnosHoy.test.ts` | debería devolver 401 si user existe pero no tiene id | Un usuario sin id válido devuelve 401. |
| `turnosHoy.test.ts` | debería ser válido si el usuario tiene id | Un usuario con id pasa la validación. |
| `validarProdUt.test.ts` | debería devolver error si no viene idAtSer | Registrar productos utilizados sin `idAtSer` da error. |
| `validarProdUt.test.ts` | debería devolver error si idAtSer no es válido | Un `idAtSer` no numérico o ≤ 0 da error. |
| `validarProdUt.test.ts` | debería devolver error si prodMars no es un array | La lista de productos con formato incorrecto da error. |
| `validarProdUt.test.ts` | debería devolver null si los datos son válidos | Datos correctos pasan la validación. |
| `validarServicio.test.ts` | debería devolver error si el servicio ya existe | Crear un servicio con un nombre existente devuelve 409. |
| `validarServicio.test.ts` | debería ser válido si no existe el servicio | Un nombre nuevo pasa la validación. |

### Integración

Levanta la aplicación real (Express + MikroORM) contra la base de datos configurada en `.env` y
hace pedidos HTTP con `supertest`.

| Archivo | Test | Qué verifica |
|---|---|---|
| `marca.integration.test.ts` | GET /api/marca debería devolver 200 | El endpoint de listado de marcas responde correctamente pasando por todas las capas: ruta, controller, ORM y base de datos. |

## Salida de la ejecución

### Tests unitarios

```
$ pnpm test

> dswbackend@1.0.0 test
> tsx --test src/tests/validarProdUt.test.ts src/tests/turnosHoy.test.ts src/tests/validarServicio.test.ts src/tests/sanatizeMarca.test.ts

✔ sanitizeMarcaInput debería crear sanitizedInput correctamente (3.7201ms)
✔ turnosHoy - debería devolver 401 si no hay usuario logueado (1.9255ms)
✔ turnosHoy - debería devolver 401 si user existe pero no tiene id (0.4023ms)
✔ turnosHoy - debería ser válido si el usuario tiene id (0.2566ms)
✔ debería devolver error si no viene idAtSer (1.6799ms)
✔ debería devolver error si idAtSer no es válido (0.4306ms)
✔ debería devolver error si prodMars no es un array (0.2534ms)
✔ debería devolver null si los datos son válidos (0.2284ms)
✔ validarNombreDuplicado - debería devolver error si el servicio ya existe (1.7041ms)
✔ validarNombreDuplicado - debería ser válido si no existe el servicio (0.4176ms)
ℹ tests 10
ℹ suites 0
ℹ pass 10
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 652.4254
```

### Test de integración

```
$ pnpm run build

> dswbackend@1.0.0 build
> tsc -p ./tsconfig.json

$ pnpm run test:integration

> dswbackend@1.0.0 test:integration
> node --test dist/tests/marca.integration.test.js

✔ GET /api/marca debería devolver 200 (40.6976ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 7629.584
```

La salida del test de integración se muestra sin las líneas de log de las consultas SQL que imprime
MikroORM.
