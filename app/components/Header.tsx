'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Package,
  UserPlus,
  LogIn,
  Heart,
  Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import productsData from '../../lib/products.json'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { state, toggleCart } = useCart()
  const { user, profile, signOut, isAdmin } = useAuth()

  // Calcular cantidad total de items en el carrito
  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // Generar categorías dinámicamente desde products.json
  const products = productsData as any[]
  const uniqueCategories = Array.from(new Set(products.map(p => p.category)))

  const humanizeCategory = (cat: string) => {
    const map: Record<string, string> = {
      camaras: 'Cámaras',
      accesorios: 'Accesorios',
      computacion: 'Computación',
      UPS: 'UPS',
      energia: 'Energía',
      gaming: 'Gaming',
      smartphones: 'Smartphones',
      laptops: 'Laptops',
      audio: 'Audio',
    }
    return map[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      // Disparar evento personalizado con la búsqueda
      window.dispatchEvent(
        new CustomEvent('globalSearch', {
          detail: { query: query.trim() },
        })
      )
      // Navegar a productos
      const el = document.getElementById('productos')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Limpiar búsqueda
      window.dispatchEvent(
        new CustomEvent('globalSearch', {
          detail: { query: '' },
        })
      )
    }
  }

  const categories = uniqueCategories.map(cat => {
    const representative = products.find(p => p.category === cat)
    return {
      id: cat,
      name: humanizeCategory(cat),
      image: representative?.image || '/placeholder.jpg',
    }
  })

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Mobile Header - Diseño de doble fila */}
      <div className="md:hidden">
        {/* Primera fila: Logo centrado */}
        <div className="flex items-center justify-center py-3 px-4 border-b border-gray-100">
          <a
            href="/"
            className="flex items-center group focus:outline-none rounded-lg p-1 hover:bg-orange-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img
                src="/favicon.png"
                alt="CapiShop Logo"
                className="w-10 h-10 object-contain rounded-full group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                CapiShop
              </span>
            </div>
          </a>
        </div>

        {/* Segunda fila: Navegación y acciones */}
        <div className="flex items-center justify-between px-3 py-2">
          {/* Lado izquierdo: Menú + Búsqueda */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <button
              className="mobile-menu-button flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 active:bg-orange-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
              aria-label="Abrir menú"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-5 h-5 text-gray-800 stroke-[2.5]" />
            </button>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-orange-50"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Buscar"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </Button>
          </div>

          {/* Lado derecho: WhatsApp + Auth + Cart */}
          <div className="flex items-center space-x-2">
            {/* WhatsApp */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => {
                const el = document.getElementById('no-encontraste')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              aria-label="¿No encontraste lo que buscas?"
              title="¿No encontraste lo que buscas?"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>

            {/* User Menu - Responsivo */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-8 w-8 rounded-full p-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || ''}
                        alt={profile?.full_name || ''}
                      />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.full_name && (
                        <p className="font-medium">{profile.full_name}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/orders">
                      <Package className="mr-2 h-4 w-4" />
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Panel Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-1">
                {/* Login */}
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="p-2 hover:bg-orange-50"
                  title="Iniciar Sesión"
                >
                  <Link href="/auth/login">
                    <LogIn className="w-5 h-5" />
                  </Link>
                </Button>

                {/* Register */}
                <Button
                  size="sm"
                  asChild
                  className="p-2 bg-orange-600 hover:bg-orange-700 min-w-[40px]"
                  title="Registrarse"
                >
                  <Link href="/auth/register">
                    <UserPlus className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              onClick={toggleCart}
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-orange-600 hover:bg-orange-600 border-2 border-white"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Header - Una sola fila */}
      <div className="hidden md:block mx-auto w-full max-w-[1720px] px-4 md:px-6 xl:px-8 py-3">
        <div className="flex items-center justify-between relative">
          {/* Logo y nombre para desktop */}
          <div className="flex items-center space-x-3">
            <a
              href="/"
              className="flex items-center group focus:outline-none rounded-lg p-1 hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src="/favicon.png"
                  alt="CapiShop Logo"
                  className="w-10 h-10 object-contain rounded-full group-hover:scale-105 transition-transform"
                />
                <span className="text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                  CapiShop
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors">
                <span>Categorías</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Submenu de Categorías */}
              <div
                className="absolute top-full left-0 w-80 bg-white shadow-xl rounded-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50"
                role="menu"
                aria-label="Categorías"
              >
                <div className="grid grid-cols-1 gap-2">
                  {categories.map(category => (
                    <a
                      key={category.id}
                      href="#productos"
                      role="menuitem"
                      onClick={e => {
                        e.preventDefault()
                        try {
                          const url = new URL(window.location.href)
                          url.searchParams.set('cat', category.id)
                          window.history.pushState({}, '', url.toString())
                        } catch (err) {
                          const sep = window.location.href.split('#')[0]
                          window.history.pushState(
                            {},
                            '',
                            `${sep}?cat=${encodeURIComponent(
                              category.id
                            )}#productos`
                          )
                        }

                        window.dispatchEvent(
                          new CustomEvent('categoryFilterChanged', {
                            detail: { category: category.id },
                          })
                        )

                        setIsMenuOpen(false)
                        const el = document.getElementById('productos')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">Ver</span>
                    </a>
                  ))}
                </div>
                <div className="mt-3 border-t pt-3">
                  <a
                    href="#productos"
                    className="text-sm text-orange-600 font-medium hover:underline"
                    onClick={e => {
                      e.preventDefault()
                      try {
                        const url = new URL(window.location.href)
                        url.searchParams.delete('cat')
                        window.history.pushState({}, '', url.toString())
                      } catch (err) {
                        // noop
                      }

                      window.dispatchEvent(
                        new CustomEvent('categoryFilterChanged', {
                          detail: { category: null },
                        })
                      )

                      setIsMenuOpen(false)
                      const el = document.getElementById('productos')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Ver todos los productos
                  </a>
                </div>
              </div>
            </div>

            <a
              href="#productos"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Productos
            </a>
            <a
              href="#ofertas"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Ofertas
            </a>
            <a
              href="#blog"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Blog
            </a>
            <a
              href="#contacto"
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Contacto
            </a>
          </nav>

          {/* Search Bar Desktop */}
          <div className="flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Right Actions Desktop */}
          <div className="flex items-center space-x-4">
            {/* WhatsApp Desktop */}
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => {
                const el = document.getElementById('no-encontraste')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              aria-label="¿No encontraste lo que buscas?"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>

            {/* User Menu Desktop */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-8 w-8 rounded-full p-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || ''}
                        alt={profile?.full_name || ''}
                      />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.full_name && (
                        <p className="font-medium">{profile.full_name}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <Package className="mr-2 h-4 w-4" />
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Panel Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Link href="/auth/register">Registrarse</Link>
                </Button>
              </div>
            )}

            {/* Cart Desktop */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-gray-700 hover:text-orange-600"
              onClick={toggleCart}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-orange-600 hover:bg-orange-600"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Expandible */}
      {isSearchOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-2 py-3 shadow-sm">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="pl-10 pr-10 py-2 w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Cerrar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside className="relative w-80 max-w-[80%] bg-white h-full shadow-xl p-4 overflow-auto z-[61]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img src="/favicon.png" className="w-8 h-8 rounded-full" />
                <span className="font-bold text-lg text-orange-600">
                  CapiShop
                </span>
              </div>
              <button
                className="flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white hover:bg-red-50 active:bg-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
                style={{ minWidth: '40px', minHeight: '40px' }}
              >
                <X className="w-5 h-5 text-gray-800 stroke-[2.5]" />
              </button>
            </div>

            <div className="mb-4">
              <Input
                placeholder="Buscar productos..."
                className="py-2"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>

            <nav className="space-y-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Categorías
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-orange-50 w-full text-left"
                      onClick={() => {
                        try {
                          const url = new URL(window.location.href)
                          url.searchParams.set('cat', cat.id)
                          window.history.pushState({}, '', url.toString())
                        } catch (err) {}
                        window.dispatchEvent(
                          new CustomEvent('categoryFilterChanged', {
                            detail: { category: cat.id },
                          })
                        )
                        setIsMenuOpen(false)
                        const el = document.getElementById('productos')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {cat.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <a
                href="#productos"
                className="block p-2 rounded-md hover:bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false)
                  const el = document.getElementById('productos')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Productos
              </a>
              <a
                href="#ofertas"
                className="block p-2 rounded-md hover:bg-gray-100"
              >
                Ofertas
              </a>
              <a
                href="#blog"
                className="block p-2 rounded-md hover:bg-gray-100"
              >
                Blog
              </a>
              <a
                href="#contacto"
                className="block p-2 rounded-md hover:bg-gray-100"
              >
                Contacto
              </a>
            </nav>

            <div className="mt-6 border-t pt-4">
              <a
                className="flex items-center gap-2 text-sm text-green-600"
                href="https://wa.me/15551234567"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a
                className="block mt-2 text-sm text-gray-600"
                href="tel:+15551234567"
              >
                Teléfono
              </a>
              <a
                className="block mt-1 text-sm text-gray-600"
                href="mailto:info@CapiShoping.com"
              >
                Email
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}
