import { Shield, Clock, Award } from 'lucide-react'
import { brand } from '@/lib/brand'

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Garantia y respaldo',
      description:
        'Trabajamos con productos originales y te ayudamos a validar garantia, compatibilidad y condiciones de compra.',
      color: 'text-[hsl(var(--brand-strong))]',
      bgColor: 'bg-[hsl(var(--surface-highlight))]',
    },
    {
      icon: Clock,
      title: 'Compra sin enredos',
      description:
        'Te atendemos por WhatsApp para cotizar, resolver dudas y confirmar lo que realmente te sirve.',
      color: 'text-sky-700',
      bgColor: 'bg-sky-50',
    },
    {
      icon: Award,
      title: 'Asesoria util',
      description:
        'En varias referencias te orientamos con instalacion, uso basico y recomendaciones segun tu necesidad.',
      color: 'text-cyan-700',
      bgColor: 'bg-cyan-50',
    },
  ]

  return (
    <section className="bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))] py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-[hsl(var(--foreground))] md:text-4xl mb-4">
            ¿Por qué elegir {brand.name}?
          </h2>
          <p className="text-xl text-[hsl(var(--text-muted))] max-w-3xl mx-auto">
            No somos un marketplace gigante. Somos un equipo pequeño con respaldo local, atención
            directa y productos que conocemos bien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-[transform,box-shadow] duration-[220ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 border border-gray-100"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-xl mb-4 transition-transform duration-[220ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.08]`}
                >
                  <IconComponent className={`w-6 h-6 ${feature.color}`} />
                </div>

                <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-1.5 group-hover:text-[hsl(var(--brand-strong))] transition-colors duration-[160ms]">
                  {feature.title}
                </h3>

                <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-10 rounded-xl bg-gradient-to-r from-[hsl(var(--brand-strong))] to-[hsl(var(--brand))] p-4 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">150+</div>
              <div className="text-sky-100 text-xs">Pedidos despachados</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">120+</div>
              <div className="text-sky-100 text-xs">Clientes con compra confirmada</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">5+</div>
              <div className="text-sky-100 text-xs">Marcas con respaldo</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">98%</div>
              <div className="text-sky-100 text-xs">Pedidos sin novedades reportadas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
