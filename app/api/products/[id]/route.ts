import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Si compras una cámara, necesitas router y respaldo de energía, etc.
const COMPLEMENTARY: Record<string, string[]> = {
  'camaras-wifi': [
    'routers-redes',
    'energia-respaldo',
    'timbres-inteligentes',
    'cerraduras-inteligentes',
  ],
  'camaras-solares': ['routers-redes', 'energia-respaldo', 'camaras-wifi'],
  'timbres-inteligentes': ['cerraduras-inteligentes', 'camaras-wifi', 'routers-redes'],
  'cerraduras-inteligentes': ['timbres-inteligentes', 'camaras-wifi', 'routers-redes'],
  'routers-redes': ['camaras-wifi', 'camaras-solares', 'timbres-inteligentes'],
  'energia-respaldo': ['camaras-wifi', 'camaras-solares'],
}

const RELATED_SELECT = `
  *,
  category:categories!category_id (id, name, slug),
  product_images (id, image_url, alt_text, is_primary, sort_order)
`

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    const { data: product, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories!category_id (id, name, slug),
        product_images (id, image_url, alt_text, is_primary, sort_order)
      `
      )
      .eq('id', id)
      .eq('active', true)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    const productCategorySlug = (product.category as { slug?: string } | null)?.slug ?? null
    const complementarySlugs = productCategorySlug ? (COMPLEMENTARY[productCategorySlug] ?? []) : []

    // Queries 2 y 3 son independientes entre sí — corren en paralelo
    const [{ data: sameCategoryProducts }, { data: complementaryCategories }] = await Promise.all([
      product.category_id
        ? supabase
            .from('products')
            .select(RELATED_SELECT)
            .eq('category_id', product.category_id)
            .eq('active', true)
            .neq('id', id)
            .limit(2)
        : Promise.resolve({ data: [] as NonNullable<typeof sameCategoryProducts>, error: null }),
      complementarySlugs.length > 0
        ? supabase.from('categories').select('id').in('slug', complementarySlugs).eq('active', true)
        : Promise.resolve({ data: [] as { id: string }[], error: null }),
    ])

    let complementaryProducts: typeof sameCategoryProducts = []
    const complementaryCategoryIds = (complementaryCategories ?? []).map(c => c.id)

    if (complementaryCategoryIds.length > 0) {
      const { data: allComplementary } = await supabase
        .from('products')
        .select(RELATED_SELECT)
        .in('category_id', complementaryCategoryIds)
        .eq('active', true)
        .limit(10)

      const excludeIds = new Set([id, ...(sameCategoryProducts ?? []).map(p => p.id)])
      complementaryProducts = (allComplementary ?? [])
        .filter(p => !excludeIds.has(p.id))
        .slice(0, 4)
    }

    const relatedProducts = [...(sameCategoryProducts ?? []), ...complementaryProducts].slice(0, 6)

    return NextResponse.json({
      product,
      relatedProducts,
    })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    // Verificar autenticación y rol de admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si es admin
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      stock_quantity,
      category_id,
      sku,
      weight,
      dimensions,
      active,
    } = body

    const { data: product, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        stock_quantity,
        category_id,
        sku,
        weight,
        dimensions,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    // Verificar autenticación y rol de admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si es admin
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Soft delete - marcar como inactivo
    const { error } = await supabase
      .from('products')
      .update({
        active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Producto eliminado exitosamente' })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
