import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { brand } from '@/lib/brand'

export default function Footer() {
  const paymentMethods = ['PSE', 'Bancolombia', 'Daviplata', 'Nequi']

  const shippingPartners = ['Interrapidisimo', 'Envía', 'Servientrega']

  const securityItems = ['Certificado de Seguridad', 'Datos Protegidos']

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="font-display text-2xl font-bold text-[hsl(var(--brand))]">
              {brand.name}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Soluciones confiables en seguridad electronica, conectividad y
              repuestos tecnicos con acompanamiento comercial y soporte local.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-[hsl(var(--brand))]"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-[hsl(var(--brand))]"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-[hsl(var(--brand))]"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-[hsl(var(--brand))]"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#productos"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Productos
                </a>
              </li>
              <li>
                <a
                  href="#ofertas"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Ofertas
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Contacto
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Sobre Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Atención al Cliente</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/help?section=faq"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a
                  href="/help?section=returns"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Política de Devoluciones
                </a>
              </li>
              <li>
                <a
                  href="/help?section=terms"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a
                  href="/help?section=privacy"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="/help?section=warranty"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Garantías
                </a>
              </li>
              <li>
                <a
                  href="/help?section=support"
                  className="text-gray-300 transition-colors hover:text-[hsl(var(--brand))]"
                >
                  Servicio Técnico
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[hsl(var(--brand))]" />
                <span className="text-gray-300">+57 ({brand.whatsappDisplay})</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[hsl(var(--brand))]" />
                <a href={`mailto:${brand.supportEmail}`} className="text-gray-300 transition-colors hover:text-white">
                  Email de soporte
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[hsl(var(--brand))]" />
                <span className="text-gray-300">
                  Cra 3 # 72A - 70
                  <br />
                  Cali, Valle del Cauca, 760006
                </span>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Payment & Shipping Info */}
      <div className="bg-gray-800 py-3">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid md:grid-cols-3 gap-4 text-left items-center">
            {/* Payment Methods */}
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <CreditCard className="h-4 w-4 text-[hsl(var(--brand))]" />
              <span className="font-semibold text-white">Métodos de Pago:</span>
              <span className="flex-1">{paymentMethods.join(' • ')}</span>
            </div>

            {/* Security */}
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Shield className="h-4 w-4 text-[hsl(var(--brand))]" />
              <span className="font-semibold text-white">Compra Segura:</span>
              <span className="flex-1">{securityItems.join(' • ')}</span>
            </div>

            {/* Shipping */}
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Truck className="h-4 w-4 text-[hsl(var(--brand))]" />
              <span className="font-semibold text-white">Envíos con:</span>
              <span className="flex-1">{shippingPartners.join(' • ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-900 border-t border-gray-800 py-4">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>© 2025 {brand.name}. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <a href="#" className="transition-colors hover:text-[hsl(var(--brand))]">
                Política de Privacidad
              </a>
              <a href="#" className="transition-colors hover:text-[hsl(var(--brand))]">
                Términos de Uso
              </a>
              <a href="#" className="transition-colors hover:text-[hsl(var(--brand))]">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
