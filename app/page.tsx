import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import ProductsSection from './components/ProductsSection'
import OffersSection from './components/OffersSection'
import BrandsSection from './components/BrandsSection'
import TestimonialsSection from './components/TestimonialsSection'
import FAQSection from './components/FAQSection'
import BlogSection from './components/BlogSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import CartSidebar from './components/CartSidebar'
import FavoritesSidebar from './components/FavoritesSidebar'
import BottomNav from './components/BottomNav'
import WhatsAppFAB from './components/WhatsAppFAB'
import { SectionErrorBoundary } from './components/ErrorBoundary'

export default function Home() {
  return (
    <div className="min-h-screen bg-white overscroll-bounce touch-pan-y">
      <Header />
      <main>
        <h1 className="sr-only">CapiShop Colombia - Tienda de Tecnología, Seguridad y Energía</h1>
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
      <ChatWidget />
      <CartSidebar />
      <FavoritesSidebar />
      <WhatsAppFAB />
      <BottomNav />
    </div>
  )
}
