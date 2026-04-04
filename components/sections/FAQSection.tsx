'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle, Mail } from 'lucide-react'
import { brand } from '@/lib/brand'

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
        `Puedes contactarnos por WhatsApp (${brand.whatsappDisplay}), llamar (${brand.whatsappDisplay}) o escribirnos por email. Horarios: Lunes a Viernes 8AM-6PM, Sábados 9AM-2PM.`,
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-[hsl(var(--foreground))] md:text-4xl mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-[hsl(var(--text-muted))] max-w-3xl mx-auto">
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
                className="rounded-lg border border-gray-200 bg-gray-50 transition-colors duration-300 hover:border-[hsl(var(--brand))]"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between rounded-lg px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))] focus:ring-inset"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-[hsl(var(--brand-strong))]" />
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
          <div className="rounded-2xl bg-gradient-to-r from-[hsl(var(--surface-highlight))] to-[hsl(var(--background))] p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿No encontraste lo que buscabas?
            </h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo de soporte está disponible para ayudarte. Horarios:
              Lunes a Viernes 8AM-6PM, Sábados 9AM-2PM
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${brand.whatsappNumber}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
              <a
                href={`mailto:${brand.supportEmail}`}
                className="inline-flex items-center justify-center rounded-lg bg-[hsl(var(--brand))] px-6 py-3 font-semibold text-white transition-colors hover:bg-[hsl(var(--brand-strong))]"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email de soporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
