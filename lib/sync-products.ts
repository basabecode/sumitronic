import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'

type SyncResult = {
  synced: number
  errors: string[]
}

type SheetProduct = {
  sku: string
  name: string
  description: string
  price: number
  compare_price: number | null
  cost_price: number | null
  brand: string
  category_id: string | null
  stock_quantity: number
  weight: number | null
  featured: boolean
  active: boolean
  tags: string[]
  image_url: string
  images: string[]
  updated_at: string
}

type ExistingProductRef = {
  id: string
  sku: string | null
  name: string
}

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function parseFloatOrDefault(value: string | undefined, defaultValue: number) {
  const parsed = Number.parseFloat(value?.trim() ?? '')
  return Number.isFinite(parsed) ? parsed : defaultValue
}

function parseFloatOrNull(value: string | undefined) {
  const rawValue = value?.trim() ?? ''
  if (!rawValue) return null

  const parsed = Number.parseFloat(rawValue)
  return Number.isFinite(parsed) ? parsed : null
}

function parseIntOrDefault(value: string | undefined, defaultValue: number) {
  const parsed = Number.parseInt(value?.trim() ?? '', 10)
  return Number.isFinite(parsed) ? parsed : defaultValue
}

function parseBooleanTrue(value: string | undefined) {
  return value?.trim().toUpperCase() === 'TRUE'
}

