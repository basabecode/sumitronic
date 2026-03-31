import {
  Shield,
  Headphones,
  CreditCard,
  Clock,
  Award,
  Mail,
} from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Garantía de 12 Meses',
      description: 'Múltiples métodos de pago para mayor facilidad',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Clock,
      title: 'Configuración Rápida',
      description: 'Algunos Productos con Video tutoriales para la Configuración',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Award,
      title: 'Productos Originales',
      description: '100% originales con certificación oficial',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir CapiShoping?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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

                <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">150+</div>
              <div className="text-orange-100 text-xs">Productos Vendidos</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">120+</div>
              <div className="text-orange-100 text-xs">
                Clientes Satisfechos
              </div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">5+</div>
              <div className="text-orange-100 text-xs">Marcas Oficiales</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold mb-1">98%</div>
              <div className="text-orange-100 text-xs">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
