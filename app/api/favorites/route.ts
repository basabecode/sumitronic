import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ratelimit } from '@/lib/ratelimit'

// Helper para obtener identificador del cliente
function getClientIdentifier(request: NextRequest, userId?: string): string {
  return userId || request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Rate limiting
    const identifier = getClientIdentifier(request, user.id)
    const { success } = await ratelimit.limit(identifier)

    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      )
    }

    // 1. Obtener favoritos del usuario (solo IDs primero para evitar error de relación)
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('id, product_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error)
      // Si la tabla no existe, devolver array vacío
      if (error.code === '42P01') {
        // undefined_table
        return NextResponse.json([])
      }
      return NextResponse.json({ error: 'Error al obtener favoritos' }, { status: 500 })
    }

    if (!favorites || favorites.length === 0) {
      return NextResponse.json([])
    }

    // 2. Obtener los detalles de los productos manualmente
    const productIds = favorites.map(f => f.product_id)

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        price,
        image_url,
        brand,
        category_id,
        stock_quantity
      `
      )
      .in('id', productIds)

    if (productsError) {
      console.error('Error fetching favorite products:', productsError)
      return NextResponse.json({ error: 'Error al obtener productos favoritos' }, { status: 500 })
    }

    // 3. Combinar los datos
    const productsMap = new Map(products?.map(p => [p.id, p]) || [])

    const transformedFavorites = favorites
      .map((fav: any) => {
        const product = productsMap.get(fav.product_id)
        if (!product) return null // El producto podría haber sido eliminado

        return {
          id: product.id, // Usamos ID del producto para consistencia frontend
          favorite_id: fav.id, // Guardamos ID de favorito por si acaso
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          brand: product.brand,
          category: product.category_id,
          stock: product.stock_quantity || 0,
          discount_percentage: 0,
          added_at: fav.created_at,
        }
      })
      .filter(Boolean) // Eliminar nulos

    return NextResponse.json(transformedFavorites)
  } catch (error) {
    console.error('Favorites API error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Rate limiting
    const identifier = getClientIdentifier(request, user.id)
    const { success } = await ratelimit.limit(identifier)

    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { product_id } = body

    if (!product_id || typeof product_id !== 'string') {
      return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 })
    }

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!UUID_REGEX.test(product_id)) {
      return NextResponse.json({ error: 'Formato de ID inválido' }, { status: 400 })
    }

    // Verificar que el producto existe
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('id', product_id)
      .maybeSingle()

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Agregar a favoritos (evitar duplicados)
    const { data: favorite, error } = await supabase
      .from('favorites')
      .upsert(
        {
          user_id: user.id,
          product_id: product_id,
        },
        {
          onConflict: 'user_id,product_id',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Error adding favorite:', error)
      return NextResponse.json({ error: 'Error al agregar favorito' }, { status: 500 })
    }

    return NextResponse.json({ favorite }, { status: 201 })
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Rate limiting
    const identifier = getClientIdentifier(request, user.id)
    const { success } = await ratelimit.limit(identifier)

    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { product_id, clear_all } = body

    if (!product_id && !clear_all) {
      return NextResponse.json(
        { error: 'Se requiere product_id o clear_all: true' },
        { status: 400 }
      )
    }

    if (clear_all === true) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', user.id)

      if (error) {
        console.error('Error clearing favorites:', error)
        return NextResponse.json({ error: 'Error al limpiar favoritos' }, { status: 500 })
      }

      return NextResponse.json({ message: 'Favoritos eliminados' })
    }

    // Eliminar favorito específico
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', product_id)

    if (error) {
      console.error('Error removing favorite:', error)
      return NextResponse.json({ error: 'Error al eliminar favorito' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Favorito eliminado' })
  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
