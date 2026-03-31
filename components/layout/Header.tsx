'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { Brand } from './header/Brand'
import { HeaderActions } from './header/HeaderActions'
import { MobileDrawer } from './header/MobileDrawer'
import { SearchBar } from './header/SearchBar'
import { primaryNavLinks } from './header/headerData'
import { NavCategory } from './header/types'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<NavCategory[]>([])
  const { state, toggleCart } = useCart()
  const { user, profile, signOut, isAdmin } = useAuth()
  const { state: favoritesState, openFavorites } = useFavorites()
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
  const totalFavorites = favoritesState.items.length

  useEffect(() => {
    fetch('/api/categories')
      .then(res => (res.ok ? res.json() : []))
      .then((data: { id: string; name: string; slug: string; image_url?: string | null }[]) => {
        if (!Array.isArray(data)) return
        setCategories(
          data.map(category => ({
            id: category.slug,
            name: category.name,
            image: category.image_url || '/placeholder.svg',
          }))
        )
      })
      .catch(() => {})
  }, [])

  const broadcastSearch = (query: string) => {
    window.dispatchEvent(
      new CustomEvent('globalSearch', {
        detail: { query: query.trim() },
      })
    )
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    broadcastSearch(query)
    if (query.trim()) {
      const section = document.getElementById('productos')
      if (section) section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    broadcastSearch('')
  }

  const navigateToSection = (sectionId?: string) => {
    if (!sectionId || !isHome) return
    const section = document.getElementById(sectionId)
    if (section) section.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCategorySelect = (categoryId: string) => {
    if (!isHome) {
      router.push(`/?cat=${categoryId}#productos`)
      setIsMenuOpen(false)
      return
    }

    try {
      const url = new URL(window.location.href)
      url.searchParams.set('cat', categoryId)
      window.history.pushState({}, '', url.toString())
    } catch {}

    window.dispatchEvent(
      new CustomEvent('categoryFilterChanged', {
        detail: { category: categoryId },
      })
    )

    setIsMenuOpen(false)
    navigateToSection('productos')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-overlay))]/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1720px] px-4 py-3 md:px-6 xl:px-8">
        {/* Desktop header — single row */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <Brand />

          {/* Nav links */}
          <nav className="flex items-center gap-4 lg:gap-6 shrink-0">
            {primaryNavLinks.map(link => (
              <Link
                key={link.label}
                href={isHome ? link.href : `/${link.href}`}
                onClick={() => navigateToSection(link.sectionId)}
                className="text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:text-[hsl(var(--brand-strong))] whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar — grows to fill available space */}
          <div className="flex-1 min-w-0">
            <SearchBar value={searchQuery} onChange={handleSearch} onClear={clearSearch} />
          </div>

          {/* WhatsApp contact — hidden on md, shown on xl */}
          <div className="hidden xl:flex flex-col items-end shrink-0 rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] px-4 py-2">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--text-muted))] leading-none">
              Asesoría rápida
            </p>
            <a
              href="https://wa.me/573003094854"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[hsl(var(--foreground))] whitespace-nowrap leading-snug"
            >
              WhatsApp +57 300 309 4854
            </a>
          </div>

          {/* Auth actions */}
          <div className="shrink-0">
            <HeaderActions
              user={user}
              profile={profile}
              isAdmin={isAdmin}
              totalItems={totalItems}
              totalFavorites={totalFavorites}
              onToggleCart={toggleCart}
              onOpenFavorites={openFavorites}
              onSignOut={signOut}
            />
          </div>
        </div>

        <div className="md:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="touch-target rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-0))] shadow-sm"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <Brand compact />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="touch-target rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-0))]"
              onClick={() => setIsSearchOpen(current => !current)}
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>

            <HeaderActions
              user={user}
              profile={profile}
              isAdmin={isAdmin}
              totalItems={totalItems}
              totalFavorites={totalFavorites}
              onToggleCart={toggleCart}
              onOpenFavorites={openFavorites}
              onSignOut={signOut}
              mobile
            />
          </div>

          {isSearchOpen && (
            <div className="mt-3">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                onClear={clearSearch}
                autoFocus
              />
            </div>
          )}

          <div className="mt-3 overflow-x-auto pb-1">
            <div className="flex items-center gap-2">
              {primaryNavLinks.map(link => (
                <Link
                  key={link.label}
                  href={isHome ? link.href : `/${link.href}`}
                  onClick={() => navigateToSection(link.sectionId)}
                  className="rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] px-4 py-2 text-xs font-medium text-[hsl(var(--foreground))] whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MobileDrawer
        isOpen={isMenuOpen}
        categories={categories}
        navLinks={primaryNavLinks}
        isHome={isHome}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onClose={() => setIsMenuOpen(false)}
        onCategorySelect={handleCategorySelect}
        onSectionNavigate={navigateToSection}
      />
    </header>
  )
}
