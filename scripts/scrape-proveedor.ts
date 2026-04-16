/**
 * scripts/scrape-proveedor.ts
 *
 * Scraper de https://www.comerciotecnologico.co/
 * Extrae productos desde JSON-LD, los mapea al formato del Google Sheet
 * y genera un archivo CSV listo para importar.
 *
 * Uso:
 *   npx tsx scripts/scrape-proveedor.ts
 *   npx tsx scripts/scrape-proveedor.ts --solo-smart-home   (filtra solo productos relevantes)
 *
 * Salida: scripts/output/catalogo-proveedor.csv
 */

import { loadEnvConfig } from '@next/env'
import * as fs from 'fs'
import * as path from 'path'
import { JSDOM, VirtualConsole } from 'jsdom'

loadEnvConfig(process.cwd())

// ─── Configuración ────────────────────────────────────────────────────────────

const BASE_URL = 'https://www.comerciotecnologico.co'
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'catalogo-proveedor.csv')
const DELAY_MS = 800 // pausa entre requests para no sobrecargar el servidor
const SOLO_SMART_HOME = process.argv.includes('--solo-smart-home')

// Palabras clave en el slug para filtrar solo productos smart home
const SMART_HOME_KEYWORDS = [
  'camara',
  'camera',
  'imou',
  'tapo',
  'router',
  'wifi',
  'wi-fi',
  'mesh',
  'deco',
  'tenda',
  'mercusys',
  'switch',
  'access-point',
  'halo',
  'enchufe',
  'smart',
  'ups',
  'forza',
  'regulador',
  'bateria',
  'solar',
  'timbre',
  'doorbell',
  'cerradura',
  'poe',
  'extensor',
  'repeater',
]

// Exclusiones explícitas aunque contengan alguna keyword anterior
const EXCLUDE_KEYWORDS = [
  'impresora',
  'tinta',
  'suministro',
  'monitor',
  'portatil',
  'laptop',
  'notebook',
  'tablet',
  'audifonos',
  'diadema',
  'parlante',
  'teclado',
  'cajon-monedero',
  'pos-system',
  'pos-digital',
  'lector',
  'refrigerante',
  'cargador-voltaje',
  'redmi-watch',
  'mouse-gamer',
  'mouse-de-juego',
  'base-refrigerante',
  'torre-lenovo',
  'dell-inspiron',
  'acer-gamer',
  'lenovo',
  'disco-solido',
  'disco-duro',
  'memoria-micro',
]

// Mapeo de categorías del proveedor a slugs de SUMITRONIC
const CATEGORY_MAP: Record<string, string> = {
  camara: 'camaras-wifi',
  tapo: 'camaras-wifi',
  imou: 'camaras-wifi',
  solar: 'camaras-solares',
  doorbell: 'timbres-inteligentes',
  timbre: 'timbres-inteligentes',
  cerradura: 'cerraduras-inteligentes',
  router: 'routers-redes',
  mesh: 'routers-redes',
  deco: 'routers-redes',
  'access-point': 'routers-redes',
  switch: 'routers-redes',
  extensor: 'routers-redes',
  halo: 'routers-redes',
  tenda: 'routers-redes',
  mercusys: 'routers-redes',
  ups: 'energia-respaldo',
  forza: 'energia-respaldo',
  regulador: 'energia-respaldo',
  bateria: 'energia-respaldo',
  enchufe: 'routers-redes',
}

