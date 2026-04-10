import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { blogPosts } from '@/lib/content'

export default function BlogSection() {
  return (
    <section id="blog" className="py-16">
      <div className="container">
        <div className="mb-12 flex flex-col gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="eyebrow-label">Guias de compra</p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[hsl(var(--foreground))] md:text-4xl">
              Guías y comparativas para comprar mejor
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-[hsl(var(--text-muted))]">
              Compartimos contenido util para comparar referencias, entender diferencias y tomar
              mejores decisiones de compra en Colombia.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href="/blog">Ver todos los artículos</Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map(post => (
            <article key={post.slug} className="section-shell flex h-full flex-col overflow-hidden">
              <Link href={`/blog/${post.slug}`} className="block shrink-0">
                <div className="relative aspect-[16/10] overflow-hidden bg-[hsl(var(--surface-muted))]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-[hsl(var(--brand))] px-3 py-1 text-xs font-semibold text-white">
                      {post.category}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="flex flex-1 flex-col space-y-4 p-5">
                <div className="flex items-center gap-4 text-xs text-[hsl(var(--text-muted))]">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.date}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                    {post.title}
                  </h3>
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
      </div>
    </section>
  )
}
