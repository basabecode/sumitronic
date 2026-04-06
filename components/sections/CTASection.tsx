import { MapPin, Clock } from 'lucide-react'
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
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

              {/*<Button
                variant="outline"
                className="mt-6 w-full border-[hsl(var(--brand))] bg-transparent text-[hsl(var(--brand-strong))] hover:bg-[hsl(var(--surface-highlight))]"
              >
                Ver ubicacion de referencia
              </Button>*/}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
