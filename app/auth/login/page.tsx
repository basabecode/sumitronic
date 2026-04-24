'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { brand } from '@/lib/brand'

function AuthShell({ children }: { children: React.ReactNode }) {
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

        {children}
      </div>
    </div>
  )
}

function LoginPageContent() {
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || searchParams.get('redirect') || '/'
  useRedirectIfAuthenticated(redirectTo)

  if (showForgotPassword) {
    return (
      <AuthShell>
        <ForgotPasswordForm />
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setShowForgotPassword(false)}
            className="text-[hsl(var(--brand-strong))] hover:text-[hsl(var(--brand))]"
          >
            ← Volver al inicio de sesión
          </Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <LoginForm redirectTo={redirectTo} />

      <div className="text-center space-y-3 text-sm">
        <div>
          <Button
            variant="link"
            onClick={() => setShowForgotPassword(true)}
            className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--foreground))] h-auto p-0"
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </div>
        <div className="text-[hsl(var(--text-muted))]">
          ¿No tienes cuenta?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-[hsl(var(--brand-strong))] hover:text-[hsl(var(--brand))]"
          >
            Regístrate gratis
          </Link>
        </div>
      </div>
    </AuthShell>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--surface-highlight))] via-white to-[hsl(var(--background))]">
      <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--brand))]" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}
