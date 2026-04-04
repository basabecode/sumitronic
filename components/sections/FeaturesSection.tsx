import { Shield, Clock, Award } from 'lucide-react'
import { brand } from '@/lib/brand'

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Garantía de 12 Meses',
      description: 'Múltiples métodos de pago para mayor facilidad',
      color: 'text-[hsl(var(--brand-strong))]',
      bgColor: 'bg-[hsl(var(--surface-highlight))]',
    },
    {
      icon: Clock,
      title: 'Configuración Rápida',
      description: 'Algunos Productos con Video tutoriales para la Configuración',
      color: 'text-sky-700',
      bgColor: 'bg-sky-50',
    },
    {
      icon: Award,
      title: 'Productos Originales',
      description: '100% originales con certificación oficial',
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
            Ofrecemos la mejor experiencia de compra con servicios premium que
            garantizan tu satisfacción
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-md mb-3 group-hover:scale-105 transition-transform duration-300`}
                >
                  <IconComponent className={`w-6 h-6 ${feature.color}`} />
                </div>

                <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-1 group-hover:text-[hsl(var(--brand-strong))] transition-colors">
                  {feature.title}
                </h3>

                <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed">
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
              <div className="text-sky-100 text-xs">Productos Vendidos</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">120+</div>
              <div className="text-sky-100 text-xs">
                Clientes Satisfechos
              </div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">5+</div>
              <div className="text-sky-100 text-xs">Marcas Oficiales</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">98%</div>
              <div className="text-sky-100 text-xs">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
