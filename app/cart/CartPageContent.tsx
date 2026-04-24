'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Truck,
  Shield,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/CartContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function CartPageContent() {
  const { state, removeItem, updateQuantity, clearCart, formatCurrency } = useCart()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Header />
        <main className="container py-16">
          <div className="mx-auto max-w-md py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--surface-highlight))]">
              <ShoppingCart className="h-10 w-10 text-[hsl(var(--brand))]" aria-hidden="true" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-[hsl(var(--foreground))]">
              Tu carrito está vacío
            </h1>
            <p className="mt-2 text-[hsl(var(--text-muted))]">
              Aún no agregaste ningún producto. Revisa el catálogo y encuentra lo que necesitas.
            </p>
            <Link href="/products" className="mt-8 inline-block">
              <Button size="lg" className="h-12 rounded-xl gap-2">
                <ShoppingBag className="h-5 w-5" />
                Ver catálogo
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header />

      <main className="container py-8">
        {/* Breadcrumb */}
        <nav
          className="mb-6 flex items-center gap-2 text-sm text-[hsl(var(--text-muted))]"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[hsl(var(--brand-strong))] transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="font-medium text-[hsl(var(--foreground))]">Carrito</span>
        </nav>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-[hsl(var(--foreground))] sm:text-3xl">
            Carrito
            <span className="ml-2 text-base font-normal text-[hsl(var(--text-muted))]">
              ({state.itemCount} {state.itemCount === 1 ? 'producto' : 'productos'})
            </span>
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-[hsl(var(--text-muted))] hover:text-red-500 transition-colors"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Lista de productos */}
          <div className="space-y-3">
            {state.items.map(item => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-4 shadow-sm"
              >
                {/* Imagen */}
                <Link
                  href={`/products/${item.id}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[hsl(var(--border-subtle))] bg-white sm:h-24 sm:w-24"
                >
                  <div className="absolute inset-2">
                    <Image
                      src={item.image_url || item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-contain mix-blend-multiply"
                      sizes="96px"
                    />
                  </div>
                </Link>

                {/* Info + controles */}
                <div className="flex flex-1 flex-col gap-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {item.brand && (
                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-strong))]">
                          {item.brand}
                        </span>
                      )}
                      <Link href={`/products/${item.id}`}>
                        <h3 className="mt-0.5 text-sm font-semibold leading-snug text-[hsl(var(--foreground))] line-clamp-2 hover:text-[hsl(var(--brand-strong))] transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 rounded-lg p-1 text-[hsl(var(--text-muted))] transition-colors hover:text-red-500"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    {/* Controles cantidad */}
                    <div className="flex items-center rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] p-0.5">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[hsl(var(--foreground))] transition-colors hover:bg-white disabled:opacity-40"
                        disabled={item.quantity <= 1}
                        aria-label="Reducir cantidad"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold text-[hsl(var(--foreground))]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[hsl(var(--foreground))] transition-colors hover:bg-white disabled:opacity-40"
                        disabled={item.quantity >= (item.stock || item.stockCount || 99)}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      <p className="font-display text-base font-bold leading-none text-[hsl(var(--foreground))]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="mt-0.5 text-xs text-[hsl(var(--text-muted))]">
                          {formatCurrency(item.price)} c/u
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--text-muted))] hover:text-[hsl(var(--brand-strong))] transition-colors mt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Seguir comprando
            </Link>
          </div>

          {/* Sidebar — resumen */}
          <aside className="space-y-4">
            {/* Resumen del pedido */}
            <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-[hsl(var(--foreground))]">
                Resumen del pedido
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-[hsl(var(--text-muted))]">
                  <span>
                    Subtotal ({state.itemCount} {state.itemCount === 1 ? 'producto' : 'productos'})
                  </span>
                  <span>{formatCurrency(state.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[hsl(var(--text-muted))]">
                  <span>Envío</span>
                  <span className="text-emerald-600 font-medium">Por confirmar</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-[hsl(var(--foreground))]">Total</span>
                <span className="font-display text-xl font-bold text-[hsl(var(--foreground))]">
                  {formatCurrency(state.total)}
                </span>
              </div>

              <p className="mt-1 text-xs text-[hsl(var(--text-muted))]">Precio con IVA incluido</p>

              <Link href="/checkout" className="mt-5 block">
                <Button size="lg" className="h-12 w-full rounded-xl gap-2 text-base font-semibold">
                  <CreditCard className="h-5 w-5" />
                  Proceder al pago
                </Button>
              </Link>
            </div>

            {/* Beneficios */}
            <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] p-5 space-y-3">
              {[
                {
                  icon: Truck,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
                  text: 'Envío a toda Colombia',
                },
                {
                  icon: Shield,
                  color: 'text-[hsl(var(--brand-strong))]',
                  bg: 'bg-[hsl(var(--surface-highlight))]',
                  text: 'Compra respaldada por SUMITRONIC',
                },
                {
                  icon: MessageCircle,
                  color: 'text-violet-600',
                  bg: 'bg-violet-50',
                  text: 'Soporte por WhatsApp — sin bot',
                },
              ].map(({ icon: Icon, color, bg, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${bg}`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${color}`} aria-hidden="true" />
                  </div>
                  <span className="text-[hsl(var(--text-muted))]">{text}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
