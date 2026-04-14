// URL base del CDN de imágenes (Cloudflare R2). Se resuelve una vez al cargar el módulo.
const IMAGES_BASE_URL = process.env.NEXT_PUBLIC_IMAGES_URL ?? 'https://images.sumitronic.com'

export function getImageUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${IMAGES_BASE_URL}/${cleanPath}`
}

// Convenio de nombres R2: productos/{sku}.{ext}
export function getProductImageUrl(sku: string, extension = 'jpg'): string {
  return getImageUrl(`productos/${sku}.${extension}`)
}

export function getPlaceholderImageUrl(): string {
  return getImageUrl('ui/placeholder-product.jpg')
}
