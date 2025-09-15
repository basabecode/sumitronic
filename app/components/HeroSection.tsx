'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import ProductDetailsModal from './ProductDetailsModal'

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addItem, openCart } = useCart()

  const slides = [
    {
      id: 1,
      title: 'Imou Cruiser Bullet 2E',
      subtitle: 'Cámara profesional con visión nocturna y conectividad WiFi',
      image: '/productos/imou/Cruiser_bullet_2E/bullet_2E.png',
      cta: 'Comprar Ahora',
      price: '192000',
      originalPrice: '199000',
      badge: 'Nuevo',
      brand: 'Imou',
      stockCount: 10,
      category: 'Seguridad',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Diadema Logitech G335',
      subtitle: 'Comodidad y calidad de sonido para gamers exigentes',
      image: '/productos/logitech/diadema/diademaG335_lateral.png',
      cta: 'Comprar Ahora',
      price: '258000',
      originalPrice: '289000',
      badge: 'Oferta',
      brand: 'Logitech',
      stockCount: 25,
      category: 'Gaming',
      rating: 4.7,
    },
    {
      id: 3,
      title: 'Central Eléctrica Forza FPP-T100',
      subtitle: 'Energía portátil para tu hogar y oficina',
      image: '/encabezado/FPP-T100_2.PNG',
      cta: 'Comprar Ahora',
      price: '580000',
      originalPrice: '599000',
      badge: 'Popular',
      brand: 'Forza',
      stockCount: 5,
      category: 'Energía',
      rating: 4.9,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] md:h-[700px] overflow-hidden bg-gradient-to-br from-orange-50 to-white">
      {slides.map((slide, index) => (
        <div
          key={`slide-${slide.id}-${slide.title}`}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide
              ? 'translate-x-0'
              : index < currentSlide
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          <div className="mx-auto w-full max-w-[1720px] px-2 sm:px-4 md:px-6 xl:px-8 py-8 md:py-0 h-full flex items-center">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center w-full">
              {/* Content */}
              <div className="space-y-4 md:space-y-6 text-center md:text-left order-2 md:order-1 min-w-0">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
                  {slide.badge}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight truncate py-3">
                  {slide.title}
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0">
                  {slide.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl md:text-3xl font-bold text-orange-600">
                      ${slide.price}
                    </span>
                    <span className="text-base md:text-lg text-gray-500 line-through">
                      ${slide.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({slide.rating})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => {
                      addItem({
                        id: slide.id.toString(),
                        name: slide.title,
                        price: parseInt(slide.price),
                        originalPrice: parseInt(slide.originalPrice),
                        image: slide.image,
                        brand: slide.brand,
                        category: slide.category,
                        stockCount: slide.stockCount,
                        inStock: slide.stockCount > 0,
                      })
                      openCart()
                    }}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {slide.cta}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-orange-600 text-orange-600 hover:bg-orange-50 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 bg-transparent"
                    onClick={() => {
                      if (slide.cta === 'Ver Ofertas') {
                        // Navegar a productos y filtrar por ofertas
                        window.dispatchEvent(
                          new CustomEvent('filterByOffers', {
                            detail: { showOffers: true },
                          })
                        )
                        const el = document.getElementById('productos')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      } else {
                        // Abrir modal de detalles
                        setSelectedProduct({
                          id: slide.id,
                          name: slide.title,
                          price: parseInt(slide.price),
                          originalPrice: parseInt(slide.originalPrice),
                          image: slide.image,
                          brand: slide.brand,
                          category: slide.category,
                          stockCount: slide.stockCount,
                          inStock: slide.stockCount > 0,
                          badge: slide.badge,
                          rating: slide.rating,
                          description: slide.subtitle,
                        })
                        setIsModalOpen(true)
                      }
                    }}
                  >
                    {slide.cta === 'Ver Ofertas'
                      ? 'Ver Ofertas'
                      : 'Ver Detalles'}
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-xs md:text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Envío Gratis</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Garantía 2 años</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Soporte 24/7</span>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative order-1 md:order-2">
                <div className="relative z-10 mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                  <div className="w-full">
                    <div className="aspect-w-4 aspect-h-3">
                      <img
                        src={slide.image || '/placeholder.svg'}
                        alt={slide.title}
                        className="w-full h-full object-contain mx-auto drop-shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full opacity-20 blur-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-orange-600 w-8'
                : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Modal de Detalles del Producto */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
      />
    </section>
  )
}
