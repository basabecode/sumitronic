'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LoginForm } from '@/app/components/auth/LoginForm'
import { ForgotPasswordForm } from '@/app/components/auth/ForgotPasswordForm'
import { useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

function LoginPageContent() {
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  useRedirectIfAuthenticated(redirectTo)

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <ForgotPasswordForm />
          <div className="text-center">
            <Button variant="link" onClick={() => setShowForgotPassword(false)}>
              Volver al inicio de sesión
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm redirectTo={redirectTo} />

        <div className="text-center space-y-4">
          <Button variant="link" onClick={() => setShowForgotPassword(true)}>
            ¿Olvidaste tu contraseña?
          </Button>

          <div className="text-sm">
            ¿No tienes cuenta?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Cargando...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
