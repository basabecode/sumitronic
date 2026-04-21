# SUMITRONIC

Plataforma de comercio electronico construida con Next.js 14, TypeScript y Supabase para operar un storefront moderno, administrar catalogo, gestionar cuentas de usuario y procesar pedidos sobre una arquitectura full-stack unificada.

El repositorio concentra la aplicacion publica, las interfaces administrativas, las rutas API, la integracion con servicios externos, la capa de datos y la documentacion operativa necesaria para evolucionar el producto de forma segura y mantenible.

## Vision General

SUMITRONIC esta diseñado como un ecommerce enfocado en catalogo, conversion y operacion comercial. La aplicacion combina renderizado con App Router, componentes cliente para experiencias interactivas, acceso a datos con Supabase y automatizaciones puntuales para sincronizacion, notificaciones y soporte operativo.

El proyecto cubre estas capacidades principales:

- Storefront publico con catalogo, detalle de producto, marcas, categorias, blog, centro de ayuda y contenido SEO.
- Cuenta de usuario con autenticacion, perfil, favoritos, historial de pedidos y configuracion de credenciales.
- Carrito con persistencia local y sincronizacion para usuarios autenticados.
- Checkout orientado a mercado colombiano con validaciones de datos, pagos por billeteras digitales y verificacion posterior.
- Panel administrativo para inventario, alta y edicion de productos, seguimiento comercial y sincronizacion de catalogo.
- Backend basado en Route Handlers de Next.js para catalogo, carrito, favoritos, pedidos, contacto y utilidades internas.

## Arquitectura de Alto Nivel

```text
Cliente web (Next.js App Router)
  ├─ UI publica y SEO
  ├─ Contextos de auth, carrito, favoritos y datos compartidos
  └─ Panel administrativo
          │
          ▼
Rutas API / Server Components
  ├─ Catalogo y filtros
  ├─ Pedidos y checkout
  ├─ Contacto y notificaciones
  ├─ Generacion de comprobantes PDF
  └─ Sincronizacion de catalogo
          │
          ▼
Servicios y persistencia
  ├─ Supabase Auth + Postgres + Storage
  ├─ Google Sheets API
  ├─ Resend / React Email
  ├─ Upstash Redis (opcional)
  └─ Vercel runtime
```

## Capacidades del Sistema

### Storefront

- Home page con secciones dinamicas, productos destacados, marcas, contenido comercial y CTA.
- Catalogo paginado con filtros por categoria, marca, precio, stock, estado de oferta y ordenamiento.
- Paginas de producto, categorias, marcas, blog y centro de ayuda.
- Metadatos SEO, `sitemap`, `robots`, Open Graph y datos estructurados.
- Activos PWA y configuracion base para experiencia mobile-friendly.

### Identidad y Cuenta

- Login, registro y callback OAuth mediante Supabase Auth.
- Perfil de usuario con actualizacion de datos y gestion de credenciales.
- Favoritos y pedidos ligados al usuario autenticado.
- Proteccion de sesiones desde middleware server-side.

### Carrito y Checkout

- Estado global del carrito mediante contexto React.
- Persistencia en `localStorage` y sincronizacion hacia backend cuando existe sesion.
- Checkout con validacion de datos personales y direccion de entrega.
- Creacion de pedidos con recalculo server-side de items y totales.
- Generacion de comprobantes PDF para pedidos autenticados.

### Operacion Administrativa

- Dashboard administrativo para inventario, ventas y mantenimiento de catalogo.
- Creacion, edicion, activacion y eliminacion de productos.
- Exportacion de catalogo a CSV.
- Sincronizacion de productos desde Google Sheets con controles de acceso.

### Integraciones

- Google Sheets como fuente de sincronizacion de catalogo.
- Resend + React Email para correos transaccionales y notificaciones.
- Upstash Redis para rate limiting cuando esta configurado.
- Vercel Speed Insights para observabilidad de experiencia.

## Composicion del Repositorio

```text
app/         Rutas App Router, paginas publicas, panel admin y API handlers
components/  UI reutilizable, layout, carrito, auth, pagos y modulos admin
contexts/    Estado global de autenticacion, carrito, favoritos y datos compartidos
emails/      Plantillas transaccionales renderizadas con React Email
hooks/       Hooks de interfaz y utilidades de comportamiento
lib/         Clientes, tipos, branding, pagos, sincronizacion y utilidades de dominio
public/      Assets estaticos, imagenes, iconografia y manifiestos
scripts/     Scripts de validacion, pruebas operativas y mantenimiento
supabase/    Esquema SQL, migraciones y artefactos de base de datos
tests/       Suite de pruebas con Vitest y Testing Library
docs/        Guias tecnicas, diagnosticos y referencia operativa
```

## Stack Tecnologico

### Aplicacion

- Next.js 14 con App Router
- React 18
- TypeScript 5
- Tailwind CSS
- shadcn/ui + Radix UI

