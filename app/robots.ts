import { MetadataRoute } from 'next'
import { brand } from '@/lib/brand'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/auth/',
          '/cart/',
          '/checkout/',
          '/orders/',
          '/favorites/',
          '/profile/',
        ],
      },
      // Bloquear scrapers y bots agresivos sin valor para el negocio
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot'],
        disallow: '/',
      },
    ],
    sitemap: `${brand.siteUrl}/sitemap.xml`,
  }
}
