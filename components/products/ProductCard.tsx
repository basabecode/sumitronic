'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock?: number
  stock_quantity?: number
  sku?: string
  category?:
    | string
    | {
        id: string
        name: string
        slug: string
      }
  brand?: string
  image_url?: string
  featured?: boolean
  categories?: {
    id: string
    name: string
    slug: string
  }
  product_images?: Array<{
    id: string
    image_url: string
    alt_text: string
    is_primary: boolean
  }>
}

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list' | 'compact'
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addItem, formatCurrency } = useCart()

  // Helper function to get category name from different structures
  const getCategoryName = (): string => {
    // Check categories object first
    if (product.categories?.name) {
      return product.categories.name
    }
    // Check if category is an object
    if (product.category && typeof product.category === 'object') {
      return product.category.name
    }
    // Check if category is a string
    if (product.category && typeof product.category === 'string') {
      return product.category
    }
    return ''
  }

  const categoryName = getCategoryName()

  // Robust image extraction - check multiple sources
  const primaryImage = product.product_images?.find(img => img.is_primary)
  const firstImage = product.product_images?.[0]
  const imageUrl =
    (product as any).image ||
    (product as any).image_url ||
    primaryImage?.image_url ||
    firstImage?.image_url ||
    product.image_url ||
    '/placeholder.svg'
  const imageAlt = primaryImage?.alt_text || firstImage?.alt_text || product.name

  const stockQuantity = product.stock_quantity || product.stock || 0
  const isOutOfStock = stockQuantity === 0

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      image_url: imageUrl,
      image: imageUrl, // Para compatibilidad
      stock: stockQuantity,
      stockCount: stockQuantity, // Para compatibilidad
      category: categoryName,
    })
  }

  if (viewMode === 'compact') {
    return (
      <Card className="group overflow-hidden rounded-2xl border border-[hsl(var(--border-subtle))] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-slate-50">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 45vw"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Badge variant="destructive" className="text-xs">
                  Agotado
                </Badge>
              </div>
            )}
            {categoryName && (
              <div className="absolute left-2 top-2">
                <Badge
                  variant="secondary"
                  className="bg-white/90 px-2 py-0.5 text-[0.65rem] text-slate-600"
                >
                  {categoryName}
                </Badge>
              </div>
            )}
          </div>
        </Link>

        <CardContent className="px-3 pb-3 pt-2.5">
          <Link href={`/products/${product.id}`}>
            <h3
              className="line-clamp-2 text-[0.82rem] font-semibold leading-snug text-slate-900 transition-colors hover:text-[hsl(var(--brand-strong))]"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="font-display text-[1.1rem] font-semibold leading-none tracking-tight text-slate-950">
              {formatCurrency(product.price)}
            </p>
            <Button
              size="sm"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="h-8 rounded-full bg-[hsl(var(--brand))] px-3 text-xs font-semibold text-white hover:bg-[hsl(var(--brand-strong))]"
            >
              <ShoppingCart className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">{isOutOfStock ? 'Agotado' : 'Agregar'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/30 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(14,165,233,0.32)]">
        <div className="flex flex-col sm:flex-row">
          <div className="relative aspect-square w-full overflow-hidden bg-slate-50 sm:w-48 sm:flex-shrink-0 sm:border-r border-slate-100">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 640px) 192px, 100vw"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="destructive">Agotado</Badge>
              </div>
            )}
          </div>

          <CardContent className="flex-1 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start h-full">
              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.id}`}>
                  <h3
                    className="line-clamp-2 text-[1.16rem] font-semibold leading-[1.35] tracking-[-0.015em] transition-colors hover:text-[hsl(var(--brand-strong))] sm:text-[1.25rem]"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                </Link>

                <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-strong))]">
                  {categoryName}
                </p>

                <p className="mt-3 line-clamp-2 text-[0.98rem] leading-6 text-slate-500">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:ml-4 sm:min-w-[140px]">
                <p className="font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em] text-slate-950 sm:text-[2rem]">
                  {formatCurrency(product.price)}
                </p>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Button
                    size="sm"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className="h-10 rounded-full bg-[hsl(var(--brand))] px-5 text-sm font-semibold text-white shadow-[0_16px_26px_-16px_rgba(14,165,233,0.85)] transition-all hover:bg-[hsl(var(--brand-strong))] hover:shadow-[0_20px_30px_-16px_rgba(3,105,161,0.7)]"
                  >
                    <ShoppingCart className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{isOutOfStock ? 'Agotado' : 'Agregar'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 90vw"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Agotado</Badge>
          </div>
        )}

        {categoryName && (
          <div className="absolute left-4 top-4">
            <Badge variant="secondary" className="bg-white/90 text-slate-700">
              {categoryName}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="space-y-4 px-5 pb-5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-strong))]">
            {categoryName || product.brand || 'Producto'}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
            {isOutOfStock ? 'Agotado' : `Stock ${stockQuantity}`}
          </span>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3
            className="min-h-[3.2rem] text-[1.12rem] font-semibold leading-[1.38] tracking-[-0.015em] text-slate-900 transition-colors hover:text-[hsl(var(--brand-strong))]"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        <p className="min-h-[3rem] line-clamp-2 text-[0.98rem] leading-6 text-slate-500">
          {product.description}
        </p>

        <div className="flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">(4.0)</span>
        </div>

        <div className="flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] text-slate-950">
              {formatCurrency(product.price)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {isOutOfStock ? 'Sin disponibilidad' : `${stockQuantity} unidades`}
            </p>
          </div>

          <Button
            size="sm"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="h-12 rounded-full bg-[hsl(var(--brand))] px-5 text-sm font-semibold text-white shadow-[0_16px_26px_-16px_rgba(14,165,233,0.85)] transition-all hover:bg-[hsl(var(--brand-strong))] hover:shadow-[0_20px_30px_-16px_rgba(3,105,161,0.7)]"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? 'Agotado' : 'Agregar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
