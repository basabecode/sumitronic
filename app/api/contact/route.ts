import { NextRequest, NextResponse } from 'next/server'
import { brand } from '@/lib/brand'
import { ratelimit } from '@/lib/ratelimit'

/**
 * POST /api/contact
 * Recibe el formulario de contacto y envía el mensaje a soporte@sumitronic.com
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await ratelimit.limit(`contact:${ip}`)
    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { nombre, apellido, email, telefono, asunto, mensaje } = body

    if (!nombre || !apellido || !email || !mensaje) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@sumitronic.com'
    const supportEmail = process.env.RESEND_SUPPORT_EMAIL || brand.supportEmail

    if (!resendApiKey) {
      console.log('[contact] Mensaje recibido (sin email configurado):', { nombre, email, asunto })
      return NextResponse.json({ ok: true, skipped: true })
    }

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <div style="background:#1a1a2e;padding:20px 24px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">Nuevo mensaje de contacto — ${brand.name}</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:24px">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr><td style="padding:6px 0;color:#6b7280;width:120px">Nombre</td><td style="padding:6px 0;font-weight:600">${nombre} ${apellido}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Correo</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#2563eb">${email}</a></td></tr>
            ${telefono ? `<tr><td style="padding:6px 0;color:#6b7280">Teléfono</td><td style="padding:6px 0">${telefono}</td></tr>` : ''}
            ${asunto ? `<tr><td style="padding:6px 0;color:#6b7280">Asunto</td><td style="padding:6px 0">${asunto}</td></tr>` : ''}
          </table>

          <h2 style="font-size:15px;margin:0 0 10px;color:#374151">Mensaje</h2>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;color:#111;white-space:pre-wrap">${mensaje}</div>

          <div style="margin-top:24px;padding:12px 16px;background:#eff6ff;border-radius:8px;font-size:13px;color:#1e40af">
            Responder directamente a: <a href="mailto:${email}" style="font-weight:600;color:#1e40af">${email}</a>
          </div>
        </div>
      </div>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${brand.name} <${fromEmail}>`,
        to: [supportEmail],
        reply_to: email,
        subject: `Consulta de ${nombre} ${apellido}${asunto ? ` — ${asunto}` : ''}`,
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[contact] Error Resend:', errorText)
      return NextResponse.json({ error: 'No se pudo enviar el mensaje.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[contact] Error inesperado:', error)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
