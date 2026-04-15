import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { brand } from '@/lib/brand'
import { ratelimit } from '@/lib/ratelimit'
import ContactNotificationEmail from '@/emails/contact-notification'

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
    if (!resendApiKey) {
      console.log('[contact] Mensaje recibido (sin email configurado):', { nombre, email, asunto })
      return NextResponse.json({ ok: true, skipped: true })
    }

    const resend = new Resend(resendApiKey)
    const fromEmail = process.env.RESEND_FROM_EMAIL || `noreply@sumitronic.com`
    const supportEmail = process.env.RESEND_SUPPORT_EMAIL || brand.supportEmail

    const { error } = await resend.emails.send({
      from: `${brand.name} <${fromEmail}>`,
      to: [supportEmail],
      replyTo: email,
      subject: `Consulta de ${nombre} ${apellido}${asunto ? ` — ${asunto}` : ''}`,
      react: ContactNotificationEmail({ nombre, apellido, email, telefono, asunto, mensaje }),
    })

    if (error) {
      console.error('[contact] Error Resend:', error)
      return NextResponse.json({ error: 'No se pudo enviar el mensaje.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[contact] Error inesperado:', error)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
