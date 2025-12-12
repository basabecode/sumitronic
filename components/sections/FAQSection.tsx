'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle, Mail } from 'lucide-react'

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      question: '¿Los productos son originales con garantía oficial?',
      answer:
        'Sí, todos nuestros productos son 100% originales con garantía oficial del fabricante. Somos distribuidores de la marca Dahua, Imou, Logitech, Forza y TP-Link, lo que garantiza autenticidad y respaldo técnico en Colombia.',
    },
    {
      question: '¿Cuáles son los tiempos de entrega?',
      answer:
        'En Cali y principales ciudades de Colombia: 1-2 días hábiles. Ciudades intermedias: 2-5 días hábiles. Municipios y zonas rurales: 5-8 días hábiles. Trabajamos con Servientrega, Envía e Interrapidísimo.',
    },
    {
      question: '¿Qué métodos de pago manejan?',
      answer:
        'Aceptamos: Efectivo contra entrega en Cali, transferencias bancarias, Nequi, Daviplata y consignaciones a través de Bancolombia y Daviplata. En el momento no manejamos créditos ni sistema PSE o pago electrónico.',
    },
    {
      question: '¿Cuál es la política de cambios y devoluciones?',
      answer:
        'Tienes 8 días calendario para cambios o devoluciones. Los productos deben estar en perfecto estado con empaques originales. Gastos de envío gratuitos si hay defectos de fábrica.',
    },
    {
      question: '¿Ofrecen servicio técnico especializado?',
      answer:
        'Ofrecemos soporte técnico gratuito por WhatsApp según el tipo de producto que requiera, instalación a domicilio en la ciudad de Cali.',
    },
    {
      question: '¿Cómo puedo contactarlos?',
      answer:
        'Puedes contactarnos por WhatsApp (300 3094854), llamar (300 3094854), o email (info@capishop.com). Horarios: Lunes a Viernes 8AM-6PM, Sábados 9AM-2PM.',
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
                <Mail className="w-5 h-5 mr-2" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
