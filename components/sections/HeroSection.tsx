'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import ProductDetailsModal from '@/components/products/ProductDetailsModal'

const SLIDE_INTERVAL = 5000

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  cta: string
  price: number
  originalPrice: number
  badge: string
  brand: string
  stockCount: number
  category: string
  rating: number
  description?: string
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<HeroSlide | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addItem, openCart, formatCurrency } = useCart()

  const slides: HeroSlide[] = [
    {
      id: 1,
      title: 'Imou Cruiser Bullet 2E',
      subtitle: 'Camara profesional con vision nocturna y conectividad WiFi',
      image: '/productos/imou/Cruiser_bullet_2E/bullet_2E.png',
      cta: 'Comprar ahora',
      price: 192000,
      originalPrice: 199000,
      badge: 'Nuevo',
      brand: 'Imou',
      stockCount: 10,
      category: 'Seguridad',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Diadema Logitech G335',
      subtitle: 'Comodidad y sonido ligero para sesiones de juego largas',
      image: '/productos/Logitech/diadema/g335-black-gallery-1 (9).png',
      cta: 'Comprar ahora',
      price: 258000,
      originalPrice: 289000,
      badge: 'Oferta',
      brand: 'Logitech',
      stockCount: 25,
      category: 'Gaming',
      rating: 4.7,
    },
    {
      id: 3,
      title: 'Central Electrica Forza FPP-T100',
      subtitle: 'Energia portatil para hogar y oficina con multiples puertos',
      image: '/encabezado/FPP-T100_2.PNG',
      cta: 'Comprar ahora',
      price: 580000,
      originalPrice: 599000,
      badge: 'Popular',
      brand: 'Forza',
      stockCount: 5,
      category: 'Energia',
      rating: 4.9,
    },
  ]

  useEffect(() => {
    if (isPaused) {
      return
    }

    const timer = window.setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, SLIDE_INTERVAL)

    return () => window.clearInterval(timer)
  }, [isPaused, slides.length])

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  const openDetails = (slide: HeroSlide) => {
    setSelectedProduct(slide)
    setIsModalOpen(true)
  }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white"
      aria-label="Productos destacados"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container min-h-[780px] sm:min-h-[700px] md:min-h-[640px] xl:min-h-[680px]">
        <div
          className="relative flex h-full"
          aria-live="polite"
          aria-roledescription="carousel"
        >
          {slides.map((slide, index) => {
            const isActive = index === currentSlide
            const positionClass =
              index === currentSlide
                ? 'translate-x-0 opacity-100'
                : index < currentSlide
                ? '-translate-x-full opacity-0'
                : 'translate-x-full opacity-0'

            return (
              <article
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${positionClass}`}
                aria-hidden={!isActive}
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${slides.length}`}
              >
                <div className="grid h-full grid-cols-12 gap-y-6 md:gap-y-10 gap-x-8 pt-6 pb-20 md:py-16">
                  <div className="order-2 col-span-12 flex flex-col justify-start md:justify-center space-y-4 md:space-y-6 md:order-1 md:col-span-6">
                    <span className="inline-flex w-fit items-center rounded-full bg-orange-100 px-4 py-1 text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-orange-800">
                      {slide.badge}
                    </span>

                    <div className="space-y-4">
                      <h2 className="max-w-[22ch] text-3xl font-semibold leading-[1.2] text-gray-900 sm:text-4xl md:text-[3rem]">
                        {slide.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-baseline gap-2 text-gray-900">
                          <span className="text-[1.75rem] font-bold sm:text-[2.25rem]">
                            {formatCurrency(slide.price)}
                          </span>
                          <span className="text-base text-gray-400 line-through">
                            {formatCurrency(slide.originalPrice)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const reviews = document.getElementById('resenas')
                            if (reviews) {
                              reviews.scrollIntoView({ behavior: 'smooth' })
                            }
                          }}
                          className="flex items-center gap-1 rounded-full border border-orange-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-orange-200 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                          onFocus={() => setIsPaused(true)}
                          onBlur={() => setIsPaused(false)}
                          aria-label={`Ver resenas del producto ${slide.title}`}
                        >
                          <span className="flex items-center">
                            {[...Array(5)].map((_, starIndex) => (
                              <Star
                                key={starIndex}
                                className={`h-4 w-4 ${
                                  starIndex < Math.round(slide.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                          </span>
                          <span>{slide.rating.toFixed(1)}</span>
                        </button>
                      </div>

                      <p className="max-w-[38ch] text-base text-gray-600 sm:text-lg">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Button
                        size="lg"
                        className="h-12 rounded-lg px-8 text-base font-semibold"
                        onClick={() => {
                          addItem({
                            id: String(slide.id),
                            name: slide.title,
                            price: slide.price,
                            originalPrice: slide.originalPrice,
                            image: slide.image,
                            brand: slide.brand,
                            stockCount: slide.stockCount,
                            category: slide.category,
                          })
                          openCart()
                        }}
                        onFocus={() => setIsPaused(true)}
                        onBlur={() => setIsPaused(false)}
                      >
                        <ShoppingBag
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        Comprar ahora
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-12 rounded-lg border-orange-600 px-8 text-base font-semibold text-orange-600 transition-colors hover:bg-orange-50"
                        onClick={() => openDetails(slide)}
                        onFocus={() => setIsPaused(true)}
                        onBlur={() => setIsPaused(false)}
                      >
                        Ver detalles
                      </Button>
                    </div>

                    <dl className="grid grid-cols-1 gap-4 text-sm text-gray-700 sm:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full bg-green-500"
                          aria-hidden="true"
                        ></span>
                        <span>Envío nacional</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full bg-blue-500"
                          aria-hidden="true"
                        ></span>
                        <span>Garantía 12 meses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full bg-purple-500"
                          aria-hidden="true"
                        ></span>
                        <span>Soporte Lun-Vie</span>
                      </div>
                    </dl>
                  </div>

                  <div className="order-1 col-span-12 md:order-2 md:col-span-6">
                    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] mt-4 md:mt-0">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-lg">
                        <Image
                          src={slide.image || '/placeholder.svg'}
                          alt={slide.title}
                          fill
                          className="object-contain"
                          priority={index === 0}
                          sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 90vw"
                        />
                      </div>
                      <div
                        className="absolute inset-0 -z-10 translate-y-12 rounded-full bg-orange-200/40 blur-3xl"
                        aria-hidden="true"
                      ></div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 md:bottom-10 flex items-center justify-center gap-4">
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={prevSlide}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-white text-gray-800 transition-transform hover:scale-105 hover:border-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide
              return (
                <button
                  key={slide.id}
                  type="button"
                  className={`h-3 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'w-8 bg-orange-600'
                      : 'w-3 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Ir al slide ${index + 1}`}
                  aria-current={isActive}
                  onClick={() => setCurrentSlide(index)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                />
              )
            })}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-white text-gray-800 transition-transform hover:scale-105 hover:border-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            aria-label="Slide siguiente"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ProductDetailsModal
        product={
          selectedProduct && {
            id: selectedProduct.id,
            name: selectedProduct.title,
            price: selectedProduct.price,
            originalPrice: selectedProduct.originalPrice,
            image: selectedProduct.image,
            brand: selectedProduct.brand,
            category: selectedProduct.category,
            stockCount: selectedProduct.stockCount,
            inStock: selectedProduct.stockCount > 0,
            badge: selectedProduct.badge,
            rating: selectedProduct.rating,
            description: selectedProduct.subtitle,
          }
        }
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
      />
    </section>
  )
}
