import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ProductsSection } from '@/components/products/ProductsSection'
import { brand } from '@/lib/brand'
import { Tag, ShieldCheck, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ofertas y descuentos — Equipos con precio rebajado',
  description: `Equipos de seguridad, conectividad y energía con descuento real en ${brand.name}. Inventario disponible, respaldo de garantía y envíos a todo Colombia.`,
  keywords: [
    'ofertas camaras seguridad colombia',
    'descuentos equipos tecnologia cali',
    'ofertas routers ups colombia',
    'equipos seguridad precio rebajado',
  ],
  alternates: { canonical: '/ofertas' },
  openGraph: {
    title: `Ofertas y descuentos — ${brand.name}`,
    description: `Equipos con precio rebajado, inventario verificado y envío nacional. Revisa las ofertas vigentes en ${brand.name}.`,
    url: `${brand.siteUrl}/ofertas`,
    siteName: brand.organizationName,
    locale: 'es_CO',
    type: 'website',
  },
}

const ofertasJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `Ofertas — ${brand.name}`,
  description:
    'Equipos de seguridad electrónica, conectividad y energía con descuento disponible para compra en Colombia.',
  url: `${brand.siteUrl}/ofertas`,
  publisher: {
    '@type': 'Organization',
    name: brand.organizationName,
    url: brand.siteUrl,
  },
}

export default function OfertasPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ofertasJsonLd) }}
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="eyebrow-label">Precios para aprovechar</p>
              <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-[hsl(var(--foreground))] md:text-5xl">
                Ofertas vigentes en {brand.name}
              </h1>
              <p className="mt-4 text-lg text-[hsl(var(--text-muted))]">
                Equipos con descuento real, inventario verificado y el mismo respaldo de garantía
                que cualquier otro producto de la tienda. Los precios están actualizados y aplican
                mientras dure el stock.
              </p>
            </div>

            {/* Garantías */}
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full border border-[hsl(var(--border-subtle))] bg-white px-4 py-2 text-sm text-[hsl(var(--foreground))]">
                <ShieldCheck className="h-4 w-4 text-[hsl(var(--brand-strong))]" />
                Garantía incluida
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[hsl(var(--border-subtle))] bg-white px-4 py-2 text-sm text-[hsl(var(--foreground))]">
                <Truck className="h-4 w-4 text-[hsl(var(--brand-strong))]" />
                Envío a todo Colombia
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[hsl(var(--border-subtle))] bg-white px-4 py-2 text-sm text-[hsl(var(--foreground))]">
                <Tag className="h-4 w-4 text-[hsl(var(--brand-strong))]" />
                Descuentos sobre precio regular
              </div>
            </div>
          </div>
        </section>

        {/* Grilla con filtros */}
        <ProductsSection onOffer={true} />

        {/* CTA */}
        <section className="border-t border-[hsl(var(--border-subtle))] bg-white py-14">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-2xl font-semibold text-[hsl(var(--foreground))] md:text-3xl">
              ¿No encuentra lo que busca entre las ofertas?
            </h2>
            <p className="mt-3 text-base text-[hsl(var(--text-muted))]">
              Escríbanos por WhatsApp con el equipo que necesita. En muchos casos podemos revisar
              disponibilidad o condiciones especiales para pedidos puntuales.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${brand.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Consultar disponibilidad
              </a>
              <a
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--brand))] px-6 py-3 text-sm font-semibold text-[hsl(var(--brand-strong))] transition-colors hover:bg-[hsl(var(--surface-highlight))]"
              >
                Ver catálogo completo
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
