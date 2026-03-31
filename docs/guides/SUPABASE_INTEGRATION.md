# Integracion actual con Supabase

Esta guia describe el estado real del proyecto y el flujo recomendado para recuperar la base de datos.

## Que usa hoy la app

La aplicacion espera estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Opcional:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

El cliente se construye desde:

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`

## Activos reales disponibles

- `supabase/schema.sql`
- `supabase/migrations/20251201_user_persistence.sql`
- `supabase/migrations/20251208_create_indexes.sql`
- `supabase/db_cluster-04-09-2025@04-34-20.backup.gz`
- `supabase/pmvhtxlciekynczjspja.storage/`

## Recomendacion actual

No empieces recreando tablas manualmente en Supabase remoto a ciegas.

Flujo recomendado:

1. Restaurar el backup en Postgres local con Docker.
2. Inspeccionar datos y esquema restaurados.
3. Comparar ese estado con `schema.sql` y `migrations/`.
4. Validar la instancia remota actual con los scripts del repo.
5. Solo entonces decidir si:
   - migrar datos hacia la instancia remota actual
   - reconstruir una nueva instancia Supabase
   - o preparar un entorno Supabase local completo

## Validaciones disponibles

```bash
npm run test:database
npm run db:quick-check
npm run db:test:connection
npm run fix:database
```

## Restauracion local

Consulta:

- `docs/guides/LOCAL_DATABASE_RECOVERY.md`
- `scripts/restore-local-postgres.ps1`

## Limitaciones importantes

- El repo no trae configuracion lista para `supabase start`.
- Restaurar el backup en Docker te da Postgres local, no un stack Supabase completo.
- Para que la app funcione completamente en local con Auth y Storage, haria falta preparar un entorno Supabase local o una nueva instancia remota.

## Administracion

Si la tabla `public.users` ya existe y el usuario esta creado, el rol admin se puede ajustar con:

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'tu-email@ejemplo.com';
```
