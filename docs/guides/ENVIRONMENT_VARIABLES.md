# Variables de Entorno - SUMITRONIC

Esta guia refleja las variables realmente usadas por el codigo del repositorio al 1 de abril de 2026.

Importante: los identificadores `CAPISHOP_*` y nombres como `capishop-postgres` siguen siendo los validos a nivel tecnico mientras no se haga la migracion de infraestructura.

## Resumen rapido

### Minimas para levantar la app

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-publica
```

### Opcionales para rate limiting

```env
UPSTASH_REDIS_REST_URL=https://tu-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=tu-token-de-redis
```

Si faltan estas variables, el rate limiting hace fallback a modo no-op y la app sigue funcionando.

### Necesarias para sincronizacion con Google Sheets

```env
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n\"
GOOGLE_SHEET_ID=tu-sheet-id
GOOGLE_SHEET_NAME=Catalogo
SYNC_SECRET=tu-secreto-de-sync
```

### Opcionales para restauracion local del backup

```env
CAPISHOP_DB_CONTAINER=capishop-postgres
CAPISHOP_DB_NAME=postgres
CAPISHOP_DB_USER=capishop_admin
CAPISHOP_DB_PASSWORD=cambia-esta-clave
CAPISHOP_DB_PORT=54329
CAPISHOP_DB_BACKUP_PATH=supabase/db_cluster-04-09-2025@04-34-20.backup.gz
```

## Donde se usan

### Supabase publico

Usadas por la app cliente y servidor:

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`

### Upstash Redis

Usadas en:

- `lib/ratelimit.ts`

Si no existen, se crea un rate limiter permisivo para no bloquear desarrollo.

### Google Sheets + sync de catalogo

Usadas en:

- `lib/sync-products.ts`
- `app/api/sync-products/route.ts`

Sin estas variables, la ruta de sincronizacion falla porque exige credenciales completas y secreto de autorizacion.

### Restauracion local del backup

Usadas por:

- `scripts/restore-local-postgres.ps1`

## Ejemplo de `.env.local`

```env
# Supabase minimo
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-publica

# Opcional: server-side / sync
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GOOGLE_SHEET_NAME=
SYNC_SECRET=

# Opcional: rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Opcional: restore local
CAPISHOP_DB_CONTAINER=capishop-postgres
CAPISHOP_DB_NAME=postgres
CAPISHOP_DB_USER=capishop_admin
CAPISHOP_DB_PASSWORD=
CAPISHOP_DB_PORT=54329
CAPISHOP_DB_BACKUP_PATH=supabase/db_cluster-04-09-2025@04-34-20.backup.gz
```

## Notas de seguridad

- `NEXT_PUBLIC_*` se expone al navegador.
- `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_PRIVATE_KEY` y `SYNC_SECRET` son secretos server-side.
- No subas `.env.local` al repositorio.
- Usa `.env.example` como plantilla minima, no como garantia de que todas las integraciones opcionales estan activas.

## Verificacion basica

Para verificar configuracion base:

```bash
npm run dev
```

Para validar conectividad o DB:

```bash
npm run db:quick-check
npm run db:test:connection
npm run test:database
```

## Referencias relacionadas

- `README.md`
- `docs/ESTADO_ACTUAL_2026-04.md`
- `docs/guides/DATABASE_OPERATIONS.md`
- `docs/guides/GOOGLE_SHEETS_OPERATIONS.md`
- `.env.example`
