'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, ShoppingBag, Heart, User, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * 📱 Bottom Navigation Component - Mobile-First
 *
 * Navegación inferior estilo iOS/Android con:
 * - Safe areas para notches
 * - Touch targets de 48x48px
 * - Animaciones suaves
 * - Badges para notificaciones
 * - Haptic feedback visual
 */

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: number
  requiresAuth?: boolean
  onClick?: () => void
}

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { state: cartState, toggleCart } = useCart()
  const { state: favoritesState, openFavorites } = useFavorites()

  // Calcular badges
  const cartItemsCount = cartState.items.reduce((total, item) => total + item.quantity, 0)
  const favoritesCount = favoritesState.items.length

  // Definir items de navegación
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: Home,
      href: '/',
    },
    {
      id: 'products',
      label: 'Productos',
      icon: ShoppingBag,
      href: '/#productos',
    },
    {
      id: 'favorites',
      label: 'Favoritos',
      icon: Heart,
      href: '/favorites',
      badge: favoritesCount,
      requiresAuth: true,
      onClick: () => openFavorites(),
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      href: user ? '/profile' : '/auth/login',
    },
  ]

  const handleNavClick = (item: NavItem) => {
    // Ejecutar onClick personalizado si existe
    if (item.onClick) {
      item.onClick()
      return
    }

    // Navegación normal
    if (item.href.startsWith('/#')) {
      // Scroll a sección en home
      const sectionId = item.href.replace('/#', '')
      if (pathname === '/') {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        router.push(item.href)
      }
    } else {
      router.push(item.href)
    }
  }

  const isActive = (item: NavItem) => {
    if (item.href === '/') {
      return pathname === '/'
    }
    if (item.href.startsWith('/#')) {
      return pathname === '/' // Activo si estamos en home
    }
    return pathname.startsWith(item.href)
  }

  // Ocultar en desktop
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null
  }

  return (
    <>
      {/* Spacer para evitar que el contenido quede detrás del bottom nav */}
      <div className="h-20 md:hidden" aria-hidden="true" />

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 safe-bottom"
        role="navigation"
        aria-label="Navegación principal móvil"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            // Ocultar items que requieren auth si no está autenticado
            if (item.requiresAuth && !user) {
              return null
            }

            const Icon = item.icon
            const active = isActive(item)

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={cn(
                  'relative flex flex-col items-center justify-center',
                  'touch-target-lg rounded-xl transition-all duration-200',
                  'active:scale-95 active:bg-orange-50',
                  active
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-orange-500'
                )}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                {/* Icon Container */}
                <div className="relative">
                  <Icon
                    className={cn(
                      'w-6 h-6 transition-transform duration-200',
                      active && 'scale-110'
                    )}
                  />

                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className={cn(
                        'absolute -top-2 -right-2 h-5 min-w-[20px] px-1',
                        'flex items-center justify-center text-[10px] font-bold',
                        'border-2 border-white animate-scale-in',
                        item.id === 'favorites'
                          ? 'bg-red-600 hover:bg-red-600'
                          : 'bg-orange-600 hover:bg-orange-600'
                      )}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-[11px] font-medium mt-1 transition-all duration-200',
                    active ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
                  )}
                >
                  {item.label}
                </span>

                {/* Active Indicator */}
                {active && (
                  <div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-600 rounded-full animate-scale-in"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Safe area spacer for iOS home indicator */}
        <div
          className="h-[env(safe-area-inset-bottom)] bg-white"
          aria-hidden="true"
        />
      </nav>
    </>
  )
}
