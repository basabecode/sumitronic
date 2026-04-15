import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { SharedDataProvider } from '@/contexts/SharedDataContext'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { Toaster } from 'sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CartSidebar from '@/components/cart/CartSidebar'
import FavoritesSidebar from '@/components/cart/FavoritesSidebar'
import { brand } from '@/lib/brand'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Permitir zoom para accesibilidad
  userScalable: true,
  themeColor: '#00A3BF',
}

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: `${brand.organizationName} - Seguridad electronica, conectividad y repuestos`,
    template: `%s | ${brand.organizationName}`,
  },
  description:
    'Cámaras de seguridad, routers, UPS y repuestos para televisores con atención directa desde Cali y envíos a todo Colombia. Marcas Hikvision, Dahua, TP-Link, Forza e Imou.',
  keywords:
    'seguridad electronica colombia, tarjetas para televisores, repuestos tv, camaras de seguridad, redes, sumitronic',
  authors: [{ name: brand.organizationName }],
  creator: brand.organizationName,
  publisher: brand.organizationName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  openGraph: {
    title: `${brand.organizationName} - Seguridad electronica y repuestos`,
    description:
      'Cámaras, routers, UPS y repuestos para TV con atención en Cali y despacho nacional. Hikvision, Dahua, TP-Link, Forza, Imou.',
    url: brand.siteUrl,
    siteName: brand.organizationName,
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${brand.organizationName} - Seguridad electronica y repuestos`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brand.organizationName} - Seguridad electronica y repuestos`,
    description:
      'Cámaras, redes, energía y repuestos para TV con respaldo en Cali. Envíos a todo Colombia.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: googleSiteVerification
    ? {
        google: googleSiteVerification,
      }
    : undefined,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ElectronicsStore',
  name: brand.organizationName,
  alternateName: brand.name,
  url: brand.siteUrl,
  logo: brand.logoUrl,
  image: `${brand.siteUrl}/og-image.png`,
  description: brand.tagline,
  priceRange: '$$',
  currenciesAccepted: 'COP',
  paymentAccepted: 'Cash, Credit Card, Bank Transfer',
  address: {
    '@type': 'PostalAddress',
    streetAddress: brand.address.street,
    addressLocality: brand.address.city,
    addressRegion: brand.address.region,
    postalCode: brand.address.postalCode,
    addressCountry: brand.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 3.4516,
    longitude: -76.5319,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: brand.hours.schema.weekdayOpen,
      closes: brand.hours.schema.weekdayClose,
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: brand.hours.schema.saturdayOpen,
      closes: brand.hours.schema.saturdayClose,
    },
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: `+57${brand.whatsappClean}`,
      contactType: 'customer service',
      contactOption: 'TollFree',
      areaServed: 'CO',
      availableLanguage: 'es',
    },
    {
      '@type': 'ContactPoint',
      email: brand.supportEmail,
      contactType: 'customer support',
      areaServed: 'CO',
      availableLanguage: 'es',
    },
  ],
  sameAs: brand.socialLinks,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Catálogo SUMITRONIC',
    itemListElement: [
      { '@type': 'OfferCatalog', name: 'Cámaras de seguridad' },
      { '@type': 'OfferCatalog', name: 'Routers y conectividad' },
      { '@type': 'OfferCatalog', name: 'UPS y energía' },
      { '@type': 'OfferCatalog', name: 'Repuestos para televisores' },
    ],
  },
  areaServed: {
    '@type': 'Country',
    name: 'Colombia',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />

        {/* iOS Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={brand.shortName} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon.png" />

        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/apple-touch-icon.png" />

        {/* Android Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#00ABE4" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <ErrorBoundary>
          <SharedDataProvider>
            <AuthProvider>
              <CartProvider>
                <FavoritesProvider>
                  {children}
                  {/* Global UI Components - Available on all pages */}
                  <CartSidebar />
                  <FavoritesSidebar />
                </FavoritesProvider>
              </CartProvider>
            </AuthProvider>
          </SharedDataProvider>
        </ErrorBoundary>
        <Toaster richColors position="top-right" />
        <SpeedInsights />
      </body>
    </html>
  )
}