// Tags base por categoría
const CATEGORY_TAGS: Record<string, string[]> = {
  'camaras-wifi': ['camara', 'wifi', 'seguridad'],
  'camaras-solares': ['camara', 'solar', 'bateria', 'exterior'],
  'timbres-inteligentes': ['timbre', 'doorbell', 'videoportero'],
  'cerraduras-inteligentes': ['cerradura', 'smart', 'acceso'],
  'routers-redes': ['router', 'wifi', 'conectividad'],
  'energia-respaldo': ['ups', 'energia', 'respaldo'],
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ScrapedProduct {
  sku: string
  name: string
  description: string
  price: number
  compare_price: number | null
  cost_price: null
  brand: string
  category_slug: string
  stock_quantity: number
  weight: number | null
  featured: boolean
  active: boolean
  tags: string[]
  image_url: string
  extra_images: string[]
  source_url: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function log(msg: string, type: 'info' | 'ok' | 'warn' | 'error' = 'info') {
  const prefix = { info: '  ', ok: '✓ ', warn: '⚠ ', error: '✗ ' }[type]
  console.log(`${prefix}${msg}`)
}

function slugContains(slug: string, keywords: string[]) {
  return keywords.some(kw => slug.includes(kw))
}

function isSmartHomeProduct(slug: string): boolean {
  if (slugContains(slug, EXCLUDE_KEYWORDS)) return false
  return slugContains(slug, SMART_HOME_KEYWORDS)
}

function detectCategorySlug(slug: string, brand: string): string {
  const combined = `${slug} ${brand.toLowerCase()}`
  for (const [keyword, categorySlug] of Object.entries(CATEGORY_MAP)) {
    if (combined.includes(keyword)) return categorySlug
  }
  return 'routers-redes' // fallback para conectividad
}

function generateTags(name: string, brand: string, categorySlug: string): string[] {
  const tags: string[] = []
  const lowerName = name.toLowerCase()
  const lowerBrand = brand.toLowerCase()

  tags.push(lowerBrand)

  const baseTags = CATEGORY_TAGS[categorySlug]
  if (baseTags) tags.push(...baseTags)

  if (lowerName.includes('wifi 6') || lowerName.includes('wi-fi 6') || lowerName.includes('ax'))
    tags.push('wifi6')
  if (lowerName.includes('4g') || lowerName.includes('lte')) tags.push('4g', 'lte')
  if (lowerName.includes('poe')) tags.push('poe')
  if (lowerName.includes('solar')) tags.push('solar')
  if (lowerName.includes('4k') || lowerName.includes('8mp')) tags.push('4k')
  if (lowerName.includes('mesh')) tags.push('mesh')
  if (lowerName.includes('exterior') || lowerName.includes('outdoor')) tags.push('exterior')
  if (lowerName.includes('interior') || lowerName.includes('indoor')) tags.push('interior')

  return [...new Set(tags)]
}

// ─── Fetching & Parsing ───────────────────────────────────────────────────────

async function fetchSitemapUrls(): Promise<string[]> {
  log('Obteniendo URLs del sitemap...')
  const res = await fetch(SITEMAP_URL)
  const xml = await res.text()

  const urls: string[] = []
  const regex = /<loc>(https:\/\/www\.comerciotecnologico\.co\/productos\/[^<]+)<\/loc>/g
  let match
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1])
  }

  log(`${urls.length} URLs de productos encontradas en el sitemap`, 'ok')
  return urls
}

async function scrapeProductPage(url: string): Promise<ScrapedProduct | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SumitronicBot/1.0)' },
    })

    if (!res.ok) {
      log(`HTTP ${res.status} en ${url}`, 'warn')
      return null
    }

    const html = await res.text()
    const vc = new VirtualConsole()
    vc.on('jsdomError', () => {}) // silencia warnings de CSS externo (Google Fonts, etc.)

    const dom = new JSDOM(html, {
      resources: undefined, // no cargar recursos externos
      runScripts: undefined, // no ejecutar scripts
      virtualConsole: vc,
    })
    const document = dom.window.document

    // Extraer JSON-LD (fuente más confiable del sitio)
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')
    let productData: Record<string, unknown> | null = null

    for (const script of jsonLdScripts) {
      try {
        const data = JSON.parse(script.textContent ?? '{}')
        if (data['@type'] === 'Product' || data?.mainEntity?.['@type'] === 'Product') {
          productData = data['@type'] === 'Product' ? data : data.mainEntity
          break
        }
      } catch {
        /* ignorar JSON malformado */
      }
    }

    if (!productData) {
      log(`Sin JSON-LD de producto en ${url}`, 'warn')
      return null
    }

    // Precio
    const offers = Array.isArray(productData.offers)
      ? productData.offers[0]
      : (productData.offers as Record<string, unknown>)

    const price = offers?.price ? Number(offers.price) : 0
    const comparePrice = null // el sitio no siempre expone el precio original en JSON-LD

    // Imágenes
    const rawImages = productData.image as string | string[] | null
    const allImages: string[] = Array.isArray(rawImages) ? rawImages : rawImages ? [rawImages] : []

    // Limpiar URLs de imágenes (usar resolución 640 en lugar de thumbs)
    const cleanImages = allImages
      .map(img => img.replace(/\/\d+-0\.webp$/, '/640-0.webp'))
      .filter(img => img.startsWith('http'))

    const imageUrl = cleanImages[0] ?? ''
    const extraImages = cleanImages.slice(1)

    // Nombre y marca
    const name = String(productData.name ?? '').trim()
    const brand =
      typeof productData.brand === 'object'
        ? String((productData.brand as Record<string, unknown>)?.name ?? '')
        : String(productData.brand ?? '')

    // Descripción — limpiar HTML si viene con tags
    const rawDescription = String(productData.description ?? '').trim()
    const description = rawDescription
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // SKU
    const sku = String(productData.sku ?? productData.mpn ?? '').trim()

    // Stock
    const availability = String((offers as Record<string, unknown>)?.availability ?? '')
    const stock = availability.includes('OutOfStock') ? 0 : 10

    // Peso
    const weightSpec = (productData.weight as string | null) ?? null
    const weight = weightSpec ? parseFloat(weightSpec) : null

    // Slug para detección de categoría
    const slug = url.replace(`${BASE_URL}/productos/`, '').replace(/\//g, '')
    const categorySlug = detectCategorySlug(slug, brand)
    const tags = generateTags(name, brand, categorySlug)

    return {
      sku,
      name,
      description: description.slice(0, 500), // máximo 500 chars
      price,
      compare_price: comparePrice,
      cost_price: null,
      brand: brand.toUpperCase(),
      category_slug: categorySlug,
      stock_quantity: stock,
      weight,
      featured: false,
      active: true,
      tags,
      image_url: imageUrl,
      extra_images: extraImages,
      source_url: url,
    }
  } catch (err) {
    log(`Error scrapeando ${url}: ${err instanceof Error ? err.message : err}`, 'error')
    return null
  }
}

