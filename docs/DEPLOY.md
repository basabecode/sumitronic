# SUMITRONIC — Guía de Deploy a Producción

**Stack:** Next.js 14 · Supabase cloud · Vercel  
**Repositorio:** https://github.com/basabecode/sumitronic  
**Proyecto Supabase cloud:** `pmvhtxlciekynczjspja.supabase.co`  
**Última actualización:** 2026-04-10

---

## Resumen del proceso

```
FASE 1 — Supabase cloud   (~20 min)  →  aplicar schema + migraciones + configurar auth
FASE 2 — MCP Vercel       (opcional) →  autenticar el MCP para operar Vercel desde Claude
FASE 3 — Vercel deploy    (~10 min)  →  conectar repo + variables de entorno + primer deploy
```

El orden importa: **Supabase debe estar configurado antes de hacer el deploy en Vercel.**

---

## FASE 1 — Supabase cloud

### 1.1 Acceder al dashboard

1. Ir a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Seleccionar el proyecto **`pmvhtxlciekynczjspja`** (SUMITRONIC)

### 1.2 Obtener las claves de API

Ir a **Settings → API** y copiar:

| Variable                        | Dónde encontrarla                                                       |
| ------------------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | "Project URL" — ya conocida: `https://pmvhtxlciekynczjspja.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "Project API keys → anon public"                                        |
| `SUPABASE_SERVICE_ROLE_KEY`     | "Project API keys → service_role" ⚠️ nunca exponer al browser           |

> **Importante:** Las claves del Docker local (`sb_publishable_*`, `sb_secret_*`) son solo para desarrollo.
> En Vercel deben ir las claves cloud del dashboard.

### 1.3 Aplicar el schema y las migraciones

Ir a **SQL Editor** y ejecutar los siguientes scripts **en el orden indicado**.
Cada uno es idempotente (`IF NOT EXISTS`, `IF EXISTS`) — se puede re-ejecutar sin riesgo.

---

#### Script 1 — Schema base

**Archivo:** `supabase/schema.sql`

Crea todas las tablas principales:
`users`, `categories`, `products`, `product_images`, `product_variants`,
`inventory`, `orders`, `carts`, `cart_items`, `favorites`, `system_settings`

```
Copiar y pegar contenido de: supabase/schema.sql
```

---

#### Script 2 — Schema inicial extendido

**Archivo:** `supabase/migrations/20250101_initial_schema.sql`

Complementa el schema base con tablas adicionales y relaciones.

```
Copiar y pegar contenido de: supabase/migrations/20250101_initial_schema.sql
```

---

#### Script 3 — Persistencia de usuarios

**Archivo:** `supabase/migrations/20251201_user_persistence.sql`

Crea trigger para sincronizar `auth.users` → `public.users` al registrarse.
Garantiza que cada usuario autenticado tenga un perfil en la tabla `users`.

```
Copiar y pegar contenido de: supabase/migrations/20251201_user_persistence.sql
```

---

#### Script 4 — Índices de rendimiento

**Archivo:** `supabase/migrations/20251208_create_indexes.sql`

Crea índices en `products`, `orders`, `carts`, `cart_items`, `favorites`, `categories`, `users`.
Mejora el rendimiento entre 10x–100x en queries frecuentes.

```
Copiar y pegar contenido de: supabase/migrations/20251208_create_indexes.sql
```

---

#### Script 5 — Compatibilidad con backup

**Archivo:** `supabase/migrations/20260329_restore_backup_compatibility.sql`

Restaura compatibilidad con el backup histórico. Crea la función `capishop_slugify`.

```
Copiar y pegar contenido de: supabase/migrations/20260329_restore_backup_compatibility.sql
```

---

#### Script 6 — Saneamiento del schema

**Archivo:** `supabase/migrations/20260401_sanear_schema_contrato.sql`

- Migra datos de `compare_at_price` → `compare_price` y elimina la columna legacy
- Sincroniza tabla `inventory` desde `products.stock_quantity`
- Crea índices para `compare_price` e `inventory.product_id`

```
Copiar y pegar contenido de: supabase/migrations/20260401_sanear_schema_contrato.sql
```

---

#### Script 7 — Función slugify de SUMITRONIC

**Archivo:** `supabase/migrations/20260403_add_sumitronic_slugify.sql`

Crea el alias `sumitronic_slugify` (renombrado desde `capishop_slugify`).

```
Copiar y pegar contenido de: supabase/migrations/20260403_add_sumitronic_slugify.sql
```

---

#### Script 8 — Columna `price` en `cart_items` ⚠️ Crítico

**Archivo:** `supabase/migrations/20260410_add_price_to_cart_items.sql`

Agrega `price numeric NOT NULL DEFAULT 0` a `cart_items`.
Sin esta migración, la API del carrito falla con error de columna no encontrada.

```
Copiar y pegar contenido de: supabase/migrations/20260410_add_price_to_cart_items.sql
```

---

#### Script 9 — Bucket de Storage para productos

**Archivo:** `supabase/migrations/20261101_storage_products.sql`

Crea el bucket público `products` en Supabase Storage para imágenes de productos.

```
Copiar y pegar contenido de: supabase/migrations/20261101_storage_products.sql
```

---

### 1.4 Configurar Auth — URL permitidas

Ir a **Authentication → URL Configuration** y configurar:

| Campo             | Valor                                                            |
| ----------------- | ---------------------------------------------------------------- |
| **Site URL**      | `https://sumitronic.vercel.app`                                  |
| **Redirect URLs** | `https://sumitronic.vercel.app/**`                               |
|                   | `https://sumitronic.vercel.app/auth/callback`                    |
|                   | `http://localhost:3003/**` ← para que dev local siga funcionando |

