import Header from '@/components/layout/Header'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import ProductsSection from '@/components/products/ProductsSection'
import OffersSection from '@/components/sections/OffersSection'
import BrandsSection from '@/components/sections/BrandsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FAQSection from '@/components/sections/FAQSection'
import BlogSection from '@/components/sections/BlogSection'
import CTASection from '@/components/sections/CTASection'
import Footer from '@/components/layout/Footer'
import WhatsAppFAB from '@/components/features/WhatsAppFAB'
import { SectionErrorBoundary } from '@/components/ui/ErrorBoundary'
import { brand } from '@/lib/brand'

export default function Home() {
  return (
    <div className="min-h-screen bg-white w-full">
      <Header />
      <main>
        <h1 className="sr-only">{brand.organizationName} - Seguridad electronica, conectividad y repuestos</h1>
        <HeroSection />
        <SectionErrorBoundary title="Error al cargar los productos">
          <ProductsSection />
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
