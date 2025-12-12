'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Star } from 'lucide-react'
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
  category?: string | {
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
  viewMode?: 'grid' | 'list'
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

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex">
          <div className="relative w-48 h-32 flex-shrink-0 bg-gray-50">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-contain p-2"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="destructive">Agotado</Badge>
              </div>
            )}
          </div>

          <CardContent className="flex-1 p-6">
            <div className="flex justify-between items-start h-full">
              <div className="flex-1">
                <Link href={`/products/${product.id}`}>
                  <h3
                    className="text-lg font-medium hover:text-blue-600 transition-colors line-clamp-1"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mt-1">
                  {categoryName}
                </p>

                <p className="text-gray-700 mt-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">(4.0)</span>
                </div>
              </div>

              <div className="text-right ml-6">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  Stock: {stockQuantity}
                </p>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className="flex items-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isOutOfStock ? 'Agotado' : 'Agregar'}
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
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Agotado</Badge>
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="sm" className="bg-white/90">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {categoryName && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90">
              {categoryName}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3
            className="font-medium text-base leading-tight hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem] mb-2"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center mt-2 mb-3">
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
          <span className="text-sm text-gray-600 ml-2">(4.0)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </p>
            <p className="text-sm text-gray-600">Stock: {stockQuantity}</p>
          </div>

          <Button
            size="sm"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="flex items-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? 'Agotado' : 'Agregar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