> Si el proyecto tiene dominio personalizado, reemplazar `sumitronic.vercel.app`
> por el dominio real en todos los campos.

### 1.5 Configurar RLS (Row Level Security)

El schema ya incluye `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` en cada tabla.
Verificar que las políticas estén activas en **Authentication → Policies**.

Las políticas mínimas requeridas:

- `products`: lectura pública, escritura solo admin
- `orders`: lectura/escritura solo del propio usuario + admin
- `cart_items` / `carts`: solo el propio usuario
- `favorites`: solo el propio usuario

> Si las políticas no existen, el `SUPABASE_SERVICE_ROLE_KEY` en las API routes
> bypassea RLS correctamente — pero es buena práctica tenerlas configuradas.

### 1.6 Verificar que todo quedó bien

En **SQL Editor**, ejecutar este query de verificación:

```sql
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c
   WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS columnas
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Resultado esperado (mínimo):

```
cart_items      — 8 columnas (incluye price)
carts           — 5 columnas
categories      — 10 columnas
favorites       — 4 columnas
inventory       — 6 columnas
orders          — 18 columnas
product_images  — 7 columnas
product_variants — 9 columnas
products        — 20 columnas (compare_price, NO compare_at_price)
system_settings — 6 columnas
users           — 9 columnas
```

---

## FASE 2 — MCP de Vercel (opcional pero recomendado)

El MCP de Vercel permite configurar variables de entorno y gestionar el deploy
directamente desde Claude Code, sin salir del chat.

### 2.1 Instalar el MCP (si no está instalado)

En Claude Code, ejecutar:

```bash
claude mcp add --transport http "claude.ai Vercel" https://mcp.vercel.com/claude
```

O desde la configuración de Claude Desktop/Code:

- Settings → MCP Servers → Add Server
- URL: `https://mcp.vercel.com/claude`
- Nombre: `claude.ai Vercel`

### 2.2 Autenticar el MCP

1. En el chat de Claude Code, escribir `/mcp`
2. Seleccionar **"claude.ai Vercel"**
3. Completar el OAuth en el navegador con tu cuenta de Vercel
4. Volver al chat — las herramientas de Vercel quedan disponibles automáticamente

### 2.3 Instalar el MCP de Supabase (recomendado para el futuro)

Actualmente no está instalado. Para añadirlo:

```bash
claude mcp add --transport http "Supabase" https://mcp.supabase.com/claude
```

Con el MCP de Supabase activo, Claude puede:

- Crear y ejecutar migraciones directamente
- Consultar el schema en tiempo real
- Gestionar variables de entorno de Supabase
- Revisar logs de la DB

---

## FASE 3 — Deploy en Vercel

### 3.1 Conectar el repositorio (primera vez)

#### Opción A — Con MCP de Vercel activo (desde Claude)

Una vez autenticado el MCP, pedirle a Claude:

> "Crea un proyecto en Vercel conectado al repositorio basabecode/sumitronic
> con framework Next.js"

Claude ejecutará los pasos automáticamente.

#### Opción B — Manual desde vercel.com

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Importar repositorio: `basabecode/sumitronic`
3. Framework: **Next.js** (detectado automáticamente)
4. Root directory: `.` (raíz del proyecto)
5. **NO hacer deploy aún** — primero configurar variables de entorno

### 3.2 Configurar variables de entorno

Ir a **Project Settings → Environment Variables** y agregar:

#### Variables CRÍTICAS (la app falla sin ellas)

