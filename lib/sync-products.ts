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
    new Set(
      validRows
        .map(row => (row[7] ?? '').trim())
        .filter(Boolean)
    )
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
      sku: (sku ?? '').trim(),
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

  const { error: upsertError } = await supabase
    .from('products')
    .upsert(products, {
      onConflict: 'sku',
    })

  if (upsertError) {
    throw upsertError
  }

  const errors: string[] = []
  let synced = 0

  for (const product of products) {
    try {
      const { data: storedProduct, error: productLookupError } = await supabase
        .from('products')
        .select('id')
        .eq('sku', product.sku)
        .maybeSingle()

      if (productLookupError) {
        throw productLookupError
      }

      if (!storedProduct?.id) {
        throw new Error(`Product not found after upsert for sku: ${product.sku}`)
      }

      const { error: deleteImagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', storedProduct.id)

      if (deleteImagesError) {
        throw deleteImagesError
      }

      const productImages = []

      if (product.image_url) {
        productImages.push({
          product_id: storedProduct.id,
          image_url: product.image_url,
          alt_text: product.name,
          is_primary: true,
          sort_order: 0,
        })
      }

      product.images.forEach((imageUrl, index) => {
        productImages.push({
          product_id: storedProduct.id,
          image_url: imageUrl,
          alt_text: product.name,
          is_primary: false,
          sort_order: index + 1,
        })
      })

      if (productImages.length > 0) {
        const { error: insertImagesError } = await supabase
          .from('product_images')
          .insert(productImages)

        if (insertImagesError) {
          throw insertImagesError
        }
      }

      synced += 1
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown sync error'
      errors.push(`${product.sku}: ${message}`)
    }
  }

  return {
    synced,
    errors,
  }
}
