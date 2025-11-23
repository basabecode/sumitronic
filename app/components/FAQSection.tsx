'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      question: '¿Los productos son originales con garantía oficial?',
      answer:
        'Sí, todos nuestros productos son 100% originales con garantía oficial del fabricante. Somos distribuidores autorizados de marcas como Dahua, Imou, Logitech, Forza y TP-Link, lo que garantiza autenticidad y respaldo técnico en Colombia.',
    },
    {
      question: '¿Cuáles son los tiempos de entrega en Colombia?',
      answer:
        'En Bogotá y principales ciudades: 1-2 días hábiles. Ciudades intermedias: 2-3 días hábiles. Municipios y zonas rurales: 3-5 días hábiles. Trabajamos con Servientrega, Coordinadora e Interrapidísimo para garantizar entregas seguras a nivel nacional.',
    },
    {
      question: '¿Qué métodos de pago manejan?',
      answer:
        'Aceptamos: Efectivo contra entrega, tarjetas débito/crédito (Visa, Mastercard), PSE (Pagos Seguros en Línea), transferencias bancarias, Nequi, Daviplata y consignaciones. También ofrecemos financiación hasta 12 cuotas sin intereses con tarjetas participantes.',
    },
    {
      question: '¿Cuál es la política de cambios y devoluciones?',
      answer:
        'Tienes 30 días calendario para cambios o devoluciones según la Ley del Consumidor colombiana. Los productos deben estar en perfecto estado con empaques originales. Los gastos de envío de devolución son gratuitos si el producto presenta defectos de fábrica.',
    },
    {
      question: '¿Ofrecen servicio técnico especializado?',
      answer:
        'Sí, contamos con técnicos certificados en todas las marcas que vendemos. Ofrecemos soporte técnico gratuito por WhatsApp, instalación a domicilio en principales ciudades, y centro de servicio autorizado con repuestos originales.',
    },
    {
      question: '¿Manejan garantía extendida?',
      answer:
        'Además de la garantía oficial (12-24 meses según el producto), ofrecemos garantía extendida hasta 3 años adicionales. Incluye protección contra daños accidentales, robo, y soporte técnico prioritario sin costo adicional.',
    },
    {
      question: '¿Realizan instalación y configuración a domicilio?',
      answer:
        'Sí, en Bogotá, Medellín, Cali, Barranquilla y Bucaramanga ofrecemos instalación profesional a domicilio. Incluye configuración completa, capacitación de uso, y garantía de instalación. Programamos cita según tu disponibilidad.',
    },
    {
      question: '¿Cómo hago seguimiento a mi pedido?',
      answer:
        'Al confirmar tu compra recibes un código de seguimiento por SMS y email. Puedes rastrear tu pedido 24/7 en nuestra página web o llamando al 018000. Te notificaremos cada cambio de estado hasta la entrega exitosa.',
    },
    {
      question: '¿Tienen tienda física para ver los productos?',
      answer:
        'Sí, tenemos showroom en Bogotá donde puedes ver y probar los productos antes de comprar. También realizamos demostraciones virtuales por videollamada. Agenda tu cita previa para recibir asesoría personalizada de nuestros expertos.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros
            productos y servicios
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset rounded-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-orange-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div id="no-encontraste" className="mt-12 text-center">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿No encontraste lo que buscabas?
            </h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo de soporte está disponible para ayudarte. Horarios:
              Lunes a Viernes 8AM-6PM, Sábados 9AM-2PM
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/573003094854"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
              <a
                href="mailto:info@capishop.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✉️ Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
