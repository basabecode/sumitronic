# Recuperacion local de base de datos

Esta guia restaura el backup del proyecto en un Postgres local usando Docker.

## Que tenemos

- Backup SQL comprimido: `supabase/db_cluster-04-09-2025@04-34-20.backup.gz`
- Esquema base: `supabase/schema.sql`
- Migraciones posteriores: `supabase/migrations/*.sql`

El backup es SQL plano comprimido con gzip. No requiere `pg_restore`.

## Que resuelve este flujo

- Permite inspeccionar la data real guardada.
- Permite comparar backup vs esquema actual.
- Permite extraer datos antes de decidir una migracion a Supabase.

## Que no resuelve por si solo

- No levanta Auth de Supabase.
- No levanta Storage de Supabase.
- No expone API REST de Supabase.
- No deja la app lista para usar `NEXT_PUBLIC_SUPABASE_URL` contra local automaticamente.

## Prerrequisitos

- Docker Desktop funcionando.
- PowerShell.

## Restauracion rapida

Desde la raiz del proyecto:

```powershell
npm run db:restore:local
```

Eso ejecuta:

```powershell
scripts/restore-local-postgres.ps1
```

Nota: este backup contiene comandos `\connect postgres`, por lo que los objetos restaurados quedan en la base `postgres`.

## Valores por defecto del script

- Container: `capishop-postgres`
- Database: `postgres`
- User: `capishop_admin`
- Password: la definida en `.env`
- Port: `54329`

## Comandos utiles despues de restaurar

Conectarse:

```powershell
docker exec -it capishop-postgres psql -U capishop_admin -d postgres
```

Listar tablas:

```sql
\dt
```

Ver conteos basicos:

```sql
select count(*) from public.products;
select count(*) from public.categories;
select count(*) from public.orders;
```

## Siguiente paso recomendado

Despues de restaurar:

1. Confirmar que el backup contiene las tablas y datos esperados.
2. Comparar con `supabase/schema.sql`.
3. Comparar con `supabase/migrations/20251201_user_persistence.sql`.
4. Comparar con `supabase/migrations/20251208_create_indexes.sql`.
5. Decidir si el destino final sera:
   - Supabase remoto existente
   - nueva instancia Supabase
   - o entorno Supabase local
