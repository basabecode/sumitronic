import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://capishop-web.vercel.app'),
  title: 'CapiShoping - Tu Tienda de Electrónicos de Confianza',
  description:
    'Descubre la mejor selección de productos electrónicos con precios increíbles. iPhone, MacBook, Gaming, Smart Home y más. Envío gratis, garantía extendida y soporte 24/7.',
  keywords:
    'electrónicos, iPhone, MacBook, gaming, smart home, tecnología, tienda online',
  authors: [{ name: 'CapiShoping Team' }],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'CapiShoping - Tu Tienda de Electrónicos de Confianza',
    description:
      'Descubre la mejor selección de productos electrónicos con precios increíbles.',
    url: 'https://CapiShoping.com',
    siteName: 'CapiShoping',
    images: [
      {
        url: '/placeholder.svg?height=630&width=1200',
        width: 1200,
        height: 630,
        alt: 'CapiShoping - Productos Electrónicos',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CapiShoping - Tu Tienda de Electrónicos de Confianza',
    description:
      'Descubre la mejor selección de productos electrónicos con precios increíbles.',
    images: ['/placeholder.svg?height=630&width=1200'],
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
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
