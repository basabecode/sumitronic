import Link from 'next/link'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 bg-gray-50">
      {/* Header simple con branding */}
      <div className="text-2xl font-bold text-orange-500">CapiShop</div>

      {/* Contenido principal */}
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <SearchX className="w-16 h-16 text-orange-300" />
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
          className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors text-center"
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
        <Link href="/help" className="text-orange-600 hover:underline">
          Visita nuestro centro de ayuda
        </Link>
      </p>
    </div>
  )
}
