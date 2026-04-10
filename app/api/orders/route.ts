import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ratelimit } from '@/lib/ratelimit'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { success } = await ratelimit.limit(user.id)
    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      )
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        user_id,
        customer_info,
        items,
        subtotal,
        tax,
        shipping,
        total,
        status,
        payment_status,
        payment_method,
        tracking_number,
        notes,
        shipping_address,
        created_at,
        updated_at
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 503 })
    }

    return NextResponse.json({ data: orders || [] })
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Auth es opcional: se permiten órdenes de invitados (guest checkout)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Rate limit por usuario autenticado o por IP para invitados
    const rateLimitKey = user?.id
      ? `orders_post:${user.id}`
      : `orders_post:guest:${request.headers.get('x-forwarded-for') || 'anonymous'}`

    const { success } = await ratelimit.limit(rateLimitKey)
    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      items: clientItems,
      shipping_address,
      payment_method,
      shipping,
      customer_info,
      notes,
    } = body

    // Validar que vengan items con product_id
    if (!clientItems || !Array.isArray(clientItems) || clientItems.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un producto en el pedido' },
        { status: 400 }
      )
    }

    const productIds: string[] = []
    for (const item of clientItems) {
      if (!item.product_id) {
        return NextResponse.json(
          { error: 'Cada producto debe incluir un product_id válido' },
          { status: 400 }
        )
      }
      productIds.push(String(item.product_id))
    }

    // Usar el cliente admin (service role) — bypassa RLS de forma segura desde el servidor
    const adminClient = createAdminClient()

    // Validación server-side de precios: nunca confiar en el precio que envía el cliente
    const { data: dbProducts, error: productsError } = await adminClient
      .from('products')
      .select('id, name, price, stock_quantity')
      .in('id', productIds)

    if (productsError) {
      console.error('Error verificando productos para orden:', productsError)
      return NextResponse.json({ error: 'Error al verificar los productos' }, { status: 500 })
    }

    const productMap = new Map((dbProducts || []).map(p => [String(p.id), p]))

    // Reconstruir items con precios reales de la DB (descartar precio del cliente)
    const validatedItems: Array<{
      product_id: string
      name: string
      price: number
      quantity: number
      variant_id?: string
      image?: string
    }> = []

    for (const clientItem of clientItems) {
      const dbProduct = productMap.get(String(clientItem.product_id))
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Producto no encontrado: ${clientItem.product_id}` },
          { status: 400 }
        )
      }
      const quantity = Math.max(1, Math.floor(Number(clientItem.quantity) || 1))
      const entry: (typeof validatedItems)[number] = {
        product_id: String(dbProduct.id),
        name: String(dbProduct.name),
        price: Number(dbProduct.price),
        quantity,
      }
      if (clientItem.variant_id) entry.variant_id = String(clientItem.variant_id)
      if (clientItem.image) entry.image = String(clientItem.image)
      validatedItems.push(entry)
    }

    // Calcular totales 100% en el servidor
    const subtotal = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = typeof shipping === 'number' && shipping >= 0 ? shipping : 0
    const tax = 0
    const total = subtotal + shippingCost + tax

    // customer_info: si no se provee usar datos del usuario autenticado
    const resolvedCustomerInfo = customer_info || {
      user_id: user?.id || null,
      email: user?.email || null,
    }

    const { data: order, error: insertError } = await adminClient
      .from('orders')
      .insert({
        user_id: user?.id || null,
        customer_info: resolvedCustomerInfo,
        items: validatedItems,
        subtotal,
        tax,
        shipping: shippingCost,
        total,
        status: 'pending',
        payment_status: 'pending',
        payment_method: payment_method || null,
        shipping_address: shipping_address || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating order:', insertError)
      return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 })
    }

    // Notificar al admin desde el servidor (fire-and-forget, no bloquea la respuesta)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'
    const notifySecret = process.env.NOTIFY_ORDER_SECRET
    if (notifySecret) {
      fetch(`${siteUrl}/api/notify-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': notifySecret,
        },
        body: JSON.stringify({ order }),
      }).catch(err => console.error('[orders] Error enviando notificación:', err))
    }

    return NextResponse.json({ data: order }, { status: 201 })
  } catch (error) {
    console.error('Orders POST error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
