'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="text-2xl font-bold text-orange-500 mb-6">CapiShop</div>
      <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
      <p className="text-gray-600 mb-6">
        Ocurrió un error inesperado. Por favor intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
      >
        Intentar de nuevo
      </button>
      <Link href="/" className="mt-4 text-orange-600 hover:underline">
        Volver a la tienda
      </Link>
    </div>
  )
}
