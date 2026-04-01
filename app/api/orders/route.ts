import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
      return NextResponse.json(
        { error: 'Error al obtener pedidos' },
        { status: 503 }
      )
    }

    return NextResponse.json({ data: orders || [] })
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
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

    const { success } = await ratelimit.limit(`orders_post:${user.id}`)
    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      items,
      shipping_address,
      payment_method,
      subtotal,
      shipping,
      total,
      customer_info,
      notes,
    } = body

    // Validar campos obligatorios
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un producto en el pedido' },
        { status: 400 }
      )
    }

    if (typeof subtotal !== 'number' || typeof total !== 'number') {
      return NextResponse.json(
        { error: 'Los campos subtotal y total son obligatorios y deben ser números' },
        { status: 400 }
      )
    }

    const tax = body.tax ?? 0
    const shippingCost = typeof shipping === 'number' ? shipping : 0

    // customer_info: si no se provee usar datos del usuario autenticado
    const resolvedCustomerInfo = customer_info || {
      user_id: user.id,
      email: user.email,
    }

    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        customer_info: resolvedCustomerInfo,
        items,
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
      return NextResponse.json(
        { error: 'Error al crear el pedido' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: order }, { status: 201 })
  } catch (error) {
    console.error('Orders POST error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
