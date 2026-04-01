'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  CheckCircle2,
  ChevronRight,
  Heart,
  RotateCcw,
  Shield,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/products/ProductCard'
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
  dimensions?: unknown
  brand?: string
  image_url?: string
  images?: string[]
  compare_price?: number | null
  category?: {
    id: string
    name: string
    slug: string
  }
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

const trustPoints = [
  {
    title: 'Envíos nacionales asegurados',
    description: 'Despachamos a toda Colombia con seguimiento y coordinación local.',
    icon: Truck,
  },
  {
    title: 'Garantía y soporte real',
    description: 'Acompañamiento postventa para instalación, compatibilidad y uso.',
    icon: Shield,
  },
  {
    title: 'Compra con margen de decisión',
    description: 'Política de devolución para compras no usadas y fallas cubiertas.',
    icon: RotateCcw,
  },
]

function getPrimaryImage(product: Product) {
  const primaryImage = product.product_images?.find(image => image.is_primary)
  return (
    primaryImage?.image_url ||
    product.product_images?.[0]?.image_url ||
    product.images?.[0] ||
    product.image_url ||
    '/placeholder.svg'
  )
}

// Devuelve todas las URLs de imágenes disponibles para miniaturas
function getAllImageUrls(product: Product): { url: string; alt: string }[] {
  if (product.product_images?.length > 0) {
    return product.product_images.map(img => ({ url: img.image_url, alt: img.alt_text || product.name }))
  }
  if (product.images && product.images.length > 0) {
    return product.images.map(url => ({ url, alt: product.name }))
  }
  return []
}

function buildHighlights(product: Product, categoryName?: string) {
  const snippets = product.description
    .split(/[.!?]\s+/)
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 3)

  const defaults = [
    `Configurado para ${categoryName?.toLowerCase() || 'uso diario'} con enfoque práctico y confiable.`,
    'Selección curada para compra segura, no solo por precio sino por compatibilidad y soporte.',
    `Inventario local para entrega más rápida y seguimiento en Colombia.`,
  ]

  return [...snippets, ...defaults].slice(0, 3)
}

