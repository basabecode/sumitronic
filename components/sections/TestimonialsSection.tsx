import { Star, CheckCircle2, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Andrés Bermúdez',
    role: 'Propietario de local comercial',
    initials: 'AB',
    avatarBg: 'bg-sky-100 text-sky-700',
    rating: 5,
    text: 'Compré la cámara IMOU y en 30 minutos la tenía funcionando desde el celular. Me llamaron para confirmar el pedido y me resolvieron una duda de instalación sin cobrarme nada extra.',
    product: 'Cámara IMOU Cruiser WiFi',
    verified: true,
  },
  {
    id: 2,
    name: 'Juliana Torres',
    role: 'Directora administrativa',
    initials: 'JT',
    avatarBg: 'bg-cyan-100 text-cyan-700',
    rating: 5,
    text: 'Necesitaba cámaras para la oficina y me orientaron bien sin intentar venderme más de lo que necesitaba. El envío llegó en dos días y todo llegó bien empacado.',
    product: 'Kit Hikvision 4 cámaras',
    verified: true,
  },
  {
    id: 3,
    name: 'Carlos Patiño',
    role: 'Instalador independiente',
    initials: 'CP',
    avatarBg: 'bg-violet-100 text-violet-700',
    rating: 5,
    text: 'Les compro con frecuencia para mis clientes. Precios honestos, los productos llegan bien y cuando ha habido alguna novedad la resuelven rápido. Recomendados sin duda.',
    product: 'Múltiples referencias Dahua',
    verified: true,
  },
  {
    id: 4,
    name: 'María Fernanda Ríos',
    role: 'Propietaria de apartamento',
    initials: 'MR',
    avatarBg: 'bg-emerald-100 text-emerald-700',
    rating: 5,
    text: 'Me ayudaron a elegir el timbre correcto para mi apartamento. Fácil de instalar, funciona genial y el soporte por WhatsApp fue muy claro y sin rodeos.',
    product: 'Timbre IMOU Doorbell 2S',
    verified: true,
  },
]

export default function TestimonialsSection() {
  return (
    <section id="resenas" className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container">
        <div className="text-center mb-10">
          <p className="eyebrow-label">Clientes reales</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[hsl(var(--foreground))] md:text-4xl">
            Lo que dicen quienes ya compraron
          </h2>
          <p className="mt-4 text-base text-[hsl(var(--text-muted))] max-w-2xl mx-auto md:text-lg">
            Sin scripts. Lo que nos escriben por WhatsApp después de recibir su pedido.
          </p>
        </div>

        <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-gray-50 to-transparent z-10 md:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-gray-50 to-transparent z-10 md:hidden" />

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
            {testimonials.map(testimonial => (
              <article
                key={testimonial.id}
                className="group relative shrink-0 w-[19rem] md:w-auto bg-white rounded-2xl p-6 shadow-sm border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--brand))] hover:shadow-md transition-[transform,box-shadow,border-color] duration-[220ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 snap-start"
              >
                <Quote
                  className="absolute right-5 top-5 h-5 w-5 text-[hsl(var(--brand))] opacity-20 group-hover:opacity-40 transition-opacity"
                  aria-hidden="true"
                />

                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed mb-5">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-[hsl(var(--border-subtle))]">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${testimonial.avatarBg}`}
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
                        {testimonial.name}
                      </span>
                      {testimonial.verified && (
                        <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-100 shrink-0">
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                          Verificado
                        </span>
                      )}
                    </div>
                    <p className="text-[0.7rem] text-[hsl(var(--text-muted))]">
                      {testimonial.role}
                    </p>
                    <p className="text-[0.7rem] font-medium text-[hsl(var(--brand-strong))] truncate">
                      {testimonial.product}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
