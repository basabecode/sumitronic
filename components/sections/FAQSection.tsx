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
        'Si. Trabajamos con productos originales y te informamos la garantia aplicable segun la marca o referencia. Si antes de comprar quieres validar compatibilidad o cobertura, te ayudamos por WhatsApp.',
    },
    {
      question: '¿Cuáles son los tiempos de entrega?',
      answer:
        'En Cali y ciudades principales el despacho suele tardar entre 1 y 3 dias habiles. Para municipios intermedios o zonas apartadas puede tomar un poco mas. Siempre te confirmamos tiempos antes de cerrar el pedido.',
    },
    {
      question: '¿Qué métodos de pago manejan?',
      answer:
        'Manejamos opciones practicas para el mercado local como transferencia, Nequi, Daviplata y otros medios que te confirmamos al momento de la compra. Si tienes una necesidad puntual, la revisamos contigo.',
    },
    {
      question: '¿Cuál es la política de cambios y devoluciones?',
      answer:
        'Si se presenta una novedad, revisamos tu caso y te indicamos el proceso de cambio o devolucion segun el estado del producto y las condiciones de la compra. La idea es darte una gestion clara, no dejarte solo con el problema.',
    },
    {
      question: '¿Ofrecen servicio técnico especializado?',
      answer:
        'Brindamos orientacion por WhatsApp y, segun la referencia, apoyo en instalacion, configuracion o uso basico. En Cali tambien podemos revisar opciones de atencion mas directa.',
    },
    {
      question: '¿Cómo puedo contactarlos?',
      answer:
        `Puedes escribirnos por WhatsApp al ${brand.whatsappDisplay} o por correo. Si ya tienes una referencia en mente, mejor aun: asi te confirmamos disponibilidad y precio mas rapido.`,
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
            Resolvemos las dudas mas comunes para que compres con informacion clara y sin sorpresas.
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
              ¿Todavia tienes dudas?
            </h3>
            <p className="text-gray-600 mb-6">
              Escribenos y te orientamos segun el producto, el presupuesto o el tipo de uso que tienes en mente.
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
