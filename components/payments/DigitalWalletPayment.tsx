'use client'

/**
 * Digital Wallet Payment Selector Component
 * Premium UI for selecting and displaying digital wallet payment options
 */

import { useState } from 'react'
import Image from 'next/image'
import { Smartphone, Copy, CheckCircle2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DIGITAL_WALLET_ACCOUNTS,
  WHATSAPP_NUMBER_DISPLAY,
  generateWhatsAppURL,
  formatCurrency,
  type DigitalWalletProvider,
  type PaymentReference,
} from '@/lib/payments'

interface DigitalWalletPaymentProps {
  totalAmount: number
  orderId?: string
  onPaymentReferenceChange?: (reference: PaymentReference | undefined) => void
}

export default function DigitalWalletPayment({
  totalAmount,
  orderId = 'TEMP',
  onPaymentReferenceChange,
}: DigitalWalletPaymentProps) {
  const [selectedProvider, setSelectedProvider] = useState<DigitalWalletProvider | null>(null)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [senderPhone, setSenderPhone] = useState('')
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber.replace(/\s/g, ''))
    setCopiedAccount(accountNumber)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  const handleReferenceChange = (field: 'reference' | 'phone', value: string) => {
    if (field === 'reference') {
      setReferenceNumber(value)
    } else {
      setSenderPhone(value)
    }

    // Update parent component
    if (onPaymentReferenceChange) {
      const reference: PaymentReference | undefined =
        value.trim() || referenceNumber.trim() || senderPhone.trim()
          ? {
              referenceNumber: field === 'reference' ? value : referenceNumber,
              senderPhone: field === 'phone' ? value : senderPhone,
              amount: totalAmount,
              selectedProvider: selectedProvider || 'NEQUI',
              paymentDate: new Date(),
            }
          : undefined

      onPaymentReferenceChange(reference)
    }
  }

  const whatsappURL = generateWhatsAppURL(orderId, totalAmount, WHATSAPP_NUMBER_DISPLAY.replace(/\s/g, ''))

  return (
    <Card className="border-2 border-[hsl(var(--border-subtle))] bg-gradient-to-br from-[hsl(var(--surface-highlight))] to-[hsl(var(--background))]">
      <CardHeader>
        <CardTitle className="flex items-center text-[hsl(var(--foreground))]">
          <Smartphone className="w-5 h-5 mr-2" />
          Billeteras Digitales / Transferencia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <Alert className="border-[hsl(var(--border-strong))] bg-white">
          <AlertDescription className="text-sm">
            <strong className="text-[hsl(var(--foreground))]">Instrucciones:</strong>
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-gray-700">
              <li>Transfiere <strong className="text-[hsl(var(--foreground))]">{formatCurrency(totalAmount)}</strong> a una de las cuentas</li>
              <li>Copia el número de cuenta haciendo clic en el botón</li>
              <li>Completa el pago desde tu app bancaria</li>
              <li>Envía el comprobante por WhatsApp o ingresa la referencia</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Account Options */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900">
            Selecciona una cuenta para transferir:
          </Label>

          <div className="grid gap-3">
            {DIGITAL_WALLET_ACCOUNTS.map((account) => (
              <div
                key={account.provider}
                className={`
                  relative p-4 rounded-lg border-2 transition-all cursor-pointer
                  hover:shadow-md hover:scale-[1.02]
                  ${
                    selectedProvider === account.provider
                      ? 'border-[hsl(var(--brand))] bg-[hsl(var(--surface-highlight))] shadow-md'
                      : 'border-gray-200 bg-white hover:border-[hsl(var(--brand))]'
                  }
                `}
                onClick={() => setSelectedProvider(account.provider)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={account.icon}
                        alt={account.displayName}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {account.displayName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {account.accountType === 'WALLET' ? 'Celular' : 'Cuenta'}: {account.accountNumber}
                      </p>
                      {account.instructions && (
                        <p className="text-xs text-gray-500 mt-1">
                          {account.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyAccount(account.accountNumber)
                    }}
                    className="flex items-center space-x-1 hover:border-[hsl(var(--border-strong))] hover:bg-[hsl(var(--surface-highlight))] hover:text-[hsl(var(--brand-strong))]"
                  >
                    {copiedAccount === account.accountNumber ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Reference Section */}
        <div className="space-y-4 rounded-lg border-2 border-dashed border-[hsl(var(--border-strong))] bg-white p-4">
          <Label className="text-base font-semibold text-gray-900">
            Información del Pago (Opcional)
          </Label>

          <div className="space-y-3">
            <div>
              <Label htmlFor="referenceNumber" className="text-sm">
                Número de Referencia / Código de Aprobación
              </Label>
              <Input
                id="referenceNumber"
                type="text"
                placeholder="Ej: 123456789"
                value={referenceNumber}
                onChange={(e) => handleReferenceChange('reference', e.target.value)}
                className="mt-1 focus:border-[hsl(var(--brand))] focus:ring-[hsl(var(--brand))]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ingresa el código que aparece en tu comprobante
              </p>
            </div>

            <div>
              <Label htmlFor="senderPhone" className="text-sm">
                Celular desde el que pagaste
              </Label>
              <Input
                id="senderPhone"
                type="tel"
                placeholder="300 123 4567"
                value={senderPhone}
                onChange={(e) => handleReferenceChange('phone', e.target.value)}
                className="mt-1 focus:border-[hsl(var(--brand))] focus:ring-[hsl(var(--brand))]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nos ayuda a verificar tu pago más rápido
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">
                ¿Ya realizaste el pago?
              </h4>
              <p className="text-sm text-green-800 mb-3">
                Envíanos tu comprobante por WhatsApp para procesar tu pedido más rápido
              </p>
              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Enviar Comprobante a WhatsApp
                </Button>
              </a>
              <p className="text-xs text-green-700 mt-2">
                WhatsApp: {WHATSAPP_NUMBER_DISPLAY}
              </p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <Alert className="border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-highlight))]">
          <AlertDescription className="text-xs text-[hsl(var(--foreground))]">
            🔒 <strong>Seguridad:</strong> Nunca compartas tu contraseña o PIN. Solo necesitamos el comprobante de pago.
            Verificaremos tu pago manualmente antes de procesar tu pedido.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
