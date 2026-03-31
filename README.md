# CapiShop

Aplicacion e-commerce construida con Next.js 14, TypeScript y Supabase. Este README refleja el estado operativo real del repositorio a marzo de 2026.

## Estado actual

- La aplicacion compila correctamente con `npm run build`.
- La base de datos remota actual no esta confiable; el repo incluye un backup en `supabase/db_cluster-04-09-2025@04-34-20.backup.gz`.
- El flujo recomendado para retomar la BD es restaurar primero ese backup en Postgres local con Docker.
- La suite de tests existe, pero no esta completamente sana todavia.
- Se ha optimizado intensamente la interfaz (Mobile-First y UI/UX Pro Max) en el Header, secciones de productos, Slider y el Admin Dashboard, resolviendo desbordamientos horizontales.

## Stack

- Next.js 14 App Router
- TypeScript
- Supabase Auth, Postgres y Storage
- Tailwind CSS + shadcn/ui
- Vitest + Testing Library

## Estructura relevante

```text
app/            Rutas App Router y API routes
components/     Componentes reutilizables
contexts/       Estado global
lib/            Utilidades y clientes de Supabase
scripts/        Scripts operativos reales del proyecto
supabase/       Schema, migrations, backup y assets de storage
docs/           Documentacion vigente e historica
```

## Variables de entorno minimas

Crear `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Opcional:

```env
SUPABASE_SERVICE_ROLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Comandos confiables

```bash
npm run dev
npm run build
npm run test -- --run
npm run test:database
npm run db:quick-check
npm run db:test:connection
npm run db:restore:local
```

## Base de datos

Documentacion actualizada:

- `docs/guides/SUPABASE_INTEGRATION.md`
- `docs/guides/DATABASE_TESTING.md`
- `docs/guides/LOCAL_DATABASE_RECOVERY.md`

Activos reales hoy:

- `supabase/schema.sql`
- `supabase/migrations/20251201_user_persistence.sql`
- `supabase/migrations/20251208_create_indexes.sql`
- `supabase/db_cluster-04-09-2025@04-34-20.backup.gz`

## Notas

- `npm run lint` todavia no es una validacion confiable porque Next intenta inicializar ESLint en modo interactivo.
- Parte de la documentacion en `docs/reports/` y `docs/archive/` es historica y no debe tomarse como estado actual del proyecto.