// ─── CSV Output ───────────────────────────────────────────────────────────────

function escapeCsv(value: string | number | boolean | null): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function productToRow(p: ScrapedProduct): string {
  const row = [
    p.sku, // A: sku
    p.name, // B: nombre
    p.description, // C: descripcion
    p.price, // D: precio
    p.compare_price ?? '', // E: precio comparacion
    p.cost_price ?? '', // F: precio costo
    p.brand, // G: marca
    p.category_slug, // H: categoria_slug
    p.stock_quantity, // I: stock
    p.weight ?? '', // J: peso
    p.featured ? 'TRUE' : 'FALSE', // K: destacado
    p.active ? 'TRUE' : 'FALSE', // L: activo
    p.tags.join(','), // M: tags
    p.image_url, // N: imagen_url
    p.extra_images.join(','), // O: imagenes_extra
  ]
  return row.map(escapeCsv).join(',')
}

const CSV_HEADER =
  'sku,nombre,descripcion,precio,precio_comparacion,precio_costo,marca,categoria_slug,stock,peso,destacado,activo,tags,imagen_url,imagenes_extra'

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' SCRAPER — comerciotecnologico.co → SUMITRONIC')
  console.log(`  Modo: ${SOLO_SMART_HOME ? 'Solo Smart Home' : 'Todos los productos'}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  // 1. Obtener URLs del sitemap
  const allUrls = await fetchSitemapUrls()

  // 2. Filtrar si se pidió solo smart home
  const urls = SOLO_SMART_HOME
    ? allUrls.filter(url => {
        const slug = url.replace(`${BASE_URL}/productos/`, '').replace(/\//g, '')
        return isSmartHomeProduct(slug)
      })
    : allUrls

  log(`Procesando ${urls.length} URLs ${SOLO_SMART_HOME ? '(filtrado smart home)' : ''}`)

  if (SOLO_SMART_HOME) {
    const excluded = allUrls.length - urls.length
    log(`${excluded} productos excluidos por no ser smart home`, 'info')
  }

  // 3. Scrape en serie con delay
  const products: ScrapedProduct[] = []
  let ok = 0
  let failed = 0

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const slug = url.replace(`${BASE_URL}/productos/`, '').replace(/\/+$/, '')
    process.stdout.write(`  [${i + 1}/${urls.length}] ${slug.slice(0, 60)}...`)

    const product = await scrapeProductPage(url)
    if (product) {
      products.push(product)
      process.stdout.write(` ✓\n`)
      ok++
    } else {
      process.stdout.write(` ✗\n`)
      failed++
    }

    if (i < urls.length - 1) await sleep(DELAY_MS)
  }

  // 4. Escribir CSV
  const rows = [CSV_HEADER, ...products.map(productToRow)]
  fs.writeFileSync(OUTPUT_FILE, rows.join('\n'), 'utf-8')

  // 5. Resumen
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  log(`Extraídos: ${ok} productos`, 'ok')
  if (failed > 0) log(`Fallidos:  ${failed} URLs`, 'warn')

  // Resumen por categoría
  const byCategory: Record<string, number> = {}
  for (const p of products) {
    byCategory[p.category_slug] = (byCategory[p.category_slug] ?? 0) + 1
  }
  console.log('\n  Por categoría:')
  for (const [cat, count] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${cat.padEnd(28)} ${count} productos`)
  }

  console.log(`\n  Archivo generado: ${OUTPUT_FILE}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('  Próximo paso:')
  console.log('  1. Abre el archivo CSV en Excel o Google Sheets')
  console.log('  2. Revisa y ajusta precios, stock y descripciones')
  console.log('  3. Pega las filas en la pestaña "catalogo" del Google Sheet')
  console.log('  4. Presiona "Sincronizar" en el panel admin de SUMITRONIC\n')
}

main().catch(err => {
  console.error('\n✗ Error fatal:', err)
  process.exit(1)
})
