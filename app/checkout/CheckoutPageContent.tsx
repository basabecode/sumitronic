'use client'

import { useState, useEffect } from 'react'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { PaymentMethodSelector, DigitalWalletPayment } from '@/components/payments'
import {
  type PaymentMethod,
  type PaymentReference,
  type CheckoutFormData as PaymentCheckoutFormData,
  validateCheckoutForm,
  sanitizeCheckoutForm,
} from '@/lib/payments'
import { isValidEmail, isValidColombianPhone } from '@/lib/formatting'


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
  paymentMethod: PaymentMethod
  paymentReference?: PaymentReference

  // Opciones
  saveInfo: boolean
  acceptTerms: boolean
  newsletter: boolean
}

export default function CheckoutPageContent() {
  const { state, formatCurrency, clearCart } = useCart()
  const { user, profile } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<string>('new')

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
    paymentMethod: 'DIGITAL_WALLET',
    paymentReference: undefined,
    saveInfo: false,
    acceptTerms: false,
    newsletter: false,
  })

  const clearFieldError = (field: string) =>
    setFormErrors(p => ({ ...p, [field]: '' }))

  const handleAddressSelect = (indexStr: string, addressesList: any[] = savedAddresses) => {
    setSelectedAddressIndex(indexStr)
    const isNew = indexStr === 'new'

    if (isNew) {
      setForm(prev => ({
        ...prev,
        address: '',
        city: '',
        state: '',
        zipCode: ''
      }))
    } else {
      const idx = parseInt(indexStr)
      const addr = addressesList[idx]
      if (addr) {
        setForm(prev => ({
          ...prev,
          address: addr.street,
          city: addr.city,
          state: addr.department?.toLowerCase() || '',
          zipCode: addr.postal_code
        }))
      }
    }
  }

  // Cargar datos del perfil
  useEffect(() => {
    if (user && profile) {
      // Nombre y email
      const [firstName, ...lastNameParts] = (profile.full_name || '').split(' ')
      const lastName = lastNameParts.join(' ')

      setForm(prev => ({
        ...prev,
        email: user.email || prev.email,
        phone: profile.phone || prev.phone,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName
      }))

      // Direcciones guardadas
      if (profile.address) {
        try {
          const addresses = Array.isArray(profile.address)
            ? profile.address
            : [profile.address]
          setSavedAddresses(addresses)

          // Seleccionar la primera por defecto si existe y no hemos seleccionado nada aun
          if (addresses.length > 0) {
             // Solo seleccionamos si estaba en 'new' por defecto y queremos autoseleccionar
             handleAddressSelect('0', addresses)
          }
        } catch (e) {
          console.error('Error parsing addresses', e)
        }
      }
    }
  }, [user, profile])

  const handleInputChange = (
    field: keyof CheckoutForm,
    value: string | boolean | PaymentMethod | PaymentReference | undefined
  ) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})
    setSubmitError('')

    // ── Validación de campos obligatorios ──
    const errors: Record<string, string> = {}
    if (!form.firstName.trim()) errors.firstName = 'El nombre es obligatorio'
    if (!form.lastName.trim()) errors.lastName = 'El apellido es obligatorio'
    if (!isValidEmail(form.email.trim()))
      errors.email = 'Ingresa un correo electrónico válido'
    if (!isValidColombianPhone(form.phone))
      errors.phone = 'El teléfono debe ser un número colombiano de 10 dígitos (ej: 300 000 0000)'
    if (!form.address.trim()) errors.address = 'La dirección de entrega es obligatoria'
    if (!form.city.trim()) errors.city = 'La ciudad es obligatoria'
    if (!form.state) errors.state = 'Selecciona el departamento'
    if (!form.acceptTerms) errors.acceptTerms = 'Debes aceptar los términos para continuar'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      // Hacer scroll al primer error
      setTimeout(() => {
        document.querySelector('[data-field-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }

    setIsProcessing(true)

    try {
      // ── Guardar orden en la base de datos ──
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_info: {
            fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
            email: form.email.trim(),
            phone: form.phone.trim(),
          },
          items: state.items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image_url: item.image_url || null,
          })),
          shipping_address: {
            address: form.address.trim(),
            city: form.city.trim(),
            department: form.state,
            zipCode: form.zipCode.trim(),
            country: form.country,
          },
          subtotal: state.subtotal,
          shipping: state.shipping,
          total: state.total,
          payment_method: form.paymentMethod,
          notes: form.paymentReference
            ? `Billetera: ${form.paymentReference.selectedProvider} | Ref: ${form.paymentReference.referenceNumber || '-'} | Cel: ${form.paymentReference.senderPhone || '-'}`
            : null,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setSubmitError(json.error || 'No se pudo procesar el pedido. Intenta de nuevo.')
        setIsProcessing(false)
        return
      }

      const orderId = json.data?.id || `SUM-${Date.now()}`

      // ── Notificar al administrador (sin bloquear el flujo) ──
      fetch('/api/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: json.data }),
      }).catch(() => {})

      // ── Limpiar carrito y redirigir a éxito ──
      clearCart()
      window.location.href = `/checkout/success?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(form.email.trim())}&total=${state.total}`
    } catch {
      setSubmitError('Error de conexión. Verifica tu internet e intenta de nuevo.')
      setIsProcessing(false)
    }
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
              <Button size="lg" className="bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand-strong))]">
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
          <Link href="/" className="hover:text-[hsl(var(--brand-strong))]">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-[hsl(var(--brand-strong))]">
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
                        onChange={e => {
                          handleInputChange('firstName', e.target.value)
                          if (formErrors.firstName) clearFieldError('firstName')
                        }}
                        placeholder="Ej: Carlos"
                        className={formErrors.firstName ? 'border-red-500' : ''}
                        required
                      />
                      {formErrors.firstName && <p className="text-sm text-red-600 mt-1" data-field-error>{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={e => {
                          handleInputChange('lastName', e.target.value)
                          if (formErrors.lastName) clearFieldError('lastName')
                        }}
                        placeholder="Ej: García"
                        className={formErrors.lastName ? 'border-red-500' : ''}
                        required
                      />
                      {formErrors.lastName && <p className="text-sm text-red-600 mt-1" data-field-error>{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={e => {
                          handleInputChange('email', e.target.value)
                          if (formErrors.email) clearFieldError('email')
                        }}
                        placeholder="correo@ejemplo.com"
                        className={formErrors.email ? 'border-red-500' : ''}
                        required
                      />
                      {formErrors.email && <p className="text-sm text-red-600 mt-1" data-field-error>{formErrors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={e => {
                          handleInputChange('phone', e.target.value)
                          if (formErrors.phone) clearFieldError('phone')
                        }}
                        placeholder="300 000 0000"
                        className={formErrors.phone ? 'border-red-500' : ''}
                        required
                      />
                      {formErrors.phone && <p className="text-sm text-red-600 mt-1" data-field-error>{formErrors.phone}</p>}
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
                  {savedAddresses.length > 0 && (
                    <div className="mb-6">
                      <Label className="block mb-3 font-medium">Mis Direcciones</Label>
                      <RadioGroup
                         value={selectedAddressIndex}
                         onValueChange={handleAddressSelect}
                         className="grid grid-cols-1 gap-3"
                      >
                         {savedAddresses.map((addr, idx) => (
                           <div key={idx} className={`flex items-start space-x-3 border p-3 rounded-lg transition-colors ${selectedAddressIndex === idx.toString() ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                              <RadioGroupItem value={idx.toString()} id={`addr-${idx}`} className="mt-1" />
                              <Label htmlFor={`addr-${idx}`} className="font-normal cursor-pointer flex-1">
                                 <div className="font-medium text-gray-900">{addr.street}</div>
                                 <div className="text-sm text-gray-500">
                                   {addr.neighborhood ? `${addr.neighborhood}, ` : ''}
                                   {addr.city}, {addr.department}
                                 </div>
                                 {addr.additional_info && (
                                   <div className="text-xs text-gray-400 mt-1">{addr.additional_info}</div>
                                 )}
                              </Label>
                           </div>
                         ))}
                         <div className={`flex items-center space-x-3 border p-3 rounded-lg transition-colors ${selectedAddressIndex === 'new' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                              <RadioGroupItem value="new" id="addr-new" />
                              <Label htmlFor="addr-new" className="font-medium cursor-pointer text-gray-900">
                                 Usar una nueva dirección
                              </Label>
                         </div>
                      </RadioGroup>
                      <Separator className="my-6" />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={e => {
                        handleInputChange('address', e.target.value)
                        if (formErrors.address) clearFieldError('address')
                      }}
                      placeholder="Calle, número, edificio, apartamento"
                      className={formErrors.address ? 'border-red-500' : ''}
                      required
                    />
                    {formErrors.address && <p className="text-sm text-red-600 mt-1" data-field-error>{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={e => {
                          handleInputChange('city', e.target.value)
                          if (formErrors.city) clearFieldError('city')
                        }}
                        placeholder="Ej: Bogotá"
                        className={formErrors.city ? 'border-red-500' : ''}
                        required
                      />
                      {formErrors.city && <p className="text-sm text-red-600 mt-1" data-field-error>{formErrors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">Departamento *</Label>
                      <Select
                        value={form.state}
                        onValueChange={value => {
                          handleInputChange('state', value)
                          if (formErrors.state) clearFieldError('state')
                        }}
                      >
                        <SelectTrigger className={formErrors.state ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="amazonas">Amazonas</SelectItem>
                          <SelectItem value="antioquia">Antioquia</SelectItem>
                          <SelectItem value="arauca">Arauca</SelectItem>
                          <SelectItem value="atlantico">Atlántico</SelectItem>
                          <SelectItem value="bolivar">Bolívar</SelectItem>
                          <SelectItem value="boyaca">Boyacá</SelectItem>
                          <SelectItem value="caldas">Caldas</SelectItem>
                          <SelectItem value="caqueta">Caquetá</SelectItem>
                          <SelectItem value="casanare">Casanare</SelectItem>
                          <SelectItem value="cauca">Cauca</SelectItem>
                          <SelectItem value="cesar">Cesar</SelectItem>
                          <SelectItem value="choco">Chocó</SelectItem>
                          <SelectItem value="cordoba">Córdoba</SelectItem>
                          <SelectItem value="cundinamarca">Cundinamarca</SelectItem>
                          <SelectItem value="guainia">Guainía</SelectItem>
                          <SelectItem value="guaviare">Guaviare</SelectItem>
                          <SelectItem value="huila">Huila</SelectItem>
                          <SelectItem value="laguajira">La Guajira</SelectItem>
                          <SelectItem value="magdalena">Magdalena</SelectItem>
                          <SelectItem value="meta">Meta</SelectItem>
                          <SelectItem value="narino">Nariño</SelectItem>
                          <SelectItem value="nortesantander">Norte de Santander</SelectItem>
                          <SelectItem value="putumayo">Putumayo</SelectItem>
                          <SelectItem value="quindio">Quindío</SelectItem>
                          <SelectItem value="risaralda">Risaralda</SelectItem>
                          <SelectItem value="sanandres">San Andrés y Providencia</SelectItem>
                          <SelectItem value="santander">Santander</SelectItem>
                          <SelectItem value="sucre">Sucre</SelectItem>
                          <SelectItem value="tolima">Tolima</SelectItem>
                          <SelectItem value="valle">Valle del Cauca</SelectItem>
                          <SelectItem value="vaupes">Vaupés</SelectItem>
                          <SelectItem value="vichada">Vichada</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.state && <p className="text-sm text-red-600 mt-1" data-field-error>{formErrors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input
                        id="zipCode"
                        value={form.zipCode}
                        onChange={e =>
                          handleInputChange('zipCode', e.target.value)
                        }
                        placeholder="Ej: 110111"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Método de Pago */}
              <PaymentMethodSelector
                selectedMethod={form.paymentMethod}
                onMethodChange={(method) => handleInputChange('paymentMethod', method)}
              />

              {/* Digital Wallet Payment Details */}
              {form.paymentMethod === 'DIGITAL_WALLET' && (
                <DigitalWalletPayment
                  totalAmount={state.total}
                  orderId="PREVIEW"
                  onPaymentReferenceChange={(reference) =>
                    handleInputChange('paymentReference', reference)
                  }
                />
              )}

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
                      onCheckedChange={checked => {
                        handleInputChange('acceptTerms', checked as boolean)
                        if (formErrors.acceptTerms) clearFieldError('acceptTerms')
                      }}
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      Acepto los{' '}
                      <Link
                        href="/help/terminos-y-condiciones"
                        className="text-[hsl(var(--brand-strong))] hover:underline"
                      >
                        términos y condiciones
                      </Link>{' '}
                      y la{' '}
                      <Link
                        href="/help/politica-de-privacidad"
                        className="text-[hsl(var(--brand-strong))] hover:underline"
                      >
                        política de privacidad
                      </Link>
                      *
                    </Label>
                  </div>
                  {formErrors.acceptTerms && (
                    <p className="text-sm text-red-600" data-field-error>{formErrors.acceptTerms}</p>
                  )}
                </CardContent>
              </Card>

              {/* Error global de envío */}
              {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}
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
                    {state.shipping === 0 && (
                      <p className="text-xs text-amber-600 mt-1">Envío calculado por el equipo tras confirmar el pedido</p>
                    )}

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
                  className="w-full bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand-strong))]"
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
                    <p className="text-sm text-gray-600 mb-4">
                      Métodos de pago aceptados
                    </p>
                    <div className="flex justify-center flex-wrap gap-3">
                      {[
                        { src: '/bancos/nequi_1.png',       alt: 'Nequi' },
                        { src: '/bancos/daviplata_1.png',    alt: 'Daviplata' },
                        { src: '/bancos/bancolombia_3.png',  alt: 'Bancolombia' },
                        { src: '/bancos/davivienda_1.png',   alt: 'Davivienda' },
                        { src: '/bancos/nubank_1.png',       alt: 'Nubank' },
                      ].map(bank => (
                        <div
                          key={bank.alt}
                          className="relative h-16 w-24 rounded-lg border-2 border-gray-200 bg-white p-2 transition-all duration-300 hover:scale-110 hover:border-[hsl(var(--brand))] hover:shadow-md"
                        >
                          <Image src={bank.src} alt={bank.alt} fill className="object-contain p-1" />
                        </div>
                      ))}
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
