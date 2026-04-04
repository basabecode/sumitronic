'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { useRedirectIfAuthenticated } from '@/hooks/useAuth'

function RegisterPageContent() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || searchParams.get('redirect') || '/'
  useRedirectIfAuthenticated(redirectTo)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <RegisterForm />

        <div className="text-center">
          <div className="text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-[hsl(var(--brand-strong))] hover:text-[hsl(var(--brand))]"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Cargando...</div>}>
      <RegisterPageContent />
    </Suspense>
  )
}
