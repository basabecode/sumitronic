import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { BRAND_PROFILES } from '@/lib/brands'
import { brand as storeBrand } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Marcas — ${storeBrand.name}`,
  description: `Distribuidores autorizados de Dahua, Imou, Logitech, Forza, TP-Link y Mercusys en Cali, Colombia. Seguridad, redes, energia y accesorios con soporte local.`,
  alternates: { canonical: '/marcas' },
  openGraph: {
    title: `Marcas en ${storeBrand.name}`,
    description: 'Portafolio de marcas con respaldo local en Cali, Colombia.',
    type: 'website',
    locale: 'es_CO',
    siteName: storeBrand.name,
  },
}

export default function MarcasPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero */}
        <section className="border-b border-[hsl(var(--border-subtle))] bg-gradient-to-b from-[hsl(var(--surface-highlight))]/40 to-white pb-12 pt-8 md:pb-14 md:pt-12">
          <div className="container">
            <nav
              aria-label="Ruta de navegacion"
              className="mb-8 flex items-center gap-1.5 text-sm text-[hsl(var(--text-muted))]"
            >
              <Link href="/" className="transition-colors hover:text-[hsl(var(--foreground))]">Inicio</Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="font-medium text-[hsl(var(--foreground))]">Marcas</span>
            </nav>

            <p className="eyebrow-label">Portafolio de marcas</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[hsl(var(--foreground))] md:text-5xl">
              Marcas que distribuimos
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[hsl(var(--text-muted))] md:text-lg">
              Distribuidores con respaldo local en Cali. Seguridad electronica, redes, energia y accesorios con soporte pre y post venta.
            </p>
          </div>
        </section>

        {/* Grid de marcas */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {BRAND_PROFILES.map(brand => (
                <Link
                  key={brand.slug}
                  href={`/marcas/${brand.slug}`}
                  className="section-shell group flex flex-col gap-5 p-6 transition-shadow hover:shadow-md"
                >
                  {/* Logo */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative h-12 w-36">
                      <Image
                        src={brand.logo}
                        alt={`Logo ${brand.name}`}
                        fill
                        className="object-contain object-left"
                        sizes="144px"
                      />
                    </div>
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${brand.accentClass}`}>
                      {brand.category}
                    </span>
                  </div>

                  {/* Resumen */}
                  <p className="flex-1 text-sm leading-6 text-[hsl(var(--text-muted))]">
                    {brand.summary}
                  </p>

                  {/* Casos de uso */}
                  <div className="flex flex-wrap gap-1.5">
                    {brand.useCases.map(uc => (
                      <span
                        key={uc}
                        className="rounded-full border border-[hsl(var(--border-subtle))] bg-white px-2.5 py-1 text-xs text-[hsl(var(--text-muted))]"
                      >
                        {uc}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--brand-strong))] transition-opacity group-hover:opacity-80">
                    Ver productos {brand.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
