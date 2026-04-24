'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { brand } from '@/lib/brand'

function RegisterPageContent() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || searchParams.get('redirect') || '/'
  useRedirectIfAuthenticated(redirectTo)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))] px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image
              src="/logos/logo_sumitronic_3.png"
              alt={brand.name}
              width={160}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">
            Seguridad electrónica con respaldo local
          </p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm text-[hsl(var(--text-muted))]">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-[hsl(var(--brand-strong))] hover:text-[hsl(var(--brand))]"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))]">
      <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--brand))]" />
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegisterPageContent />
    </Suspense>
  )
}
