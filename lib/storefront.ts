import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createStaticSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export async function getActiveCategories() {
  const supabase = createStaticSupabaseClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, image_url, updated_at')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  return data || []
}

export async function getProductsByCategorySlug(slug: string) {
  const supabase = createStaticSupabaseClient()
  if (!supabase) return null

  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .eq('slug', slug)
    .maybeSingle()

  if (!category) return null

  const { data: products } = await supabase
    .from('products')
    .select(
      `
      *,
      category:categories!category_id (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary
      )
    `
    )
    .eq('category_id', category.id)
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(12)

  return { category, products: products || [] }
}

export async function getActiveBrands() {
  const supabase = createStaticSupabaseClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('products')
    .select('brand, updated_at')
    .eq('active', true)
    .not('brand', 'is', null)

  const normalized = (data || []).map(item => item.brand?.trim()).filter(Boolean) as string[]

  return Array.from(new Set(normalized))
    .sort((a, b) => a.localeCompare(b, 'es'))
    .map(brand => ({
      name: brand,
      slug: brand
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    }))
}

export async function getProductsByBrandSlug(slug: string) {
  const supabase = createStaticSupabaseClient()
  if (!supabase) return null

  // Determinar el nombre de marca: primero desde perfiles estáticos,
  // luego buscando en la DB para cubrir marcas no perfiladas.
  const { BRAND_PROFILES } = await import('@/lib/brands')
  const staticProfile = BRAND_PROFILES.find(b => b.slug === slug)

  let brandName: string

  if (staticProfile) {
    brandName = staticProfile.name
  } else {
    // Buscar en la DB marcas cuyos slugs coincidan
    const { data: rawBrands } = await supabase
      .from('products')
      .select('brand')
      .eq('active', true)
      .not('brand', 'is', null)

    const match = (rawBrands || [])
      .map((r: { brand: string }) => r.brand?.trim())
      .filter(Boolean)
      .find(
        (name: string) =>
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') === slug
      )

    if (!match) return null
    brandName = match
  }

  const { data: products } = await supabase
    .from('products')
    .select(
      `
      *,
      category:categories!category_id (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary
      )
    `
    )
    .ilike('brand', brandName)
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(24)

  return {
    brand: { name: brandName, slug },
    products: products || [],
  }
}
