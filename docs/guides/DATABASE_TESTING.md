# Testing de Base de Datos

Esta guia refleja los scripts reales disponibles en el repo.

## Scripts vigentes

```text
scripts/validate-db.ts
scripts/quick-database-fix.ts
scripts/quick-check.js
scripts/test-supabase-connection.js
scripts/simple-db-test.js
scripts/migrate-products.ts
scripts/restore-local-postgres.ps1
```

## Que valida cada uno

- `npm run test:database`
  Valida existencia y acceso de tablas principales usando `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

- `npm run db:quick-check`
  Hace una comprobacion HTTP simple contra el API REST de Supabase y lista productos.

- `npm run db:test:connection`
  Ejecuta una validacion mas detallada de conexion y tablas desde Node.

- `npm run fix:database`
  Ejecuta un diagnostico rapido y propone correcciones manuales.

- `npm run db:migrate:products`
  Inserta productos desde `lib/products.json` hacia Supabase. No migra toda la base de datos.

- `npm run db:restore:local`
  Restaura el backup SQL comprimido en un Postgres local con Docker.

## Variables requeridas para validacion remota

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` es opcional, pero mejora la validacion al saltar RLS.

## Flujo recomendado

1. Restaurar el backup localmente con Docker.
2. Inspeccionar el esquema y los datos restaurados.
3. Validar la instancia remota actual con `npm run test:database`.
4. Comparar remoto vs backup antes de decidir migracion o reemplazo.

## Advertencias

- El repo no incluye hoy un entorno Supabase local completo listo para `supabase start`.
- La restauracion local con Docker crea un Postgres estandar, util para inspeccion y extraccion de datos.
- Un Postgres local no reemplaza por si solo Auth, Storage ni REST de Supabase.
