# Sumitronic — Configuración Cloudflare R2 + Imágenes

## Contexto

Proyecto ecommerce Next.js (App Router) con 598 productos en catálogo.
Stack: Next.js 14, TypeScript, Tailwind, Supabase (PostgreSQL), Vercel.
Cloudflare R2 bucket creado: `sumitronic-images`
Dominio de imágenes activo: `https://images.sumitronic.com`

## Tareas a implementar

### 1. Actualizar next.config.js

Agregar el dominio de Cloudflare R2 a remotePatterns para que
Next.js Image Optimization acepte imágenes desde images.sumitronic.com:

```js
// next.config.js o next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.sumitronic.com',
        pathname: '/**',
      },
      // mantener los dominios anteriores si ya existían
    ],
  },
}
```

### 2. Crear variable de entorno para la URL base de imágenes

En .env.local agregar:

```
NEXT_PUBLIC_IMAGES_URL=https://images.sumitronic.com
```

En .env.example agregar la misma variable (sin valor sensible):

```
NEXT_PUBLIC_IMAGES_URL=https://images.sumitronic.com
```

### 3. Crear utility helper para URLs de imágenes

Crear archivo: `src/lib/images.ts`

```ts
/**
 * Retorna la URL completa de una imagen de producto desde Cloudflare R2.
 * @param path - ruta relativa, ej: "productos/sku-001.jpg"
 */
export function getImageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_IMAGES_URL ?? 'https://images.sumitronic.com'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}/${cleanPath}`
}

/**
 * Retorna la URL de imagen de un producto por su SKU.
 * Convenio de nombres: productos/{sku}.jpg
 */
export function getProductImageUrl(sku: string, extension = 'jpg'): string {
  return getImageUrl(`productos/${sku}.${extension}`)
}

/**
 * Retorna la URL de imagen de placeholder cuando no hay imagen disponible.
 */
export function getPlaceholderImageUrl(): string {
  return getImageUrl('ui/placeholder-product.jpg')
}
```

### 4. Actualizar componentes de imagen de productos

Buscar todos los componentes que renderizan imágenes de productos
(ProductCard, ProductDetail, ProductGrid o similares) y:

- Reemplazar URLs hardcodeadas o de Supabase Storage por getProductImageUrl(sku)
- Usar el componente <Image> de Next.js con:
  - width y height explícitos
  - alt descriptivo con nombre del producto
  - placeholder="blur" con blurDataURL para mejor UX
  - priority={true} solo en el primer producto visible (above the fold)

Ejemplo de implementación en un ProductCard:

```tsx
import Image from 'next/image'
import { getProductImageUrl, getPlaceholderImageUrl } from '@/lib/images'

interface ProductCardProps {
  product: {
    sku: string
    nombre: string
    precio: number
    // ...otros campos
  }
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <div className="...">
      <Image
        src={getProductImageUrl(product.sku)}
        alt={product.nombre}
        width={400}
        height={400}
        className="object-cover w-full h-full"
        priority={priority}
        onError={e => {
          // fallback a placeholder si la imagen no existe en R2
          e.currentTarget.src = getPlaceholderImageUrl()
        }}
      />
      {/* resto del card */}
    </div>
  )
}
```

### 5. Crear script de migración de imágenes a R2

Crear archivo: `scripts/upload-images-to-r2.ts`

Este script sube todas las imágenes del catálogo al bucket sumitronic-images.
Requiere wrangler autenticado: `wrangler login`

```ts
import { execSync } from 'child_process'
import { readdirSync, existsSync } from 'fs'
import path from 'path'

const BUCKET_NAME = 'sumitronic-images'
const IMAGES_DIR = './public/images/productos' // ajustar según estructura actual
const R2_PREFIX = 'productos'

async function uploadImages() {
  if (!existsSync(IMAGES_DIR)) {
    console.error(`Directorio no encontrado: ${IMAGES_DIR}`)
    console.log('Ajusta IMAGES_DIR en el script según donde estén tus imágenes actuales')
    process.exit(1)
  }

  const files = readdirSync(IMAGES_DIR).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))

  console.log(`Subiendo ${files.length} imágenes a R2...`)

  let success = 0
  let failed = 0

  for (const file of files) {
    const localPath = path.join(IMAGES_DIR, file)
    const r2Key = `${R2_PREFIX}/${file}`

    try {
      execSync(`wrangler r2 object put ${BUCKET_NAME}/${r2Key} --file="${localPath}"`, {
        stdio: 'pipe',
      })
      console.log(`✅ ${file}`)
      success++
    } catch (err) {
      console.error(`❌ ${file}`)
      failed++
    }
  }

  console.log(`\nCompletado: ${success} subidas, ${failed} errores`)
}

uploadImages()
```

Agregar script en package.json:

```json
{
  "scripts": {
    "upload:images": "npx ts-node scripts/upload-images-to-r2.ts"
  }
}
```

### 6. Configurar Cloudflare Access para pre-producción (opcional)

Si el dominio sumitronic.com está activo en Cloudflare pero NO quieres
que sea público todavía, agregar header de protección temporal.

Crear archivo: `src/middleware.ts` (si no existe)

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // En pre-producción: verificar header de Cloudflare Access
  // Cloudflare Access inyecta CF-Access-Authenticated-User-Email
  // cuando el usuario pasó por el login de Zero Trust

  const cfUser = request.headers.get('cf-access-authenticated-user-email')
  const isDev = process.env.NODE_ENV === 'development'
  const isProtected = process.env.NEXT_PUBLIC_SITE_PROTECTED === 'true'

  if (isProtected && !isDev && !cfUser) {
    return new NextResponse('Acceso restringido', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

Agregar en .env.local:

```
NEXT_PUBLIC_SITE_PROTECTED=true   # cambiar a false cuando lances
```

### 7. Verificación final

Después de implementar todo, verificar:

1. `npm run build` sin errores de TypeScript
2. Las imágenes cargan desde https://images.sumitronic.com/productos/[sku].jpg
3. El componente Image de Next.js no lanza errores de dominio no permitido
4. El fallback a placeholder funciona cuando una imagen no existe en R2
5. En mobile las imágenes cargan con tamaño correcto (no sobredimensionadas)

## Estructura de archivos que debe quedar

```
sumitronic/
├── src/
│   ├── lib/
│   │   └── images.ts          ← NUEVO
│   ├── middleware.ts           ← NUEVO (si no existía)
│   └── components/
│       └── products/
│           └── ProductCard.tsx ← ACTUALIZADO
├── scripts/
│   └── upload-images-to-r2.ts ← NUEVO
├── .env.local                  ← ACTUALIZADO
├── .env.example                ← ACTUALIZADO
└── next.config.js              ← ACTUALIZADO
```

## Notas importantes

- El bucket R2 ya está creado: sumitronic-images (creado 2026-04-14)
- El dominio images.sumitronic.com ya está configurado y activo
- NO migrar ni tocar Supabase — sigue siendo la base de datos principal
- NO migrar ni tocar Vercel — sigue siendo el hosting de Next.js
- Solo cambia el origen de las imágenes estáticas de productos
- Mantener el dominio sumitronic.com desconectado de Vercel por ahora
  (usar preview URL de Vercel durante pre-producción)
