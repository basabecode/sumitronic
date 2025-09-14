'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, ShoppingBag, Lock, Settings } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

interface ProfileLayoutProps {
  children: ReactNode
}

const sidebarItems = [
  {
    label: 'Perfil',
    href: '/profile',
    icon: User,
  },
  {
    label: 'Mis Pedidos',
    href: '/profile/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Cambiar Contraseña',
    href: '/profile/password',
    icon: Lock,
  },
  {
    label: 'Configuración',
    href: '/profile/settings',
    icon: Settings,
  },
  {
    label: 'Volver al inicio',
    href: '/',
    icon: User,
  },
]

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-0">
                    <nav className="space-y-1">
                      {sidebarItems.map(item => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-gray-700 hover:bg-gray-100'
                            )}
                          >
                            <Icon className="mr-3 h-4 w-4" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </nav>
                  </CardContent>
                </Card>
              </div>

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
