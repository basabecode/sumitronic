'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

/**
 * Página de Favoritos - Redirige al home y abre el modal de favoritos
 *
 * Esta página ahora solo sirve como punto de entrada para abrir el modal de favoritos.
 * El componente principal de favoritos es FavoritesSidebar que funciona como modal.
 */
export default function FavoritesPage() {
  const router = useRouter()
  const { openFavorites } = useFavorites()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Esperar a que termine de cargar la autenticación
    if (loading) return

    // Si no hay usuario, redirigir al login
    if (!user) {
      router.push('/auth/login?redirect=/favorites')
      return
    }

    // Si hay usuario, redirigir al home y abrir el modal de favoritos
    router.push('/')

    // Pequeño delay para asegurar que la navegación se complete
    setTimeout(() => {
      openFavorites()
    }, 100)
  }, [user, loading, router, openFavorites])

  // Mostrar loader mientras se procesa
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[hsl(var(--brand))]" />
        <p className="text-gray-600">
          {loading ? 'Cargando...' : user ? 'Abriendo favoritos...' : 'Redirigiendo...'}
        </p>
      </div>
    </div>
  )
}
