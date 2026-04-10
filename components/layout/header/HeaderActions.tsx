'use client'

import Link from 'next/link'
import { Heart, LogIn, LogOut, Package, Settings, ShoppingCart, User, UserPlus } from 'lucide-react'
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
  const badgeClass = mobile
    ? {
        brand:
          'absolute -right-1 -top-1 h-4 min-w-4 rounded-full border border-white bg-[hsl(var(--brand))] px-1 text-[9px] text-white',
        danger:
          'absolute -right-1 -top-1 h-4 min-w-4 rounded-full border border-white bg-[hsl(var(--danger))] px-1 text-[9px] text-white',
      }
    : {
        brand:
          'absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-[hsl(var(--brand))] px-1 text-[10px] text-white',
        danger:
          'absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-[hsl(var(--danger))] px-1 text-[10px] text-white',
      }

  const iconButtonClass = mobile
    ? 'relative h-8 w-8 rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-0))] p-0 text-[hsl(var(--foreground))] shadow-sm transition-colors hover:bg-[hsl(var(--surface-muted))]'
    : 'relative h-9 w-9 rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-0))] p-0 text-[hsl(var(--foreground))] shadow-sm transition-colors hover:bg-[hsl(var(--surface-muted))]'

  if (!user) {
    return (
      <div className={mobile ? 'flex items-center gap-1' : 'flex items-center gap-2'}>
        {mobile ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="rounded-full h-8 w-8 p-0 text-[hsl(var(--foreground))]"
            >
              <Link href="/auth/login" aria-label="Iniciar sesión">
                <LogIn className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="rounded-full bg-[hsl(var(--brand))] h-8 w-8 p-0 text-white hover:bg-[hsl(var(--brand-strong))]"
              aria-label="Crear cuenta"
            >
              <Link href="/auth/register">
                <UserPlus className="h-4 w-4" />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="rounded-full text-white hover:bg-white/20 hover:text-white"
            >
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
    <div className={mobile ? 'flex items-center gap-1' : 'flex items-center gap-2'}>
      <Button
        variant="ghost"
        size="sm"
        className={iconButtonClass}
        onClick={onOpenFavorites}
        aria-label="Favoritos"
      >
        <Heart className={mobile ? 'h-4 w-4' : 'h-4 w-4'} />
        {totalFavorites > 0 && (
          <Badge variant="destructive" className={badgeClass.danger}>
            {totalFavorites}
          </Badge>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={iconButtonClass}
        onClick={onToggleCart}
        aria-label="Carrito"
      >
        <ShoppingCart className={mobile ? 'h-4 w-4' : 'h-4 w-4'} />
        {totalItems > 0 && (
          <Badge variant="destructive" className={badgeClass.brand}>
            {totalItems}
          </Badge>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={
              mobile ? 'relative h-8 w-8 rounded-full p-0' : 'relative h-9 w-9 rounded-full p-0'
            }
          >
            <Avatar
              className={
                mobile
                  ? 'h-8 w-8 border border-[hsl(var(--border-subtle))]'
                  : 'h-9 w-9 border border-[hsl(var(--border-subtle))]'
              }
            >
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
        <DropdownMenuContent
          className="w-56 rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-1 text-slate-900 shadow-xl"
          align="end"
          forceMount
        >
          <div className="space-y-1 px-3 py-2.5">
            {profile?.full_name && (
              <p className="font-medium text-slate-900">{profile.full_name}</p>
            )}
            <p className="truncate text-sm text-[hsl(var(--text-muted))]">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            asChild
            className="text-slate-700 focus:bg-[hsl(var(--surface-highlight))] focus:text-slate-900"
          >
            <Link href="/profile" className="w-full">
              <User className="mr-2 h-4 w-4" />
              Mi perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-slate-700 focus:bg-[hsl(var(--surface-highlight))] focus:text-slate-900">
            <button
              type="button"
              onClick={onOpenFavorites}
              className="flex w-full items-center text-left text-slate-700"
            >
              <Heart className="mr-2 h-4 w-4" />
              Mis favoritos
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="text-slate-700 focus:bg-[hsl(var(--surface-highlight))] focus:text-slate-900"
          >
            <Link href={mobile ? '/profile/orders' : '/orders'} className="w-full">
              <Package className="mr-2 h-4 w-4" />
              Mis pedidos
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem
              asChild
              className="text-slate-700 focus:bg-[hsl(var(--surface-highlight))] focus:text-slate-900"
            >
              <Link href="/admin" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Panel admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onSignOut}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
