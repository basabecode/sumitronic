import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { truncateText } from '@/lib/formatting'
import { brand } from '@/lib/brand'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://www.somostecnicos.com',
  'Access-Control-Allow-Methods': 'GET',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
}

interface RawProduct {
  id: string
  name: string
  description: string
  price: number
  compare_price: number | null
  image_url: string
  brand: string
  stock_quantity: number
  featured: boolean
  created_at: string
  category: { id: string; name: string; slug: string } | null
}

interface FeaturedProduct {
  id: string
  name: string
  slug: string
  price: number
  originalPrice: number | null
  imageUrl: string
  category: string
  categorySlug: string
  brand: string
  shortDescription: string
  productUrl: string
  badge: 'Más vendido' | 'Nuevo' | 'Oferta' | null
}

const MOCK_PRODUCTS: FeaturedProduct[] = [
  {
    id: 'mock-1',
    name: 'Cámara IP HD exterior 4MP',
    slug: 'camara-ip-hd-exterior-4mp',
    price: 185000,
    originalPrice: 220000,
    imageUrl: `${brand.siteUrl}/images/placeholder-camara.jpg`,
    category: 'Cámara IP',
    categorySlug: 'camara-ip',
    brand: 'Hikvision',
    shortDescription: 'Cámara exterior con visión nocturna y detección de movimiento',
    productUrl: `${brand.siteUrl}/productos/camara-ip-hd-exterior-4mp`,
    badge: 'Oferta',
  },
  {
    id: 'mock-2',
    name: 'Kit alarma inalámbrica 8 zonas',
    slug: 'kit-alarma-inalambrica-8-zonas',
    price: 245000,
    originalPrice: null,
    imageUrl: `${brand.siteUrl}/images/placeholder-alarma.jpg`,
    category: 'Alarma',
    categorySlug: 'alarma',
    brand: 'DSC',
    shortDescription: 'Sistema de alarma para hogar o negocio, instalación sencilla',
    productUrl: `${brand.siteUrl}/productos/kit-alarma-inalambrica-8-zonas`,
    badge: 'Más vendido',
  },
  {
    id: 'mock-3',
    name: 'Control de acceso biométrico',
    slug: 'control-acceso-biometrico',
    price: 320000,
    originalPrice: null,
    imageUrl: `${brand.siteUrl}/images/placeholder-acceso.jpg`,
    category: 'Control de Acceso',
    categorySlug: 'control-acceso',
    brand: 'ZKTeco',
    shortDescription: 'Lector de huella dactilar para puertas, capacidad 500 usuarios',
    productUrl: `${brand.siteUrl}/productos/control-acceso-biometrico`,
    badge: null,
  },
  {
    id: 'mock-4',
    name: 'DVR 8 canales Full HD',
    slug: 'dvr-8-canales-full-hd',
    price: 410000,
    originalPrice: 480000,
    imageUrl: `${brand.siteUrl}/images/placeholder-dvr.jpg`,
    category: 'DVR/NVR',
    categorySlug: 'dvr-nvr',
    brand: 'Dahua',
    shortDescription: 'Grabador para 8 cámaras CCTV, disco duro no incluido',
    productUrl: `${brand.siteUrl}/productos/dvr-8-canales-full-hd`,
    badge: 'Oferta',
  },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function isOffer(p: RawProduct): boolean {
  return p.compare_price !== null && p.compare_price > p.price
}

function resolveBadge(p: RawProduct, now: number): FeaturedProduct['badge'] {
  if (isOffer(p)) return 'Oferta'
  if (new Date(p.created_at).getTime() > now - 30 * 24 * 60 * 60 * 1000) return 'Nuevo'
  // Sin salesCount en el schema: featured=true se usa como proxy de "Más vendido"
  if (p.featured) return 'Más vendido'
  return null
}

function mapProduct(p: RawProduct, now: number): FeaturedProduct {
  return {
    id: p.id,
    name: p.name,
    slug: slugify(p.name),
    price: p.price,
    originalPrice: isOffer(p) ? p.compare_price! : null,
    imageUrl: p.image_url,
    category: p.category?.name ?? 'Seguridad',
    categorySlug: p.category?.slug ?? 'seguridad',
    brand: p.brand,
    shortDescription: truncateText(p.description, 80),
    productUrl: `${brand.siteUrl}/products/${p.id}`,
    badge: resolveBadge(p, now),
  }
}

function selectDiverse(products: RawProduct[], now: number): FeaturedProduct[] {
  const seenCategories = new Set<string>()
  const seenBrands = new Set<string>()
  const result: FeaturedProduct[] = []

  for (const p of products) {
    if (result.length >= 8) break

    const catId = p.category?.id ?? '__none__'
    const brandKey = p.brand.toLowerCase()

    if (seenCategories.has(catId)) continue
    if (seenBrands.has(brandKey)) continue

    seenCategories.add(catId)
    seenBrands.add(brandKey)
    result.push(mapProduct(p, now))
  }

  return result
}

const PRODUCT_SELECT = `
  id,
  name,
  description,
  price,
  compare_price,
  image_url,
  brand,
  stock_quantity,
  featured,
  created_at,
  category:categories!category_id (
    id,
    name,
    slug
  )
`

export async function GET() {
  try {
    const supabase = createClient()
    const now = Date.now()

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('active', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(60)

    if (!error && data && data.length > 0) {
      const products = data as unknown as RawProduct[]

      // First pass: only in-stock products
      const selected = selectDiverse(
        products.filter(p => p.stock_quantity > 0),
        now
      )
      if (selected.length >= 4) {
        return NextResponse.json(
          { products: selected, fetchedAt: new Date(now).toISOString() },
          { headers: CORS_HEADERS }
        )
      }

      // Second pass: relax stock filter to reach minimum 4
      const relaxed = selectDiverse(products, now)
      if (relaxed.length > 0) {
        return NextResponse.json(
          { products: relaxed, fetchedAt: new Date(now).toISOString() },
          { headers: CORS_HEADERS }
        )
      }
    }

    return NextResponse.json(
      { products: MOCK_PRODUCTS, fetchedAt: new Date(now).toISOString() },
      { headers: CORS_HEADERS }
    )
  } catch (err) {
    console.error('[featured-products] DB error:', err)
    return NextResponse.json(
      { products: MOCK_PRODUCTS, fetchedAt: new Date().toISOString() },
      { headers: CORS_HEADERS }
    )
  }
}
