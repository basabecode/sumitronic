/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production'

// URLs de Supabase según entorno
const supabaseLocalUrl = 'http://127.0.0.1:54321 http://localhost:54321'
const supabaseCloudUrl = 'https://pmvhtxlciekynczjspja.supabase.co'
const connectSrcDev = `'self' ${supabaseLocalUrl} ${supabaseCloudUrl}`
const connectSrcProd = `'self' ${supabaseCloudUrl}`

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    // 'unsafe-inline' en script-src: requerido por Next.js para hidratación (__NEXT_DATA__).
    // 'unsafe-eval' en script-src: requerido por Next.js en dev (hot reload); en producción
    //   podría removerse pero requiere pruebas. TODO: migrar a nonces con next@14.1+.
    // 'unsafe-inline' en style-src: requerido por Radix UI / shadcn que inyectan estilos dinámicos.
    // connect-src: permite llamadas fetch/XHR a Supabase (local en dev, cloud en prod).
    value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src ${isProduction ? connectSrcProd : connectSrcDev};`,
  },
  // HSTS solo en produccion para no interferir con desarrollo local HTTP
  ...(isProduction
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]
    : []),
]

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pmvhtxlciekynczjspja.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'dcdn-us.mitiendanube.com',
        port: '',
        pathname: '/**',
      },
      // Patrones locales solo en desarrollo
      ...(!isProduction
        ? [
            {
              protocol: 'http',
              hostname: '127.0.0.1',
              port: '54321',
              pathname: '/storage/v1/object/public/**',
            },
            {
              protocol: 'http',
              hostname: 'localhost',
              port: '54321',
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
    ],
    formats: ['image/webp', 'image/avif'],
    // Optimized device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Optimized image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
    // Allow SVG with secure CSP
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    turbo: {},
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-popover',
      '@radix-ui/react-navigation-menu',
      'recharts',
      'date-fns',
    ],
  },
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
