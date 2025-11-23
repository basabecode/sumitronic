'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ChevronLeft, ChevronRight, Flame, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { Product, ProductsApiResponse, convertDatabaseProductsToProducts } from '@/lib/types/products'

export default function OffersSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
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

  const checkScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    checkScroll()
    container.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      container.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [products])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 320 // Card width + gap
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

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

  // Don't render if no offers available
  if (!loading && products.length === 0) {
    return null
  }

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-amber-50/30 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Flame className="h-6 w-6 text-orange-600" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              Ofertas Especiales
            </p>
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Descuentos Increíbles
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
            Aprovecha nuestras ofertas exclusivas con los mejores descuentos
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
          </div>
        ) : (
          <>
            {/* Slider Container */}
            <div className="relative">
              {/* Navigation Arrows - Desktop */}
              {canScrollLeft && (
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 z-10 hidden -translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg ring-1 ring-gray-100 transition-all hover:bg-orange-50 hover:ring-orange-200 lg:block"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
              )}

              {canScrollRight && (
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-4 rounded-full bg-white p-3 shadow-lg ring-1 ring-gray-100 transition-all hover:bg-orange-50 hover:ring-orange-200 lg:block"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              )}

              {/* Scroll Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {products.map((product) => {
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
                      key={product.id}
                      className="group relative flex min-w-[280px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-w-[300px]"
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

              {/* Scroll Indicators - Mobile */}
              <div className="mt-6 flex justify-center gap-2 lg:hidden">
                {products.slice(0, 6).map((_, index) => (
                  <div
                    key={index}
                    className="h-2 w-2 rounded-full bg-gray-300 transition-colors"
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

      {/* Custom scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
