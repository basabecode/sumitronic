'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  redirectTo = '/auth/login',
  fallback,
}: ProtectedRouteProps) {
  const { loading, canAccess } = useRequireAuth({
    redirectTo,
    adminOnly,
  })

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando...</span>
          </div>
        </div>
      )
    )
  }

  if (!canAccess) {
    return null // El hook se encarga de la redirección
  }

  return <>{children}</>
}

interface AdminOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminOnly({ children, fallback }: AdminOnlyProps) {
  const { isAdmin, loading } = useRequireAuth()

  if (loading) {
    return null
  }

  if (!isAdmin) {
    return fallback || null
  }

  return <>{children}</>
}
