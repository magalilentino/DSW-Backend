# Peluquería — Backend

API REST del sistema de gestión de una peluquería: turnos, agenda de peluqueros, catálogo de
servicios, productos, tonos y fórmulas, y vouchers de descuento por fidelidad.

Este repositorio contiene solo el backend. El frontend se encuentra en un repositorio aparte y se
comunica con esta API por HTTP.

**Documentación del trabajo práctico:** [docs/README.md](docs/README.md) (propuesta, minutas,
tracking, documentación de la API, evidencia de tests, video y deploy).

## Tecnologías

| | |
|---|---|
| Lenguaje | TypeScript sobre Node.js |
| Framework web | Express |
| Base de datos | MySQL |
| ORM | MikroORM |
| Autenticación | JWT (`jsonwebtoken`) + contraseñas hasheadas con `bcrypt` |
| Mails | Nodemailer (Gmail) |
| Tests | `node:test` + `tsx` (unitarios) y `supertest` (integración) |
| Documentación de la API | OpenAPI 3 + Swagger UI |

## Requisitos previos

- **Node.js 22** (la versión exacta está en `.nvmrc`).
- **pnpm 10**. Si no lo tenés: `npm install -g pnpm`.
- **MySQL 8** corriendo y accesible.
- (Opcional) Una cuenta de Gmail con [contraseña de aplicación](https://support.google.com/accounts/answer/185833) para el envío de mails.

## Instalación

```bash
git clone https://github.com/magalilentino/DSW-Backend.git
cd DSW-Backend
pnpm install
```

## Configuración

1. Crear la base de datos vacía en MySQL. Las tablas se crean solas al iniciar la aplicación.

   ```sql
   CREATE DATABASE peluqueria;
   ```

2. Copiar el archivo de ejemplo de variables de entorno y completarlo:

   ```bash
   cp .env.example .env
   ```

   | Variable | Descripción | Ejemplo |
   |---|---|---|
   | `JWT_SECRET` | Clave para firmar los tokens. Cualquier texto largo y secreto. | `una-clave-larga-y-secreta` |
   | `DB_USER` | Usuario de MySQL | `root` |
   | `DB_PASS` | Contraseña de MySQL | `root` |
   | `DB_HOST` | Host de MySQL | `localhost` |
   | `DB_PORT` | Puerto de MySQL | `3306` |
   | `DB_NAME` | Nombre de la base | `peluqueria` |
   | `MAIL_USER` | Cuenta de Gmail que envía los mails | `peluqueria@gmail.com` |
   | `MAIL_PASS` | Contraseña de aplicación de esa cuenta | `abcd efgh ijkl mnop` |

   Sin `MAIL_USER` y `MAIL_PASS`, la app funciona, pero fallan las operaciones que envían mails
   (sacar un turno con un servicio de coloración y finalizar una atención que desbloquea un voucher).

## Ejecución

```bash
pnpm start
```

Compila el proyecto y levanta el servidor en **http://localhost:3000**. Queda en modo watch:
cada vez que se guarda un cambio en `src/`, recompila y reinicia.

Al arrancar, MikroORM sincroniza el esquema de la base (crea o actualiza las tablas a partir de las
entidades).

## Documentación de la API

Con el servidor levantado, la documentación interactiva está en:

**http://localhost:3000/api/docs**

Ahí se ven todos los endpoints con sus parámetros, el body esperado, las respuestas posibles y el rol
requerido, y se pueden probar desde el navegador:

1. Ejecutar `POST /persona/login` con un usuario existente y copiar el `token` de la respuesta.
2. Hacer clic en **Authorize** y pegar el token (sin el prefijo `Bearer`).
3. Desde ese momento, las rutas protegidas se ejecutan con ese usuario.

La especificación está en [`docs/openapi.yaml`](docs/openapi.yaml).

### Autenticación y niveles de acceso

Las rutas protegidas esperan el header `Authorization: Bearer <token>`. El token se obtiene con
`POST /api/persona/login` y vence a las 2 horas.

| Rol | Puede |
|---|---|
| `cliente` | Sacar turnos, consultar sus turnos pendientes y su historial, ver el precio con descuento. |
| `peluquero` | Todo lo anterior, más administrar servicios, productos, categorías, marcas, tonos, fórmulas y vouchers; gestionar su agenda (bloquear horarios); cancelar y finalizar atenciones; registrar los productos usados; ver el resumen del día (turnos, atenciones completadas y ganancias). |

Respuestas de error de autenticación:
- `401`: no se envió token.
- `403`: el token es inválido o expiró, o el rol del usuario no tiene permiso para esa ruta.

### Crear usuarios de prueba

El registro público (`POST /api/persona/register`) siempre crea usuarios con rol `cliente`. Los
peluqueros los da de alta otro peluquero con `POST /api/persona/peluquero`. Por eso, con la base
vacía, el **primer peluquero** se crea así:

1. Registrarlo como cualquier usuario con `POST /api/persona/register` (desde Swagger o cualquier
   cliente HTTP):

   ```json
   {
     "nombre": "Ana",
     "apellido": "Gómez",
     "dni": "40123456",
     "email": "peluquero@test.com",
     "telefono": "3415551234",
     "clave": "123456"
   }
   ```

2. Cambiarle el rol directamente en la base:

   ```sql
   UPDATE persona SET type = 'peluquero' WHERE email = 'peluquero@test.com';
   ```

A partir de ahí, ese peluquero puede crear otros peluqueros desde la aplicación. Para el usuario
cliente alcanza con el paso 1, usando otro `email` y otro `dni`.

## Tests

**Unitarios** (no necesitan base de datos):

```bash
pnpm test
```

**De integración** (levantan la app real, así que necesitan la base configurada en `.env`):

```bash
pnpm run build
pnpm run test:integration
```

| Archivo | Tipo | Qué prueba |
|---|---|---|
| `src/tests/validarServicio.test.ts` | Unitario | Validación de nombre duplicado al crear un servicio. |
| `src/tests/validarProdUt.test.ts` | Unitario | Validación del registro de productos utilizados en una atención. |
| `src/tests/turnosHoy.test.ts` | Unitario | Validación del usuario logueado al consultar los turnos del día. |
| `src/tests/sanatizeMarca.test.ts` | Unitario | Sanitización de los datos de entrada de una marca. |
| `src/tests/marca.integration.test.ts` | Integración | `GET /api/marca` responde 200 contra la app y la base reales. |

La evidencia de la última ejecución está en [`docs/evidencia-tests.md`](docs/evidencia-tests.md).

## Estructura del proyecto

```
src/
├── app.ts                  # Configuración de Express: middlewares, routers y Swagger
├── server.ts               # Punto de entrada: levanta el servidor
├── mailer.ts               # Envío de mails
├── shared/orm.ts           # Configuración de MikroORM
├── <módulo>/               # Un módulo por entidad (atencion, servicio, producto, marca, ...)
│   ├── <módulo>.entity.ts      # Entidad (modelo de la base)
│   ├── <módulo>.controller.ts  # Lógica de cada endpoint
│   ├── <módulo>.routes.ts      # Rutas y middlewares de autenticación/rol
│   └── sanitize*/validar*.ts   # Sanitización y validación de la entrada
└── tests/                  # Tests unitarios y de integración
docs/
└── openapi.yaml            # Especificación OpenAPI de la API
```

Cada módulo sigue la misma separación en capas: **rutas** (qué URL y qué permisos) → **sanitización y
validación** de la entrada → **controller** (lógica) → **entidad** persistida mediante el **ORM**.

## Deploy

Links y credenciales de prueba: ver [docs/README.md](docs/README.md#deploy).
