import { Metadata } from 'next'
import CheckoutPageContent from './CheckoutPageContent'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { brand } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Checkout - ${brand.name}`,
  description: 'Finaliza tu compra de forma segura',
}

export default function CheckoutPage() {
  return (
    <ErrorBoundary>
      <CheckoutPageContent />
    </ErrorBoundary>
  )
}
