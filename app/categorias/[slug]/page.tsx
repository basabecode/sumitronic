import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ProductCard } from '@/components/products/ProductCard'
import { getActiveCategories, getProductsByCategorySlug } from '@/lib/storefront'

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

  return {
    title: `${data.category.name} en Colombia`,
    description: `Explora ${data.category.name} con inventario, soporte y compra asistida en CapiShop Colombia.`,
    alternates: { canonical: `/categorias/${data.category.slug}` },
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const data = await getProductsByCategorySlug(params.slug)
  if (!data) notFound()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-[hsl(var(--text-muted))]">
          <Link href="/">Inicio</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[hsl(var(--foreground))]">{data.category.name}</span>
        </nav>

        <header className="section-shell mb-8 overflow-hidden p-6 md:p-8">
          <p className="eyebrow-label">Landing indexable de categoría</p>
          <h1 className="font-display mt-2 text-4xl font-semibold text-[hsl(var(--foreground))]">
            {data.category.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-[hsl(var(--text-muted))]">
            Selección curada de {data.category.name.toLowerCase()} con inventario activo, soporte comercial y despacho nacional.
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
