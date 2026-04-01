import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: order, error } = await supabase
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
        payment_proof_url,
        tracking_number,
        notes,
        shipping_address,
        billing_address,
        created_at,
        updated_at
      `
      )
      .eq('id', params.id)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la orden pertenece al usuario, o que es admin
    if (order.user_id !== user.id) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
      }
    }

    return NextResponse.json({ data: order })
  } catch (error) {
    console.error('Order GET [id] error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admins pueden actualizar el estado de una orden
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Verificar que la orden existe
    const { data: existing, error: fetchError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { status, payment_status, tracking_number, notes } = body

    // Construir objeto de actualización solo con los campos provistos
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    const validStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ]
    const validPaymentStatuses = [
      'pending',
      'paid',
      'failed',
      'refunded',
      'partially_refunded',
    ]

    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            error: `Estado inválido. Valores permitidos: ${validStatuses.join(', ')}`,
          },
          { status: 400 }
        )
      }
      updates.status = status
    }

    if (payment_status !== undefined) {
      if (!validPaymentStatuses.includes(payment_status)) {
        return NextResponse.json(
          {
            error: `Estado de pago inválido. Valores permitidos: ${validPaymentStatuses.join(', ')}`,
          },
          { status: 400 }
        )
      }
      updates.payment_status = payment_status
    }

    if (tracking_number !== undefined) {
      if (typeof tracking_number !== 'string' || tracking_number.length > 100) {
        return NextResponse.json(
          { error: 'Número de seguimiento inválido (máximo 100 caracteres)' },
          { status: 400 }
        )
      }
      updates.tracking_number = tracking_number.trim()
    }

    if (notes !== undefined) {
      if (typeof notes !== 'string' || notes.length > 1000) {
        return NextResponse.json(
          { error: 'Las notas no pueden exceder 1000 caracteres' },
          { status: 400 }
        )
      }
      updates.notes = notes.trim()
    }

    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar el pedido' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: order })
  } catch (error) {
    console.error('Order PATCH [id] error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
