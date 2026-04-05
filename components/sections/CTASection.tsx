import { MessageCircle, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function CTASection() {
  return (
    <section
      id="contacto"
      className="bg-gradient-to-br from-[hsl(var(--surface-highlight))] to-white py-16"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-[hsl(var(--foreground))] md:text-4xl mb-4">
            Hablemos de lo que necesitas
          </h2>
          <p className="text-xl text-[hsl(var(--text-muted))] max-w-3xl mx-auto">
            Si buscas una referencia puntual o quieres comparar opciones, te ayudamos a elegir sin enredos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Pide tu cotizacion
            </h3>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Nombre *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Escribe tu nombre"
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Apellido *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Escribe tu apellido"
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@correo.com"
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Teléfono *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="300 123 4567"
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="product"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Producto de Interés
                </Label>
                <Input
                  id="product"
                  type="text"
                  placeholder="Ejemplo: camara WiFi, UPS, tarjeta para TV"
                  className="w-full"
                />
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Mensaje *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Cuéntanos para que lo necesitas, cuantas unidades buscas o que duda quieres resolver."
                  rows={4}
                  className="w-full"
                  required
                />
              </div>

              <Button type="submit" className="w-full py-3 text-lg font-semibold">
                Enviar solicitud
              </Button>
            </form>
          </div>

          {/* Contact Info & Quick Actions */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Atencion rapida por WhatsApp
              </h3>

              <div className="space-y-6">
                <a
                  href="https://wa.me/573003094854"
                  className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                >
                  <div className="bg-green-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                    <p className="text-gray-600">Te ayudamos con disponibilidad, precio y compatibilidad</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Store Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Atencion y cobertura
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[hsl(var(--brand-strong))] mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Dirección</h4>
                    <p className="text-gray-600">
                      Cra 3 # 72A - 70
                      <br />
                      Cali, Valle del Cauca
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[hsl(var(--brand-strong))] mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Horarios</h4>
                    <div className="text-gray-600 text-sm">
                      <p>Lun - Vie: 8:00 AM - 5:00 PM</p>
                      <p>Sábado: 8:00 AM - 2:00 PM</p>
                      <p>Domingo: No atendemos</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-6 w-full border-[hsl(var(--brand))] bg-transparent text-[hsl(var(--brand-strong))] hover:bg-[hsl(var(--surface-highlight))]"
              >
                Ver ubicacion de referencia
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
