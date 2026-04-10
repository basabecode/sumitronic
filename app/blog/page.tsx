import type { Metadata } from 'next'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { blogPosts } from '@/lib/content'
import { brand } from '@/lib/brand'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog — Guías de compra y consejos técnicos',
  description: `Aprende a elegir cámaras, routers, UPS y repuestos para TV con guías prácticas del equipo de ${brand.name}. Comparativas, consejos de instalación y ayuda para comprar bien en Colombia.`,
  keywords: [
    'guias de compra seguridad electronica',
    'como elegir camara seguridad',
    'ups para hogar colombia',
    'blog tecnologia cali',
    'consejos compra router wifi',
  ],
  alternates: { canonical: '/blog' },
  openGraph: {
    title: `Blog de ${brand.name} — Guías y consejos técnicos`,
    description: `Guías prácticas para elegir cámaras, routers, UPS y repuestos. Escrito por el equipo de ${brand.name} en Cali.`,
    url: `${brand.siteUrl}/blog`,
    siteName: brand.organizationName,
    locale: 'es_CO',
    type: 'website',
  },
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: `Blog de ${brand.name}`,
  description:
    'Guías de compra, comparativas y consejos técnicos para seguridad electrónica, conectividad y energía en Colombia.',
  url: `${brand.siteUrl}/blog`,
  publisher: {
    '@type': 'Organization',
    name: brand.organizationName,
    url: brand.siteUrl,
  },
}

// Derivado de datos estáticos — computado una vez fuera del componente
const categories = [...new Set(blogPosts.map(p => p.category))]

export default function BlogIndexPage() {
  const featuredPost = blogPosts[0]
  const restPosts = blogPosts.slice(1)

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <Header />

      <main>
        {/* Hero del blog */}
        <section className="bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="eyebrow-label">Guías y consejos</p>
              <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-[hsl(var(--foreground))] md:text-5xl">
                Aprende a comprar mejor
              </h1>
              <p className="mt-4 text-lg text-[hsl(var(--text-muted))]">
                Escribimos guías prácticas para que puedas comparar opciones, entender diferencias
                técnicas y tomar una decisión de compra sin depender solo del vendedor. Todo con
                contexto colombiano.
              </p>
            </div>

            {/* Categorías */}
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full bg-[hsl(var(--brand))] px-4 py-1.5 text-sm font-semibold text-white">
                Todo
              </span>
              {categories.map(cat => (
                <span
                  key={cat}
                  className="rounded-full border border-[hsl(var(--border-subtle))] bg-white px-4 py-1.5 text-sm font-medium text-[hsl(var(--text-muted))] hover:border-[hsl(var(--brand))] hover:text-[hsl(var(--brand-strong))] transition-colors cursor-pointer"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Post destacado */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="eyebrow-label mb-6">Artículo destacado</p>
          <article className="group grid gap-0 overflow-hidden rounded-2xl border border-[hsl(var(--border-subtle))] bg-white shadow-sm md:grid-cols-2">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="relative block aspect-[4/3] overflow-hidden md:aspect-auto"
            >
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
              <div className="absolute left-4 top-4">
                <span className="rounded-full bg-[hsl(var(--brand))] px-3 py-1 text-xs font-semibold text-white">
                  {featuredPost.category}
                </span>
              </div>
            </Link>

            <div className="flex flex-col justify-center space-y-5 p-8">
              <p className="eyebrow-label">{featuredPost.pillar}</p>
              <Link href={`/blog/${featuredPost.slug}`}>
                <h2 className="font-display text-2xl font-semibold leading-snug text-[hsl(var(--foreground))] hover:text-[hsl(var(--brand-strong))] transition-colors md:text-3xl">
                  {featuredPost.title}
                </h2>
              </Link>
              <p className="text-base leading-7 text-[hsl(var(--text-muted))]">
                {featuredPost.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[hsl(var(--text-muted))]">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {featuredPost.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {featuredPost.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {featuredPost.readTime}
                </span>
              </div>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--brand-strong))]"
              >
                Leer artículo completo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </section>

        {/* Resto de posts */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <p className="eyebrow-label mb-6">Más artículos</p>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {restPosts.map(post => (
              <article
                key={post.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[hsl(var(--border-subtle))] bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block aspect-[16/10] shrink-0 overflow-hidden"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-[hsl(var(--brand))] px-3 py-1 text-xs font-semibold text-white">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col space-y-4 p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--text-muted))]">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="block">
                    <h2 className="text-xl font-semibold leading-snug text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--brand-strong))] transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="line-clamp-3 text-sm leading-6 text-[hsl(var(--text-muted))]">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--brand-strong))]"
                  >
                    Leer artículo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-[hsl(var(--border-subtle))] bg-gradient-to-br from-[hsl(var(--surface-highlight))] to-white py-14">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-2xl font-semibold text-[hsl(var(--foreground))] md:text-3xl">
              ¿Tiene una pregunta que no está en los artículos?
            </h2>
            <p className="mt-3 text-base text-[hsl(var(--text-muted))]">
              Escríbanos por WhatsApp y le orientamos según su caso puntual — sin costo y sin
              compromiso de compra.
            </p>
            <a
              href={`https://wa.me/${brand.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
