import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cartRatelimit } from '@/lib/ratelimit'

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
    const { success, limit, reset, remaining } = await cartRatelimit.limit(identifier)

    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          }
        }
      )
    }

    // 1. Obtener carrito del usuario
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (cartError && cartError.code !== 'PGRST116') { // PGRST116 es "no rows returned"
      console.error('Error fetching cart:', cartError)
      return NextResponse.json({ error: 'Error al obtener carrito' }, { status: 500 })
    }

    if (!cart) {
      return NextResponse.json({ items: [] })
    }

    // 2. Obtener items del carrito (sin JOIN para evitar error de relación)
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select('id, product_id, variant_id, quantity, price')
      .eq('cart_id', cart.id)

    if (itemsError) {
      console.error('Error fetching cart items:', itemsError)
      return NextResponse.json({ error: 'Error al obtener items' }, { status: 500 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ items: [] })
    }

    // 3. Obtener detalles de productos manualmente
    const productIds = items.map(item => item.product_id)

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        image_url,
        brand,
        category_id,
        stock_quantity
      `)
      .in('id', productIds)

    if (productsError) {
      console.error('Error fetching cart products:', productsError)
      return NextResponse.json({ error: 'Error al obtener productos del carrito' }, { status: 500 })
    }

    // 4. Combinar datos
    const productsMap = new Map(products?.map(p => [p.id, p]) || [])

    const formattedItems = items
      .map((item: any) => {
        const product = productsMap.get(item.product_id)
        if (!product) return null

        return {
          id: product.id,
          name: product.name,
          price: item.price > 0 ? item.price : product.price, // Usar precio guardado o actual
          image_url: product.image_url,
          quantity: item.quantity,
          stock: product.stock_quantity,
          brand: product.brand,
          category: product.category_id,
          description: '',
          inStock: (product.stock_quantity || 0) > 0
        }
      })
      .filter(Boolean)

    return NextResponse.json({ items: formattedItems })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Rate limiting
    const identifier = getClientIdentifier(request, user.id)
    const { success } = await cartRatelimit.limit(identifier)

    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { items } = body // Esperamos recibir el array completo de items para sincronizar

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })
    }

    // 1. Obtener o crear carrito
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select('id')
        .single()

      if (createError) throw createError
      cart = newCart
    }

    if (!cart) throw new Error('No se pudo crear el carrito')

    // 2. Sincronizar items
    // Estrategia simple: Eliminar todo y recrear (para asegurar consistencia con el estado local)
    // En producción idealmente se haría un upsert inteligente, pero esto es más seguro para evitar duplicados

    // Primero limpiamos items existentes
    await supabase.from('cart_items').delete().eq('cart_id', cart.id)

    if (items.length > 0) {
      const itemsToInsert = items.map((item: any) => ({
        cart_id: cart.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        // variant_id: item.variantId // Si se implementa variantes
      }))

      const { error: insertError } = await supabase
        .from('cart_items')
        .insert(itemsToInsert)

      if (insertError) throw insertError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sync cart error:', error)
    return NextResponse.json({ error: 'Error al sincronizar carrito' }, { status: 500 })
  }
}
