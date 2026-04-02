'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { formatProductName } from '@/lib/formatting'
import Image from 'next/image'
import {
  BadgePercent,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Truck,
  Zap,
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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
    title: 'Envíos a todo Colombia',
    description: 'Cobertura nacional con seguimiento del despacho y acompañamiento en la entrega.',
    icon: Truck,
  },
  {
    title: 'Garantía y soporte',
    description: 'Atención para resolver dudas de instalación, compatibilidad y uso del producto.',
    icon: Shield,
  },
  {
    title: 'Compra con respaldo',
    description: 'Gestión clara para devoluciones y novedades cubiertas según las condiciones de la compra.',
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

function getAllImageUrls(product: Product): { url: string; alt: string }[] {
  if (product.product_images?.length > 0) {
    return product.product_images.map(img => ({ url: img.image_url, alt: img.alt_text || product.name }))
  }
  if (product.images && product.images.length > 0) {
    return product.images.map(url => ({ url, alt: product.name }))
  }
  return [{ url: getPrimaryImage(product), alt: product.name }]
}

function buildHighlights(product: Product, categoryName?: string) {
  const snippets = product.description
    .split(/[.!?]\s+/)
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 2)

  const defaults = [
    `Ideal para ${categoryName?.toLowerCase() || 'tu compra'} con información clara y disponibilidad visible.`,
    'Incluye detalles clave para revisar compatibilidad, entrega y condiciones de compra.',
    'Disponible con gestión local para despacho y seguimiento del pedido.',
  ]

  return [...snippets, ...defaults].slice(0, 3)
}

function buildFaq(product: Product, categoryName?: string) {
  return [
    {
      question: `¿Este ${product.name} sirve para ${categoryName?.toLowerCase() || 'mi necesidad'}?`,
      answer:
        'Si buscas una opción con información clara y soporte antes de comprar, esta ficha te ayuda a validar si se ajusta a lo que necesitas.',
    },
    {
      question: '¿Qué recibo además del producto?',
      answer:
        'Recibes confirmación del pedido, coordinación del despacho y apoyo para resolver dudas relacionadas con el uso del producto.',
    },
    {
      question: '¿Por qué comprarlo aquí y no solo comparar precio?',
      answer:
        'Además del precio, aquí puedes revisar disponibilidad, envío, garantía y soporte para tomar una decisión con más contexto.',
    },
  ]
}

function formatDimensions(dimensions: unknown) {
  if (!dimensions) return null
  if (typeof dimensions === 'object' && dimensions !== null) {
    return Object.entries(dimensions as Record<string, unknown>)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' • ')
  }
  return String(dimensions)
}

