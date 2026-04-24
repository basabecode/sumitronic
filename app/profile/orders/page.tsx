'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Hash,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/formatting'

interface OrderItem {
  id?: string
  product_id?: string
  name: string
  quantity: number
  unit_price: number
  price?: number
  image_url?: string
}

interface Order {
  id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  payment_method?: string | null
  total: number
  subtotal: number
  tax: number
  shipping: number
  tracking_number?: string | null
  created_at: string
  updated_at: string
  items: OrderItem[]
  shipping_address?: {
    street?: string
    city?: string
    state?: string
    postal_code?: string
  } | null
}

const orderSteps = [
  { key: 'pending', label: 'Recibido', icon: Clock },
  { key: 'processing', label: 'En preparación', icon: Package },
  { key: 'shipped', label: 'Enviado', icon: Truck },
  { key: 'delivered', label: 'Entregado', icon: CheckCircle },
]

const statusConfig = {
  pending: { label: 'Recibido', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'En preparación', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
}

const paymentStatusConfig = {
  pending: { label: 'Pago pendiente', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Pago confirmado', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Pago rechazado', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-700' },
  partially_refunded: { label: 'Reembolso parcial', color: 'bg-orange-100 text-orange-800' },
}

const paymentMethodLabel: Record<string, string> = {
  nequi: 'Nequi',
  bancolombia: 'Bancolombia',
  daviplata: 'Daviplata',
  cash_on_delivery: 'Pago contra entrega',
  bank_transfer: 'Transferencia bancaria',
}

function OrderProgressBar({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 font-medium py-2">
        <XCircle className="h-4 w-4" />
        Pedido cancelado
      </div>
    )
  }

  const currentIndex = orderSteps.findIndex(s => s.key === status)

  return (
    <div className="flex items-center gap-0 w-full mt-2 mb-1">
      {orderSteps.map((step, idx) => {
        const done = idx <= currentIndex
        const active = idx === currentIndex
        const Icon = step.icon

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0
                  ${done ? 'bg-[hsl(var(--brand))]' : 'bg-gray-200'}`}
              >
                <Icon className={`h-4 w-4 ${done ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <span
                className={`text-[10px] mt-1 text-center leading-tight max-w-[60px]
                  ${active ? 'text-[hsl(var(--brand))] font-semibold' : done ? 'text-gray-600' : 'text-gray-400'}`}
              >
                {step.label}
              </span>
            </div>
            {idx < orderSteps.length - 1 && (
              <div
                className={`flex-1 h-[2px] mb-4 mx-1
                  ${idx < currentIndex ? 'bg-[hsl(var(--brand))]' : 'bg-gray-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          id,
          status,
          payment_status,
          payment_method,
          total,
          subtotal,
          tax,
          shipping,
          tracking_number,
          items,
          shipping_address,
          created_at,
          updated_at
        `
        )
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError('Error al cargar los pedidos')
      } else {
        setOrders((data || []) as Order[])
      }
    } catch {
      setError('Error inesperado al cargar los pedidos')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const fmt = formatPrice

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="mt-2 text-gray-600">Revisa el estado y los detalles de tus pedidos</p>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
        <p className="mt-2 text-gray-600">Revisa el estado y los detalles de tus pedidos</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes pedidos aún</h3>
            <p className="text-gray-500 text-center mb-6">
              Cuando realices tu primer pedido, aparecerá aquí
            </p>
            <Button asChild>
              <a href="/products">Explorar productos</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const statusInfo = statusConfig[order.status] ?? statusConfig['pending']
            const payInfo =
              paymentStatusConfig[order.payment_status] ?? paymentStatusConfig['pending']
            const StatusIcon = statusInfo.icon
            const orderRef = order.id.slice(0, 8).toUpperCase()
            const orderItems = Array.isArray(order.items) ? order.items : []
            const isExpanded = !!expanded[order.id]

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div>
                      <CardTitle className="text-lg">Pedido #{orderRef}</CardTitle>
                      <CardDescription>
                        {format(new Date(order.created_at), "d 'de' MMMM yyyy, HH:mm", {
                          locale: es,
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`${statusInfo.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </Badge>
                      <Badge className={payInfo.color}>{payInfo.label}</Badge>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <OrderProgressBar status={order.status} />

                  {/* Número de seguimiento */}
                  {order.tracking_number && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg text-sm">
                      <Hash className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="text-blue-800">
                        Número de seguimiento: <strong>{order.tracking_number}</strong>
                      </span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Resumen rápido siempre visible */}
                  <div className="flex flex-wrap justify-between items-center gap-2 py-3 border-t">
                    <span className="text-sm text-gray-500">
                      {orderItems.length} {orderItems.length === 1 ? 'producto' : 'productos'}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{fmt(order.total)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpand(order.id)}
                        className="flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            Ocultar <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Ver detalles <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Detalles expandibles */}
                  {isExpanded && (
                    <div className="mt-4 space-y-6 border-t pt-4">
                      {/* Productos */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4" /> Productos
                        </h4>
                        {orderItems.length === 0 ? (
                          <p className="text-sm text-gray-500">Sin detalle de productos</p>
                        ) : (
                          <div className="space-y-3">
                            {orderItems.map((item, index) => {
                              const itemPrice = item.unit_price ?? item.price ?? 0
                              return (
                                <div key={item.id ?? index} className="flex items-center gap-3">
                                  <Image
                                    src={item.image_url || '/placeholder.svg'}
                                    alt={item.name}
                                    width={56}
                                    height={56}
                                    className="object-cover rounded-lg border"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {item.quantity} x {fmt(itemPrice)}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold">
                                    {fmt(item.quantity * itemPrice)}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Resumen de costos */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Resumen de pago
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                              <span>Subtotal</span>
                              <span>{fmt(order.subtotal ?? order.total)}</span>
                            </div>
                            {order.shipping > 0 && (
                              <div className="flex justify-between text-gray-600">
                                <span>Envío</span>
                                <span>{fmt(order.shipping)}</span>
                              </div>
                            )}
                            {order.tax > 0 && (
                              <div className="flex justify-between text-gray-600">
                                <span>IVA</span>
                                <span>{fmt(order.tax)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span>Total</span>
                              <span>{fmt(order.total)}</span>
                            </div>
                            {order.payment_method && (
                              <div className="flex justify-between text-gray-600 pt-1">
                                <span>Método de pago</span>
                                <span>
                                  {paymentMethodLabel[order.payment_method] ?? order.payment_method}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-gray-600">Estado del pago</span>
                              <Badge className={`${payInfo.color} text-xs`}>{payInfo.label}</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Dirección de envío */}
                        {order.shipping_address && (
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <MapPin className="h-4 w-4" /> Dirección de entrega
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {order.shipping_address.street}
                              {order.shipping_address.city && (
                                <>
                                  <br />
                                  {order.shipping_address.city}
                                  {order.shipping_address.state
                                    ? `, ${order.shipping_address.state}`
                                    : ''}
                                </>
                              )}
                              {order.shipping_address.postal_code && (
                                <>
                                  <br />
                                  CP: {order.shipping_address.postal_code}
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Última actualización */}
                      <p className="text-xs text-gray-400 pt-2 border-t">
                        Última actualización:{' '}
                        {format(new Date(order.updated_at), "d 'de' MMMM yyyy, HH:mm", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
