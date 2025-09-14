import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ProductFilters, ProductsApiResponse } from '@/lib/types/products'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sortBy = searchParams.get('sortBy') || 'created_at'
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  const featured = searchParams.get('featured')
  const inStockOnly = searchParams.get('inStockOnly') === 'true'

  try {
    const supabase = createClient()

    let query = supabase
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
          is_primary,
          sort_order
        ),
        inventory (
          id,
          quantity_available,
          reserved_quantity,
          last_updated
        )
      `,
        { count: 'exact' }
      )
      .eq('active', true)

    // Filtros
    if (category && category !== 'all') {
      query = query.eq('categories.slug', category)
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`
      )
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    if (inStockOnly) {
      query = query.gt('stock_quantity', 0)
    }

    // Ordenamiento
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Error al obtener productos' },
        { status: 500 }
      )
    }

    const totalPages = Math.ceil((count || 0) / limit)

    const response: ProductsApiResponse = {
      products: products || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verificar autenticación y rol de admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si es admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

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
      brand,
      image_url,
      images,
      sku,
      weight,
      dimensions,
      featured = false,
    } = body

    // Crear producto
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price,
        stock_quantity,
        category_id,
        brand,
        image_url,
        images: images || [],
        sku,
        weight,
        dimensions,
        featured,
        active: true,
      })
      .select()
      .single()

    if (productError) {
      console.error('Error creating product:', productError)
      return NextResponse.json(
        { error: 'Error al crear producto' },
        { status: 500 }
      )
    }

    // Crear imagen principal
    if (image_url) {
      await supabase.from('product_images').insert({
        product_id: product.id,
        image_url,
        alt_text: name,
        is_primary: true,
        sort_order: 0,
      })
    }

    // Crear imágenes adicionales si se proporcionan
    if (images && images.length > 0) {
      const imageInserts = images.map((img: string, index: number) => ({
        product_id: product.id,
        image_url: img,
        alt_text: `${name} - Imagen ${index + 1}`,
        is_primary: false,
        sort_order: index + 1,
      }))

      await supabase.from('product_images').insert(imageInserts)
    }

    // Crear inventario inicial
    await supabase.from('inventory').insert({
      product_id: product.id,
      quantity_available: stock_quantity || 0,
      reserved_quantity: 0,
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
