import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { brand } from '@/lib/brand'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 bg-gray-50">
      {/* Header simple con branding */}
      <div className="font-display text-2xl font-bold text-[hsl(var(--brand))]">{brand.name}</div>

      {/* Contenido principal */}
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <SearchX className="h-16 w-16 text-[hsla(var(--brand),0.45)]" />
        </div>
        <p className="text-8xl font-bold text-gray-200 leading-none">404</p>
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">
          Página no encontrada
        </h1>
        <p className="text-gray-500 mt-3 leading-relaxed">
          La página que buscas no existe, fue movida o la dirección fue escrita
          incorrectamente.
        </p>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="rounded-lg bg-[hsl(var(--brand))] px-6 py-3 text-center font-medium text-white transition-colors hover:bg-[hsl(var(--brand-strong))]"
        >
          Volver a la tienda
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
        >
          Ver productos
        </Link>
      </div>

      {/* Ayuda adicional */}
      <p className="text-sm text-gray-400">
        ¿Necesitas ayuda?{' '}
        <Link href="/help" className="text-[hsl(var(--brand-strong))] hover:underline">
          Visita nuestro centro de ayuda
        </Link>
      </p>
    </div>
  )
}
