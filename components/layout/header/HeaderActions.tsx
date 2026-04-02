'use client'

import Link from 'next/link'
import {
  Heart,
  LogIn,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  User,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface HeaderActionsProps {
  user: any
  profile: any
  isAdmin: boolean
  totalItems: number
  totalFavorites: number
  onToggleCart: () => void
  onOpenFavorites: () => void
  onSignOut: () => void
  mobile?: boolean
}

function CountBadge({ count, tone }: { count: number; tone: 'brand' | 'danger' }) {
  if (count <= 0) return null

  return (
    <Badge
      variant="destructive"
      className={
        tone === 'brand'
          ? 'absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-[hsl(var(--brand))] px-1 text-[10px] text-white'
          : 'absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-[hsl(var(--danger))] px-1 text-[10px] text-white'
      }
    >
      {count}
    </Badge>
  )
}

export function HeaderActions({
  user,
  profile,
  isAdmin,
  totalItems,
  totalFavorites,
  onToggleCart,
  onOpenFavorites,
  onSignOut,
  mobile = false,
}: HeaderActionsProps) {
  const iconButtonClass =
    'relative touch-target rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-0))] text-[hsl(var(--foreground))] shadow-sm transition-colors hover:bg-[hsl(var(--surface-muted))]'

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {mobile ? (
          <>
            <Button variant="ghost" size="sm" asChild className="touch-target rounded-full h-10 w-10 p-0 text-[hsl(var(--foreground))]">
              <Link href="/auth/login" aria-label="Iniciar sesión">
                <LogIn className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="touch-target rounded-full bg-[hsl(var(--brand))] h-10 w-10 p-0 text-white hover:bg-[hsl(var(--brand-strong))]"
              aria-label="Crear cuenta"
            >
              <Link href="/auth/register">
                <UserPlus className="h-5 w-5" />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild className="rounded-full text-white hover:bg-white/20 hover:text-white">
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="rounded-full bg-white px-4 text-[hsl(var(--brand-strong))] hover:bg-white/90"
            >
              <Link href="/auth/register">Crear cuenta</Link>
            </Button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={iconButtonClass}
        onClick={onOpenFavorites}
        aria-label="Favoritos"
      >
        <Heart className="h-5 w-5" />
        <CountBadge count={totalFavorites} tone="danger" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={iconButtonClass}
        onClick={onToggleCart}
        aria-label="Carrito"
      >
        <ShoppingCart className="h-5 w-5" />
        <CountBadge count={totalItems} tone="brand" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full p-0">
            <Avatar className="h-10 w-10 border border-[hsl(var(--border-subtle))]">
              <AvatarImage
                src={profile?.avatar_url || ''}
                alt={profile?.full_name || user.email || 'Usuario'}
              />
              <AvatarFallback className="bg-[hsl(var(--surface-muted))] text-[hsl(var(--foreground))]">
                {profile?.full_name?.charAt(0)?.toUpperCase() ||
                  user.email?.charAt(0)?.toUpperCase() ||
                  'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 rounded-2xl" align="end" forceMount>
          <div className="space-y-1 p-3">
            {profile?.full_name && <p className="font-medium">{profile.full_name}</p>}
            <p className="truncate text-sm text-[hsl(var(--text-muted))]">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Mi perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button type="button" onClick={onOpenFavorites} className="flex w-full items-center">
              <Heart className="mr-2 h-4 w-4" />
              Mis favoritos
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={mobile ? '/profile/orders' : '/orders'}>
              <Package className="mr-2 h-4 w-4" />
              Mis pedidos
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Settings className="mr-2 h-4 w-4" />
                Panel admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSignOut} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
