'use client'

import { brand } from '@/lib/brand'
import { MessageCircle, MapPin, Clock, Mail, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function ContactoClient() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
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
              Si tiene dudas sobre un equipo, quiere cotizar para su negocio o necesita soporte técnico, el canal más rápido es WhatsApp. También puede dejarnos un mensaje y le respondemos el mismo día hábil.
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
                El canal más rápido. Le respondemos sobre disponibilidad, precios, compatibilidad técnica y soporte postventa.
              </p>
              <a
                href={`https://wa.me/${brand.whatsappNumber}?text=Hola%2C%20tengo%20una%20consulta%20sobre%20un%20equipo`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl bg-green-50 p-4 transition-colors hover:bg-green-100 group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600 group-hover:scale-105 transition-transform">
                  <MessageCircle className="h-6 w-6 text-white" />
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
                    <p className="text-sm text-gray-600">{brand.address.city}, {brand.address.region}</p>
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
                    Le respondemos antes del siguiente día hábil. Si es urgente, escríbanos por WhatsApp al{' '}
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
                      <Input id="nombre" type="text" placeholder="Su nombre" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input id="apellido" type="text" placeholder="Su apellido" required />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Correo *</Label>
                      <Input id="email" type="email" placeholder="nombre@correo.com" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" type="tel" placeholder="300 000 0000" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="asunto">¿Qué necesita?</Label>
                    <Input
                      id="asunto"
                      type="text"
                      placeholder="Ej: cotización cámaras, soporte técnico, consulta de precio"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      placeholder="Cuéntenos con detalle: el equipo que busca, cuántas unidades, para qué uso o qué problema tiene."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar mensaje
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
                  <a href="/help/garantias-y-devoluciones" className="text-[hsl(var(--brand-strong))] hover:underline">
                    ¿Qué cubre la garantía? →
                  </a>
                </li>
                <li>
                  <a href="/help/envios-y-seguimiento" className="text-[hsl(var(--brand-strong))] hover:underline">
                    ¿Cuánto tarda el envío? →
                  </a>
                </li>
                <li>
                  <a href="/help/pagos-y-confirmacion" className="text-[hsl(var(--brand-strong))] hover:underline">
                    ¿Cuáles son los métodos de pago? →
                  </a>
                </li>
                <li>
                  <a href="/help/servicio-tecnico" className="text-[hsl(var(--brand-strong))] hover:underline">
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
