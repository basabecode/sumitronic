'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Share2,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCard } from '@/app/components/ProductCard'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  sku: string
  weight?: number
  dimensions?: any
  brand?: string
  category?: {
    id: string
    name: string
    slug: string
  }
  // Support both structures for compatibility
  categories?: {
    id: string
    name: string
    slug: string
  }
  product_images: Array<{
    id: string
    image_url: string
    alt_text: string
    is_primary: boolean
  }>
}

interface ProductClientProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  // Robust image extraction - check multiple sources
  const getInitialImage = () => {
    // Check for direct image properties first
    if ((product as any).image) return (product as any).image
    if ((product as any).image_url) return (product as any).image_url

    // Check product_images array
    const primaryImage = product.product_images?.find(img => img.is_primary)
    if (primaryImage?.image_url) return primaryImage.image_url

    const firstImage = product.product_images?.[0]
    if (firstImage?.image_url) return firstImage.image_url

    // Fallback to placeholder
    return '/placeholder.svg'
  }

  const [selectedImage, setSelectedImage] = useState<string>(getInitialImage())
  const [quantity, setQuantity] = useState(1)
  const { addItem, openCart } = useCart()
  const { addItem: addToFavorites, isFavorite, removeItem: removeFromFavorites } = useFavorites()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const isOutOfStock = product.stock_quantity === 0
  const maxQuantity = Math.min(product.stock_quantity || 0, 10)
  const categoryName = product.category?.name || product.categories?.name

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      image_url: selectedImage,
      brand: product.brand || '',
      stock: product.stock_quantity,
      stockCount: product.stock_quantity,
      quantity: quantity
    })
    openCart()
  }

  const handleToggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: selectedImage,
        image: selectedImage,
        brand: product.brand || '',
        category: categoryName || '',
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="text-gray-500 hover:text-gray-700">
              Inicio
            </a>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <a href="/products" className="text-gray-500 hover:text-gray-700">
              Productos
            </a>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={selectedImage || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg">
                  Agotado
                </Badge>
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {product.product_images && product.product_images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.product_images.map(image => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.image_url)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === image.image_url
                      ? 'border-orange-500'
                      : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              {categoryName}
            </p>

            <div className="flex items-center mt-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                (4.0) • 24 reseñas
              </span>
            </div>
          </div>

          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </div>

          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Stock info */}
          <div className="flex items-center space-x-4">
            <Badge variant={isOutOfStock ? 'destructive' : 'secondary'} className={!isOutOfStock ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ""}>
              {isOutOfStock
                ? 'Agotado'
                : `${product.stock_quantity} disponibles`}
            </Badge>
            <span className="text-sm text-gray-600">
              SKU: {product.sku}
            </span>
          </div>

          {/* Cantidad y botones */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Cantidad:</label>
                <select
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {[...Array(maxQuantity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <Button size="lg" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al carrito
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleFavorite}
                  className={isFavorite(product.id) ? "text-red-600 border-red-200 bg-red-50" : ""}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Características de envío */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Envío nacional</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Garantía 12 meses</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">
                30 días devolución
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de información adicional */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Descripción</TabsTrigger>
            <TabsTrigger value="specifications">
              Especificaciones
            </TabsTrigger>
            <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Descripción del producto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Especificaciones técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>SKU:</strong> {product.sku}
                  </div>
                  {product.weight && (
                    <div>
                      <strong>Peso:</strong> {product.weight}kg
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <strong>Dimensiones:</strong>{' '}
                      {JSON.stringify(product.dimensions)}
                    </div>
                  )}
                  <div>
                    <strong>Stock:</strong> {product.stock_quantity}{' '}
                    unidades
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Reseñas de clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Las reseñas estarán disponibles próximamente.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Productos relacionados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                viewMode="grid"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
