'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Flame, Loader2, ChevronRight, ChevronLeft, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { cn } from '@/lib/utils'
import { Product, ProductsApiResponse, convertDatabaseProductsToProducts } from '@/lib/types/products'
import ProductDetailsModal from '@/components/products/ProductDetailsModal'

export default function OffersSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [carouselSpeed, setCarouselSpeed] = useState<'normal' | 'fast-forward' | 'fast-reverse'>('normal')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { addItem, openCart, formatCurrency } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } = useFavorites()

  useEffect(() => {
    const controller = new AbortController()
    const fetchOffers = async () => {
      setLoading(true)
      try {
        // Fetch 2× limit para compensar el post-filter compare_price > price
        const response = await fetch('/api/products?onOffer=true&limit=24&sortBy=compare_price&sortOrder=desc', { signal: controller.signal })
        const data: ProductsApiResponse = await response.json()
        if (response.ok && data.products) {
          setProducts(convertDatabaseProductsToProducts(data.products).slice(0, 12))
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') console.error('Error fetching offers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOffers()
    return () => controller.abort()
  }, [])

  const getProductImage = (product: Product): string =>
    (product as any).image ||
    (product as any).image_url ||
    product.product_images?.find(img => img.is_primary)?.image_url ||
    '/placeholder.svg'

  const getStockCount = (product: Product): number =>
    (product as any).stockCount ??
    (product as any).stock_quantity ??
    (product as any).stock ??
    0

  const getOriginalPrice = (product: Product): number | null =>
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice
      : null

  const handleAddToCart = (product: Product) => {
    const image = getProductImage(product)
    const stockCount = getStockCount(product)
    addItem({ id: product.id, name: product.name, price: product.price, image, image_url: image, brand: product.brand, stock: stockCount, stockCount })
    openCart()
  }

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      const image = getProductImage(product)
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image,
        image_url: image,
        brand: product.brand,
        stock: getStockCount(product),
      })
    }
  }

  // Pre-computar datos por producto único antes de triplicar para el carrusel
  // DEBE estar antes del early return para no violar las Rules of Hooks
  const productDataMap = useMemo(() => new Map(
    products.map(p => [p.id, {
      image: getProductImage(p),
      stockCount: getStockCount(p),
      originalPrice: getOriginalPrice(p),
    }])
  ), [products])

  if (!loading && products.length === 0) return null

  const duplicatedProducts = [...products, ...products, ...products]

  return (
    <section
      id="ofertas-especiales"
      className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))] py-16"
    >
      <div className="container">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Flame className="h-6 w-6 text-[hsl(var(--brand))]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--brand-strong))]">
              Precios para aprovechar
            </p>
          </div>
          <h2 className="font-display mb-3 text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] md:text-4xl">
            Referencias con descuento real
          </h2>
          <p className="mx-auto max-w-2xl text-base text-[hsl(var(--text-muted))] md:text-lg">
            Revisa equipos con ahorro vigente, inventario disponible y respaldo para compra en Colombia.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--brand))]" />
          </div>
        ) : (
          <>
            <div className="relative mb-8">
              {/* Flechas desktop */}
              <div className="hidden lg:block">
                <div
                  className="absolute left-0 top-1/2 z-20 -translate-x-4 -translate-y-1/2"
                  onMouseDown={() => setCarouselSpeed('fast-reverse')}
                  onMouseUp={() => setCarouselSpeed('normal')}
                  onMouseLeave={() => setCarouselSpeed('normal')}
                >
                  <div className={cn(
                    'cursor-pointer rounded-full bg-white p-3 shadow-lg ring-2 transition-all duration-200 select-none',
                    carouselSpeed === 'fast-reverse'
                      ? 'scale-95 bg-[hsl(var(--surface-highlight))] ring-[hsl(var(--brand))]'
                      : 'ring-gray-200 hover:bg-[hsl(var(--surface-highlight))] hover:ring-[hsl(var(--brand))]'
                  )}>
                    <ChevronLeft className={cn('h-6 w-6', carouselSpeed === 'fast-reverse' ? 'text-[hsl(var(--brand-strong))]' : 'text-gray-700')} />
                  </div>
                </div>
                <div
                  className="absolute right-0 top-1/2 z-20 translate-x-4 -translate-y-1/2"
                  onMouseDown={() => setCarouselSpeed('fast-forward')}
                  onMouseUp={() => setCarouselSpeed('normal')}
                  onMouseLeave={() => setCarouselSpeed('normal')}
                >
                  <div className={cn(
                    'cursor-pointer rounded-full bg-white p-3 shadow-lg ring-2 transition-all duration-200 select-none',
                    carouselSpeed === 'fast-forward'
                      ? 'scale-95 bg-[hsl(var(--surface-highlight))] ring-[hsl(var(--brand))]'
                      : 'ring-gray-200 hover:bg-[hsl(var(--surface-highlight))] hover:ring-[hsl(var(--brand))]'
                  )}>
                    <ChevronRight className={cn('h-6 w-6', carouselSpeed === 'fast-forward' ? 'text-[hsl(var(--brand-strong))]' : 'text-gray-700')} />
                  </div>
                </div>
              </div>

              {/* Carrusel */}
              <div className="carousel-container">
                <div className={cn('carousel-track', {
                  'speed-fast-forward': carouselSpeed === 'fast-forward',
                  'speed-fast-reverse': carouselSpeed === 'fast-reverse',
                  'speed-normal': carouselSpeed === 'normal',
                })}>
                  {duplicatedProducts.map((product, index) => {
                    const data = productDataMap.get(product.id)!
                    const { image, stockCount, originalPrice } = data
                    const discountPct = originalPrice
                      ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
                      : 0
                    const isOutOfStock = stockCount <= 0
                    const favorited = isFavorite(product.id)

                    return (
                      <div
                        key={`${product.id}-${index}`}
                        className="carousel-item group flex w-[220px] flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-8px_rgba(14,165,233,0.25)] sm:w-[240px]"
                      >
                        {/* Imagen */}
                        <div className="relative aspect-square overflow-hidden">
                          <Link href={`/products/${product.id}`} className="absolute inset-0 z-0">
                            <Image
                              src={image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                              sizes="(min-width: 640px) 240px, 220px"
                            />
                          </Link>

                          {/* Badges top-left: descuento apilado */}
                          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
                            {discountPct > 0 && (
                              <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[0.62rem] font-bold text-white">
                                -{discountPct}%
                              </span>
                            )}
                          </div>

                          {/* Badge stock — top-right */}
                          <span className={cn(
                            'absolute right-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide',
                            isOutOfStock ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          )}>
                            {isOutOfStock ? 'Sin stock' : `Stock ${stockCount}`}
                          </span>

                          {/* Acciones hover — Heart + Eye, igual que ProductsSection */}
                          <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                'h-8 w-8 rounded-full border border-white/80 bg-white/90 shadow-sm backdrop-blur-sm transition-colors',
                                favorited ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
                              )}
                              onClick={() => handleToggleFavorite(product)}
                              aria-label={favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            >
                              <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full border border-white/80 bg-white/90 text-slate-500 shadow-sm backdrop-blur-sm hover:text-[hsl(var(--brand-strong))]"
                              onClick={() => setSelectedProduct(product)}
                              aria-label={`Ver detalles de ${product.name}`}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex flex-1 flex-col gap-2.5 p-4">
                          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-strong))]">
                            {product.brand || 'Marca'}
                          </span>
                          <Link href={`/products/${product.id}`}>
                            <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-slate-900 transition-colors hover:text-[hsl(var(--brand-strong))]">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="mt-auto space-y-2.5 pt-1">
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-[1.25rem] font-bold leading-none tracking-tight text-slate-950">
                                {formatCurrency(product.price)}
                              </span>
                              {originalPrice && (
                                <span className="text-xs text-slate-400 line-through">
                                  {formatCurrency(originalPrice)}
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              disabled={isOutOfStock}
                              onClick={() => handleAddToCart(product)}
                              className="h-9 w-full rounded-xl bg-[hsl(var(--brand))] text-[0.82rem] font-semibold text-white transition-colors hover:bg-[hsl(var(--brand-strong))] disabled:opacity-60"
                            >
                              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                              {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Dots mobile */}
              <div className="mt-6 flex justify-center gap-2 lg:hidden">
                {products.slice(0, Math.min(6, products.length)).map((_, i) => (
                  <div key={i} className="h-2 w-2 animate-pulse rounded-full bg-[hsl(var(--brand))]" />
                ))}
              </div>
            </div>

            {/* Link a página de ofertas */}
            <div className="mt-8 text-center">
              <Link
                href="/ofertas"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[hsl(var(--brand))] px-6 py-3 text-sm font-semibold text-[hsl(var(--brand-strong))] transition-all hover:bg-[hsl(var(--brand))] hover:text-white"
              >
                Ver todas las ofertas
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Modal de detalle */}
      <ProductDetailsModal
        product={
          selectedProduct && (() => {
            const d = productDataMap.get(selectedProduct.id)
            return {
              id: Number(selectedProduct.id),
              name: selectedProduct.name,
              price: selectedProduct.price,
              originalPrice: d?.originalPrice ?? undefined,
              image: d?.image ?? '/placeholder.svg',
              brand: selectedProduct.brand,
              category: typeof (selectedProduct as any).category === 'object'
                ? (selectedProduct as any).category?.name
                : (selectedProduct as any).category ?? '',
              stockCount: d?.stockCount ?? 0,
              inStock: (d?.stockCount ?? 0) > 0,
              description: selectedProduct.description,
            }
          })()
        }
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />

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
        .speed-normal      { animation: scroll 19s linear infinite; }
        .speed-fast-forward{ animation: scroll 4.5s linear infinite; }
        .speed-fast-reverse{ animation: scroll-reverse 4.5s linear infinite; }
        .carousel-track:hover { animation-play-state: paused; }
        .carousel-item { flex-shrink: 0; }
        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @keyframes scroll-reverse {
          0%   { transform: translateX(calc(-100% / 3)); }
          100% { transform: translateX(0); }
        }
        @media (max-width: 640px) {
          .speed-normal       { animation-duration: 27s; }
          .speed-fast-forward { animation-duration: 3s; }
          .speed-fast-reverse { animation-duration: 3s; }
        }
      `}</style>
    </section>
  )
}
