import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { SharedDataProvider } from '@/contexts/SharedDataContext'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CartSidebar from '@/components/cart/CartSidebar'
import FavoritesSidebar from '@/components/cart/FavoritesSidebar'
import ChatWidget from '@/components/features/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Permitir zoom para accesibilidad
  userScalable: true,
  themeColor: '#ea580c', // Orange-600 brand color
}

export const metadata: Metadata = {
  metadataBase: new URL('https://capishop-web.vercel.app'),
  title: {
    default: 'CapiShop Colombia - Tecnología, Seguridad y Energía',
    template: '%s | CapiShop Colombia',
  },
  description:
    'Tienda online líder en Colombia. Encuentra iPhone, MacBook, Cámaras de Seguridad y Soluciones de Energía. Envíos a todo el país, garantía real y soporte local.',
  keywords:
    'tecnología colombia, iphone bogota, macbook medellin, cámaras seguridad, paneles solares, capishop, tienda apple colombia',
  authors: [{ name: 'CapiShop Colombia' }],
  creator: 'CapiShop Colombia',
  publisher: 'CapiShop Colombia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CapiShop Colombia - Tecnología y Seguridad al Mejor Precio',
    description:
      'Tu tienda de confianza en Colombia para productos Apple, Gaming y Seguridad. Envíos seguros a nivel nacional.',
    url: 'https://capishop-web.vercel.app',
    siteName: 'CapiShop Colombia',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Make sure to create this image
        width: 1200,
        height: 630,
        alt: 'CapiShop Colombia - Tecnología Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CapiShop Colombia - Tecnología Premium',
    description:
      'Envíos a toda Colombia. iPhone, Mac, Seguridad y Energía.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'verification_token', // Placeholder for GSC
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CapiShop Colombia',
  url: 'https://capishop-web.vercel.app',
  logo: 'https://capishop-web.vercel.app/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+57-300-309-4854',
    contactType: 'customer service',
    areaServed: 'CO',
    availableLanguage: 'es',
  },
  sameAs: [
    'https://instagram.com/capishop_col',
    'https://facebook.com/capishop_col',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />

        {/* iOS Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CapiShop" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/favicon.png" />

        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/favicon.png" />

        {/* Android Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ea580c" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <SharedDataProvider>
            <AuthProvider>
              <CartProvider>
                <FavoritesProvider>
                  {children}
                  {/* Global UI Components - Available on all pages */}
                  <CartSidebar />
                  <FavoritesSidebar />
                  <ChatWidget />
                </FavoritesProvider>
              </CartProvider>
            </AuthProvider>
          </SharedDataProvider>
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  )
}
