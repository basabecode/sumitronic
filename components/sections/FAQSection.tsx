'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail } from 'lucide-react'
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
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
