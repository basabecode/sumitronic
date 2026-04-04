'use client'

/**
 * Payment Method Selector Component
 * Allows users to choose between different payment methods
 */

import { useState } from 'react'
import { CreditCard, Smartphone, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { type PaymentMethod } from '@/lib/payments'

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
  enabledMethods?: PaymentMethod[]
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  enabledMethods = ['DIGITAL_WALLET'],
}: PaymentMethodSelectorProps) {
  const paymentMethods = [
    {
      id: 'DIGITAL_WALLET' as PaymentMethod,
      name: 'Billeteras Digitales / Transferencia',
      description: 'Nequi, Daviplata, Bancolombia, Davivienda, Nubank',
      icon: Smartphone,
      enabled: enabledMethods.includes('DIGITAL_WALLET'),
      recommended: true,
    },
    {
      id: 'CREDIT_CARD' as PaymentMethod,
      name: 'Tarjeta de Crédito/Débito',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      enabled: enabledMethods.includes('CREDIT_CARD'),
      comingSoon: true,
    },
    {
      id: 'PSE' as PaymentMethod,
      name: 'PSE',
      description: 'Pago Seguro en Línea',
      icon: Building2,
      enabled: enabledMethods.includes('PSE'),
      comingSoon: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Método de Pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => onMethodChange(value as PaymentMethod)}
          className="space-y-3"
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="relative">
              <div
                className={`
                  flex items-start space-x-3 p-4 rounded-lg border-2 transition-all
                  ${
                    selectedMethod === method.id
                      ? 'border-[hsl(var(--brand))] bg-[hsl(var(--surface-highlight))]'
                      : 'border-gray-200 bg-white'
                  }
                  ${
                    !method.enabled || method.comingSoon
                      ? 'opacity-60 cursor-not-allowed'
                      : 'cursor-pointer hover:border-[hsl(var(--brand))] hover:shadow-sm'
                  }
                `}
                onClick={() => {
                  if (method.enabled && !method.comingSoon) {
                    onMethodChange(method.id)
                  }
                }}
              >
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  disabled={!method.enabled || method.comingSoon}
                  className="mt-1 border-[hsl(var(--brand))] text-[hsl(var(--brand-strong))] focus:ring-[hsl(var(--brand))]"
                />

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <method.icon className={`w-5 h-5 ${selectedMethod === method.id ? 'text-[hsl(var(--brand-strong))]' : 'text-gray-600'}`} />
                    <Label
                      htmlFor={method.id}
                      className={`font-semibold ${
                        !method.enabled || method.comingSoon
                          ? 'cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      {method.name}
                    </Label>
                    {method.recommended && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                        Recomendado
                      </span>
                    )}
                    {method.comingSoon && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                        Próximamente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {method.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        {selectedMethod === 'DIGITAL_WALLET' && (
          <Alert className="mt-4 bg-green-50 border-green-300">
            <AlertDescription className="text-sm text-green-900">
              ✓ <strong>Sin comisiones adicionales</strong> - Paga solo el valor de tu pedido
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
