import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { helpArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Centro de ayuda y soporte',
  description:
    'Documentación de soporte, garantías, devoluciones, envíos y pagos de CapiShop en rutas indexables.',
}

export default function HelpIndexPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="eyebrow-label">Soporte indexable</p>
          <h1 className="font-display mt-2 text-4xl font-semibold text-[hsl(var(--foreground))]">
            Centro de ayuda de CapiShop
          </h1>
          <p className="mt-4 text-lg text-[hsl(var(--text-muted))]">
            Documentación separada por tema para resolver objeciones comerciales y dudas operativas con URLs reales.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {helpArticles.map(article => (
            <article key={article.slug} className="section-shell p-6">
              <p className="eyebrow-label">{article.category}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[hsl(var(--foreground))]">
                {article.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[hsl(var(--text-muted))]">
                {article.description}
              </p>
              <Link
                href={`/help/${article.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--brand-strong))]"
              >
                Ver artículo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
