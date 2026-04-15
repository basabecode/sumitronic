import { NextRequest, NextResponse } from 'next/server'
import { brand } from '@/lib/brand'
import { buildOrderConfirmationEmail, buildAdminOrderAlertEmail } from '@/lib/email-templates'

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
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || brand.supportEmail
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@sumitronic.com'
    const orderId = `#${String(order.id).slice(0, 8).toUpperCase()}`

    if (!resendApiKey) {
      console.log('[notify-order] Nueva orden (sin email configurado):', order.id)
      return NextResponse.json({ ok: true, skipped: true })
    }

    // 1. Alerta al administrador
    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${brand.name} <${fromEmail}>`,
        to: [adminEmail],
        subject: `Nueva orden ${orderId} — ${order.customer_info?.fullName || 'Invitado'} — $${Number(order.total).toLocaleString('es-CO')} COP`,
        html: buildAdminOrderAlertEmail(order),
      }),
    })

    if (!adminResponse.ok) {
      console.error('[notify-order] Error Resend (admin):', await adminResponse.text())
    }

    // 2. Confirmación al cliente
    const customerEmail = order.customer_info?.email
    if (customerEmail) {
      const customerResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${brand.name} <${fromEmail}>`,
          to: [customerEmail],
          subject: `Pedido recibido ${orderId} — ${brand.name}`,
          html: buildOrderConfirmationEmail(order),
        }),
      })

      if (!customerResponse.ok) {
        console.error('[notify-order] Error Resend (cliente):', await customerResponse.text())
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[notify-order] Error inesperado:', error)
    return NextResponse.json({ ok: true, error: String(error) })
  }
}
