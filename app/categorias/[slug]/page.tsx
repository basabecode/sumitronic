import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ProductCard } from '@/components/products/ProductCard'
import { getActiveCategories, getProductsByCategorySlug } from '@/lib/storefront'
import { brand } from '@/lib/brand'

export async function generateStaticParams() {
  const categories = await getActiveCategories()
  return categories.map(category => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const data = await getProductsByCategorySlug(params.slug)
  if (!data) return { title: 'Categoría no encontrada' }

  const title = `${data.category.name} en Colombia — ${brand.name}`
  const description = `Compra ${data.category.name} con inventario activo, soporte técnico local y envío a todo Colombia. ${data.products.length > 0 ? `${data.products.length} referencias disponibles en ${brand.name}.` : `Disponible en ${brand.name}.`}`

  return {
    title,
    description,
    alternates: { canonical: `/categorias/${data.category.slug}` },
    openGraph: {
      title,
      description,
      url: `${brand.siteUrl}/categorias/${data.category.slug}`,
      siteName: brand.organizationName,
      locale: 'es_CO',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${data.category.name} — ${brand.name}`,
        },
      ],
    },
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const data = await getProductsByCategorySlug(params.slug)
  if (!data) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${data.category.name} — ${brand.name}`,
    description: `Compra ${data.category.name} con inventario activo y envío a todo Colombia desde ${brand.name}, Cali.`,
    url: `${brand.siteUrl}/categorias/${data.category.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: brand.siteUrl },
        {
          '@type': 'ListItem',
          position: 2,
          name: data.category.name,
          item: `${brand.siteUrl}/categorias/${data.category.slug}`,
        },
      ],
    },
    ...(data.products.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: data.products.length,
        itemListElement: data.products.slice(0, 10).map((p: any, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            description: p.description,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'COP',
              price: p.price,
              availability:
                (p.stock_quantity ?? p.stock ?? 0) > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: brand.organizationName },
            },
          },
        })),
      },
    }),
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav
          aria-label="Ruta de navegacion"
          className="mb-8 flex items-center gap-2 text-sm text-[hsl(var(--text-muted))]"
        >
          <Link href="/" className="transition-colors hover:text-[hsl(var(--foreground))]">
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-[hsl(var(--foreground))]">{data.category.name}</span>
        </nav>

        <header className="section-shell mb-8 overflow-hidden p-6 md:p-8">
          <p className="eyebrow-label">Categoría</p>
          <h1 className="font-display mt-2 text-4xl font-semibold text-[hsl(var(--foreground))]">
            {data.category.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-[hsl(var(--text-muted))]">
            {data.products.length > 0
              ? `${data.products.length} referencias con inventario activo, soporte técnico local y despacho a todo Colombia.`
              : `Catálogo en actualización. Escríbenos para saber qué hay disponible.`}
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {data.products.map(product => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}
