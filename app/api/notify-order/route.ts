import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { brand } from '@/lib/brand'
import OrderConfirmationEmail from '@/emails/order-confirmation'
import AdminOrderAlertEmail from '@/emails/admin-order-alert'

/**
 * POST /api/notify-order
 * Envía 2 correos al crear una orden:
 *   1. Alerta al administrador (admin@sumitronic.com)
 *   2. Confirmación al cliente (su email)
 *
 * Endpoint interno — requiere header x-internal-secret.
 */
export async function POST(request: NextRequest) {
  try {
    const notifySecret = process.env.NOTIFY_ORDER_SECRET
    if (!notifySecret) {
      return NextResponse.json({ error: 'Endpoint no disponible' }, { status: 503 })
    }

    const providedSecret = request.headers.get('x-internal-secret')
    if (!providedSecret || providedSecret !== notifySecret) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { order } = body

    if (!order) {
      return NextResponse.json({ error: 'Datos de orden requeridos' }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.log('[notify-order] Nueva orden (sin email configurado):', order.id)
      return NextResponse.json({ ok: true, skipped: true })
    }

    const resend = new Resend(resendApiKey)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || brand.supportEmail
    const fromEmail = process.env.RESEND_FROM_EMAIL || `noreply@sumitronic.com`
    const orderId = String(order.id)

    const sharedOrderProps = {
      orderId,
      paymentMethod: order.payment_method,
      notes: order.notes,
      shippingAddress: order.shipping_address,
      items: order.items ?? [],
      total: Number(order.total),
    }

    const sends = [
      resend.emails.send({
        from: `${brand.name} <${fromEmail}>`,
        to: [adminEmail],
        subject: `Nueva orden #${orderId.slice(0, 8).toUpperCase()} — ${order.customer_info?.fullName || 'Invitado'} — $${Number(order.total).toLocaleString('es-CO')} COP`,
        react: AdminOrderAlertEmail({
          ...sharedOrderProps,
          customerName: order.customer_info?.fullName,
          customerEmail: order.customer_info?.email,
          customerPhone: order.customer_info?.phone,
        }),
      }),
    ]

    const customerEmail = order.customer_info?.email
    if (customerEmail) {
      sends.push(
        resend.emails.send({
          from: `${brand.name} <${fromEmail}>`,
          to: [customerEmail],
          subject: `Pedido recibido #${orderId.slice(0, 8).toUpperCase()} — ${brand.name}`,
          react: OrderConfirmationEmail({
            ...sharedOrderProps,
            customerName: order.customer_info?.fullName || 'Cliente',
            customerPhone: order.customer_info?.phone,
            orderDate: order.created_at,
          }),
        })
      )
    }

    const results = await Promise.allSettled(sends)
    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('[notify-order] Error Resend:', result.reason)
      } else if (result.value.error) {
        console.error('[notify-order] Error Resend API:', result.value.error)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[notify-order] Error inesperado:', error)
    return NextResponse.json({ ok: true, error: String(error) })
  }
}
