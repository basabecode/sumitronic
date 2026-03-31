'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

interface Order {
  id: string
  order_number?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  created_at: string
  shipping_address?: {
    street?: string
    city?: string
    state?: string
    postal_code?: string
  } | null
  order_items: Array<{
    id: string
    quantity: number
    unit_price: number
    products: {
      id: string
      name: string
      image_url: string
    }
  }>
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  processing: {
    label: 'Procesando',
    color: 'bg-blue-100 text-blue-800',
    icon: Package,
  },
  shipped: {
    label: 'Enviado',
    color: 'bg-purple-100 text-purple-800',
    icon: Package,
  },
  delivered: {
    label: 'Entregado',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          order_items (
            id,
            quantity,
            unit_price,
            products (
              id,
              name,
              image_url
            )
          )
        `
        )
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError('Error al cargar los pedidos')
      } else {
        setOrders(data || [])
      }
    } catch (err) {
      setError('Error inesperado al cargar los pedidos')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="mt-2 text-gray-600">
            Revisa el estado y los detalles de tus pedidos
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
        <p className="mt-2 text-gray-600">
          Revisa el estado y los detalles de tus pedidos
        </p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes pedidos aún
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Cuando realices tu primer pedido, aparecerá aquí
            </p>
            <Button>Explorar productos</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const statusInfo = statusConfig[order.status]
            const StatusIcon = statusInfo.icon

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{order.order_number || order.id.slice(0, 8)}
                      </CardTitle>
                      <CardDescription>
                        {format(
                          new Date(order.created_at),
                          'dd MMM yyyy, HH:mm',
                          { locale: es }
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Productos */}
                    <div>
                      <h4 className="font-semibold mb-3">Productos</h4>
                      <div className="space-y-3">
                        {order.order_items.map(item => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3"
                          >
                            <img
                              src={
                                item.products.image_url || '/placeholder.svg'
                              }
                              alt={item.products.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {item.products.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Cantidad: {item.quantity} ×{' '}
                                {formatCurrency(item.unit_price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resumen */}
                    <div>
                      <h4 className="font-semibold mb-3">Resumen</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Subtotal
                          </span>
                          <span className="text-sm">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Envío</span>
                          <span className="text-sm">Gratis</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      {order.shipping_address && (
                        <div className="mt-4">
                          <h5 className="font-medium text-sm mb-2">
                            Dirección de envío
                          </h5>
                          <p className="text-sm text-gray-600">
                            {order.shipping_address.street}
                            <br />
                            {order.shipping_address.city},{' '}
                            {order.shipping_address.state}
                            <br />
                            {order.shipping_address.postal_code}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
