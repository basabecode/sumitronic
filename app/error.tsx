'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { brand } from '@/lib/brand'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 font-display text-2xl font-bold text-[hsl(var(--brand))]">
        {brand.name}
      </div>
      <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
      <p className="text-gray-600 mb-6">Ocurrió un error inesperado. Por favor intenta de nuevo.</p>
      <button
        onClick={reset}
        className="rounded-lg bg-[hsl(var(--brand))] px-6 py-3 text-white hover:bg-[hsl(var(--brand-strong))]"
      >
        Intentar de nuevo
      </button>
      <Link href="/" className="mt-4 text-[hsl(var(--brand-strong))] hover:underline">
        Volver a la tienda
      </Link>
    </div>
  )
}
