'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Minus, Trash2, CreditCard, Shield, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

export default function CartSidebar() {
  const { state, removeItem, updateQuantity, closeCart, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    // Verificar si el usuario está autenticado
    if (!user) {
      // Redirigir a login si no está autenticado
      closeCart()
      router.push('/auth/login?redirect=/checkout')
      return
    }

    // Si está autenticado, redirigir a checkout
    closeCart()
    router.push('/checkout')
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO')}`
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="space-y-2.5 pr-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-[hsl(var(--brand-strong))]" />
                <span>Mi Carrito</span>
              </div>
            </SheetTitle>
            <Badge variant="secondary" className="ml-auto">
              {state.itemCount} {state.itemCount === 1 ? 'artículo' : 'artículos'}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Tu carrito está vacío</h3>
                <p className="text-gray-500 max-w-sm">
                  Explora nuestros productos y agrega artículos a tu carrito
                </p>
              </div>
              <Button
                onClick={closeCart}
                className="bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand-strong))]"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Items del carrito */}
              <div className="space-y-4">
                {state.items.map(item => (
                  <div key={item.id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image_url || item.image || '/placeholder.svg'}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-contain bg-white rounded-md border"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">{item.brand}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                            disabled={item.quantity >= (item.stock || item.stockCount || 999)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          {item.originalPrice !== undefined && item.originalPrice > item.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(item.originalPrice * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>

                      {item.quantity >= (item.stock || item.stockCount || 999) && (
                        <p className="text-xs text-amber-600 mt-1">Stock máximo alcanzado</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Garantía */}
              <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Garantía de 12 meses</span>
                </div>
                <p className="text-xs text-green-700">
                  Todos los productos incluyen garantía oficial del fabricante
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer del carrito */}
        {state.items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            {/* Resumen de precio */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(state.subtotal)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[hsl(var(--brand-strong))]">{formatPrice(state.total)}</span>
              </div>
              <p className="text-xs text-gray-500 text-right">Incluye IVA</p>
            </div>

            {/* Botones de acción */}
            <div className="space-y-2">
              {!user && (
                <p className="rounded-md bg-[hsl(var(--surface-highlight))] p-2 text-center text-xs text-[hsl(var(--text-muted))]">
                  Inicia sesión para proceder con tu compra
                </p>
              )}
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut || state.items.length === 0}
                className="w-full bg-[hsl(var(--brand))] text-white hover:bg-[hsl(var(--brand-strong))]"
              >
                {isCheckingOut ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>{user ? 'Proceder al Pago' : 'Iniciar Sesión para Pagar'}</span>
                  </div>
                )}
              </Button>

              <Button variant="outline" onClick={closeCart} className="w-full">
                Continuar Comprando
              </Button>

              {state.items.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Vaciar Carrito
                </Button>
              )}
            </div>

            {/* Métodos de pago */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 mb-2">Métodos de pago aceptados</p>
              <div className="flex justify-center space-x-2">
                <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">💳 Tarjetas</div>
                <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">🏦 PSE</div>
                <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">💰 Efectivo</div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
