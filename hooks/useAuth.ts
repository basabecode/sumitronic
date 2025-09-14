'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface UseRequireAuthOptions {
  redirectTo?: string
  adminOnly?: boolean
  debugMode?: boolean
}

export function useRequireAuth({
  redirectTo = '/auth/login',
  adminOnly = false,
  debugMode = false,
}: UseRequireAuthOptions = {}) {
  const { user, profile, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (debugMode) {
      console.log('🔍 useRequireAuth - Estado:', {
        loading,
        user: user?.email,
        profile: profile?.role,
        isAdmin,
        adminOnly,
      })
    }

    // Esperar a que termine de cargar completamente
    if (loading) {
      return
    }

    // Evitar múltiples redirecciones
    if (hasChecked) {
      return
    }

    // Si no hay usuario, redirigir al login
    if (!user) {
      if (debugMode) console.log('❌ Sin usuario, redirigiendo a login')
      router.push(redirectTo)
      setHasChecked(true)
      return
    }

    // Si requiere admin y no es admin, redirigir
    if (adminOnly && !isAdmin) {
      if (debugMode) console.log('❌ No es admin, redirigiendo a home')
      router.push('/')
      setHasChecked(true)
      return
    }

    // Usuario autorizado
    if (debugMode) console.log('✅ Usuario autorizado')
    setHasChecked(true)
  }, [
    user,
    profile,
    loading,
    isAdmin,
    router,
    redirectTo,
    adminOnly,
    hasChecked,
    debugMode,
  ])

  return {
    user,
    profile,
    loading,
    isAdmin,
    isAuthenticated: !!user,
    canAccess: adminOnly ? isAdmin : !!user,
  }
}

export function useRedirectIfAuthenticated(redirectTo: string = '/') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading }
}
