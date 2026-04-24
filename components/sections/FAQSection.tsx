'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
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
      answer: `Puedes escribirnos por WhatsApp al ${brand.whatsappDisplay} o por correo. Si ya tienes una referencia en mente, mejor aun: asi te confirmamos disponibilidad y precio mas rapido.`,
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-10">
          <p className="eyebrow-label">Preguntas frecuentes</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[hsl(var(--foreground))] md:text-4xl">
            Lo que más nos preguntan
          </h2>
          <p className="mt-4 text-base text-[hsl(var(--text-muted))] max-w-2xl mx-auto md:text-lg">
            Respuestas directas para que compres con información clara y sin sorpresas.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-[border-color,background-color] duration-[220ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${
                openFAQ === index
                  ? 'border-[hsl(var(--brand))] bg-[hsl(var(--surface-highlight))]'
                  : 'border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] hover:border-[hsl(var(--brand))]'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between rounded-2xl px-6 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand))] focus-visible:ring-inset"
                aria-expanded={openFAQ === index}
              >
                <h3 className="text-base font-semibold text-[hsl(var(--foreground))] pr-4">
                  {faq.question}
                </h3>
                <div className="shrink-0 ml-2">
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-[hsl(var(--brand-strong))]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[hsl(var(--text-muted))]" />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFAQ === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