function getDiscountPercent(price: number, comparePrice?: number | null) {
  if (!comparePrice || comparePrice <= price) return null
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

function getStockTone(stock: number) {
  if (stock <= 0) {
    return {
      label: 'Sin stock',
      className: 'bg-rose-100 text-rose-700 border-rose-200',
    }
  }

  if (stock <= 5) {
    return {
      label: `Últimas ${stock} unidades`,
      className: 'bg-amber-100 text-amber-800 border-amber-200',
    }
  }

  return {
    label: `Stock disponible: ${stock}`,
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const [selectedImage, setSelectedImage] = useState<string>(getPrimaryImage(product))
  const [quantity, setQuantity] = useState(1)
  const { addItem, openCart, formatCurrency } = useCart()
  const { addItem: addFavorite, isFavorite, removeItem: removeFavorite } = useFavorites()

  const categoryName = product.category?.name || product.categories?.name
  const allImages = getAllImageUrls(product)
  const isOutOfStock = product.stock_quantity === 0
  const maxQuantity = Math.max(1, Math.min(product.stock_quantity || 1, 10))
  const favorite = isFavorite(product.id)
  const highlights = useMemo(() => buildHighlights(product, categoryName), [product, categoryName])
  const faqItems = useMemo(() => buildFaq(product, categoryName), [product, categoryName])
  const discountPercent = getDiscountPercent(product.price, product.compare_price)
  const stockTone = getStockTone(product.stock_quantity)
  const dimensionsLabel = formatDimensions(product.dimensions)
  const deliveryTone = isOutOfStock
    ? 'Consulta disponibilidad para nueva entrada'
    : product.price >= 100000
      ? 'Envío gratis disponible'
      : 'Envío calculado al finalizar'
  const deliveryMessage = isOutOfStock
    ? 'Podemos ayudarte a encontrar alternativa o avisarte cuando vuelva.'
    : 'Recíbelo con coordinación local y seguimiento comercial.'

  const specCards = [
    {
      title: 'Disponibilidad',
      value: isOutOfStock ? 'Actualmente agotado' : `${product.stock_quantity} unidades listas para despacho`,
      icon: PackageCheck,
    },
    {
      title: 'Marca',
      value: product.brand || 'No especificada',
      icon: Store,
    },
    {
      title: 'SKU',
      value: product.sku || 'Sin referencia',
      icon: Zap,
    },
    ...(product.weight
      ? [
          {
            title: 'Peso',
            value: `${product.weight} kg`,
            icon: Truck,
          },
        ]
      : []),
    ...(dimensionsLabel
      ? [
          {
            title: 'Dimensiones',
            value: dimensionsLabel,
            icon: Sparkles,
          },
        ]
      : []),
  ]

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

  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))
  const increaseQuantity = () => setQuantity(prev => Math.min(maxQuantity, prev + 1))

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[hsl(var(--text-muted))]" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-[hsl(var(--brand-strong))]">
          Inicio
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="transition-colors hover:text-[hsl(var(--brand-strong))]">
          Productos
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-[hsl(var(--foreground))]">{formatProductName(product.name)}</span>
      </nav>

      <section className="section-shell overflow-hidden">
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_380px]">
          <div className="space-y-4 p-4 lg:p-6">
            <div className="grid gap-3 xl:grid-cols-[80px_minmax(0,1fr)]">
              <div className="order-2 flex gap-2 overflow-x-auto pb-1 xl:order-1 xl:flex-col xl:overflow-visible">
                {allImages.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image.url)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-white transition-all ${
                      selectedImage === image.url
                        ? 'border-[hsl(var(--brand))] shadow-[0_0_0_3px_rgba(249,115,22,0.14)]'
                        : 'border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--border-strong))]'
                    }`}
                  >
                    <Image src={image.url} alt={image.alt} fill className="object-contain p-1.5" />
                  </button>
                ))}
              </div>

              <div className="order-1 xl:order-2">
                <div className="surface-elevated relative overflow-hidden rounded-2xl">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-orange-100/80 via-amber-50/60 to-transparent" />
                  <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-[hsla(var(--brand),0.12)] blur-3xl" />
                  <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                    {discountPercent ? (
                      <Badge className="rounded-full bg-[hsl(var(--brand))] px-3 py-1 text-white hover:bg-[hsl(var(--brand))]">
                        <BadgePercent className="mr-1 h-3.5 w-3.5" />
                        {discountPercent}% OFF
                      </Badge>
                    ) : null}
                    <Badge variant="outline" className={`rounded-full border ${stockTone.className}`}>
                      {stockTone.label}
                    </Badge>
                  </div>

                  <div className="relative aspect-square min-h-[240px] sm:min-h-[320px]">
                    <Image
                      src={selectedImage}
                      alt={product.name}
                      fill
                      priority
                      className="object-contain p-4 sm:p-8"
                      onError={() => setSelectedImage('/placeholder.svg')}
                    />
                  </div>

                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/38 backdrop-blur-[2px]">
                      <Badge variant="destructive" className="px-4 py-1.5 text-sm">
                        Agotado
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 pt-4 border-t border-[hsl(var(--border-subtle))]">
              {trustPoints.map(point => {
                const Icon = point.icon
                return (
                  <div key={point.title} className="flex gap-2.5 items-start">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--surface-highlight))]">
                      <Icon className="h-4 w-4 text-[hsl(var(--brand-strong))]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[hsl(var(--foreground))]">{point.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[hsl(var(--text-muted))]">{point.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid gap-5 sm:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h3 className="font-display text-base font-semibold text-[hsl(var(--foreground))] mb-2">
                  Información principal
                </h3>
                <p className="text-sm leading-relaxed text-[hsl(var(--text-muted))]">
                  {product.description}
                </p>

                <ul className="mt-3 space-y-2">
                  {highlights.map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--success))]" />
                      <span className="text-xs leading-relaxed text-[hsl(var(--foreground))]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] p-3.5">
                <h3 className="text-xs font-semibold text-[hsl(var(--foreground))] mb-1">
                  Características
                </h3>
                <div className="divide-y divide-[hsl(var(--border-subtle))] mt-2">
                  {specCards.map((card, index) => {
                    const Icon = card.icon
                    return (
                      <div
                        key={`${card.title}-${index}`}
                        className="flex items-center gap-2 py-2 text-xs"
                      >
                        <Icon className="h-3 w-3 flex-shrink-0 text-[hsl(var(--text-muted))]" />
                        <span className="text-[hsl(var(--text-muted))]">{card.title}</span>
                        <span className="font-medium text-[hsl(var(--foreground))] ml-auto text-right">{card.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <aside className="border-l border-[hsl(var(--border-subtle))] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,247,237,0.9))]">
            <div className="lg:sticky lg:top-0 overflow-hidden">
              <div className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  {categoryName ? (
                    <Badge className="rounded-full bg-[hsl(var(--surface-highlight))] px-3 py-1 text-[hsl(var(--brand-strong))] hover:bg-[hsl(var(--surface-highlight))]">
                      {categoryName}
                    </Badge>
                  ) : null}
                  {product.brand ? (
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      {product.brand}
                    </Badge>
                  ) : null}
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    SKU {product.sku}
                  </Badge>
                </div>

                <p className="eyebrow-label mt-4">Detalle del producto</p>
                <h1 className="mt-2 font-display text-[2rem] font-semibold leading-[1.05] tracking-tight text-[hsl(var(--foreground))] md:text-[2.2rem]">
                  {formatProductName(product.name)}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-2.5 text-sm text-[hsl(var(--text-muted))]">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className={`h-4 w-4 ${index < 4 ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span>Compra protegida</span>
                  <span className="hidden h-1 w-1 rounded-full bg-[hsl(var(--text-soft))] sm:inline-block" />
                  <span>Envíos disponibles en Colombia</span>
                </div>
              </div>

              <div className="border-t border-[hsl(var(--border-subtle))] px-5 py-4">
                {discountPercent && product.compare_price ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[hsl(var(--text-muted))] line-through">
                      {formatCurrency(product.compare_price)}
                    </span>
                    <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
                      Ahorras {discountPercent}%
                    </Badge>
                  </div>
                ) : null}

                <div className="mt-1.5 flex items-end gap-3">
                  <p className="font-display text-[2.35rem] font-semibold tracking-tight text-[hsl(var(--foreground))]">
                    {formatCurrency(product.price)}
                  </p>
                </div>

                <div className="mt-2 space-y-1.5 text-sm text-[hsl(var(--text-muted))]">
                  <p>Precio final con IVA incluido.</p>
                  <p>Revisa disponibilidad y condiciones antes de agregar al carrito.</p>
                </div>

                <div className="mt-4 flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--success))]" />
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                      {isOutOfStock ? 'Pendiente de reposición' : 'Disponible para compra'}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[hsl(var(--text-muted))]">
                      {discountPercent ? `${discountPercent}% de descuento disponible.` : 'Producto listo para agregar al carrito.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[hsl(var(--border-subtle))] px-5 py-4">
                {!isOutOfStock ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[hsl(var(--foreground))]">Cantidad</p>
                        <p className="text-sm text-[hsl(var(--text-muted))]">Máximo {maxQuantity} unidades por pedido</p>
                      </div>
                      <div className="flex items-center rounded-full border border-[hsl(var(--border-strong))] bg-[hsl(var(--surface-muted))] p-1">
                        <button
                          type="button"
                          onClick={decreaseQuantity}
                          className="touch-target rounded-full text-[hsl(var(--foreground))] transition-colors hover:bg-white"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-10 text-center text-sm font-semibold text-[hsl(var(--foreground))]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={increaseQuantity}
                          className="touch-target rounded-full text-[hsl(var(--foreground))] transition-colors hover:bg-white"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="h-13 w-full rounded-full bg-[hsl(var(--brand))] text-base font-semibold text-white hover:bg-[hsl(var(--brand-strong))]"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Agregar al carrito
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className={`rounded-full ${favorite ? 'border-red-200 bg-red-50 text-red-600' : ''}`}
                        onClick={handleToggleFavorite}
                      >
                        <Heart className={`mr-2 h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
                        Guardar
                      </Button>
                      <Button variant="outline" className="rounded-full" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartir
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-base font-semibold text-[hsl(var(--foreground))]">Producto sin inventario en este momento</p>
                    <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">
                      Puedes guardarlo en favoritos o compartir la referencia para retomarlo cuando vuelva a estar disponible.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className={`rounded-full ${favorite ? 'border-red-200 bg-red-50 text-red-600' : ''}`}
                        onClick={handleToggleFavorite}
                      >
                        <Heart className={`mr-2 h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
                        Guardar
                      </Button>
                      <Button variant="outline" className="rounded-full" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartir
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[hsl(var(--border-subtle))] px-5 py-4">
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--success))]" />
                    <p className="text-sm text-[hsl(var(--foreground))]">
                      {isOutOfStock ? 'Podemos ayudarte cuando el producto vuelva a estar disponible.' : 'Inventario disponible para compra y despacho.'}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--success))]" />
                    <p className="text-sm text-[hsl(var(--foreground))]">Atención para resolver dudas de compatibilidad o uso.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--success))]" />
                    <p className="text-sm text-[hsl(var(--foreground))]">Información visible para comprar con mayor tranquilidad.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-10 section-shell p-6">
        <p className="eyebrow-label">Preguntas frecuentes</p>
        <div className="mt-5">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`faq-${index}`}
                className="mb-3 rounded-[1.25rem] border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] px-5 last:mb-0"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-[hsl(var(--foreground))] hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pt-0 text-sm leading-7 text-[hsl(var(--text-muted))]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-10 section-shell p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow-label">También te puede interesar</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[hsl(var(--foreground))]">
                Productos relacionados
              </h2>
            </div>
            <p className="hidden max-w-sm text-right text-sm text-[hsl(var(--text-muted))] md:block">
              Productos relacionados para comparar otras opciones similares.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} viewMode="grid" />
            ))}
          </div>
        </section>
      )}

      {!isOutOfStock && (
        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-[hsl(var(--border-subtle))] bg-white/95 p-3 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[hsl(var(--foreground))]">{formatProductName(product.name)}</p>
              <p className="text-sm text-[hsl(var(--text-muted))]">{formatCurrency(product.price)}</p>
            </div>
            <Button
              size="lg"
              className="h-12 rounded-full bg-[hsl(var(--brand))] px-5 text-white hover:bg-[hsl(var(--brand-strong))]"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Agregar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
