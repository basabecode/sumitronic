import { Metadata } from 'next'
import CartPageContent from './CartPageContent'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

export const metadata: Metadata = {
  title: 'Carrito de Compras - CapiShop',
  description: 'Revisa y modifica los productos en tu carrito de compras',
}

export default function CartPage() {
  return (
    <ErrorBoundary>
      <CartPageContent />
    </ErrorBoundary>
  )
}
