import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { blogPosts } from '@/lib/content'
import Link from 'next/link'
import { ArrowRight, Calendar, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog de tecnología, seguridad y conectividad',
  description:
    'Guías de compra, comparativas y contenido técnico de CapiShop para seguridad, conectividad y energía en Colombia.',
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Blog CapiShop',
  description:
    'Contenido editorial para tecnología, seguridad, conectividad y compra asistida en Colombia.',
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="eyebrow-label">Fase 3 SEO y contenido</p>
          <h1 className="font-display mt-2 text-4xl font-semibold text-[hsl(var(--foreground))]">
            Blog y centro editorial de CapiShop
          </h1>
          <p className="mt-4 text-lg text-[hsl(var(--text-muted))]">
            Artículos orientados a intención de compra, soporte preventivo y decisión técnica con contexto local.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map(post => (
            <article key={post.slug} className="section-shell overflow-hidden">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-56 overflow-hidden bg-[hsl(var(--surface-muted))]">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                </div>
              </Link>
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[hsl(var(--text-muted))]">
                  <span className="rounded-full bg-[hsl(var(--surface-highlight))] px-3 py-1 text-[hsl(var(--brand-strong))]">
                    {post.pillar}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.date}
                  </span>
                </div>
                <Link href={`/blog/${post.slug}`} className="block">
                  <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{post.title}</h2>
                </Link>
                <p className="text-sm leading-6 text-[hsl(var(--text-muted))]">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--brand-strong))]"
                >
                  Leer artículo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
