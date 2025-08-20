'use client'

import { useState } from 'react'
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import productsData from '../../lib/products.json'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { state, toggleCart } = useCart()

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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main Header */}
      <div className="mx-auto w-full max-w-[1720px] px-3 sm:px-4 md:px-6 xl:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y nombre enlazados al inicio */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Abrir menú"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <a
              href="#"
              className="flex items-center group focus:outline-none rounded-lg p-1 hover:bg-orange-50 transition-colors"
              onClick={e => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <div className="flex items-center space-x-3">
                <img
                  src="/favicon.png"
                  alt="CapiShop Logo"
                  className="w-10 h-10 object-contain rounded-full group-hover:scale-105 transition-transform"
                />
                <span className="text-xl sm:text-2xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                  CapiShop
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex lg:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors">
                <span>Categorías</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Submenu de Categorías (sin imágenes) */}
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

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
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

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* WhatsApp: scroll a "no encontraste lo que buscas" */}
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

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-gray-700 hover:text-orange-600"
              onClick={toggleCart}
            >
              <ShoppingCart className="w-5 h-5" />
              {state.itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-orange-600 hover:bg-orange-600"
                >
                  {state.itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside className="relative w-80 max-w-[80%] bg-white h-full shadow-xl p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img src="/favicon.png" className="w-8 h-8 rounded-full" />
                <span className="font-bold text-lg text-orange-600">
                  CapiShop
                </span>
              </div>
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
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
                {' '}
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
