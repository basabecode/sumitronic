'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function CartPageContent() {
  const { state, removeItem, updateQuantity, clearCart, formatCurrency } =
    useCart()
  const [promoCode, setPromoCode] = useState('')
  const [isPromoApplied, setIsPromoApplied] = useState(false)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const applyPromoCode = () => {
    // Lógica para aplicar código promocional
    if (promoCode.toLowerCase() === 'descuento10') {
      setIsPromoApplied(true)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Agrega algunos productos increíbles a tu carrito
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Explorar Productos
              </Button>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-gray-900">Carrito</span>
        </div>

        {/* Título */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Carrito de Compras
          </h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {state.itemCount} {state.itemCount === 1 ? 'producto' : 'productos'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Productos</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vaciar carrito
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {state.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    {/* Imagen del producto */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image_url || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      {item.brand && (
                        <p className="text-sm text-gray-600">{item.brand}</p>
                      )}
                      {item.category && (
                        <Badge variant="outline" className="mt-1">
                          {item.category}
                        </Badge>
                      )}
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={e =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-16 text-center"
                        min="1"
                        max={item.stock}
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= (item.stock || 0)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.price)} c/u
                      </p>
                    </div>

                    {/* Botón eliminar */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div className="space-y-6">
            {/* Código promocional */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Código Promocional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ingresa tu código"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    disabled={isPromoApplied}
                  />
                  <Button
                    onClick={applyPromoCode}
                    disabled={!promoCode || isPromoApplied}
                    variant="outline"
                  >
                    Aplicar
                  </Button>
                </div>
                {isPromoApplied && (
                  <div className="text-green-600 text-sm">
                    ✓ Código aplicado: 10% de descuento
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resumen de costos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPromoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento (10%):</span>
                    <span>-{formatCurrency(state.subtotal * 0.1)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>
                    {formatCurrency(
                      isPromoApplied
                        ? state.total - state.subtotal * 0.1
                        : state.total
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Beneficios */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span>Envío a todo el país</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <span>Múltiples métodos de pago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="space-y-4">
              <Link href="/checkout">
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceder al Checkout
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="outline" size="lg" className="w-full">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