```
NEXT_PUBLIC_SUPABASE_URL
  = https://pmvhtxlciekynczjspja.supabase.co
  Entornos: Production, Preview, Development

NEXT_PUBLIC_SUPABASE_ANON_KEY
  = (anon key del dashboard Supabase cloud)
  Entornos: Production, Preview, Development

SUPABASE_SERVICE_ROLE_KEY
  = (service_role key del dashboard Supabase cloud)
  Entornos: Production, Preview
  ⚠️ NO agregar a Development si usas Docker local

NOTIFY_ORDER_SECRET
  = (generar con: openssl rand -hex 32)
  Entornos: Production, Preview

NEXT_PUBLIC_SITE_URL
  = https://sumitronic.vercel.app
  Entornos: Production
  (en Preview usar la URL automática de Vercel)
```

#### Variables REQUERIDAS (funcionalidad degradada sin ellas)

```
CRON_SECRET
  = (generar con: openssl rand -hex 32)
  Entornos: Production
  Nota: debe coincidir con el header que Vercel envía al cron de sync-products

RESEND_API_KEY
  = re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Entornos: Production, Preview
  Obtener en: resend.com (plan gratuito: 100 emails/día)

ADMIN_NOTIFICATION_EMAIL
  = admin@sumitronic.co
  Entornos: Production

RESEND_FROM_EMAIL
  = notificaciones@sumitronic.co
  Entornos: Production
  ⚠️ Debe ser un dominio verificado en Resend

GOOGLE_SERVICE_ACCOUNT_EMAIL
  = ecomerce-electronica-sheets@eternal-synapse-463902-f6.iam.gserviceaccount.com
  Entornos: Production

GOOGLE_PRIVATE_KEY
  = (clave privada RSA del archivo JSON de la service account)
  Formato: "-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
  ⚠️ En Vercel pegar con saltos de línea reales o usar \n como escape

GOOGLE_SHEET_ID
  = 1K-LNnEsyldr15yP4-E0mAeMXUlJ8OZXUZh8Uln3ejHE
  Entornos: Production

GOOGLE_SHEET_NAME
  = catalogo
  Entornos: Production
```

#### Variables OPCIONALES (degradan con gracia si no están)

```
UPSTASH_REDIS_REST_URL
  = https://tu-instancia.upstash.io
  Entornos: Production
  Nota: sin esto el rate limiting se desactiva (acepta tráfico ilimitado)

UPSTASH_REDIS_REST_TOKEN
  = AXxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Entornos: Production
```

### 3.3 Verificar el cron en vercel.json

El archivo `vercel.json` ya tiene configurado el cron de sincronización:

```json
{
  "version": 2,
  "framework": "nextjs",
  "crons": [
    {
      "path": "/api/sync-products",
      "schedule": "0 * * * *"
    }
  ]
}
```

Esto llama a `/api/sync-products` cada hora. Vercel enviará el header
`Authorization: Bearer <CRON_SECRET>` automáticamente si `CRON_SECRET` está configurado.

> **Nota:** Los crons de Vercel solo están disponibles en el plan Pro o superior.
> En el plan Hobby, el cron no se ejecutará — la sincronización deberá hacerse
> manualmente desde el panel admin.

### 3.4 Primer deploy

#### Con MCP activo:

Pedirle a Claude: _"Haz el primer deploy del proyecto SUMITRONIC en Vercel"_

#### Manual:

```bash
# Desde la raíz del proyecto
npx vercel --prod
```

O desde el dashboard de Vercel: **Deployments → Deploy**.

### 3.5 Verificar el deploy

Una vez desplegado, verificar en orden:

```bash
# 1. La home carga correctamente
curl -I https://sumitronic.vercel.app

# 2. La API de productos responde
curl https://sumitronic.vercel.app/api/products?limit=1

# 3. La API de categorías responde
curl https://sumitronic.vercel.app/api/categories

# 4. El health-check del carrito (requiere auth — debe retornar 401)
curl https://sumitronic.vercel.app/api/cart
```

---

## Troubleshooting frecuente

### Error: "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY son requeridos"

La variable no está configurada en Vercel o tiene un typo. Verificar en
Project Settings → Environment Variables que el nombre sea exacto.

### Error: "NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos"

`SUPABASE_SERVICE_ROLE_KEY` no está configurada. Es crítica para la creación de órdenes.

### Error 500 en `/api/cart` — "column price does not exist"

La migración `20260410_add_price_to_cart_items.sql` no fue aplicada.
Ejecutarla en el SQL Editor de Supabase.

### Error 500 en `/api/products` — column "compare_at_price" does not exist

La migración `20260401_sanear_schema_contrato.sql` no fue aplicada o
el schema.sql fue ejecutado después de ella (sobreescribió el rename).
Verificar que `products` tiene columna `compare_price` (no `compare_at_price`).

