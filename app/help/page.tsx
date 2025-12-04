'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  HelpCircle,
  RefreshCw,
  FileText,
  Shield,
  Wrench,
  Lock,
  ChevronRight,
  Mail,
  Phone,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function HelpPage() {
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState('faq')

  useEffect(() => {
    const section = searchParams.get('section')
    if (section) {
      setActiveSection(section)
    }
  }, [searchParams])

  const sections = [
    {
      id: 'faq',
      title: 'Centro de Ayuda',
      icon: HelpCircle,
      description: 'Preguntas frecuentes y soporte general',
    },
    {
      id: 'returns',
      title: 'Política de Devoluciones',
      icon: RefreshCw,
      description: 'Información sobre cambios y reembolsos',
    },
    {
      id: 'terms',
      title: 'Términos y Condiciones',
      icon: FileText,
      description: 'Reglas de uso de nuestra plataforma',
    },
    {
      id: 'privacy',
      title: 'Política de Privacidad',
      icon: Lock,
      description: 'Cómo protegemos tus datos personales',
    },
    {
      id: 'warranty',
      title: 'Garantías',
      icon: Shield,
      description: 'Cobertura y reclamos de garantía',
    },
    {
      id: 'support',
      title: 'Servicio Técnico',
      icon: Wrench,
      description: 'Soporte especializado para tus productos',
    },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'faq':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Preguntas Frecuentes
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  ¿Cuánto tiempo tarda el envío?
                </AccordionTrigger>
                <AccordionContent>
                  Nuestros envíos nacionales suelen tardar entre 2 y 5 días
                  hábiles, dependiendo de la ciudad de destino. Para ciudades
                  principales como Bogotá, Medellín y Cali, el tiempo estimado
                  es de 1 a 3 días hábiles.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  ¿Qué métodos de pago aceptan?
                </AccordionTrigger>
                <AccordionContent>
                  Aceptamos múltiples métodos de pago incluyendo tarjetas de
                  crédito/débito, PSE, Nequi, Daviplata y transferencias
                  bancarias directas a Bancolombia.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  ¿Cómo puedo rastrear mi pedido?
                </AccordionTrigger>
                <AccordionContent>
                  Una vez tu pedido sea despachado, recibirás un correo
                  electrónico con el número de guía y el enlace de la
                  transportadora para realizar el seguimiento en tiempo real.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  ¿Tienen tienda física?
                </AccordionTrigger>
                <AccordionContent>
                  Sí, nuestra sede principal está ubicada en Cali, Valle del
                  Cauca. Puedes visitarnos en la Cra 3 # 72A - 70 para recoger
                  tus pedidos o ver nuestros productos.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      case 'returns':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Política de Devoluciones
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                En CapiShop, queremos que estés completamente satisfecho con tu
                compra. Si por alguna razón no lo estás, aceptamos devoluciones
                bajo las siguientes condiciones:
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                Plazo de Devolución
              </h3>
              <p>
                Tienes un plazo de <strong>30 días calendario</strong> a partir
                de la fecha de recepción del producto para solicitar una
                devolución.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                Condiciones del Producto
              </h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  El producto debe estar en su empaque original y en perfectas
                  condiciones.
                </li>
                <li>
                  Debe incluir todos sus accesorios, manuales y etiquetas.
                </li>
                <li>No debe presentar señales de uso o maltrato.</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                Proceso de Reembolso
              </h3>
              <p>
                Una vez recibido y verificado el producto en nuestras bodegas,
                procesaremos el reembolso a tu método de pago original en un
                plazo de 5 a 10 días hábiles.
              </p>
            </div>
          </div>
        )

      case 'terms':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Términos y Condiciones
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                Bienvenido a CapiShop. Al acceder y utilizar nuestro sitio web,
                aceptas cumplir con los siguientes términos y condiciones:
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                1. Uso del Sitio
              </h3>
              <p>
                El contenido de este sitio web es para tu información general y
                uso personal. Está sujeto a cambios sin previo aviso.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                2. Precios y Disponibilidad
              </h3>
              <p>
                Todos los precios están expresados en pesos colombianos (COP) e
                incluyen IVA. Nos reservamos el derecho de modificar los precios
                o descontinuar productos en cualquier momento.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                3. Propiedad Intelectual
              </h3>
              <p>
                Todo el material contenido en este sitio web es propiedad de
                CapiShop o de sus proveedores y está protegido por las leyes de
                propiedad intelectual.
              </p>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Política de Privacidad
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                En CapiShop nos tomamos muy en serio la privacidad de tus datos.
                Esta política describe cómo recopilamos, usamos y protegemos tu
                información personal.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                Recopilación de Datos
              </h3>
              <p>
                Recopilamos información cuando te registras en nuestro sitio,
                realizas un pedido o te suscribes a nuestro boletín. Esto puede
                incluir tu nombre, dirección de correo electrónico, dirección
                postal y número de teléfono.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                Uso de la Información
              </h3>
              <p>Usamos tu información para:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Procesar tus pedidos y transacciones.</li>
                <li>Mejorar nuestro servicio al cliente.</li>
                <li>Enviar correos electrónicos periódicos con ofertas.</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                Protección de Datos
              </h3>
              <p>
                Implementamos una variedad de medidas de seguridad para mantener
                la seguridad de tu información personal. No vendemos ni
                transferimos tus datos a terceros.
              </p>
            </div>
          </div>
        )

      case 'warranty':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Políticas de Garantía
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                Todos nuestros productos cuentan con garantía oficial por
                defectos de fabricación.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                Periodo de Garantía
              </h3>
              <p>
                La mayoría de nuestros productos electrónicos cuentan con una
                garantía de <strong>12 meses</strong> a partir de la fecha de
                compra. Accesorios y otros artículos pueden tener periodos
                diferentes, especificados en la descripción del producto.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                ¿Qué cubre la garantía?
              </h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Defectos de fabricación.</li>
                <li>Fallas en el funcionamiento normal del dispositivo.</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                Exclusiones
              </h3>
              <p>La garantía no cubre daños causados por:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Mal uso o negligencia.</li>
                <li>Accidentes, caídas o golpes.</li>
                <li>Contacto con líquidos (salvo productos certificados).</li>
                <li>Modificaciones no autorizadas.</li>
              </ul>
            </div>
          </div>
        )

      case 'support':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Servicio Técnico
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                Nuestro equipo de expertos está listo para ayudarte con
                cualquier problema técnico que presentes con tus dispositivos.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      Soporte vía WhatsApp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Obtén respuestas rápidas chateando con nuestros técnicos.
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <a
                        href="https://wa.me/573003094854"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Iniciar Chat
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Mail className="w-5 h-5 text-orange-600" />
                      Soporte por Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Para casos más complejos, escríbenos detallando tu problema.
                    </p>
                    <Button variant="outline" className="w-full">
                      <a href="mailto:soporte@capishop.com">
                        Enviar Correo
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-8">
                Horarios de Atención
              </h3>
              <p>
                Lunes a Viernes: 8:00 AM - 6:00 PM
                <br />
                Sábados: 9:00 AM - 1:00 PM
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Centro de Atención al Cliente
          </h1>
          <p className="text-gray-600 mt-2">
            Estamos aquí para ayudarte. Selecciona un tema para encontrar la información que necesitas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200 text-left ${
                  activeSection === section.id
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                </div>
                {activeSection === section.id && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ))}

            {/* Contact Card in Sidebar */}
            <Card className="mt-8 bg-blue-50 border-blue-100">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  ¿No encuentras lo que buscas?
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Contáctanos directamente y te ayudaremos.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <Phone className="w-4 h-4" />
                    <span>+57 (300) 3094854</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <Mail className="w-4 h-4" />
                    <span>info@capishop.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            <Card className="min-h-[500px]">
              <CardContent className="p-8">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
