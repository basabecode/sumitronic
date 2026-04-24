'use client'

import { useState } from 'react'
import { MapPin, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { brand } from '@/lib/brand'

const WA_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export default function CTASection() {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    const texto = [
      nombre && `Hola, soy ${nombre}.`,
      telefono && `Mi teléfono: ${telefono}.`,
      mensaje,
    ]
      .filter(Boolean)
      .join(' ')
    window.open(
      `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(texto)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <section
      id="contacto"
      className="bg-gradient-to-br from-[hsl(var(--surface-highlight))] to-white py-16"
    >
      <div className="container">
        <div className="text-center mb-10">
          <p className="eyebrow-label">Contacto</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[hsl(var(--foreground))] md:text-4xl">
            Hablemos de lo que necesitas
          </h2>
          <p className="mt-4 text-base text-[hsl(var(--text-muted))] max-w-2xl mx-auto md:text-lg">
            Una referencia puntual, comparar opciones o resolver una duda de instalación. Te
            respondemos nosotros, no un bot.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start max-w-5xl mx-auto">
          {/* Formulario → abre WhatsApp */}
          <div className="bg-white rounded-2xl border border-[hsl(var(--border-subtle))] shadow-md p-8">
            <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-6">
              Pide tu cotización
            </h3>

            <form onSubmit={handleWhatsApp} className="space-y-5">
              <div>
                <Label
                  htmlFor="cta-nombre"
                  className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block"
                >
                  Nombre
                </Label>
                <Input
                  id="cta-nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="w-full rounded-xl"
                />
              </div>

              <div>
                <Label
                  htmlFor="cta-telefono"
                  className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block"
                >
                  Teléfono
                </Label>
                <Input
                  id="cta-telefono"
                  type="tel"
                  placeholder="300 123 4567"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  className="w-full rounded-xl"
                />
              </div>

              <div>
                <Label
                  htmlFor="cta-mensaje"
                  className="text-sm font-medium text-[hsl(var(--foreground))] mb-1.5 block"
                >
                  ¿Qué necesitas?{' '}
                  <span className="text-[hsl(var(--text-muted))] font-normal">(requerido)</span>
                </Label>
                <Textarea
                  id="cta-mensaje"
                  placeholder="Cuéntanos qué producto buscas, cuántas unidades o qué duda tienes."
                  rows={4}
                  value={mensaje}
                  onChange={e => setMensaje(e.target.value)}
                  required
                  className="w-full rounded-xl resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-base font-semibold gap-2"
                disabled={!mensaje.trim()}
              >
                {WA_ICON}
                Enviar por WhatsApp
              </Button>

              <p className="text-center text-xs text-[hsl(var(--text-muted))]">
                Te redirige a WhatsApp con tu mensaje ya redactado.
              </p>
            </form>
          </div>

          {/* Info de contacto */}
          <div className="space-y-4">
            <a
              href={`https://wa.me/${brand.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-5 shadow-sm transition-[border-color,box-shadow] hover:border-green-400 hover:shadow-md group"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white group-hover:bg-green-700 transition-colors">
                {WA_ICON}
              </div>
              <div>
                <p className="font-semibold text-[hsl(var(--foreground))]">WhatsApp</p>
                <p className="text-sm text-[hsl(var(--text-muted))]">
                  {brand.whatsappDisplay} — atención personalizada, sin bot
                </p>
              </div>
            </a>

            <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--surface-highlight))]">
                  <MapPin className="h-4 w-4 text-[hsl(var(--brand-strong))]" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-[hsl(var(--foreground))] text-sm">Dirección</p>
                  <p className="text-sm text-[hsl(var(--text-muted))] mt-0.5">
                    Cra 3 # 72A - 70, Cali, Valle del Cauca
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--surface-highlight))]">
                  <Clock className="h-4 w-4 text-[hsl(var(--brand-strong))]" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-[hsl(var(--foreground))] text-sm">Horarios</p>
                  <div className="mt-0.5 text-sm text-[hsl(var(--text-muted))] space-y-0.5">
                    <p>Lun – Vie: 8:00 AM – 5:00 PM</p>
                    <p>Sábado: 8:00 AM – 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[hsl(var(--surface-highlight))] bg-[hsl(var(--surface-highlight))] p-5">
              <p className="text-sm text-[hsl(var(--brand-strong))] font-medium leading-relaxed">
                Si tienes una referencia en mente — cámara, NVR, UPS, timbre — compártela y te
                confirmamos disponibilidad y precio más rápido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