### Auth no funciona — usuarios no pueden registrarse

Verificar en Supabase → Authentication → URL Configuration que el
**Site URL** y los **Redirect URLs** incluyen el dominio de producción.

### El cron de sync-products retorna 401

`CRON_SECRET` no está configurado en Vercel. El endpoint exige el secreto
via header `x-sync-secret` o `Authorization: Bearer <CRON_SECRET>`.

### Imágenes de productos no cargan

Verificar que el bucket `products` en Supabase Storage es público.
Ejecutar la migración `20261101_storage_products.sql` si no existe el bucket.

---

## Checklist pre-lanzamiento

```
SUPABASE
[ ] Schema base aplicado (supabase/schema.sql)
[ ] Las 8 migraciones aplicadas en orden
[ ] Columna compare_price confirmada en products (NO compare_at_price)
[ ] Columna price confirmada en cart_items
[ ] Site URL configurada en Auth settings
[ ] Redirect URLs incluyen el dominio de producción
[ ] Claves anon y service_role copiadas para Vercel

VERCEL
[ ] Repositorio conectado (basabecode/sumitronic)
[ ] Framework: Next.js detectado
[ ] Variables CRÍTICAS configuradas (5 variables)
[ ] Variables REQUERIDAS configuradas (8 variables)
[ ] Build exitoso (sin errores TypeScript ni ESLint)
[ ] Deploy a producción completado

VERIFICACIÓN POST-DEPLOY
[ ] https://sumitronic.vercel.app carga correctamente
[ ] /api/products retorna productos
[ ] /api/categories retorna categorías
[ ] /api/cart retorna 401 (correcto — requiere auth)
[ ] /auth/login muestra el formulario
[ ] Registro de usuario funciona
[ ] Login funciona
[ ] Carrito funciona (agregar producto)
[ ] Checkout muestra los campos
```

---

## Comandos útiles de Supabase CLI (alternativa al dashboard)

Si tienes la CLI de Supabase instalada y el proyecto vinculado:

```bash
# Vincular con el proyecto cloud
supabase link --project-ref pmvhtxlciekynczjspja

# Aplicar todas las migraciones al cloud
supabase db push

# Ver estado de las migraciones
supabase migration list

# Abrir el studio local
supabase studio

# Generar tipos TypeScript desde el schema cloud (para actualizar lib/types/database.ts)
supabase gen types typescript --project-id pmvhtxlciekynczjspja > lib/types/database.ts
```

---

## Comandos útiles de Vercel CLI (alternativa al dashboard)

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Vincular proyecto existente
vercel link

# Ver variables de entorno configuradas
vercel env ls

# Agregar una variable de entorno
vercel env add NOMBRE_VARIABLE

# Deploy a producción
vercel --prod

# Ver logs en tiempo real
vercel logs --follow
```

---

## Configuración de MCP en Claude Code

### Archivo de configuración MCP

Los MCP se configuran en:

- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Proyecto local:** `.claude/settings.json`

### Configuración recomendada para SUMITRONIC

```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-adapter"],
      "transport": "http",
      "url": "https://mcp.vercel.com/claude"
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url",
        "https://pmvhtxlciekynczjspja.supabase.co",
        "--supabase-key",
        "<SERVICE_ROLE_KEY>"
      ]
    }
  }
}
```

### Qué puede hacer cada MCP

| MCP          | Capacidades                                                                         |
| ------------ | ----------------------------------------------------------------------------------- |
| **Vercel**   | Crear proyectos, gestionar env vars, ver deployments, ver logs, configurar dominios |
| **Supabase** | Ejecutar SQL, ver schema, crear migraciones, gestionar auth, ver logs de DB         |

### Activar el MCP de Vercel en esta sesión

```
1. Escribir /mcp en el chat de Claude Code
2. Seleccionar "claude.ai Vercel"
3. Completar el OAuth en el navegador
4. Las herramientas quedan disponibles en el chat automáticamente
```

### Activar el MCP de Supabase

```bash
# Agregar el MCP al proyecto
claude mcp add supabase --transport stdio -- \
  npx -y @supabase/mcp-server-supabase@latest \
  --supabase-url https://pmvhtxlciekynczjspja.supabase.co \
  --supabase-key <SERVICE_ROLE_KEY>
```

Una vez configurado, Claude puede ejecutar migraciones, consultar tablas y
revisar el estado de la DB directamente desde el chat.

---

_Documentación generada el 2026-04-10 para SUMITRONIC v0.1.0_  
_Repositorio: https://github.com/basabecode/sumitronic_
