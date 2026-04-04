# Estado Actual del Proyecto

Fecha de referencia: 1 de abril de 2026.

Este documento existe para evitar confusiones entre el codigo vigente, las auditorias historicas y las guias que describen planes futuros.

## Que es SUMITRONIC hoy

SUMITRONIC es un ecommerce en Next.js 14 con App Router, Supabase y Tailwind. El proyecto ya tiene base funcional de tienda, autenticacion, carrito, favoritos, checkout, perfil de usuario, panel administrativo y contenido SEO basico.

No debe tratarse todavia como plataforma cerrada o completamente estabilizada. Hay funcionalidad real en produccion/desarrollo, pero tambien deuda tecnica, documentacion historica y una capa de base de datos que requiere tratamiento cuidadoso.

## Funcionalidad visible en el repo

### Storefront publico

- Home en `/`
- Catalogo en `/products`
- Detalle de producto en `/products/[id]`
- Categorias en `/categorias/[slug]`
- Marcas en `/marcas/[slug]`
- Blog indexable en `/blog` y `/blog/[slug]`
- Centro de ayuda en `/help` y `/help/[slug]`

### Cuenta de usuario

- Login en `/auth/login`
- Registro en `/auth/register`
- Callback OAuth en `/auth/callback`
- Perfil en `/profile`
- Configuracion y cambio de password
- Favoritos en `/favorites`
- Ordenes en `/orders`

### Compra

- Carrito en `/cart`
- Checkout en `/checkout`
- Confirmacion en `/checkout/success`

### Administracion

- Panel en `/admin`
- Gestion de inventario
- Formulario de productos
- Vista de ventas/pedidos
- Boton de sincronizacion desde Google Sheets

## Backend expuesto en App Router

Rutas API activas en `app/api/`:

- `/api/products`
- `/api/products/[id]`
- `/api/categories`
- `/api/categories/[id]`
- `/api/cart`
- `/api/favorites`
- `/api/orders`
- `/api/orders/[id]`
- `/api/setup-favorites`
- `/api/sync-products`

## Estado de base de datos

La base de datos remota actual no debe asumirse como canonica sin verificacion.

La referencia mas util dentro del repo es:

- `supabase/db_cluster-04-09-2025@04-34-20.backup.gz`

Los archivos que hoy describen o modifican estructura son:

- `supabase/schema.sql`
- `supabase/migrations/20250101_initial_schema.sql`
- `supabase/migrations/20251201_user_persistence.sql`
- `supabase/migrations/20251208_create_indexes.sql`
- `supabase/migrations/20260329_restore_backup_compatibility.sql`
- `supabase/migrations/20260401_sanear_schema_contrato.sql`
- `supabase/migrations/20261101_storage_products.sql`

### Flujo recomendado para retomar BD

1. Restaurar el backup en Postgres local.
2. Validar tablas, columnas e indices realmente presentes.
3. Comparar con `schema.sql` y migrations.
4. Solo despues decidir si se repara la instancia remota actual o se levanta una nueva.

## Variables de entorno por capacidad

### Minimas para ejecutar la app

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Para operaciones server-side o sync

```env
SUPABASE_SERVICE_ROLE_KEY=
SYNC_SECRET=
```

### Para Google Sheets

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GOOGLE_SHEET_NAME=
```

### Para rate limiting opcional

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### Para restauracion local del backup

```env
CAPISHOP_DB_CONTAINER=
CAPISHOP_DB_NAME=
CAPISHOP_DB_USER=
CAPISHOP_DB_PASSWORD=
CAPISHOP_DB_PORT=
CAPISHOP_DB_BACKUP_PATH=
```

Estos nombres `CAPISHOP_*` se mantienen como identificadores tecnicos legados por compatibilidad con scripts y restore local.

## Comportamientos importantes que suelen confundir

- `npm run dev` levanta la app en puerto `3003`, no en `3000`.
- `docs/reports/`, `docs/reportes/` y `docs/archive/` contienen snapshots historicos, no una fotografia unica del presente.
- Hay reportes viejos que ya quedaron superados por cambios posteriores en blog, help center, admin y SEO.
- El rate limiting no bloquea el desarrollo si faltan variables de Upstash; el codigo hace fallback no-op.
- La sincronizacion con Google Sheets si exige credenciales completas y `SYNC_SECRET`.
- Restaurar el backup local devuelve Postgres util para inspeccion, no un stack Supabase completo con Auth y Storage funcionando igual que remoto.

## Documentos que si son referencia actual

- `README.md`
- `docs/README.md`
- `docs/guides/REBRANDING_SUMITRONIC.md`
- `docs/guides/ENVIRONMENT_VARIABLES.md`
- `docs/guides/DATABASE_OPERATIONS.md`
- `docs/guides/GOOGLE_SHEETS_OPERATIONS.md`

## Documentos que deben leerse como contexto, no como verdad actual

- Todo `docs/archive/`
- La mayoria de `docs/reports/`
- La mayoria de `docs/reportes/`
- Checklists de mejoras si no estan contrastados con codigo
