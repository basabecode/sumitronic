'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Package, Truck, MessageCircle, Mail, Copy, Check } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { brand } from '@/lib/brand'

interface OrderDetails {
  orderNumber: string
  estimatedDelivery: string
  email: string
  total: number
}

const SuccessPageContent: React.FC = () => {
  const { clearCart, formatCurrency } = useCart()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const orderNumber =
      searchParams.get('orderNumber') || `SMT-${Date.now().toString(36).toUpperCase()}`
    const email = searchParams.get('email') || ''
    const total = parseFloat(searchParams.get('total') || '0')

    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 7)
    const estimatedDelivery = deliveryDate.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    setOrderDetails({ orderNumber, estimatedDelivery, email, total })
    clearCart()
  }, [searchParams, clearCart])

  const handleCopyOrder = async () => {
    if (!orderDetails) return
    await navigator.clipboard.writeText(orderDetails.orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!orderDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[hsl(var(--brand))] border-t-transparent" />
      </div>
    )
  }

  const steps = [
    {
      icon: Mail,
      title: 'Confirmación por email',
      description:
        'Te enviaremos los detalles del pedido a ' +
        (orderDetails.email || 'tu correo registrado') +
        '.',
      done: false,
    },
    {
      icon: Package,
      title: 'Preparación del envío',
      description: 'Nuestro equipo alista tu pedido para despacho.',
      done: false,
    },
    {
      icon: Truck,
      title: 'Seguimiento disponible',
      description: 'Recibirás el código de guía cuando salga de bodega.',
      done: false,
    },
    {
      icon: CheckCircle2,
      title: 'Entrega',
      description: `Llegará aproximadamente el ${orderDetails.estimatedDelivery}.`,
      done: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))]">
      <div className="container py-12">
        <div className="mx-auto max-w-xl space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-[hsl(var(--foreground))]">
              Pedido recibido
            </h1>
            <p className="mt-2 text-[hsl(var(--text-muted))]">
              Lo tenemos. Te contactaremos para coordinar el pago y el despacho.
            </p>
          </div>

          {/* Detalles del pedido */}
          <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--text-muted))]">
              Detalles del pedido
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[hsl(var(--text-muted))]">N° de pedido</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="font-display text-lg font-bold text-[hsl(var(--foreground))]">
                    {orderDetails.orderNumber}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyOrder}
                    className="rounded-md p-1 text-[hsl(var(--text-muted))] hover:text-[hsl(var(--brand-strong))] transition-colors"
                    aria-label="Copiar número de pedido"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              {orderDetails.total > 0 && (
                <div>
                  <p className="text-xs text-[hsl(var(--text-muted))]">Total del pedido</p>
                  <p className="mt-1 font-display text-lg font-bold text-emerald-600">
                    {formatCurrency(orderDetails.total)}
                  </p>
                </div>
              )}
              {orderDetails.email && (
                <div className="col-span-2">
                  <p className="text-xs text-[hsl(var(--text-muted))]">Confirmación enviada a</p>
                  <p className="mt-1 text-sm font-medium text-[hsl(var(--foreground))]">
                    {orderDetails.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pasos */}
          <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--text-muted))]">
              ¿Qué sigue?
            </h2>
            <div className="space-y-4">
              {steps.map(({ icon: Icon, title, description, done }) => (
                <div key={title} className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? 'bg-emerald-100' : 'bg-[hsl(var(--surface-highlight))]'}`}
                  >
                    <Icon
                      className={`h-4 w-4 ${done ? 'text-emerald-600' : 'text-[hsl(var(--brand))]'}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[hsl(var(--text-muted))]">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soporte */}
          <div className="rounded-2xl border border-[hsl(var(--surface-highlight))] bg-[hsl(var(--surface-highlight))] p-5">
            <p className="text-sm font-semibold text-[hsl(var(--brand-strong))]">
              ¿Tienes una duda sobre tu pedido?
            </p>
            <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
              Escríbenos por WhatsApp con tu número de pedido y lo resolvemos en el acto.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi pedido ${orderDetails.orderNumber}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp {brand.whatsappDisplay}
              </a>
              <a
                href={`mailto:${brand.supportEmail}?subject=Consulta pedido ${orderDetails.orderNumber}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border-subtle))] bg-white px-4 py-2.5 text-sm font-semibold text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--surface-muted))]"
              >
                <Mail className="h-4 w-4" />
                {brand.supportEmail}
              </a>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="flex-1">
              <Button size="lg" className="h-12 w-full rounded-xl">
                Seguir comprando
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-xl border-[hsl(var(--border-subtle))]"
              >
                Volver al inicio
              </Button>
            </Link>
          </div>

          <p className="text-center text-sm text-[hsl(var(--text-muted))]">
            Gracias por comprar en {brand.name}. Te respondemos en horario Lun–Vie.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SuccessPageContent
