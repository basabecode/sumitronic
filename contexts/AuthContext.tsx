'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  // Cargar perfil del usuario por id (identificador canónico del JWT)
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error loading profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error loading profile:', error)
      return null
    }
  }

  // Inicializar autenticación
  useEffect(() => {
    // Flag para evitar que actualizaciones de un efecto desmontado
    // alteren el estado (limpieza estricta de React).
    let cancelled = false

    // Registrar el listener ANTES del fetch inicial para no perder
    // eventos que lleguen mientras resolvemos la sesión.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return

      // Durante INITIAL_SESSION el listener ya nos da la sesión inicial;
      // no corremos initializeAuth en paralelo — evitamos la race condition.
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const profileData = await loadProfile(session.user.id)
        if (!cancelled) setProfile(profileData)
      } else {
        if (!cancelled) setProfile(null)
      }

      if (!cancelled) setLoading(false)
    })

    // Fallback: si onAuthStateChange no dispara INITIAL_SESSION en ≤3 s
    // (p. ej. Supabase no disponible), terminamos el loading igual.
    const fallbackTimer = setTimeout(() => {
      if (!cancelled) {
        console.warn('[Auth] Supabase no respondió en 3 s. La app continuará sin sesión.')
        setLoading(false)
      }
    }, 3000)

    return () => {
      cancelled = true
      clearTimeout(fallbackTimer)
      subscription.unsubscribe()
    }
  }, [])

  // Registro
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      })

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Inicio de sesión
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Inicio de sesión con Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Cerrar sesión
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Resetear contraseña
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Actualizar perfil
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('No user authenticated') }
    }

    try {
      const { error } = await supabase.from('users').update(updates).eq('id', user.id)

      if (!error) {
        setProfile(prev => (prev ? { ...prev, ...updates } : null))
      }

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // Actualizar contraseña
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Verificar si es admin
  const isAdmin = profile?.role === 'admin'

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
