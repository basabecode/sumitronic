import { MetadataRoute } from 'next'
import { blogPosts, helpArticles } from '@/lib/content'
import { BRAND_PROFILES } from '@/lib/brands'
import { getActiveCategories } from '@/lib/storefront'
import { createClient } from '@/lib/supabase/server'
import { brand } from '@/lib/brand'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = brand.siteUrl
  const supabase = createClient()

  // Productos activos
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('active', true)

  const productUrls =
    products?.map(product => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })) ?? []

  // Categorías desde DB
  const categories = await getActiveCategories()
  const categoryUrls = categories.map(category => ({
    url: `${baseUrl}/categorias/${category.slug}`,
    lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  // Marcas desde perfiles estáticos (fuente de verdad)
  const brandUrls = BRAND_PROFILES.map(b => ({
    url: `${baseUrl}/marcas/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  // Blog
  const blogUrls = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.72,
  }))

  // Centro de ayuda
  const helpUrls = helpArticles.map(article => ({
    url: `${baseUrl}/help/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.68,
  }))

  return [
    // Páginas estáticas principales
    { url: baseUrl,                      lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0  },
    { url: `${baseUrl}/products`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9  },
    { url: `${baseUrl}/ofertas`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.88 },
    { url: `${baseUrl}/blog`,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.82 },
    { url: `${baseUrl}/contacto`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },
    { url: `${baseUrl}/help`,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.78 },
    { url: `${baseUrl}/marcas`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.78 },
    { url: `${baseUrl}/nosotros`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    // Dinámicas
    ...categoryUrls,
    ...brandUrls,
    ...blogUrls,
    ...helpUrls,
    ...productUrls,
  ]
}
