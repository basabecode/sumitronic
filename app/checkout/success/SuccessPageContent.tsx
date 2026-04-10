'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { brand } from '@/lib/brand'

interface OrderDetails {
  orderNumber: string
  estimatedDelivery: string
  email: string
  total: number
}

const SuccessPageContent: React.FC = () => {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    // Obtener detalles del pedido de los parámetros de búsqueda
    const orderNumber = searchParams.get('orderNumber') || `CAP-${Date.now()}`
    const email = searchParams.get('email') || 'cliente@ejemplo.com'
    const total = parseFloat(searchParams.get('total') || '0')

    // Calcular fecha estimada de entrega (5-7 días hábiles)
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 7)
    const estimatedDelivery = deliveryDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    setOrderDetails({
      orderNumber,
      estimatedDelivery,
      email,
      total,
    })

    // Limpiar el carrito después de una compra exitosa
    clearCart()
  }, [searchParams, clearCart])

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[hsl(var(--brand))]" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Encabezado de éxito */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Compra Realizada con Éxito!</h1>
          <p className="text-gray-600">
            Gracias por tu compra. Hemos recibido tu pedido y lo procesaremos pronto.
          </p>
        </div>

        {/* Detalles del pedido */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalles del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Número de Pedido</label>
                <p className="text-lg font-semibold">{orderDetails.orderNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Pagado</label>
                <p className="text-lg font-semibold text-green-600">
                  ${orderDetails.total.toLocaleString('es-CO')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email de Confirmación</label>
                <p className="text-lg">{orderDetails.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Entrega Estimada
                </label>
                <p className="text-lg">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos pasos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              ¿Qué sigue?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-[hsl(var(--surface-highlight))] p-1">
                  <div className="h-2 w-2 rounded-full bg-[hsl(var(--brand))]" />
                </div>
                <div>
                  <p className="font-medium">Confirmación por email</p>
                  <p className="text-sm text-gray-600">
                    Te enviaremos un email de confirmación con todos los detalles de tu pedido.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-[hsl(var(--surface-highlight))] p-1">
                  <div className="h-2 w-2 rounded-full bg-[hsl(var(--brand))]" />
                </div>
                <div>
                  <p className="font-medium">Preparación del pedido</p>
                  <p className="text-sm text-gray-600">
                    Nuestro equipo preparará tu pedido cuidadosamente para el envío.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-[hsl(var(--surface-highlight))] p-1">
                  <div className="h-2 w-2 rounded-full bg-[hsl(var(--brand))]" />
                </div>
                <div>
                  <p className="font-medium">Información de seguimiento</p>
                  <p className="text-sm text-gray-600">
                    Recibirás un código de seguimiento cuando tu pedido sea despachado.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                  <div className="h-2 w-2 bg-green-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Entrega</p>
                  <p className="text-sm text-gray-600">
                    Tu pedido llegará en la fecha estimada. ¡Disfrútalo!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de soporte */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">¿Necesitas ayuda?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent('Hola, tengo una consulta sobre mi pedido')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    WhatsApp: +57 {brand.whatsappDisplay}
                  </Button>
                </a>
                <a href={`mailto:${brand.supportEmail}`}>
                  <Button variant="outline" size="sm">
                    {brand.supportEmail}
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/products">Continuar Comprando</Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>

        {/* Mensaje de agradecimiento */}
        <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-lg font-medium text-gray-900 mb-2">
            ¡Gracias por confiar en {brand.name}!
          </p>
          <p className="text-gray-600">
            Tu satisfacción es nuestra prioridad. Esperamos que disfrutes tu compra y vuelvas
            pronto.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SuccessPageContent
