'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Lock,
  CreditCard,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { useCart } from '@/contexts/CartContext'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

interface CheckoutForm {
  // Información personal
  firstName: string
  lastName: string
  email: string
  phone: string

  // Dirección de envío
  address: string
  city: string
  state: string
  zipCode: string
  country: string

  // Información de pago
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string

  // Opciones
  saveInfo: boolean
  acceptTerms: boolean
  newsletter: boolean
}

export default function CheckoutPageContent() {
  const { state, formatCurrency, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    saveInfo: false,
    acceptTerms: false,
    newsletter: false,
  })

  const handleInputChange = (
    field: keyof CheckoutForm,
    value: string | boolean
  ) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Redireccionar a página de confirmación
    clearCart()
    window.location.href = '/checkout/success'
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No hay productos en tu carrito
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Agrega algunos productos antes de proceder al checkout
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
          <Link href="/cart" className="hover:text-blue-600">
            Carrito
          </Link>
          <span>/</span>
          <span className="text-gray-900">Checkout</span>
        </div>

        {/* Título */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
          <div className="flex items-center text-sm text-gray-600">
            <Lock className="w-4 h-4 mr-2" />
            Compra Segura
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario de checkout */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información Personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input
                        id="firstName"
                        value={form.firstName}
                        onChange={e =>
                          handleInputChange('firstName', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={e =>
                          handleInputChange('lastName', e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={e =>
                          handleInputChange('email', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={e =>
                          handleInputChange('phone', e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dirección de Envío */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Dirección de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={e =>
                        handleInputChange('address', e.target.value)
                      }
                      placeholder="Calle, número, edificio, apartamento"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={e =>
                          handleInputChange('city', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Departamento *</Label>
                      <Select
                        onValueChange={value =>
                          handleInputChange('state', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cundinamarca">
                            Cundinamarca
                          </SelectItem>
                          <SelectItem value="antioquia">Antioquia</SelectItem>
                          <SelectItem value="valle">Valle del Cauca</SelectItem>
                          <SelectItem value="atlantico">Atlántico</SelectItem>
                          <SelectItem value="santander">Santander</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input
                        id="zipCode"
                        value={form.zipCode}
                        onChange={e =>
                          handleInputChange('zipCode', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de Pago */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Información de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName">
                      Nombre en la tarjeta *
                    </Label>
                    <Input
                      id="cardholderName"
                      value={form.cardholderName}
                      onChange={e =>
                        handleInputChange('cardholderName', e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Número de tarjeta *</Label>
                    <Input
                      id="cardNumber"
                      value={form.cardNumber}
                      onChange={e =>
                        handleInputChange('cardNumber', e.target.value)
                      }
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Fecha de vencimiento *</Label>
                      <Input
                        id="expiryDate"
                        value={form.expiryDate}
                        onChange={e =>
                          handleInputChange('expiryDate', e.target.value)
                        }
                        placeholder="MM/AA"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={form.cvv}
                        onChange={e => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-blue-800">
                      <Lock className="w-4 h-4" />
                      <span>
                        Tus datos están protegidos con encriptación SSL
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opciones adicionales */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveInfo"
                      checked={form.saveInfo}
                      onCheckedChange={checked =>
                        handleInputChange('saveInfo', checked as boolean)
                      }
                    />
                    <Label htmlFor="saveInfo" className="text-sm">
                      Guardar información para futuras compras
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={form.newsletter}
                      onCheckedChange={checked =>
                        handleInputChange('newsletter', checked as boolean)
                      }
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      Recibir ofertas y promociones por email
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={form.acceptTerms}
                      onCheckedChange={checked =>
                        handleInputChange('acceptTerms', checked as boolean)
                      }
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      Acepto los{' '}
                      <Link
                        href="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        términos y condiciones
                      </Link>{' '}
                      y la{' '}
                      <Link
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                      >
                        política de privacidad
                      </Link>
                      *
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen del pedido */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Productos */}
                  <div className="space-y-3">
                    {state.items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={item.image_url || '/placeholder.svg'}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Costos */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(state.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Envío:</span>
                      <span>
                        {state.shipping === 0 ? (
                          <span className="text-green-600">Calculado en checkout</span>
                        ) : (
                          formatCurrency(state.shipping)
                        )}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(state.total)}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-right">Incluye IVA</p>
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isProcessing || !form.acceptTerms}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Completar Compra
                    </>
                  )}
                </Button>

                <Link href="/cart">
                  <Button variant="outline" size="lg" className="w-full">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Volver al Carrito
                  </Button>
                </Link>
              </div>

              {/* Métodos de pago */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Métodos de pago aceptados
                    </p>
                    <div className="flex justify-center space-x-2">
                      <div className="bg-gray-100 px-3 py-2 rounded text-xs">
                        VISA
                      </div>
                      <div className="bg-gray-100 px-3 py-2 rounded text-xs">
                        Mastercard
                      </div>
                      <div className="bg-gray-100 px-3 py-2 rounded text-xs">
                        PSE
                      </div>
                      <div className="bg-gray-100 px-3 py-2 rounded text-xs">
                        Bancolombia
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
