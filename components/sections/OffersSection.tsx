'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Flame, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { Product, ProductsApiResponse, convertDatabaseProductsToProducts } from '@/lib/types/products'

export default function OffersSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [carouselSpeed, setCarouselSpeed] = useState<'normal' | 'fast-forward' | 'fast-reverse'>('normal')
  const { addItem, openCart, formatCurrency } = useCart()

  // Fetch products with offers from API
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/products?onOffer=true&limit=12&sortBy=compare_price&sortOrder=desc')
        const data: ProductsApiResponse = await response.json()

        if (response.ok && data.products) {
          const convertedProducts = convertDatabaseProductsToProducts(data.products)
          setProducts(convertedProducts)
        }
      } catch (error) {
        console.error('Error fetching offers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  const getProductImage = (product: Product) => {
    const primary = product.product_images?.find(image => image.is_primary)
    return (
      (product as any).image ||
      (product as any).image_url ||
      primary?.image_url ||
      '/placeholder.svg'
    )
  }

  const getStockCount = (product: Product) => {
    return (
      (product as any).stockCount ??
      (product as any).stock_quantity ??
      (product as any).stock ??
      0
    )
  }

  const handleAddToCart = (product: Product) => {
    const image = getProductImage(product)
    const stockCount = getStockCount(product)

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
      image_url: image,
      brand: product.brand,
      stock: stockCount,
      stockCount,
    })
    openCart()
  }

  // Funciones para controlar la velocidad del carrusel con presión de flechas
  const handleLeftArrowDown = () => {
    setCarouselSpeed('fast-reverse')
  }

  const handleRightArrowDown = () => {
    setCarouselSpeed('fast-forward')
  }

  const handleArrowUp = () => {
    setCarouselSpeed('normal')
  }

  // Don't render if no offers available
  if (!loading && products.length === 0) {
    return null
  }

  // Duplicar productos para efecto infinito seamless
  const duplicatedProducts = [...products, ...products, ...products]

  return (
    <section id="ofertas-especiales" className="relative bg-gradient-to-br from-orange-50 via-amber-50/30 to-white py-16 overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Flame className="h-6 w-6 text-orange-600" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              Descuentos Especiales
            </p>
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Ofertas Increíbles
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
            Aprovecha nuestras ofertas y obten los mejores productos a precios increíbles
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
          </div>
        ) : (
          <>
            {/* Infinite Carousel Container */}
            <div className="relative mb-8">
              {/* Navigation Arrows */}
              <div className="hidden lg:block">
                {/* Left Arrow */}
                <div
                  className="arrow-left absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20"
                  onMouseDown={handleLeftArrowDown}
                  onMouseUp={handleArrowUp}
                  onMouseLeave={handleArrowUp}
                >
                  <div className={`bg-white rounded-full p-3 shadow-lg ring-2 transition-all duration-200 cursor-pointer group select-none ${
                    carouselSpeed === 'fast-reverse'
                      ? 'ring-orange-500 bg-orange-50 scale-95'
                      : 'ring-gray-200 hover:ring-orange-400 hover:bg-orange-50'
                  }`}>
                    <ChevronLeft className={`h-6 w-6 transition-colors ${
                      carouselSpeed === 'fast-reverse'
                        ? 'text-orange-600'
                        : 'text-gray-700 group-hover:text-orange-600'
                    }`} />
                  </div>
                </div>

                {/* Right Arrow */}
                <div
                  className="arrow-right absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20"
                  onMouseDown={handleRightArrowDown}
                  onMouseUp={handleArrowUp}
                  onMouseLeave={handleArrowUp}
                >
                  <div className={`bg-white rounded-full p-3 shadow-lg ring-2 transition-all duration-200 cursor-pointer group select-none ${
                    carouselSpeed === 'fast-forward'
                      ? 'ring-orange-500 bg-orange-50 scale-95'
                      : 'ring-gray-200 hover:ring-orange-400 hover:bg-orange-50'
                  }`}>
                    <ChevronRight className={`h-6 w-6 transition-colors ${
                      carouselSpeed === 'fast-forward'
                        ? 'text-orange-600'
                        : 'text-gray-700 group-hover:text-orange-600'
                    }`} />
                  </div>
                </div>
              </div>

              <div className="carousel-container">
                <div className={`carousel-track ${
                  carouselSpeed === 'fast-forward' ? 'speed-fast-forward' :
                  carouselSpeed === 'fast-reverse' ? 'speed-fast-reverse' :
                  'speed-normal'
                }`}>
                  {duplicatedProducts.map((product, index) => {
                    const image = getProductImage(product)
                    const stockCount = getStockCount(product)
                    const originalPrice = (product as any).compare_price ?? (product as any).original_price ?? null
                    const originalValue = typeof originalPrice === 'number' ? originalPrice : originalPrice ? Number(originalPrice) : null
                    const hasDiscount = typeof originalValue === 'number' && originalValue > product.price
                    const discountPercent = hasDiscount && originalValue
                      ? Math.round(((originalValue - product.price) / originalValue) * 100)
                      : 0

                    return (
                      <div
                        key={`${product.id}-${index}`}
                        className="carousel-item group relative flex min-w-[280px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-w-[300px]"
                      >
                        {/* Discount Badge */}
                        {hasDiscount && discountPercent > 0 && (
                          <div className="absolute left-4 top-4 z-10">
                            <Badge className="bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1.5 text-sm font-bold text-white shadow-md">
                              -{discountPercent}%
                            </Badge>
                          </div>
                        )}

                        {/* Product Image */}
                        <Link
                          href={`/products/${product.id}`}
                          className="relative aspect-square overflow-hidden bg-gray-50"
                        >
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                            sizes="300px"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex flex-1 flex-col gap-3 p-5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                              {product.brand || 'Marca'}
                            </span>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              stockCount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {stockCount > 0 ? `Stock: ${stockCount}` : 'Sin stock'}
                            </span>
                          </div>

                          <Link
                            href={`/products/${product.id}`}
                            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                          >
                            <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Pricing */}
                          <div className="mt-auto space-y-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-900">
                                {formatCurrency(product.price)}
                              </span>
                              {hasDiscount && originalValue && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatCurrency(originalValue)}
                                </span>
                              )}
                            </div>

                            {hasDiscount && originalValue && (
                              <div className="text-xs font-medium text-emerald-600">
                                Ahorras {formatCurrency(originalValue - product.price)}
                              </div>
                            )}

                            {/* Add to Cart Button */}
                            <Button
                              className="h-11 w-full rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-sm font-semibold shadow-md transition-all hover:from-orange-700 hover:to-orange-600 hover:shadow-lg"
                              onClick={() => handleAddToCart(product)}
                              disabled={stockCount <= 0}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              {stockCount > 0 ? 'Agregar al Carrito' : 'Sin stock'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Mobile Pagination Dots */}
              <div className="mt-6 flex justify-center gap-2 lg:hidden">
                {products.slice(0, Math.min(6, products.length)).map((_, index) => (
                  <div
                    key={index}
                    className="h-2 w-2 rounded-full bg-orange-300 animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* View All Link */}
            <div className="mt-8 text-center">
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-2 rounded-full border-2 border-orange-600 px-6 py-3 text-sm font-semibold text-orange-600 transition-all hover:bg-orange-600 hover:text-white"
              >
                Ver Todas las Ofertas
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Carousel Animation Styles */}
      <style jsx>{`
        .carousel-container {
          overflow: hidden;
          position: relative;
          width: 100%;
        }

        .carousel-track {
          display: flex;
          gap: 1rem;
          will-change: transform;
        }

        /* Velocidad normal (por defecto) - 7.5s (8x más rápido) */
        .speed-normal {
          animation: scroll 7.5s linear infinite;
        }

        /* Velocidad 8x más rápida hacia adelante (presionar flecha derecha) - 7.5s */
        .speed-fast-forward {
          animation: scroll-fast 7.5s linear infinite;
        }

        /* Velocidad 8x más rápida en reversa (presionar flecha izquierda) - 7.5s */
        .speed-fast-reverse {
          animation: scroll-reverse-fast 7.5s linear infinite;
        }

        .carousel-track:hover {
          animation-play-state: paused;
        }

        .carousel-item {
          flex-shrink: 0;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        @keyframes scroll-fast {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        @keyframes scroll-reverse-fast {
          0% {
            transform: translateX(calc(-100% / 3));
          }
          100% {
            transform: translateX(0);
          }
        }

        @media (max-width: 640px) {
          .speed-normal {
            animation-duration: 40s;
          }
          .speed-fast-forward {
            animation-duration: 5s;
          }
          .speed-fast-reverse {
            animation-duration: 5s;
          }
        }
      `}</style>
    </section>
  )
}
