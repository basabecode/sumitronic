import { NextRequest, NextResponse } from 'next/server'
import { brand } from '@/lib/brand'

/**
 * POST /api/notify-order
 * Envía notificación al administrador cuando se crea una orden.
 *
 * Endpoint de uso INTERNO: solo puede ser llamado desde el servidor
 * (api/orders/route.ts) mediante el header x-internal-secret.
 *
 * Variables de entorno requeridas:
 *   NOTIFY_ORDER_SECRET      → Secreto compartido entre orders y este endpoint
 *   RESEND_API_KEY           → Clave de Resend (resend.com - plan gratuito disponible)
 *   ADMIN_NOTIFICATION_EMAIL → Email del admin (por defecto usa brand.supportEmail)
 *   RESEND_FROM_EMAIL        → Email remitente verificado en Resend
 */
export async function POST(request: NextRequest) {
  try {
    // Validar que la llamada proviene del servidor interno
    const notifySecret = process.env.NOTIFY_ORDER_SECRET
    if (!notifySecret) {
      console.error('[notify-order] NOTIFY_ORDER_SECRET no configurado — endpoint deshabilitado')
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
    const fromEmail = process.env.RESEND_FROM_EMAIL || `notificaciones@sumitronic.co`

    if (!resendApiKey) {
      // Sin API key: log en consola como fallback
      console.log('[notify-order] Nueva orden recibida (sin email configurado):', {
        orderId: order.id,
        cliente: order.customer_info?.fullName,
        total: order.total,
        email: order.customer_info?.email,
      })
      return NextResponse.json({ ok: true, skipped: true })
    }

    const itemsHtml = Array.isArray(order.items)
      ? order.items
          .map(
            (item: { name: string; quantity: number; price: number }) =>
              `<tr>
                <td style="padding:6px 12px;border-bottom:1px solid #eee">${item.name}</td>
                <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
                <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">$${(item.price * item.quantity).toLocaleString('es-CO')}</td>
              </tr>`
          )
          .join('')
      : '<tr><td colspan="3">Sin detalle de productos</td></tr>'

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <div style="background:#1a1a2e;padding:20px 24px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">Nueva orden — ${brand.name}</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">

          <h2 style="font-size:16px;margin:0 0 16px">Resumen del pedido</h2>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr><td style="padding:6px 0;color:#6b7280;width:140px">ID Orden</td><td style="padding:6px 0;font-weight:600">${order.id}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Cliente</td><td style="padding:6px 0">${order.customer_info?.fullName || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${order.customer_info?.email || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Teléfono</td><td style="padding:6px 0">${order.customer_info?.phone || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Método de pago</td><td style="padding:6px 0">${order.payment_method || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Dirección</td><td style="padding:6px 0">${order.shipping_address?.address || '—'}, ${order.shipping_address?.city || ''}, ${order.shipping_address?.department || ''}</td></tr>
            ${order.notes ? `<tr><td style="padding:6px 0;color:#6b7280">Referencia pago</td><td style="padding:6px 0">${order.notes}</td></tr>` : ''}
          </table>

          <h2 style="font-size:16px;margin:0 0 12px">Productos</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <thead>
              <tr style="background:#f9fafb">
                <th style="padding:8px 12px;text-align:left;font-size:13px;color:#6b7280">Producto</th>
                <th style="padding:8px 12px;text-align:center;font-size:13px;color:#6b7280">Cant.</th>
                <th style="padding:8px 12px;text-align:right;font-size:13px;color:#6b7280">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="text-align:right;font-size:20px;font-weight:700;color:#16a34a">
            Total: $${Number(order.total).toLocaleString('es-CO')} COP
          </div>

          <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;text-align:center">
            <a href="https://sumitronic.vercel.app/admin" style="display:inline-block;background:#16a34a;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600">
              Ver en el panel de administración
            </a>
          </div>
        </div>
      </div>
    `

    // 1. Email al administrador
    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${brand.name} <${fromEmail}>`,
        to: [adminEmail],
        subject: `Nueva orden #${String(order.id).slice(0, 8).toUpperCase()} — ${order.customer_info?.fullName || 'Invitado'} — $${Number(order.total).toLocaleString('es-CO')} COP`,
        html: emailHtml,
      }),
    })

    if (!adminResponse.ok) {
      const errorText = await adminResponse.text()
      console.error('[notify-order] Error Resend (admin):', errorText)
    }

    // 2. Confirmación al cliente (si tiene email)
    const customerEmail = order.customer_info?.email
    if (customerEmail) {
      const customerItemsHtml = Array.isArray(order.items)
        ? order.items
            .map(
              (item: { name: string; quantity: number; price: number }) =>
                `<tr>
                  <td style="padding:8px 12px;border-bottom:1px solid #eee">${item.name}</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">$${(item.price * item.quantity).toLocaleString('es-CO')}</td>
                </tr>`
            )
            .join('')
        : ''

      const confirmationHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
          <div style="background:#1a1a2e;padding:20px 24px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px">${brand.name} — Pedido recibido</h1>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
            <p style="font-size:16px;margin:0 0 8px">Hola ${order.customer_info?.fullName || 'cliente'},</p>
            <p style="color:#4b5563;margin:0 0 24px">Recibimos tu pedido. Te confirmamos los detalles a continuación. Nos pondremos en contacto contigo para coordinar el pago y la entrega.</p>

            <h2 style="font-size:15px;margin:0 0 12px;color:#374151">Resumen del pedido</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
              <tr><td style="padding:6px 0;color:#6b7280;width:140px">N.° de orden</td><td style="padding:6px 0;font-weight:600">#${String(order.id).slice(0, 8).toUpperCase()}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Método de pago</td><td style="padding:6px 0">${order.payment_method || 'Por confirmar'}</td></tr>
              ${order.shipping_address?.city ? `<tr><td style="padding:6px 0;color:#6b7280">Ciudad</td><td style="padding:6px 0">${order.shipping_address.city}, ${order.shipping_address.department || ''}</td></tr>` : ''}
            </table>

            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <thead>
                <tr style="background:#f9fafb">
                  <th style="padding:8px 12px;text-align:left;font-size:13px;color:#6b7280">Producto</th>
                  <th style="padding:8px 12px;text-align:center;font-size:13px;color:#6b7280">Cant.</th>
                  <th style="padding:8px 12px;text-align:right;font-size:13px;color:#6b7280">Subtotal</th>
                </tr>
              </thead>
              <tbody>${customerItemsHtml}</tbody>
            </table>

            <div style="text-align:right;font-size:20px;font-weight:700;color:#16a34a;margin-bottom:24px">
              Total: $${Number(order.total).toLocaleString('es-CO')} COP
            </div>

            <div style="background:#f0fdf4;border-radius:8px;padding:16px;font-size:14px;color:#166534">
              ¿Tienes preguntas sobre tu pedido? Escríbenos por WhatsApp o a <a href="mailto:${brand.supportEmail}" style="color:#166534;font-weight:600">${brand.supportEmail}</a>.
            </div>
          </div>
          <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:16px">${brand.name} — ${brand.address.city}, ${brand.address.region}</p>
        </div>
      `

      const customerResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${brand.name} <${fromEmail}>`,
          to: [customerEmail],
          subject: `Pedido recibido #${String(order.id).slice(0, 8).toUpperCase()} — ${brand.name}`,
          html: confirmationHtml,
        }),
      })

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text()
        console.error('[notify-order] Error Resend (cliente):', errorText)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[notify-order] Error inesperado:', error)
    // Best-effort: no rompemos el flujo de compra por un fallo de notificación
    return NextResponse.json({ ok: true, error: String(error) })
  }
}