function buildFaq(product: Product, categoryName?: string) {
  return [
    {
      question: `¿Este ${product.name} es adecuado para ${categoryName?.toLowerCase() || 'mi necesidad'}?`,
      answer:
        'Sí, si buscas una solución lista para comprar con acompañamiento comercial y soporte local. Si necesitas confirmar compatibilidad antes de pagar, CapiShop puede orientarte.',
    },
    {
      question: '¿Qué pasa después de la compra?',
      answer:
        'Recibes confirmación, coordinación de despacho y soporte para resolver dudas de instalación o uso del producto.',
    },
    {
      question: '¿Cómo sé si vale la pena frente a otras opciones?',
      answer:
        'La propuesta aquí no es solo el precio: combina disponibilidad local, garantía, soporte y una compra menos riesgosa.',
    },
  ]
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const [selectedImage, setSelectedImage] = useState<string>(getPrimaryImage(product))
  const [quantity, setQuantity] = useState(1)
  const { addItem, openCart, formatCurrency } = useCart()
  const { addItem: addFavorite, isFavorite, removeItem: removeFavorite } = useFavorites()

  const categoryName = product.category?.name || product.categories?.name
  const allImages = getAllImageUrls(product)
  const isOutOfStock = product.stock_quantity === 0
  const maxQuantity = Math.min(product.stock_quantity || 0, 10)
  const favorite = isFavorite(product.id)
  const highlights = useMemo(() => buildHighlights(product, categoryName), [product, categoryName])
  const faqItems = useMemo(() => buildFaq(product, categoryName), [product, categoryName])
  const pricePerInstallment = Math.round(product.price / 3)

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
      quantity,
      category: categoryName || '',
    })
    openCart()
  }

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFavorite(product.id)
      return
    }

    addFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: selectedImage,
      image: selectedImage,
      brand: product.brand || '',
      category: categoryName || '',
    })
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Revisa ${product.name} en CapiShop`,
      url: window.location.href,
    }

    if (navigator.share) {
      await navigator.share(shareData)
      return
    }

    await navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-[hsl(var(--text-muted))]" aria-label="Breadcrumb">
        <a href="/">Inicio</a>
        <ChevronRight className="h-4 w-4" />
        <a href="/products">Productos</a>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-[hsl(var(--foreground))] capitalize">{product.name}</span>
      </nav>

      <section className="section-shell overflow-hidden">
        <div className="grid gap-10 p-5 lg:grid-cols-[1.1fr,0.9fr] lg:p-8">
          <div className="space-y-4">
            <div className="surface-panel relative aspect-square overflow-hidden rounded-[1.5rem] bg-[hsl(var(--surface-muted))]">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                className="object-contain p-6"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45">
                  <Badge variant="destructive" className="text-sm">
                    Agotado
                  </Badge>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(image.url)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 bg-white ${
                      selectedImage === image.url
                        ? 'border-[hsl(var(--brand))]'
                        : 'border-[hsl(var(--border-subtle))]'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {categoryName && (
                  <Badge className="rounded-full bg-[hsl(var(--surface-highlight))] px-4 py-1 text-[hsl(var(--brand-strong))] hover:bg-[hsl(var(--surface-highlight))]">
                    {categoryName}
                  </Badge>
                )}
                {product.brand && (
                  <Badge variant="outline" className="rounded-full px-4 py-1">
                    {product.brand}
                  </Badge>
                )}
                <span className="text-sm text-[hsl(var(--text-muted))]">SKU {product.sku}</span>
              </div>

              <div>
                <p className="eyebrow-label">Producto recomendado</p>
                <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))] md:text-5xl capitalize">
                  {product.name}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[hsl(var(--text-muted))] md:text-lg">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className={`h-4 w-4 ${index < 4 ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-sm text-[hsl(var(--text-muted))]">
                  Compra con confianza, soporte local y selección curada.
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {highlights.map(item => (
                <Card key={item} className="surface-panel rounded-[1.4rem] border-0">
                  <CardContent className="p-4">
                    <Sparkles className="h-5 w-5 text-[hsl(var(--brand))]" />
                    <p className="mt-3 text-sm leading-6 text-[hsl(var(--foreground))]">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
                <div className="section-shell p-5">
                  <p className="eyebrow-label">Por qué ayuda a decidir</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {trustPoints.map(point => {
                      const Icon = point.icon
                      return (
                        <div key={point.title} className="rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
                          <Icon className="h-5 w-5 text-[hsl(var(--brand))]" />
                          <p className="mt-3 font-medium text-[hsl(var(--foreground))]">{point.title}</p>
                          <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">
                            {point.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="section-shell p-5">
                  <p className="eyebrow-label">Lo esencial</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">Disponibilidad</p>
                      <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">
                        {isOutOfStock ? 'Actualmente sin inventario.' : `${product.stock_quantity} unidades listas para despacho.`}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">Compra planeada</p>
                      <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">
                        Referencia para pagos de aproximadamente {formatCurrency(pricePerInstallment)} en 3 partes.
                      </p>
                    </div>
                    {product.weight && (
                      <div className="rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
                        <p className="text-sm font-medium text-[hsl(var(--foreground))]">Peso</p>
                        <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">{product.weight} kg</p>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
                        <p className="text-sm font-medium text-[hsl(var(--foreground))]">Dimensiones</p>
                        <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">
                          {typeof product.dimensions === 'object' && product.dimensions !== null
                            ? Object.entries(product.dimensions as Record<string, unknown>).map(([k, v]) => `${k}: ${v}`).join(' × ')
                            : String(product.dimensions)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              <aside className="section-shell h-fit p-5 lg:sticky lg:top-28">
                <p className="eyebrow-label">Listo para comprar</p>
                <div className="mt-3">
                  <p className="font-display text-4xl font-semibold text-[hsl(var(--foreground))]">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">
                    Precio final con IVA incluido. Envío gratis desde $100.000.
                  </p>
                </div>

                <div className="mt-5 rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--success))]">
                    <CheckCircle2 className="h-4 w-4" />
                    {isOutOfStock ? 'Te avisamos cuando vuelva.' : 'Inventario confirmado para compra.'}
                  </div>
                </div>

                {!isOutOfStock && (
                  <div className="mt-5 space-y-4">
                    <label className="block text-sm font-medium text-[hsl(var(--foreground))]">
                      Cantidad
                    </label>
                    <select
                      value={quantity}
                      onChange={event => setQuantity(Number(event.target.value))}
                      className="h-12 w-full rounded-2xl border border-[hsl(var(--border-strong))] bg-white px-4"
                    >
                      {Array.from({ length: maxQuantity }, (_, index) => index + 1).map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <Button
                      size="lg"
                      className="h-12 w-full rounded-full bg-[hsl(var(--brand))] text-white hover:bg-[hsl(var(--brand-strong))]"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Agregar al carrito
                    </Button>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className={`rounded-full ${favorite ? 'border-red-200 bg-red-50 text-red-600' : ''}`}
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
                    Favorito
                  </Button>
                  <Button variant="outline" className="rounded-full" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir
                  </Button>
                </div>

                <div className="mt-5 space-y-3 border-t border-[hsl(var(--border-subtle))] pt-5">
                  {trustPoints.map(point => {
                    const Icon = point.icon
                    return (
                      <div key={point.title} className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-4 w-4 text-[hsl(var(--brand))]" />
                        <div>
                          <p className="text-sm font-medium text-[hsl(var(--foreground))]">{point.title}</p>
                          <p className="text-sm text-[hsl(var(--text-muted))]">{point.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr,0.9fr]">
        <div className="section-shell p-6">
          <p className="eyebrow-label">Preguntas clave antes de comprar</p>
          <div className="mt-5 space-y-4">
            {faqItems.map(item => (
              <div key={item.question} className="rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
                <h2 className="text-base font-medium text-[hsl(var(--foreground))]">{item.question}</h2>
                <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-shell p-6">
          <p className="eyebrow-label">Compra con contexto</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
              <p className="text-base font-medium text-[hsl(var(--foreground))]">Ideal si priorizas confianza</p>
              <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">
                Esta página está pensada para ayudarte a decidir rápido: descripción clara, disponibilidad, soporte local y entrada directa al carrito.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[hsl(var(--surface-muted))] p-4">
              <p className="text-base font-medium text-[hsl(var(--foreground))]">Cross-sell útil, no decorativo</p>
              <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">
                Los productos relacionados se muestran como siguiente paso lógico dentro de la misma categoría.
              </p>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-10 section-shell p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow-label">Siguiente paso recomendado</p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-[hsl(var(--foreground))]">
                Productos relacionados
              </h2>
            </div>
            <p className="hidden max-w-sm text-right text-sm text-[hsl(var(--text-muted))] md:block">
              Opciones del mismo universo de compra para comparar sin salir del flujo.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} viewMode="grid" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
