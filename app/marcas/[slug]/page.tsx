import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ProductCard } from '@/components/products/ProductCard'
import { getActiveBrands, getProductsByBrandSlug } from '@/lib/storefront'

export async function generateStaticParams() {
  const brands = await getActiveBrands()
  return brands.map(brand => ({ slug: brand.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const data = await getProductsByBrandSlug(params.slug)
  if (!data) return { title: 'Marca no encontrada' }

  return {
    title: `${data.brand.name} en CapiShop`,
    description: `Productos ${data.brand.name} con inventario activo y soporte local en Colombia.`,
    alternates: { canonical: `/marcas/${data.brand.slug}` },
  }
}

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const data = await getProductsByBrandSlug(params.slug)
  if (!data) notFound()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-[hsl(var(--text-muted))]">
          <Link href="/">Inicio</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[hsl(var(--foreground))]">{data.brand.name}</span>
        </nav>

        <header className="section-shell mb-8 p-6 md:p-8">
          <p className="eyebrow-label">Landing indexable de marca</p>
          <h1 className="font-display mt-2 text-4xl font-semibold text-[hsl(var(--foreground))]">
            {data.brand.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-[hsl(var(--text-muted))]">
            Inventario curado de {data.brand.name} para compra con menor riesgo, mejor contexto y acompañamiento local.
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
