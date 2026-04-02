# Documentacion de CapiShop

Esta carpeta mezcla documentacion vigente, diagnosticos tecnicos y archivo historico. Usa este indice para no confundir planes pasados con el estado real del proyecto.

## Orden recomendado de lectura

1. `../README.md`
2. `ESTADO_ACTUAL_2026-04.md`
3. `guides/ENVIRONMENT_VARIABLES.md`
4. `guides/SUPABASE_INTEGRATION.md`
5. `guides/DATABASE_TESTING.md`
6. `guides/LOCAL_DATABASE_RECOVERY.md`
7. `guides/CONTRATO_GOOGLE_SHEETS.md`
8. `guides/GOOGLE_SHEETS_SERVICE_ACCOUNT_SETUP.md`

## Que contiene cada carpeta

- `guides/`: referencia operativa vigente.
- `reports/`: auditorias, diagnosticos y reportes tecnicos puntuales.
- `reportes/`: reportes funcionales historicos o especializados.
- `archive/`: documentacion antigua que no debe leerse como estado actual.

## Regla practica

Si un documento contradice al codigo o al archivo `ESTADO_ACTUAL_2026-04.md`, asume primero que el documento esta desactualizado y verificalo contra el repo.

## Puntos de confusion ya identificados

- Hay auditorias antiguas que describen problemas ya corregidos.
- Hay guias que explican arquitectura objetivo o mejoras planeadas, no necesariamente implementadas.
- La base remota de Supabase no debe considerarse fuente confiable sin validacion previa.
- El backup local y las migrations conviven; no reemplazan el analisis del estado real antes de tocar produccion.

## Base de datos

Activos importantes del repo:

- `supabase/schema.sql`
- `supabase/migrations/*.sql`
- `supabase/db_cluster-04-09-2025@04-34-20.backup.gz`
- `supabase/pmvhtxlciekynczjspja.storage/`

Antes de intentar arreglar Supabase, restaura el backup en local y valida el esquema contra la app.
