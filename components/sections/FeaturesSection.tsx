import { Shield, Layers2, Award } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Productos que se instalan solos',
      description:
        'Todo lo que vendemos lo puedes configurar tú mismo desde el celular. Sin técnico, sin cables difíciles, sin llamadas de soporte interminables.',
      color: 'text-[hsl(var(--brand-strong))]',
      bgColor: 'bg-[hsl(var(--surface-highlight))]',
    },
    {
      icon: Layers2,
      title: 'Todo funciona junto',
      description:
        'Cámaras, timbres, cerraduras y routers que hemos verificado que son compatibles entre sí. Compras una vez y armas tu sistema completo.',
      color: 'text-sky-700',
      bgColor: 'bg-sky-50',
    },
    {
      icon: Award,
      title: 'Asesoría real por WhatsApp',
      description:
        'Si tienes dudas antes de comprar o al instalar, te respondemos nosotros, no un bot. Con contexto de tu caso, no respuestas genéricas.',
      color: 'text-cyan-700',
      bgColor: 'bg-cyan-50',
    },
  ]

  return (
    <section className="bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))] py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-[hsl(var(--foreground))] md:text-4xl mb-4">
            Smart home sin complicaciones
          </h2>
          <p className="text-xl text-[hsl(var(--text-muted))] max-w-3xl mx-auto">
            No vendemos de todo. Vendemos lo que funciona, lo que se instala fácil y lo que tiene
            soporte real si algo no queda claro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-[transform,box-shadow,border-color] duration-[220ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--brand))] overflow-hidden"
              >
                <div
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[hsl(var(--brand-strong))] to-[hsl(var(--brand))] opacity-0 group-hover:opacity-100 transition-opacity duration-[220ms]"
                  aria-hidden="true"
                />
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-xl mb-5 transition-transform duration-[220ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]`}
                >
                  <IconComponent className={`w-6 h-6 ${feature.color}`} />
                </div>

                <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-2 group-hover:text-[hsl(var(--brand-strong))] transition-colors duration-[160ms]">
                  {feature.title}
                </h3>

                <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-[hsl(var(--brand-strong))] to-[hsl(var(--brand))] px-6 py-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '150+', label: 'Pedidos despachados' },
              { value: '120+', label: 'Clientes con compra confirmada' },
              { value: '5+', label: 'Marcas con respaldo' },
              { value: '98%', label: 'Pedidos sin novedades' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-3xl font-bold md:text-4xl">{value}</div>
                <div className="mt-1.5 text-xs text-sky-100 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
