import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getHelpArticleBySlug, helpArticles } from '@/lib/content'

export async function generateStaticParams() {
  return helpArticles.map(article => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const article = getHelpArticleBySlug(params.slug)
  if (!article) return { title: 'Documento no encontrado' }

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/help/${article.slug}` },
  }
}

export default function HelpArticlePage({ params }: { params: { slug: string } }) {
  const article = getHelpArticleBySlug(params.slug)
  if (!article) notFound()

  const faqJsonLd = article.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null

  return (
    <div className="min-h-screen">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-[hsl(var(--text-muted))]">
          <Link href="/">Inicio</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/help">Ayuda</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[hsl(var(--foreground))]">{article.title}</span>
        </nav>

        <article className="section-shell p-6 md:p-8">
          <header className="mb-8 space-y-4">
            <p className="eyebrow-label">{article.category}</p>
            <h1 className="font-display text-4xl font-semibold text-[hsl(var(--foreground))]">
              {article.title}
            </h1>
            <p className="text-lg leading-7 text-[hsl(var(--text-muted))]">{article.description}</p>
          </header>

          <div className="space-y-8">
            {article.sections.map(section => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-[hsl(var(--foreground))]">
                  {section.body.map(paragraph => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {article.faq && article.faq.length > 0 && (
            <section className="mt-10 border-t border-[hsl(var(--border-subtle))] pt-8">
              <p className="eyebrow-label">Preguntas frecuentes</p>
              <div className="mt-4 space-y-4">
                {article.faq.map(item => (
                  <div key={item.question} className="rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
                    <h2 className="text-lg font-medium text-[hsl(var(--foreground))]">{item.question}</h2>
                    <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}
