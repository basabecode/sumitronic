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
    <section id="ofertas-especiales" className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))] py-16">
      <div className="container">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Flame className="h-6 w-6 text-[hsl(var(--brand))]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--brand-strong))]">
              Descuentos Especiales
            </p>
          </div>
          <h2 className="font-display mb-3 text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] md:text-4xl">
            Ofertas Increíbles
          </h2>
          <p className="mx-auto max-w-2xl text-base text-[hsl(var(--text-muted))] md:text-lg">
            Aprovecha nuestras ofertas y obten los mejores productos a precios increíbles
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--brand))]" />
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
                      ? 'ring-[hsl(var(--brand))] bg-[hsl(var(--surface-highlight))] scale-95'
                      : 'ring-gray-200 hover:ring-[hsl(var(--brand))] hover:bg-[hsl(var(--surface-highlight))]'
                  }`}>
                    <ChevronLeft className={`h-6 w-6 transition-colors ${
                      carouselSpeed === 'fast-reverse'
                        ? 'text-[hsl(var(--brand-strong))]'
                        : 'text-gray-700 group-hover:text-[hsl(var(--brand-strong))]'
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
                      ? 'ring-[hsl(var(--brand))] bg-[hsl(var(--surface-highlight))] scale-95'
                      : 'ring-gray-200 hover:ring-[hsl(var(--brand))] hover:bg-[hsl(var(--surface-highlight))]'
                  }`}>
                    <ChevronRight className={`h-6 w-6 transition-colors ${
                      carouselSpeed === 'fast-forward'
                        ? 'text-[hsl(var(--brand-strong))]'
                        : 'text-gray-700 group-hover:text-[hsl(var(--brand-strong))]'
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
                        className="carousel-item group relative flex min-w-[240px] flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(14,165,233,0.22)] sm:min-w-[260px]"
                      >
                        {/* Imagen cuadrada */}
                        <Link
                          href={`/products/${product.id}`}
                          className="relative aspect-square overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                            sizes="260px"
                          />
                          {/* Discount Badge */}
                          {hasDiscount && discountPercent > 0 && (
                            <div className="absolute left-3 top-3 z-10">
                              <Badge className="bg-rose-500 px-2 py-0.5 text-[0.62rem] font-bold text-white">
                                -{discountPercent}%
                              </Badge>
                            </div>
                          )}
                          {/* Stock */}
                          <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide ${
                            stockCount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {stockCount > 0 ? `Stock: ${stockCount}` : 'Sin stock'}
                          </span>
                        </Link>

                        {/* Info */}
                        <div className="flex flex-1 flex-col gap-2 p-3.5">
                          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-strong))]">
                            {product.brand || 'Marca'}
                          </span>

                          <Link
                            href={`/products/${product.id}`}
                            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand))]"
                          >
                            <h3 className="text-sm font-semibold leading-snug tracking-tight text-slate-900 line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="mt-auto space-y-2 pt-1">
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-[1.35rem] font-bold leading-none tracking-tight text-slate-950">
                                {formatCurrency(product.price)}
                              </span>
                              {hasDiscount && originalValue && (
                                <span className="text-xs text-slate-400 line-through">
                                  {formatCurrency(originalValue)}
                                </span>
                              )}
                            </div>

                            {hasDiscount && originalValue && (
                              <div className="text-[0.7rem] font-semibold text-emerald-600">
                                Ahorras {formatCurrency(originalValue - product.price)}
                              </div>
                            )}

                            <Button
                              className="h-8 w-full rounded-xl bg-[hsl(var(--brand))] text-[0.78rem] font-semibold text-white transition-colors hover:bg-[hsl(var(--brand-strong))] disabled:opacity-60"
                              onClick={() => handleAddToCart(product)}
                              disabled={stockCount <= 0}
                            >
                              <ShoppingCart className="mr-1.5 h-3 w-3" />
                              {stockCount > 0 ? 'Agregar al carrito' : 'Sin stock'}
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
                    className="h-2 w-2 rounded-full bg-[hsl(var(--brand))] animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* View All Link */}
            <div className="mt-8 text-center">
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[hsl(var(--brand))] px-6 py-3 text-sm font-semibold text-[hsl(var(--brand-strong))] transition-all hover:bg-[hsl(var(--brand))] hover:text-white"
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
