# CapiShop

Aplicacion e-commerce construida con Next.js 14, TypeScript y Supabase. Este README resume el estado operativo real del repositorio al 1 de abril de 2026.

## Leer primero

Si vas a retomar el proyecto, usa este orden:

1. `README.md`
2. `docs/README.md`
3. `docs/ESTADO_ACTUAL_2026-04.md`
4. `docs/guides/SUPABASE_INTEGRATION.md`
5. `docs/guides/ENVIRONMENT_VARIABLES.md`

## Estado actual

- La app corre sobre Next.js App Router y el entorno local esta configurado para el puerto `3003`.
- El storefront publico existe y tiene rutas reales para home, catalogo, detalle de producto, categorias, marcas, blog y help center.
- Hay autenticacion con Supabase para login, registro, callback OAuth, perfil, favoritos, ordenes y checkout protegido.
- Existe panel administrativo en `/admin` con inventario, formulario de producto, dashboard de ventas y sincronizacion desde Google Sheets.
- El backend expone API routes para productos, categorias, carrito, favoritos, ordenes y sync de catalogo.
- La base remota actual no debe asumirse como fuente de verdad; el repo incluye un backup utilizable en `supabase/db_cluster-04-09-2025@04-34-20.backup.gz`.
- La suite de pruebas existe, pero no toda la base del proyecto esta cubierta ni toda la suite debe asumirse como libre de deuda.

## Stack real

- Next.js 14 App Router
- React 18
- TypeScript
- Supabase Auth, Postgres y Storage
- Tailwind CSS + shadcn/ui
- Vitest + Testing Library
- Google Sheets API para sincronizacion de catalogo
- Upstash Redis opcional para rate limiting

## Mapa rapido del repo

```text
app/            Rutas App Router y API routes
components/     Componentes de UI, layout, pagos y admin
contexts/       Estado global de carrito, auth y favoritos
lib/            Utilidades, tipos, contenido y clientes Supabase
scripts/        Scripts operativos para DB y validaciones
supabase/       Schema, migrations, backup y snapshot de storage
tests/          Tests unitarios y reportes locales
docs/           Guias vigentes, reportes y archivo historico
```

## Variables de entorno

Minimas para levantar la app:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Opcionales por modulo:

```env
SUPABASE_SERVICE_ROLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GOOGLE_SHEET_NAME=
SYNC_SECRET=
```

Referencia completa:

- `docs/guides/ENVIRONMENT_VARIABLES.md`
- `.env.example`

## Comandos utiles

```bash
npm run dev
npm run build
npm run test -- --run
npm run test:database
npm run db:quick-check
npm run db:test:connection
npm run db:restore:local
```

## Base de datos y recuperacion

El flujo recomendado hoy es:

1. Restaurar el backup en Postgres local con Docker.
2. Inspeccionar esquema y datos restaurados.
3. Contrastar con `supabase/schema.sql` y `supabase/migrations/`.
4. Validar la instancia remota antes de aplicar cambios manuales.

Guias vigentes:

- `docs/guides/SUPABASE_INTEGRATION.md`
- `docs/guides/DATABASE_TESTING.md`
- `docs/guides/LOCAL_DATABASE_RECOVERY.md`

Activos relevantes:

- `supabase/schema.sql`
- `supabase/migrations/20250101_initial_schema.sql`
- `supabase/migrations/20251201_user_persistence.sql`
- `supabase/migrations/20251208_create_indexes.sql`
- `supabase/migrations/20260329_restore_backup_compatibility.sql`
- `supabase/migrations/20260401_sanear_schema_contrato.sql`
- `supabase/migrations/20261101_storage_products.sql`
- `supabase/db_cluster-04-09-2025@04-34-20.backup.gz`

## Regla de lectura de docs

- `docs/guides/` contiene la referencia operativa vigente.
- `docs/reports/` y `docs/reportes/` contienen auditorias y diagnosticos puntuales.
- `docs/archive/` contiene contexto historico y no debe leerse como estado actual.

## Notas

- `npm run lint` no es una validacion estable hoy porque `next lint` puede intentar inicializar ESLint de forma interactiva.
- Si una guia contradice a `README.md`, `docs/README.md` o `docs/ESTADO_ACTUAL_2026-04.md`, asume que la guia esta desactualizada hasta contrastarla con el codigo.
