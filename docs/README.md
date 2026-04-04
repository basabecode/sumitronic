# Documentacion de SUMITRONIC

Esta carpeta mezcla documentacion vigente, diagnosticos tecnicos y archivo historico. Usa este indice para no confundir planes pasados con el estado real del proyecto.

Nota: la marca actual es `SUMITRONIC`. Algunos identificadores tecnicos heredados (`CAPISHOP_*`, nombres de contenedores, funciones SQL y referencias de infraestructura) siguen vigentes mientras se completa la migracion tecnica.

## Orden recomendado de lectura

1. `../README.md`
2. `ESTADO_ACTUAL_2026-04.md`
3. `guides/REBRANDING_SUMITRONIC.md`
4. `guides/REBRANDING_PENDIENTES_TECNICOS.md`
5. `guides/ENVIRONMENT_VARIABLES.md`
6. `guides/DATABASE_OPERATIONS.md`
7. `guides/GOOGLE_SHEETS_OPERATIONS.md`
8. `CHECKLIST_QA_RELEASE_FASE4.md`

## Que contiene cada carpeta

- `guides/`: referencia operativa vigente.
- `reports/`: auditorias, diagnosticos y reportes tecnicos puntuales.
- `reportes/`: reportes funcionales historicos o especializados.
- `archive/`: documentacion antigua que no debe leerse como estado actual.

## Documentos canonicos

- Rebranding: `guides/REBRANDING_SUMITRONIC.md`
- Pendientes tecnicos del rebranding: `guides/REBRANDING_PENDIENTES_TECNICOS.md`
- Variables de entorno: `guides/ENVIRONMENT_VARIABLES.md`
- Datos y recovery: `guides/DATABASE_OPERATIONS.md`
- Google Sheets y sync: `guides/GOOGLE_SHEETS_OPERATIONS.md`

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
