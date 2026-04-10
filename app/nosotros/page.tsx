import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { brand } from '@/lib/brand'
import { Shield, Users, MapPin, Truck, Headphones, Award } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre nosotros — Quiénes somos y qué vendemos',
  description: `${brand.name} es una tienda en Cali especializada en cámaras de seguridad, redes, UPS y repuestos para TV. Atención directa, marcas con respaldo y envíos a toda Colombia.`,
  keywords: [
    'sumitronic quienes somos',
    'tienda seguridad electronica cali',
    'venta camaras hikvision dahua colombia',
    'repuestos tv cali colombia',
    'sobre sumitronic',
  ],
  alternates: { canonical: '/nosotros' },
  openGraph: {
    title: `Sobre nosotros — ${brand.name}`,
    description: `Tienda en Cali especializada en seguridad electrónica, conectividad y repuestos con atención cercana y envíos a toda Colombia.`,
    url: `${brand.siteUrl}/nosotros`,
    siteName: brand.organizationName,
    locale: 'es_CO',
    type: 'website',
  },
}

const nosotrosJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: brand.organizationName,
  url: brand.siteUrl,
  logo: brand.logoUrl,
  description:
    'Tienda especializada en seguridad electrónica, conectividad, energía y repuestos tecnológicos con sede en Cali, Colombia.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: brand.address.street,
    addressLocality: brand.address.city,
    addressRegion: brand.address.region,
    postalCode: brand.address.postalCode,
    addressCountry: brand.address.country,
  },
  telephone: `+57${brand.whatsappClean}`,
  email: brand.supportEmail,
  areaServed: 'CO',
  knowsAbout: [
    'Seguridad electrónica',
    'Cámaras de seguridad',
    'Sistemas de vigilancia',
    'Redes WiFi',
    'Respaldo eléctrico UPS',
    'Repuestos para televisores',
  ],
  brand: [
    { '@type': 'Brand', name: 'Hikvision' },
    { '@type': 'Brand', name: 'Dahua' },
    { '@type': 'Brand', name: 'Imou' },
    { '@type': 'Brand', name: 'TP-Link' },
    { '@type': 'Brand', name: 'Forza' },
    { '@type': 'Brand', name: 'Logitech' },
  ],
}

const valores = [
  {
    icon: Shield,
    title: 'Productos con respaldo',
    description:
      'Trabajamos solo con marcas y referencias que conocemos. Antes de vender un equipo, sabemos cómo funciona, qué garantía tiene y cómo se instala.',
  },
  {
    icon: Headphones,
    title: 'Atención directa',
    description:
      'No somos un portal de miles de vendedores. Cuando escribe, habla con el mismo equipo que despacha el pedido. Eso hace la diferencia cuando hay una duda o un problema.',
  },
  {
    icon: Truck,
    title: 'Despacho a todo el país',
    description:
      'Enviamos por Interrapidísimo, Servientrega y Envía a cualquier ciudad de Colombia. Le confirmamos tiempos y le pasamos la guía.',
  },
  {
    icon: Award,
    title: 'Marcas que conocemos',
    description:
      'Hikvision, Dahua, Hanwha, Imou, TP-Link, Forza, Logitech. No vendemos lo que no podemos respaldar técnicamente.',
  },
  {
    icon: Users,
    title: 'Clientes, no transacciones',
    description:
      'La mayoría de clientes vuelven o nos refieren. Eso no pasa por accidente: pasa porque intentamos resolver bien cada caso.',
  },
  {
    icon: MapPin,
    title: 'Base en Cali',
    description:
      'Tenemos punto físico en Cali para clientes que prefieren ver el producto, recoger en tienda o coordinar soporte presencial.',
  },
]

