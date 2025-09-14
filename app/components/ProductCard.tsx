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
  category?: string
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

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      image_url: imageUrl,
      stock: stockQuantity,
      category: product.categories?.name || product.category,
    })
  }

  const primaryImage = product.product_images?.find(img => img.is_primary)
  const imageUrl =
    primaryImage?.image_url || product.image_url || '/placeholder.svg'
  const imageAlt = primaryImage?.alt_text || product.name

  const stockQuantity = product.stock_quantity || product.stock || 0
  const isOutOfStock = stockQuantity === 0

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex">
          <div className="relative w-48 h-32 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
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
                  <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mt-1">
                  {product.categories?.name || product.category}
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
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
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

        {(product.categories || product.category) && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90">
              {product.categories?.name || product.category}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-2">
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
