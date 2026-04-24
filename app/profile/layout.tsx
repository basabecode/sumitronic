'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, ShoppingBag, Lock, Settings, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface ProfileLayoutProps {
  children: ReactNode
}

const sidebarItems = [
  { label: 'Mi Perfil', href: '/profile', icon: User },
  { label: 'Mis Pedidos', href: '/profile/orders', icon: ShoppingBag },
  { label: 'Cambiar Contraseña', href: '/profile/password', icon: Lock },
  { label: 'Configuración', href: '/profile/settings', icon: Settings },
]

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Header />

        <main className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-2 shadow-sm">
                  <nav className="space-y-0.5" aria-label="Navegación del perfil">
                    {sidebarItems.map(item => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-[160ms]',
                            isActive
                              ? 'bg-[hsl(var(--surface-highlight))] text-[hsl(var(--brand-strong))]'
                              : 'text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--surface-muted))] hover:text-[hsl(var(--foreground))]'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-4 w-4 shrink-0',
                              isActive ? 'text-[hsl(var(--brand))]' : 'text-current'
                            )}
                            aria-hidden="true"
                          />
                          {item.label}
                        </Link>
                      )
                    })}

                    <div className="mt-1 border-t border-[hsl(var(--border-subtle))] pt-1">
                      <Link
                        href="/"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[hsl(var(--text-muted))] transition-colors hover:bg-[hsl(var(--surface-muted))] hover:text-[hsl(var(--foreground))]"
                      >
                        <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Volver al inicio
                      </Link>
                    </div>
                  </nav>
                </div>
              </aside>

              {/* Content */}
              <div className="lg:col-span-3">{children}</div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
