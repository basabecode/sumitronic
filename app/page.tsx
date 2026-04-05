import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import HeroSection from '@/components/sections/HeroSection'
import { SectionErrorBoundary } from '@/components/ui/ErrorBoundary'
import { brand } from '@/lib/brand'

// Carga inmediata: secciones críticas above-the-fold
import ProductsSection from '@/components/products/ProductsSection'

// Carga diferida: secciones below-fold — se cargan tras el render inicial
const OffersSection = dynamic(() => import('@/components/sections/OffersSection'), { ssr: false })
const FeaturesSection = dynamic(() => import('@/components/sections/FeaturesSection'), { ssr: false })
const BrandsSection = dynamic(() => import('@/components/sections/BrandsSection'), { ssr: false })
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'), { ssr: false })
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), { ssr: false })
const BlogSection = dynamic(() => import('@/components/sections/BlogSection'), { ssr: false })
const CTASection = dynamic(() => import('@/components/sections/CTASection'), { ssr: false })
const Footer = dynamic(() => import('@/components/layout/Footer'))
const WhatsAppFAB = dynamic(() => import('@/components/features/WhatsAppFAB'), { ssr: false })

export default function Home() {
  return (
    <div className="min-h-screen bg-white w-full">
      <Header />
      <main>
        <h1 className="sr-only">{brand.organizationName} - Seguridad electronica, conectividad y repuestos</h1>
        <HeroSection />
        <SectionErrorBoundary title="Error al cargar los productos">
          <ProductsSection showViewAllLink />
        </SectionErrorBoundary>
        <SectionErrorBoundary title="Error al cargar las ofertas">
          <OffersSection />
        </SectionErrorBoundary>
        <FeaturesSection />
        <BrandsSection />
        <TestimonialsSection />
        <FAQSection />
        <BlogSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
