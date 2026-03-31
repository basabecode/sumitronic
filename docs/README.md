# Documentacion de CapiShop

Esta carpeta mezcla guias vigentes con reportes historicos. Usa este indice como punto de entrada.

## Usar primero

- `guides/SUPABASE_INTEGRATION.md`
- `guides/DATABASE_TESTING.md`
- `guides/LOCAL_DATABASE_RECOVERY.md`
- `guides/ENVIRONMENT_VARIABLES.md`

## Estado documental

- `README.md` del repo y las guias anteriores son la referencia operativa actual.
- `CHECKLIST_MEJORAS.md` e `IMPLEMENTACION_MEJORAS.md` contienen contexto util, pero no deben asumirse como estado vigente sin contrastar con el codigo.
- `reports/` y `archive/` contienen auditorias y snapshots historicos. Hay reportes ahi que contradicen el estado actual del repo.

## Base de datos

Activos reales del repo:

- `supabase/schema.sql`
- `supabase/migrations/*.sql`
- `supabase/db_cluster-04-09-2025@04-34-20.backup.gz`
- `supabase/pmvhtxlciekynczjspja.storage/`

Antes de intentar arreglar Supabase, restaura el backup en local y valida el esquema contra la app.
