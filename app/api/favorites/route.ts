import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Obtener favoritos del usuario con JOIN optimizado
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(
        `
        id,
        product_id,
        created_at,
        product:products (
          id,
          name,
          price,
          image_url,
          brand,
          category_id,
          stock_quantity,
          featured,
          active
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error)
      // Si la tabla no existe, devolver array vacío
      if (
        error.code === 'PGRST200' ||
        error.message?.includes('relationship') ||
        error.message?.includes('favorites')
      ) {
        return NextResponse.json([])
      }
      return NextResponse.json(
        { error: 'Error al obtener favoritos' },
        { status: 500 }
      )
    }

    // Transformar los datos (productos ya incluidos en el JOIN)
    const transformedFavorites =
      favorites?.map((fav: any) => {
        const product = fav.product
        return {
          id: product?.id || fav.product_id,
          name: product?.name || 'Producto no encontrado',
          price: product?.price || 0,
          image_url: product?.image_url,
          brand: product?.brand,
          category: product?.category_id,
          stock: product?.stock_quantity || 0,
          discount_percentage: 0, // Se puede calcular si es necesario
          added_at: fav.created_at,
        }
      }) || []

    return NextResponse.json(transformedFavorites)
  } catch (error) {
    console.error('Favorites API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
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

    const body = await request.json()
    const { product_id } = body

    if (!product_id) {
      return NextResponse.json(
        { error: 'ID de producto requerido' },
        { status: 400 }
      )
    }

    // Verificar que el producto existe
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('id', product_id)
      .single()

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
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
      return NextResponse.json(
        { error: 'Error al agregar favorito' },
        { status: 500 }
      )
    }

    return NextResponse.json({ favorite }, { status: 201 })
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
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

    const body = await request.json()
    const { product_id } = body

    if (!product_id) {
      // Si no hay product_id, eliminar todos los favoritos del usuario
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('Error clearing favorites:', error)
        return NextResponse.json(
          { error: 'Error al limpiar favoritos' },
          { status: 500 }
        )
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
      return NextResponse.json(
        { error: 'Error al eliminar favorito' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Favorito eliminado' })
  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
