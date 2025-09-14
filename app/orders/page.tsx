'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export default function OrdersPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    // Si no está autenticado, redirigir al login
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Si está autenticado, redirigir a la página de órdenes en el perfil
    router.push('/profile/orders')
  }, [user, loading, router])

  // Mostrar loader mientras se procesa la redirección
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Redirigiendo a tus pedidos...</span>
      </div>
    </div>
  )
}
