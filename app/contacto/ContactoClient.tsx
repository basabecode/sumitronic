'use client'

import { brand } from '@/lib/brand'
import { MapPin, Clock, Mail, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function ContactoClient() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = {
      nombre: (form.elements.namedItem('nombre') as HTMLInputElement).value,
      apellido: (form.elements.namedItem('apellido') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      telefono: (form.elements.namedItem('telefono') as HTMLInputElement).value,
      asunto: (form.elements.namedItem('asunto') as HTMLInputElement).value,
      mensaje: (form.elements.namedItem('mensaje') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'No se pudo enviar el mensaje. Intenta de nuevo.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow-label">Estamos para ayudarle</p>
            <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-[hsl(var(--foreground))] md:text-5xl">
              Hablemos de lo que necesita
            </h1>
            <p className="mt-4 text-lg text-[hsl(var(--text-muted))]">
              Si tiene dudas sobre un equipo, quiere cotizar para su negocio o necesita soporte
              técnico, el canal más rápido es WhatsApp. También puede dejarnos un mensaje y le
              respondemos el mismo día hábil.
            </p>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Columna izquierda: info de contacto */}
          <div className="space-y-8">
            {/* WhatsApp */}
            <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-8 shadow-sm">
              <h2 className="mb-2 text-xl font-semibold text-[hsl(var(--foreground))]">
                Atención por WhatsApp
              </h2>
              <p className="mb-6 text-sm text-[hsl(var(--text-muted))]">
                El canal más rápido. Le respondemos sobre disponibilidad, precios, compatibilidad
                técnica y soporte postventa.
              </p>
              <a
                href={`https://wa.me/${brand.whatsappNumber}?text=Hola%2C%20tengo%20una%20consulta%20sobre%20un%20equipo`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl bg-green-50 p-4 transition-colors hover:bg-green-100 group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600 group-hover:scale-105 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6 text-white"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp directo</p>
                  <p className="text-sm text-gray-600">{brand.whatsappDisplay}</p>
                </div>
              </a>
            </div>

            {/* Correo */}
            <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-8 shadow-sm">
              <h2 className="mb-2 text-xl font-semibold text-[hsl(var(--foreground))]">
                Correo y teléfono
              </h2>
              <p className="mb-4 text-sm text-[hsl(var(--text-muted))]">
                Para cotizaciones formales, consultas detalladas o soporte con documentación.
              </p>
              <div className="space-y-3">
                <a
                  href={`mailto:${brand.supportEmail}`}
                  className="flex items-center gap-3 text-sm text-[hsl(var(--brand-strong))] hover:underline"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {brand.supportEmail}
                </a>
                <a
                  href={`tel:+57${brand.whatsappClean}`}
                  className="flex items-center gap-3 text-sm text-[hsl(var(--brand-strong))] hover:underline"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  +57 {brand.whatsappDisplay}
                </a>
              </div>
            </div>

            {/* Ubicación */}
            <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-[hsl(var(--foreground))]">
                Ubicación y horarios
              </h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--brand-strong))]" />
                  <div>
                    <p className="font-semibold text-gray-900">{brand.address.street}</p>
                    <p className="text-sm text-gray-600">
                      {brand.address.city}, {brand.address.region}
                    </p>
                    <a
                      href={brand.address.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs font-semibold text-[hsl(var(--brand-strong))] hover:underline"
                    >
                      Ver en Google Maps →
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--brand-strong))]" />
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">Horarios</p>
                    <p>{brand.hours.weekday}</p>
                    <p>{brand.hours.saturday}</p>
                    <p className="text-gray-400">{brand.hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: formulario */}
          <div>
            <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-8 shadow-sm">
              <h2 className="mb-2 text-xl font-semibold text-[hsl(var(--foreground))]">
                Envíenos un mensaje
              </h2>
              <p className="mb-6 text-sm text-[hsl(var(--text-muted))]">
                Le respondemos en el siguiente día hábil. Para urgencias use WhatsApp.
              </p>

              {submitted ? (
                <div className="rounded-xl bg-green-50 p-8 text-center">
                  <div className="mb-3 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <Send className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Mensaje recibido</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Le respondemos antes del siguiente día hábil. Si es urgente, escríbanos por
                    WhatsApp al{' '}
                    <a
                      href={`https://wa.me/${brand.whatsappNumber}`}
                      className="font-semibold text-green-700 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {brand.whatsappDisplay}
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Su nombre"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        name="apellido"
                        type="text"
                        placeholder="Su apellido"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Correo *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="nombre@correo.com"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" name="telefono" type="tel" placeholder="300 000 0000" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="asunto">¿Qué necesita?</Label>
                    <Input
                      id="asunto"
                      name="asunto"
                      type="text"
                      placeholder="Ej: cotización cámaras, soporte técnico, consulta de precio"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      placeholder="Cuéntenos con detalle: el equipo que busca, cuántas unidades, para qué uso o qué problema tiene."
                      rows={5}
                      required
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl text-sm font-semibold"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                  </Button>
                  <p className="text-center text-xs text-[hsl(var(--text-muted))]">
                    Sus datos son tratados conforme a nuestra{' '}
                    <a
                      href="/help/politica-de-privacidad"
                      className="text-[hsl(var(--brand-strong))] hover:underline"
                    >
                      Política de Privacidad
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-highlight))] p-6">
              <h3 className="mb-4 font-semibold text-[hsl(var(--foreground))]">
                Preguntas frecuentes antes de escribir
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/help/garantias-y-devoluciones"
                    className="text-[hsl(var(--brand-strong))] hover:underline"
                  >
                    ¿Qué cubre la garantía? →
                  </a>
                </li>
                <li>
                  <a
                    href="/help/envios-y-seguimiento"
                    className="text-[hsl(var(--brand-strong))] hover:underline"
                  >
                    ¿Cuánto tarda el envío? →
                  </a>
                </li>
                <li>
                  <a
                    href="/help/pagos-y-confirmacion"
                    className="text-[hsl(var(--brand-strong))] hover:underline"
                  >
                    ¿Cuáles son los métodos de pago? →
                  </a>
                </li>
                <li>
                  <a
                    href="/help/servicio-tecnico"
                    className="text-[hsl(var(--brand-strong))] hover:underline"
                  >
                    ¿Ofrecen soporte técnico? →
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
