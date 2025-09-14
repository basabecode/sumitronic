import { Metadata } from 'next'
import CartPageContent from './CartPageContent'

export const metadata: Metadata = {
  title: 'Carrito de Compras - CapiShop',
  description: 'Revisa y modifica los productos en tu carrito de compras',
}

export default function CartPage() {
  return <CartPageContent />
}
