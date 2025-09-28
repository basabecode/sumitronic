import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ProductFilters, ProductsApiResponse } from '@/lib/types/products'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const categories = searchParams.getAll('category')
  const brands = searchParams.getAll('brand')
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
    if (categories.length > 0) {
      // Optimización: Filtrar directamente por slug de categoría usando JOIN
      query = query.in('category.slug', categories)
    }

    if (brands.length > 0) {
      query = query.in('brand', brands)
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
      // Usar datos JSON como fallback
      const jsonProducts = await import('@/lib/products.json')
      const allProducts = jsonProducts.default

      // Aplicar filtros a los datos JSON
      let filteredProducts = allProducts

      if (categories.length > 0) {
        filteredProducts = filteredProducts.filter((p: any) =>
          categories.includes(p.category)
        )
      }

      if (brands.length > 0) {
        filteredProducts = filteredProducts.filter((p: any) =>
          brands.includes(p.brand)
        )
      }

      if (search) {
        const searchLower = search.toLowerCase()
        filteredProducts = filteredProducts.filter(
          (p: any) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.brand.toLowerCase().includes(searchLower)
        )
      }

      if (minPrice) {
        filteredProducts = filteredProducts.filter(
          (p: any) => p.price >= parseFloat(minPrice)
        )
      }

      if (maxPrice) {
        filteredProducts = filteredProducts.filter(
          (p: any) => p.price <= parseFloat(maxPrice)
        )
      }

      if (inStockOnly) {
        filteredProducts = filteredProducts.filter((p: any) => p.stockCount > 0)
      }

      // Aplicar paginación
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

      const totalPages = Math.ceil(filteredProducts.length / limit)

      const response: ProductsApiResponse = {
        products: paginatedProducts.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          description: p.description || '',
          price: p.price,
          original_price: p.originalPrice || p.price,
          sku: p.sku || `SKU-${p.id}`,
          brand: p.brand,
          category_id: p.category,
          image_url: p.image,
          images: [p.image],
          stock_quantity: p.stockCount || 0,
          active: true,
          featured: p.badge === 'Destacado',
          rating: p.rating || 0,
          review_count: p.reviews || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: {
            id: p.category,
            name: p.category,
            slug: p.category,
            description: `Categoría de ${p.category}`,
            active: true,
            sort_order: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          product_images: [
            {
              id: p.id.toString(),
              product_id: p.id.toString(),
              image_url: p.image,
              alt_text: p.name,
              is_primary: true,
              sort_order: 1,
              created_at: new Date().toISOString(),
            },
          ],
          inventory: {
            id: `inv-${p.id}`,
            quantity_available: p.stockCount || 0,
            reserved_quantity: 0,
            last_updated: new Date().toISOString(),
          },
        })),
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }

      return NextResponse.json(response)
    }

    // Si Supabase no tiene productos, usar datos JSON como fallback
    if (!products || products.length === 0) {
      const jsonProducts = await import('@/lib/products.json')
      const allProducts = jsonProducts.default

      // Aplicar filtros a los datos JSON
      let filteredProducts = allProducts

      if (categories.length > 0) {
        filteredProducts = filteredProducts.filter((p: any) =>
          categories.includes(p.category)
        )
      }

      if (brands.length > 0) {
        filteredProducts = filteredProducts.filter((p: any) =>
          brands.includes(p.brand)
        )
      }

      if (search) {
        const searchLower = search.toLowerCase()
        filteredProducts = filteredProducts.filter(
          (p: any) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.brand.toLowerCase().includes(searchLower)
        )
      }

      if (minPrice) {
        filteredProducts = filteredProducts.filter(
          (p: any) => p.price >= parseFloat(minPrice)
        )
      }

      if (maxPrice) {
        filteredProducts = filteredProducts.filter(
          (p: any) => p.price <= parseFloat(maxPrice)
        )
      }

      if (inStockOnly) {
        filteredProducts = filteredProducts.filter((p: any) => p.stockCount > 0)
      }

      // Aplicar paginación
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

      const totalPages = Math.ceil(filteredProducts.length / limit)

      const response: ProductsApiResponse = {
        products: paginatedProducts.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          description: p.description || '',
          price: p.price,
          original_price: p.originalPrice || p.price,
          sku: p.sku || `SKU-${p.id}`,
          brand: p.brand,
          category_id: p.category,
          image_url: p.image,
          images: [p.image],
          stock_quantity: p.stockCount || 0,
          active: true,
          featured: p.badge === 'Destacado',
          rating: p.rating || 0,
          review_count: p.reviews || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: {
            id: p.category,
            name: p.category,
            slug: p.category,
            description: `Categoría de ${p.category}`,
            active: true,
            sort_order: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          product_images: [
            {
              id: `img-${p.id}`,
              product_id: p.id.toString(),
              image_url: p.image,
              alt_text: p.name,
              is_primary: true,
              sort_order: 1,
              created_at: new Date().toISOString(),
            },
          ],
          inventory: {
            id: `inv-${p.id}`,
            quantity_available: p.stockCount || 0,
            reserved_quantity: 0,
            last_updated: new Date().toISOString(),
          },
        })),
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }

      return NextResponse.json(response)
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