function parseCommaSeparated(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

/**
 * Google Sheets may convert long numeric SKUs to scientific notation
 * (e.g. "8,46E+16" or "8.46E+16"). This function detects that pattern
 * and converts it back to the full integer string without precision loss.
 */
function parseSku(value: string | undefined): string {
  const raw = (value ?? '').trim()
  if (!raw) return ''

  // Normalize locale decimal separator (comma → dot)
  const normalized = raw.replace(',', '.')

  // Detect scientific notation: digits, optional dot+digits, then E+digits
  if (/^\d+(\.\d+)?[Ee][+\-]?\d+$/.test(normalized)) {
    try {
      // Use BigInt via parseFloat → toFixed to avoid floating-point drift
      const num = Number.parseFloat(normalized)
      if (Number.isFinite(num)) {
        return BigInt(Math.round(num)).toString()
      }
    } catch {
      // fall through and return raw value
    }
  }

  return raw
}

export async function syncProductsFromSheet(): Promise<SyncResult> {
  const supabaseUrl = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseServiceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY')
  const serviceAccountEmail = getRequiredEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL')
  const privateKey = getRequiredEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n')
  const sheetId = getRequiredEnv('GOOGLE_SHEET_ID')
  const sheetName = getRequiredEnv('GOOGLE_SHEET_NAME')

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
  const range = `${sheetName}!A2:O`

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  })

  const rows = response.data.values ?? []
  const validRows = rows.filter(row => (row[0] ?? '').trim() !== '')
  const categorySlugs = Array.from(
    new Set(validRows.map(row => (row[7] ?? '').trim()).filter(Boolean))
  )

  const categoryMap = new Map<string, string>()

  if (categorySlugs.length > 0) {
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, slug')
      .in('slug', categorySlugs)

    if (categoriesError) {
      throw categoriesError
    }

    for (const category of categories ?? []) {
      categoryMap.set(category.slug, category.id)
    }
  }

  const products: SheetProduct[] = validRows.map(row => {
    const [
      sku,
      name,
      description,
      price,
      compareAtPrice,
      costPrice,
      brand,
      categorySlug,
      stockQuantity,
      weight,
      featured,
      active,
      tags,
      imageUrl,
      extraImages,
    ] = row

    return {
      sku: parseSku(sku),
      name: (name ?? '').trim(),
      description: (description ?? '').trim() || '',
      price: parseFloatOrDefault(price, 0),
      compare_price: parseFloatOrNull(compareAtPrice),
      cost_price: parseFloatOrNull(costPrice),
      brand: (brand ?? '').trim() || '',
      category_id: categoryMap.get((categorySlug ?? '').trim()) ?? null,
      stock_quantity: parseIntOrDefault(stockQuantity, 0),
      weight: parseFloatOrNull(weight),
      featured: parseBooleanTrue(featured),
      active: parseBooleanTrue(active),
      tags: parseCommaSeparated(tags),
      image_url: (imageUrl ?? '').trim(),
      images: parseCommaSeparated(extraImages),
      updated_at: new Date().toISOString(),
    }
  })

  // ─── PASO 1: Upsert masivo de productos ───────────────────────────────────
  // Para evitar colisiones en la constraint `products_sku_key`, validamos
  // contra la base de datos y contra los otros productos del lote.

  // 1. Obtener todos los productos existentes de la base de datos
  const { data: existingProductsDb, error: fetchError } = await supabase
    .from('products')
    .select('id, name, sku')
  if (fetchError) throw fetchError

  // Construir diccionarios rápidos
  const dbSkuOwner = new Map<string, string>() // sku -> name
  for (const row of existingProductsDb ?? []) {
    if (row.sku) dbSkuOwner.set(row.sku, row.name)
  }

  // 2. Deduplicar primero por nombre (la clave real de negocio para nosotros)
  // (El último que aparezca en el sheet gana)
  const byName = new Map<string, SheetProduct>()
  for (const p of products) {
    byName.set(p.name, p)
  }

  // 3. Detectar SKUs duplicados dentro del lote filtrado
  const skuCount = new Map<string, number>()
  for (const p of byName.values()) {
    if (p.sku) skuCount.set(p.sku, (skuCount.get(p.sku) ?? 0) + 1)
  }

  // 4. Asignar los SKUs definitivos
  // Si el SKU está repetido en el sheet, o si ya le pertenece a otro producto
  // distinto en la BD, necesitamos generar uno nuevo.
  let genCounter = 1
  const uniqueProducts: SheetProduct[] = Array.from(byName.values()).map(p => {
    let finalSku = p.sku

    if (finalSku) {
      const isDuplicatedInBatch = (skuCount.get(finalSku) ?? 0) > 1
      const ownerInDb = dbSkuOwner.get(finalSku)
      const isOwnedByOtherInDb = ownerInDb && ownerInDb !== p.name

      if (isDuplicatedInBatch || isOwnedByOtherInDb) {
        // Generamos un nuevo SKU único (basado en timestamp para asegurar que no choque)
        finalSku = `GEN-${Date.now().toString().slice(-6)}-${genCounter++}`
      }
    }

    // Si ni siquiera tenía SKU, le ponemos uno por defecto para que funcione bien
    if (!finalSku) {
      finalSku = `GEN-${Date.now().toString().slice(-6)}-${genCounter++}`
    }

    return { ...p, sku: finalSku }
  })

  // Separamos images del payload (campo virtual) original para el DB insert
  type ProductRow = Omit<SheetProduct, 'images'>
  const toRow = (p: SheetProduct): ProductRow => {
    const { images: _images, ...row } = p
    return row
  }

  let upsertedProducts: ExistingProductRef[] = []

  if (uniqueProducts.length > 0) {
    // Hemos asegurado que los SKUs son 100% únicos (o pertenecen al mismo nombre que se va a actualizar)
    // Así que el onConflict: 'name' no fallará al actualizar el SKU
    const { data, error } = await supabase
      .from('products')
      .upsert(uniqueProducts.map(toRow), { onConflict: 'name', defaultToNull: false })
      .select('id, sku, name')

    if (error) throw error
    upsertedProducts = data ?? []
  }

  // Construir mapa id → producto del sheet para poder enlazar imágenes
  const idMap = new Map<string, SheetProduct>()
  for (const upserted of upsertedProducts) {
    const match =
      (upserted.sku ? products.find(p => p.sku === upserted.sku) : undefined) ??
      products.find(p => p.name === upserted.name)
    if (match) {
      idMap.set(upserted.id, match)
    }
  }

  const synced = upsertedProducts.length
  const errors: string[] = []

  // ─── PASO 2: Reconstruir imágenes en batch ────────────────────────────────
  // 1 DELETE de todos los IDs afectados + 1 INSERT de todas las imágenes.
  const allProductIds = Array.from(idMap.keys())

  if (allProductIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .in('product_id', allProductIds)

    if (deleteError) {
      // No lanzamos — registramos y seguimos para no perder el upsert ya hecho
      errors.push(`[images-delete] ${deleteError.message}`)
    } else {
      const allImages: {
        product_id: string
        image_url: string
        alt_text: string
        is_primary: boolean
        sort_order: number
      }[] = []

      for (const [productId, product] of idMap) {
        if (product.image_url) {
          allImages.push({
            product_id: productId,
            image_url: product.image_url,
            alt_text: product.name,
            is_primary: true,
            sort_order: 0,
          })
        }

        product.images.forEach((imageUrl, index) => {
          allImages.push({
            product_id: productId,
            image_url: imageUrl,
            alt_text: product.name,
            is_primary: false,
            sort_order: index + 1,
          })
        })
      }

      if (allImages.length > 0) {
        const { error: insertImagesError } = await supabase.from('product_images').insert(allImages)

        if (insertImagesError) {
          errors.push(`[images-insert] ${insertImagesError.message}`)
        }
      }
    }
  }

  return {
    synced,
    errors,
  }
}
