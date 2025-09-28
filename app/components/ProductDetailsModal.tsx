'use client'

import { useState } from 'react'
import {
  X,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Package,
  Shield,
  Truck,
  CreditCard,
  Check,
  AlertCircle,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string | number
  name: string
  brand: string
  price: number
  originalPrice?: number
  rating?: number
  reviews?: number
  image: string
  images?: string[]
  badge?: string
  inStock: boolean
  stockCount: number
  category: string
  description?: string
  product_images?: Array<{
    id: string
    image_url: string
    alt_text: string
    is_primary: boolean
    sort_order: number
  }>
}

interface ProductDetailsModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { addItem, openCart } = useCart()

  if (!product) return null

  // Obtener todas las imágenes del producto
  const productImages = (() => {
    const allImages: string[] = []

    // Imagen principal
    if (product.image) {
      allImages.push(product.image)
    }

    // Imágenes adicionales del array images
    if (product.images && product.images.length > 0) {
      allImages.push(...product.images.filter(img => img !== product.image))
    }

    // Imágenes de product_images (si existen)
    if (product.product_images && product.product_images.length > 0) {
      const additionalImages = product.product_images
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.image_url)
        .filter(img => !allImages.includes(img))
      allImages.push(...additionalImages)
    }

    // Si no hay imágenes, usar placeholder
    return allImages.length > 0 ? allImages : ['/placeholder.svg']
  })()

  // Generar características basadas en la categoría
  const getProductFeatures = (category: string, brand: string) => {
    const baseFeatures = [
      { name: 'Marca', value: brand },
      { name: 'Garantía', value: '12 meses' },
      { name: 'Origen', value: 'Original' },
      { name: 'Envío', value: 'Gratis a nivel nacional' },
    ]

    const categoryFeatures = {
      camaras: [
        { name: 'Resolución', value: '1080p Full HD' },
        { name: 'Visión nocturna', value: 'Hasta 30m' },
        { name: 'Conectividad', value: 'WiFi / Ethernet' },
        { name: 'Almacenamiento', value: 'MicroSD + Nube' },
        { name: 'Audio', value: 'Bidireccional' },
        { name: 'Detección', value: 'Movimiento y persona' },
      ],
      computacion: [
        { name: 'Procesador', value: 'Intel Core i5' },
        { name: 'Memoria RAM', value: '8GB DDR4' },
        { name: 'Almacenamiento', value: '256GB SSD' },
        { name: 'Sistema Operativo', value: 'Windows 11' },
      ],
      smartphones: [
        { name: 'Pantalla', value: '6.1" Super Retina XDR' },
        { name: 'Almacenamiento', value: '128GB' },
        { name: 'Cámara', value: 'Triple 12MP' },
        { name: 'Batería', value: 'Hasta 17h de video' },
      ],
      gaming: [
        { name: 'Plataforma', value: 'PlayStation / Xbox / PC' },
        { name: 'Conexión', value: 'Bluetooth / USB' },
        { name: 'Compatibilidad', value: 'Multi-plataforma' },
        { name: 'Batería', value: 'Hasta 40h de uso' },
      ],
    }

    return [
      ...baseFeatures,
      ...(categoryFeatures[category as keyof typeof categoryFeatures] || []),
    ]
  }

  const features = getProductFeatures(product.category, product.brand)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id.toString(),
        name: product.name,
        brand: product.brand,
        price: product.price,
        image_url: product.image,
        stock: product.stockCount,
        category: product.category,
      })
    }
    openCart()
    onClose()
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO')}`
  }

  const savings =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0
  const discountPercentage =
    product.originalPrice && savings > 0
      ? Math.round((savings / product.originalPrice) * 100)
      : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Detalles del producto</DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden aspect-square">
              <img
                src={productImages[selectedImageIndex] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-orange-600">
                  {product.badge}
                </Badge>
              )}

              {/* Navegación de imágenes */}
              {productImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    onClick={() =>
                      setSelectedImageIndex(prev =>
                        prev === 0 ? productImages.length - 1 : prev - 1
                      )
                    }
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    onClick={() =>
                      setSelectedImageIndex(prev =>
                        prev === productImages.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-orange-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain bg-white"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              {/* ...eliminado rating y reviews... */}
              {/* Precio */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-orange-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <Badge variant="destructive" className="bg-red-600">
                        -{discountPercentage}%
                      </Badge>
                    </>
                  )}
              </div>

              {savings > 0 && (
                <p className="text-green-600 font-medium mb-4">
                  Ahorras {formatPrice(savings)}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">En stock</span>
                  {product.stockCount <= 10 && (
                    <span className="text-amber-600 text-sm">
                      (Solo {product.stockCount} disponibles)
                    </span>
                  )}
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">Agotado</span>
                </>
              )}
            </div>

            {/* Cantidad y compra */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Cantidad:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(product.stockCount, quantity + 1))
                    }
                    className="h-8 w-8 p-0"
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Agregar al Carrito
                </Button>
                <Button variant="outline" size="sm" className="px-3">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="px-3">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Beneficios */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">
                  Envío GRATIS a nivel nacional
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Garantía oficial de 12 meses
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">
                  Producto 100% original
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">
                  Múltiples métodos de pago
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de información detallada */}
        <Separator className="my-6" />

        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specs">Especificaciones</TabsTrigger>
            <TabsTrigger value="description">Descripción</TabsTrigger>
            <TabsTrigger value="shipping">Envío y Devoluciones</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="space-y-4">
            <h3 className="text-lg font-semibold">Especificaciones Técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600">{feature.name}:</span>
                  <span className="font-medium">{feature.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="description" className="space-y-4">
            <h3 className="text-lg font-semibold">Descripción del Producto</h3>
            <div className="prose prose-sm">
              <p>
                El <strong>{product.name}</strong> de{' '}
                <strong>{product.brand}</strong> es un producto de alta calidad
                diseñado para satisfacer las necesidades más exigentes. Con
                tecnología de vanguardia y materiales premium, este producto
                ofrece un rendimiento excepcional y durabilidad garantizada.
              </p>
              <p>
                Perfecto para uso{' '}
                {product.category === 'camaras'
                  ? 'en seguridad doméstica y comercial'
                  : product.category === 'gaming'
                  ? 'en gaming profesional y entretenimiento'
                  : 'profesional y personal'}
                , este producto combina funcionalidad avanzada con facilidad de
                uso.
              </p>
              <p>
                Incluye garantía oficial del fabricante y soporte técnico
                especializado. Instalación y configuración disponibles en las
                principales ciudades de Colombia.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Envío</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Tiempos de Entrega</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Bogotá y área metropolitana: 1-2 días hábiles</li>
                  <li>• Principales ciudades: 2-3 días hábiles</li>
                  <li>• Resto del país: 3-5 días hábiles</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Devoluciones</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 30 días para devoluciones</li>
                  <li>• Producto en perfecto estado</li>
                  <li>• Embalaje original completo</li>
                  <li>• Costo de envío de devolución por cuenta del cliente</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
