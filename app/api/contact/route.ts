import { NextRequest, NextResponse } from 'next/server'
import { brand } from '@/lib/brand'
import { ratelimit } from '@/lib/ratelimit'
import { buildContactNotificationEmail } from '@/lib/email-templates'

/**
 * POST /api/contact
 * Recibe el formulario de contacto y envía notificación a soporte@sumitronic.com
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
        html: buildContactNotificationEmail({ nombre, apellido, email, telefono, asunto, mensaje }),
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