### Datos y Backend

- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Route Handlers de Next.js

### Integraciones y Operacion

- Google Sheets API
- Resend
- React Email
- Upstash Redis
- Vercel

### Calidad

- Vitest
- Testing Library
- ESLint
- Prettier
- Husky + lint-staged

## Flujo Tecnico de Pedido

1. El usuario arma el carrito desde el storefront.
2. El checkout recopila datos de contacto, entrega y metodo de pago.
3. La orden se envia a `/api/orders`.
4. El servidor valida autenticacion cuando aplica, limita peticiones y reconstruye los items usando precios reales desde base de datos.
5. La orden queda registrada con estado pendiente y puede disparar notificaciones transaccionales.
6. Los usuarios autenticados pueden consultar su historial y descargar comprobantes.

Este enfoque evita confiar en precios enviados por el cliente y mantiene la logica critica de negocio dentro del servidor.

## Seguridad y Privacidad

El proyecto sigue un conjunto de practicas orientadas a reducir superficie de riesgo:

- Los secretos viven en variables de entorno y no deben versionarse.
- Las operaciones administrativas verifican rol o secreto interno segun el caso.
- Los pedidos recalculan productos y totales en el servidor.
- La sincronizacion de catalogo requiere autenticacion administrativa o secreto de integracion.
- El rate limiting se activa automaticamente cuando Upstash esta disponible y hace fallback seguro en entornos locales.
- El sistema no esta orientado al almacenamiento de datos de tarjeta; el flujo actual trabaja con pagos verificados posteriormente.

## Requisitos

- Node.js `>= 18`
- npm `>= 8`
- Credenciales vigentes de Supabase para levantar la aplicacion

## Puesta en Marcha

```bash
npm install
npm run dev
```

Crear `.env.local` a partir de `.env.example` antes de iniciar el entorno.

Por defecto el entorno local inicia en `http://localhost:3003`.

## Variables de Entorno

La referencia completa vive en `.env.example` y `docs/guides/ENVIRONMENT_VARIABLES.md`. A nivel practico, estas son las categorias mas importantes:

### Minimas para ejecutar la app

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Servidor y operaciones administrativas

```env
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
SITE_PROTECTED=
```

### Sincronizacion de catalogo

```env
SYNC_SECRET=
CRON_SECRET=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GOOGLE_SHEET_NAME=
```

### Notificaciones y email

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_SUPPORT_EMAIL=
ADMIN_NOTIFICATION_EMAIL=
NOTIFY_ORDER_SECRET=
```

### Rate limiting opcional

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Scripts Relevantes

```bash
npm run dev
npm run build
npm run start
npm run test -- --run
npm run test:coverage
npm run test:database
npm run db:quick-check
npm run db:test:connection
npm run db:restore:local
```

Tambien existen scripts auxiliares para sincronizacion, scraping, carga de imagenes y validaciones operativas dentro de `scripts/`.

## Calidad y Pruebas

La base de pruebas actual usa Vitest con entorno `jsdom`, Testing Library y archivo de setup dedicado. La configuracion de coverage define umbrales del `70%` para statements, branches, functions y lines.

Las pruebas cubren, entre otros, estos dominios:

- Middleware y autenticacion.
- Componentes clave del storefront.
- Utilidades de contenido, formato y validacion.
- API routes de pedidos, notificaciones y sincronizacion.
- Contextos de carrito y modulos de pago.

## Documentacion Complementaria

- `docs/README.md`: indice documental del proyecto.
- `docs/ESTADO_ACTUAL_2026-04.md`: fotografia tecnica del estado actual.
- `docs/guides/ENVIRONMENT_VARIABLES.md`: contrato de variables de entorno.
- `docs/guides/DATABASE_OPERATIONS.md`: operacion y mantenimiento de base de datos.
- `docs/guides/GOOGLE_SHEETS_OPERATIONS.md`: sincronizacion y mantenimiento del catalogo.
- `docs/guides/PAYMENT_SYSTEM_MASTER_GUIDE.md`: detalle funcional de la capa de pagos.

## Casos de Uso para Equipos de Ingenieria

Este repositorio esta preparado para ser trabajado por equipos de frontend, backend, producto y operaciones tecnicas porque concentra:

- Una sola base de codigo para experiencia publica, administracion y backend HTTP.
- Separacion clara entre UI, contexto de cliente, dominio, integraciones y scripts.
- Un contrato de entorno documentado para desarrollo, pruebas y automatizaciones.
- Un conjunto de guias en `docs/` para transferir contexto sin depender de conocimiento tribal.

## Estado del Proyecto

SUMITRONIC es una base funcional y extensible para ecommerce. El sistema ya implementa flujos reales de catalogo, autenticacion, pedidos y administracion, y mantiene espacio para evolucionar integraciones de pago, automatizacion operativa y endurecimiento de plataforma sin rehacer la arquitectura principal.