const marcas = [
  { nombre: 'Hikvision', categoria: 'Cámaras y CCTV' },
  { nombre: 'Dahua', categoria: 'Cámaras y CCTV' },
  { nombre: 'Hanwha', categoria: 'Cámaras y CCTV' },
  { nombre: 'Imou', categoria: 'Seguridad WiFi' },
  { nombre: 'Bosch', categoria: 'Seguridad y alarmas' },
  { nombre: 'Paradox', categoria: 'Alarmas' },
  { nombre: 'TP-Link', categoria: 'Redes y WiFi' },
  { nombre: 'Forza', categoria: 'Energía y UPS' },
  { nombre: 'Logitech', categoria: 'Periféricos' },
]

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(nosotrosJsonLd) }}
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="eyebrow-label">Quiénes somos</p>
              <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-[hsl(var(--foreground))] md:text-5xl">
                Una tienda pequeña con conocimiento técnico real
              </h1>
              <p className="mt-5 text-lg leading-8 text-[hsl(var(--text-muted))]">
                {brand.name} nació en Cali como respuesta a un problema concreto: comprar equipos de
                seguridad en Colombia sin saber bien qué se está comprando. Muchos vendedores
                ofrecen mucho y explican poco. Nosotros hacemos lo contrario.
              </p>
              <p className="mt-4 text-lg leading-8 text-[hsl(var(--text-muted))]">
                Nos especializamos en seguridad electrónica, redes, respaldo eléctrico y repuestos
                para televisores. No vendemos de todo: vendemos lo que sabemos respaldar.
              </p>
            </div>
          </div>
        </section>

        {/* Qué hacemos */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <p className="eyebrow-label">Lo que hacemos</p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-[hsl(var(--foreground))]">
                Vendemos con criterio técnico
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-[hsl(var(--text-muted))]">
                <p>
                  Antes de poner un equipo en el catálogo, lo conocemos. Sabemos qué hace bien, en
                  qué falla y para qué tipo de cliente tiene sentido. Eso nos permite orientar mejor
                  cada compra.
                </p>
                <p>
                  Atendemos por WhatsApp para cotizar, resolver dudas técnicas y confirmar
                  disponibilidad. No tenemos bots: cuando escribe, le responde una persona del
                  equipo.
                </p>
                <p>
                  Despachamos a toda Colombia. Para clientes en Cali, también ofrecemos recogida en
                  tienda y, en algunos casos, orientación técnica presencial.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[hsl(var(--brand-strong))]"
                >
                  Ver catálogo
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--brand))] px-5 py-2.5 text-sm font-semibold text-[hsl(var(--brand-strong))] transition-colors hover:bg-[hsl(var(--surface-highlight))]"
                >
                  Escribanos
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { valor: '150+', label: 'Pedidos despachados' },
                { valor: '120+', label: 'Clientes con compra confirmada' },
                { valor: '9+', label: 'Marcas con respaldo técnico' },
                { valor: 'Cali', label: 'Sede con punto físico' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-6 shadow-sm text-center"
                >
                  <p className="font-display text-3xl font-bold text-[hsl(var(--brand-strong))]">
                    {stat.valor}
                  </p>
                  <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="bg-gradient-to-br from-[hsl(var(--surface-highlight))] to-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="eyebrow-label">Cómo trabajamos</p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-[hsl(var(--foreground))]">
                Lo que nos diferencia en la práctica
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {valores.map(valor => {
                const Icon = valor.icon
                return (
                  <div
                    key={valor.title}
                    className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--surface-highlight))]">
                      <Icon className="h-5 w-5 text-[hsl(var(--brand-strong))]" />
                    </div>
                    <h3 className="mb-2 font-semibold text-[hsl(var(--foreground))]">
                      {valor.title}
                    </h3>
                    <p className="text-sm leading-6 text-[hsl(var(--text-muted))]">
                      {valor.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Marcas */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="eyebrow-label">Marcas que manejamos</p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-[hsl(var(--foreground))]">
              Solo marcas que podemos respaldar
            </h2>
            <p className="mt-3 text-base text-[hsl(var(--text-muted))]">
              No tenemos un catálogo de miles de referencias genéricas. Trabajamos con marcas
              reconocidas y sabemos cómo funciona cada una.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {marcas.map(marca => (
              <div
                key={marca.nombre}
                className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-5 text-center shadow-sm"
              >
                <p className="font-semibold text-[hsl(var(--foreground))]">{marca.nombre}</p>
                <p className="mt-1 text-xs text-[hsl(var(--text-muted))]">{marca.categoria}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[hsl(var(--border-subtle))] bg-gradient-to-r from-[hsl(var(--brand-strong))] to-[hsl(var(--brand))] py-14">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">
              ¿Tiene un proyecto o necesidad de seguridad?
            </h2>
            <p className="mt-3 text-base text-sky-100">
              Cuéntenos qué necesita. Le ayudamos a elegir la solución correcta sin necesidad de
              comprar más de lo que su caso requiere.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${brand.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[hsl(var(--brand-strong))] transition-colors hover:bg-sky-50"
              >
                Consultar por WhatsApp
              </a>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-xl border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Formulario de contacto
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
