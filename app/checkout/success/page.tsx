import { Metadata } from 'next'
import { Suspense } from 'react'
import SuccessPageContent from './SuccessPageContent'

export const metadata: Metadata = {
  title: 'Compra Exitosa - CapiShop',
  description: 'Tu pedido ha sido procesado exitosamente',
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}
