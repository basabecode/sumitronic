'use client'

import Link from 'next/link'
import { RegisterForm } from '@/app/components/auth/RegisterForm'
import { useRedirectIfAuthenticated } from '@/hooks/useAuth'

export default function RegisterPage() {
  useRedirectIfAuthenticated('/')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <RegisterForm />

        <div className="text-center">
          <div className="text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
