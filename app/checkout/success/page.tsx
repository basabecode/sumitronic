import { Metadata } from 'next'
import { Suspense } from 'react'
import SuccessPageContent from './SuccessPageContent'
import { brand } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Compra Exitosa - ${brand.name}`,
  description: 'Tu pedido ha sido procesado exitosamente',
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}
