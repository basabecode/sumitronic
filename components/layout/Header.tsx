'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useSharedData } from '@/contexts/SharedDataContext'
import { Brand } from './header/Brand'
import { HeaderActions } from './header/HeaderActions'
import { MobileDrawer } from './header/MobileDrawer'
import { SearchBar } from './header/SearchBar'
import { primaryNavLinks } from './header/headerData'
import { DynamicBreadcrumbs } from './DynamicBreadcrumbs'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { state, toggleCart } = useCart()
  const { user, profile, signOut, isAdmin } = useAuth()
  const { state: favoritesState, openFavorites } = useFavorites()
  const { categories } = useSharedData()
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
  const totalFavorites = favoritesState.items.length

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
    <>
      <header className="sticky top-0 z-50 w-full flex flex-col border-b border-[hsl(var(--border-subtle))]">
        {/* ROW 1: Fondo claro (superficie) */}
        <div className="bg-[hsl(var(--surface-overlay))]/90 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-[1720px] px-4 py-2 md:px-6 xl:px-8">
            {/* Desktop Row 1 */}
            <div className="hidden md:flex items-center gap-6">
              <div className="shrink-0">
                <Brand />
              </div>

              {/* Contenedor central buscador */}
              <div className="flex-1 min-w-0 max-w-4xl mx-auto">
                <SearchBar value={searchQuery} onChange={handleSearch} onClear={clearSearch} />
              </div>

              {/* Asesoría / WhatsApp */}
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
            </div>

            {/* Mobile View Top */}
            <div className="md:hidden flex items-center justify-between gap-3">
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
          </div>
        </div>

        {/* ROW 2: Fila primaria con navegación y accesos directos */}
        <div className="bg-[hsl(var(--brand))]">
          <div className="mx-auto w-full max-w-[1720px] px-4 md:px-6 xl:px-8">
            {/* Desktop Row 2 */}
            <div className="hidden md:flex items-center justify-between py-1.5">
              <nav className="flex items-center gap-6 shrink-0">
                {primaryNavLinks.map(link => (
                  <Link
                    key={link.label}
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={() => navigateToSection(link.sectionId)}
                    className="text-sm font-medium text-white/90 transition-colors hover:text-white whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="shrink-0 flex items-center">
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

            {/* Mobile View Bottom - Nav Links */}
            <div className="md:hidden overflow-x-auto pb-2.5 pt-2">
              <div className="flex items-center gap-2">
                {primaryNavLinks.map(link => (
                  <Link
                    key={link.label}
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={() => navigateToSection(link.sectionId)}
                    className="rounded-full bg-black/10 border border-white/20 px-4 py-1.5 text-xs font-medium text-white whitespace-nowrap backdrop-blur-sm transition-colors hover:bg-black/20"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

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
      <DynamicBreadcrumbs />
    </>
  )
}
