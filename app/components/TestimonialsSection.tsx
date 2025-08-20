import { Star, CheckCircle2, Quote } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'María González',
      role: 'Diseñadora Gráfica',
      image: '/placeholder.svg?height=80&width=80',
      rating: 5,
      text: 'Excelente servicio y productos de calidad. Compré mi MacBook aquí y la experiencia fue perfecta. El envío fue rápido y el soporte técnico excepcional.',
      product: 'MacBook Pro 14"',
      verified: true,
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      role: 'Desarrollador',
      image: '/placeholder.svg?height=80&width=80',
      rating: 5,
      text: 'La mejor tienda de electrónicos de la ciudad. Precios competitivos, productos originales y un servicio al cliente que realmente se preocupa por sus clientes.',
      product: 'iPhone 15 Pro',
      verified: true,
    },
    {
      id: 3,
      name: 'Ana Martínez',
      role: 'Estudiante',
      image: '/placeholder.svg?height=80&width=80',
      rating: 5,
      text: 'Increíble experiencia de compra. El personal es muy conocedor y me ayudaron a encontrar exactamente lo que necesitaba dentro de mi presupuesto.',
      product: 'iPad Air',
      verified: true,
    },
    {
      id: 4,
      name: 'Roberto Silva',
      role: 'Gamer',
      image: '/placeholder.svg?height=80&width=80',
      rating: 5,
      text: 'Compré mi setup gaming completo aquí. La calidad es excepcional y el servicio de instalación fue perfecto. Totalmente recomendado para gamers.',
      product: 'Gaming Setup',
      verified: true,
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Miles de clientes satisfechos confían en nosotros para sus compras
            de tecnología
          </p>
        </div>
        {/* Testimonials: una sola fila */}
        <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
          {/* Fades laterales para indicar scroll */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-50 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50 to-transparent" />

          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
            {testimonials.map(testimonial => (
              <div
                key={testimonial.id}
                className="group relative shrink-0 w-[20rem] md:w-[22rem] bg-white rounded-xl p-6 shadow-sm ring-1 ring-gray-100 border border-white/0 hover:border-white/0 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 snap-start"
              >
                {/* Icono decorativo */}
                <Quote className="absolute right-4 top-4 w-5 h-5 text-orange-300/40" />
                {/* Barra de acento */}
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 mb-4 opacity-80" />

                <div className="flex items-center gap-1 mb-3 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700/90 leading-relaxed mb-4 italic line-clamp-4">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image || '/placeholder.svg'}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-gray-900 text-sm tracking-tight">
                        {testimonial.name}
                      </h5>
                      {testimonial.verified && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" /> Verificado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-orange-600 font-medium">
                      Compró: {testimonial.product}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
