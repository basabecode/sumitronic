# Operacion de Datos y Recuperacion

Fecha de referencia: 3 de abril de 2026.

Esta es la guia canonica para trabajo operativo con Supabase, validacion remota y restauracion local del backup.

## Alcance

Consolida y reemplaza la lectura separada de:

- `SUPABASE_INTEGRATION.md`
- `DATABASE_TESTING.md`
- `LOCAL_DATABASE_RECOVERY.md`

## Variables relevantes

Minimas para la app:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Opcionales para operaciones server-side:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

Legado tecnico para restore local:

```env
CAPISHOP_DB_CONTAINER=
CAPISHOP_DB_NAME=
CAPISHOP_DB_USER=
CAPISHOP_DB_PASSWORD=
CAPISHOP_DB_PORT=
CAPISHOP_DB_BACKUP_PATH=
```

## Activos reales del repo

- `supabase/schema.sql`
- `supabase/migrations/20250101_initial_schema.sql`
- `supabase/migrations/20251201_user_persistence.sql`
- `supabase/migrations/20251208_create_indexes.sql`
- `supabase/migrations/20260329_restore_backup_compatibility.sql`
- `supabase/migrations/20260401_sanear_schema_contrato.sql`
- `supabase/migrations/20261101_storage_products.sql`
- `supabase/db_cluster-04-09-2025@04-34-20.backup.gz`

## Flujo recomendado

1. Restaurar el backup en Postgres local con Docker.
2. Inspeccionar tablas, indices y datos reales.
3. Comparar backup vs `schema.sql` y `migrations/`.
4. Validar la instancia remota actual con los scripts del repo.
5. Solo despues decidir si se repara remoto, se recrea una instancia o se prepara otro entorno.

## Restore local

Comando principal:

```bash
npm run db:restore:local
```

Script real:

```text
scripts/restore-local-postgres.ps1
```

Valores tecnicos por defecto:

- Container: `capishop-postgres`
- Database: `postgres`
- User: `capishop_admin`
- Port: `54329`

Conexion util:

```powershell
docker exec -it capishop-postgres psql -U capishop_admin -d postgres
```

## Validaciones disponibles

```bash
npm run test:database
npm run db:quick-check
npm run db:test:connection
npm run fix:database
```

## Lo que valida cada script

- `npm run test:database`
  Valida existencia y acceso a tablas principales usando Supabase remoto.
- `npm run db:quick-check`
  Hace comprobacion HTTP simple contra el API REST.
- `npm run db:test:connection`
  Ejecuta validacion mas detallada de conexion y tablas.
- `npm run fix:database`
  Ejecuta diagnostico rapido y propone correcciones manuales.
- `npm run db:migrate:products`
  Inserta productos desde `lib/products.json`; no migra toda la base.

## Limitaciones importantes

- El repo no trae hoy un `supabase start` listo para replicar todo el stack.
- Restaurar el backup local te da Postgres util para inspeccion, no Auth ni Storage equivalentes a Supabase.
- La instancia remota actual no debe asumirse como fuente canonica sin contraste con backup y migraciones.

## Admin

Si `public.users` ya existe y el usuario fue creado, el rol admin se puede ajustar con:

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'tu-email@ejemplo.com';
```

