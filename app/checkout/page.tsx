import { Metadata } from 'next'
import CheckoutPageContent from './CheckoutPageContent'

export const metadata: Metadata = {
  title: 'Checkout - CapiShop',
  description: 'Finaliza tu compra de forma segura',
}

export default function CheckoutPage() {
  return <CheckoutPageContent />
}
