import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { blogPosts, getBlogPostBySlug } from '@/lib/content'

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug)
  if (!post) return { title: 'Artículo no encontrado' }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, alt: post.title }],
      type: 'article',
      locale: 'es_CO',
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    image: [post.image],
    publisher: {
      '@type': 'Organization',
      name: 'CapiShop Colombia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://capishop-web.vercel.app/favicon.png',
      },
    },
    mainEntityOfPage: `https://capishop-web.vercel.app/blog/${post.slug}`,
  }

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-[hsl(var(--text-muted))]">
          <Link href="/">Inicio</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog">Blog</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[hsl(var(--foreground))]">{post.title}</span>
        </nav>

        <article className="section-shell overflow-hidden">
          <div className="h-72 bg-[hsl(var(--surface-muted))] md:h-96">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>
          <div className="space-y-8 p-6 md:p-8">
            <header className="space-y-4">
              <p className="eyebrow-label">{post.pillar}</p>
              <h1 className="font-display text-4xl font-semibold text-[hsl(var(--foreground))]">
                {post.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-[hsl(var(--text-muted))]">
                <span>{post.author}</span>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <p className="text-lg leading-7 text-[hsl(var(--text-muted))]">{post.excerpt}</p>
            </header>

            <div className="space-y-5 text-base leading-8 text-[hsl(var(--foreground))]">
              {post.content.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {post.faq && post.faq.length > 0 && (
              <section className="space-y-4 border-t border-[hsl(var(--border-subtle))] pt-8">
                <p className="eyebrow-label">FAQ editorial</p>
                {post.faq.map(item => (
                  <div key={item.question} className="rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
                    <h2 className="text-lg font-medium text-[hsl(var(--foreground))]">{item.question}</h2>
                    <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">{item.answer}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
