# Variables de Entorno - CapiShop

Este archivo documenta todas las variables de entorno necesarias para el proyecto.

## 📋 Variables Requeridas

### Supabase (Base de Datos y Autenticación)
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-publica
```

### Upstash Redis (Rate Limiting) - OPCIONAL
```env
UPSTASH_REDIS_REST_URL=https://tu-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=tu-token-de-redis
```

**Nota**: Si no configuras Upstash Redis, el rate limiting no funcionará pero la aplicación seguirá operando normalmente.

## 🔧 Configuración

### 1. Crear archivo `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto con las variables necesarias:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://pmvhtxlciekynczjspja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-aqui

# Opcional: Rate Limiting con Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 2. Obtener Credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configurar Upstash Redis (Opcional)

Para habilitar rate limiting y proteger las APIs:

1. Ve a [upstash.com](https://upstash.com)
2. Crea una cuenta gratuita
3. Crea una nueva base de datos Redis
4. Copia las credenciales:
   - **UPSTASH_REDIS_REST_URL**
   - **UPSTASH_REDIS_REST_TOKEN**

**Plan Gratuito**: 10,000 comandos/día (suficiente para desarrollo y sitios pequeños)

## ⚠️ Seguridad

### Variables Públicas vs Privadas

- **`NEXT_PUBLIC_*`**: Estas variables son **públicas** y se exponen al navegador. Solo usa estas para datos que pueden ser públicos (como URLs de API).
- **Sin prefijo**: Estas variables son **privadas** y solo están disponibles en el servidor.

### Buenas Prácticas

1. ✅ **NUNCA** subas `.env.local` a Git
2. ✅ Usa `.env.example` para documentar las variables necesarias
3. ✅ Rota las claves regularmente en producción
4. ✅ Usa diferentes credenciales para desarrollo y producción

## 🚀 Despliegue en Vercel

Al desplegar en Vercel, configura las variables de entorno en:

1. Ve a tu proyecto en Vercel
2. **Settings** > **Environment Variables**
3. Agrega cada variable con su valor correspondiente
4. Selecciona los entornos: **Production**, **Preview**, **Development**

## 📝 Ejemplo Completo

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://pmvhtxlciekynczjspja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Upstash Redis (Opcional - para rate limiting)
UPSTASH_REDIS_REST_URL=https://us1-caring-firefly-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXAAIncDE1...
```

## 🔍 Verificación

Para verificar que las variables están configuradas correctamente:

```bash
npm run dev
```

Si hay variables faltantes, la aplicación lanzará un error claro indicando cuál falta.

## 📚 Referencias

- [Supabase Docs](https://supabase.com/docs)
- [Upstash Redis Docs](https://docs.upstash.com/redis)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
