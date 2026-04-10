import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ProductCard } from '@/components/products/ProductCard'
import { getProductsByBrandSlug } from '@/lib/storefront'
import { getBrandBySlug, BRAND_PROFILES } from '@/lib/brands'
import { brand as storeBrand } from '@/lib/brand'

// Siempre server-render: productos frescos desde la DB en cada visita
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const profile = getBrandBySlug(params.slug)
  const brandName = profile?.name ?? params.slug

  const title = `${brandName} en ${storeBrand.name} — Distribuidor en Cali, Colombia`
  const description =
    profile?.seoDescription ??
    `Productos ${brandName} con inventario activo, soporte tecnico local y envio a todo Colombia desde Cali. Compra en ${storeBrand.name}.`

  return {
    title,
    description,
    keywords: profile?.seoKeywords?.join(', '),
    alternates: { canonical: `/marcas/${params.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'es_CO',
      siteName: storeBrand.name,
    },
  }
}

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const profile = getBrandBySlug(params.slug)
  const data = await getProductsByBrandSlug(params.slug)

  // Si no hay perfil estático ni productos en DB → 404
  if (!profile && !data) notFound()

  const brandName = profile?.name ?? data?.brand.name ?? params.slug
  const products = data?.products ?? []

  // JSON-LD para Google Search Console
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${brandName} — ${storeBrand.name}`,
    description: profile?.seoDescription ?? `Productos ${brandName} en ${storeBrand.name}`,
    url: `${storeBrand.siteUrl}/marcas/${params.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: storeBrand.siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Marcas', item: `${storeBrand.siteUrl}/marcas` },
        {
          '@type': 'ListItem',
          position: 3,
          name: brandName,
          item: `${storeBrand.siteUrl}/marcas/${params.slug}`,
        },
      ],
    },
    ...(products.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: products.slice(0, 10).map((p: any, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            description: p.description,
            brand: { '@type': 'Brand', name: brandName },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'COP',
              price: p.price,
              availability:
                p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: storeBrand.organizationName },
            },
          },
        })),
      },
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen">
        <Header />

        <main>
          {/* ── Hero de marca ── */}
          <section className="border-b border-[hsl(var(--border-subtle))] bg-gradient-to-b from-[hsl(var(--surface-highlight))]/40 to-white pb-12 pt-8 md:pb-16 md:pt-12">
            <div className="container">
              {/* Breadcrumb */}
              <nav
                aria-label="Ruta de navegacion"
                className="mb-8 flex items-center gap-1.5 text-sm text-[hsl(var(--text-muted))]"
              >
                <Link href="/" className="transition-colors hover:text-[hsl(var(--foreground))]">
                  Inicio
                </Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                <Link
                  href="/marcas"
                  className="transition-colors hover:text-[hsl(var(--foreground))]"
                >
                  Marcas
                </Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                <span className="font-medium text-[hsl(var(--foreground))]">{brandName}</span>
              </nav>

              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start md:gap-12">
                <div>
                  {profile && (
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${profile.accentClass}`}
                    >
                      {profile.category}
                    </span>
                  )}

                  <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[hsl(var(--foreground))] md:text-5xl">
                    {brandName}
                    <span className="block text-lg font-normal text-[hsl(var(--text-muted))] md:text-xl">
                      en {storeBrand.name}
                    </span>
                  </h1>

                  {profile && (
                    <p className="mt-5 max-w-2xl text-base leading-7 text-[hsl(var(--text-muted))] md:text-lg md:leading-8">
                      {profile.seoDescription}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="#productos"
                      className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[hsl(var(--brand-strong))]"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Ver productos disponibles
                    </Link>
                    <a
                      href={`https://wa.me/${storeBrand.whatsappNumber}?text=${encodeURIComponent(`Hola, quiero informacion sobre productos ${brandName} que tienen en SUMITRONIC`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border-subtle))] bg-white px-5 py-2.5 text-sm font-semibold text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--border-strong))]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-emerald-600"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Preguntar por WhatsApp
                    </a>
                  </div>
                </div>

                {/* Logo de la marca */}
                {profile && (
                  <div className="flex shrink-0 items-center justify-center rounded-3xl border border-[hsl(var(--border-subtle))] bg-white p-6 shadow-sm md:h-36 md:w-56">
                    <div className="relative h-20 w-40">
                      <Image
                        src={profile.logo}
                        alt={`Logo oficial ${brandName}`}
                        fill
                        className="object-contain"
                        sizes="160px"
                        priority
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Perfil de la marca ── */}
          {profile && (
            <section className="border-b border-[hsl(var(--border-subtle))] py-12 md:py-14">
              <div className="container">
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Donde mejor encaja */}
                  <div className="section-shell p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-strong))]">
                      Donde mejor encaja
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[hsl(var(--text-muted))]">
                      {profile.salesAngle}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.useCases.map(uc => (
                        <span
                          key={uc}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border-subtle))] bg-white px-3 py-1 text-xs text-[hsl(var(--text-muted))]"
                        >
                          <CheckCircle2 className="h-3 w-3 text-[hsl(var(--brand-strong))]" />
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Linea de productos */}
                  <div className="section-shell p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--foreground))]">
                      {profile.lineupTitle}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[hsl(var(--text-muted))]">
                      {profile.lineupCopy}
                    </p>
                  </div>

                  {/* Por que comprar aqui */}
                  <div className="section-shell bg-[hsl(var(--surface-highlight))]/60 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-strong))]">
                      Por que comprar en {storeBrand.name}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {[
                        'Distribuidores con respaldo local en Cali',
                        'Soporte tecnico pre y post venta',
                        'Envio a todo Colombia',
                        'Garantia de fabrica vigente',
                        'Atencion por WhatsApp',
                      ].map(item => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-[hsl(var(--text-muted))]"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--brand-strong))]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── Catalogo de productos ── */}
          <section id="productos" className="py-12 md:py-16">
            <div className="container">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow-label">Catalogo {storeBrand.name}</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-[hsl(var(--foreground))] md:text-3xl">
                    Productos {brandName} disponibles
                  </h2>
                  {products.length > 0 && (
                    <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
                      {products.length} {products.length === 1 ? 'referencia' : 'referencias'} en
                      inventario
                    </p>
                  )}
                </div>

                <Link
                  href={`/products?brand=${encodeURIComponent(brandName)}`}
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[hsl(var(--brand-strong))] transition-opacity hover:opacity-80"
                >
                  Ver todo el catalogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {products.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="section-shell flex flex-col items-center gap-4 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--surface-highlight))]">
                    <ShoppingBag className="h-7 w-7 text-[hsl(var(--brand-strong))]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[hsl(var(--foreground))]">
                      Catalogo en actualizacion
                    </p>
                    <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
                      Estamos cargando los productos {brandName}. Escríbenos para saber que hay
                      disponible.
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${storeBrand.whatsappNumber}?text=${encodeURIComponent(`Hola, quiero saber que productos ${brandName} tienen disponibles en SUMITRONIC`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Consultar disponibilidad
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* ── CTA final ── */}
          <section className="border-t border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-highlight))]/40 py-12 md:py-14">
            <div className="container">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-display text-2xl font-semibold text-[hsl(var(--foreground))] md:text-3xl">
                  ¿Necesitas una cotizacion o tienes dudas tecnicas?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-base text-[hsl(var(--text-muted))]">
                  Nuestro equipo en Cali puede orientarte sobre que referencia de {brandName} se
                  adapta mejor a tu proyecto o presupuesto.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href={`https://wa.me/${storeBrand.whatsappNumber}?text=${encodeURIComponent(`Hola, necesito ayuda con productos ${brandName} en SUMITRONIC`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Chatear por WhatsApp
                  </a>
                  <Link
                    href="/contacto"
                    className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border-subtle))] bg-white px-6 py-3 text-sm font-semibold text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--border-strong))]"
                  >
                    Otros medios de contacto
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
