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

  const normalized = (data || [])
    .map(item => item.brand?.trim())
    .filter(Boolean) as string[]

  return Array.from(new Set(normalized))
    .sort((a, b) => a.localeCompare(b, 'es'))
    .map(brand => ({
      name: brand,
      slug: brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }))
}

export async function getProductsByBrandSlug(slug: string) {
  const brands = await getActiveBrands()
  const brand = brands.find(item => item.slug === slug)
  if (!brand) return null

  const supabase = createStaticSupabaseClient()
  if (!supabase) return null

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
    .ilike('brand', brand.name)
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(12)

  return {
    brand,
    products: products || [],
  }
}
