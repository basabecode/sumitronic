'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Mail, MessageCircle, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Brand } from './Brand'
import { NavCategory, NavLinkItem } from './types'

interface MobileDrawerProps {
  isOpen: boolean
  categories: NavCategory[]
  navLinks: NavLinkItem[]
  isHome: boolean
  searchQuery: string
  onSearchChange: (query: string) => void
  onClose: () => void
  onCategorySelect: (categoryId: string) => void
  onSectionNavigate: (sectionId?: string) => void
}

export function MobileDrawer({
  isOpen,
  categories,
  navLinks,
  isHome,
  searchQuery,
  onSearchChange,
  onClose,
  onCategorySelect,
  onSectionNavigate,
}: MobileDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  // Renderizar en document.body para salir de la stacking context del <header>
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar menú"
      />
      <aside className="surface-elevated relative z-[61] h-full w-[22rem] max-w-[86%] overflow-auto border-r border-[hsl(var(--border-subtle))] px-4 py-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <Brand compact onClick={onClose} />
          <button
            type="button"
            className="touch-target rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-0))]"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5">
          <Input
            value={searchQuery}
            onChange={event => onSearchChange(event.target.value)}
            placeholder="Buscar productos"
            className="h-11 rounded-full border-[hsl(var(--border-strong))] bg-[hsl(var(--surface-0))] px-4"
          />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))]">
              Categorías
            </h4>
            <span className="text-xs text-[hsl(var(--text-soft))]">{categories.length} activas</span>
          </div>

          <div className="grid gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                type="button"
                className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] p-3 text-left transition-colors hover:bg-[hsl(var(--surface-highlight))]"
                onClick={() => onCategorySelect(category.id)}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-11 w-11 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {category.name}
                  </p>
                  <p className="text-xs text-[hsl(var(--text-soft))]">
                    Ver productos relacionados
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <nav className="mt-6 space-y-2 border-t border-[hsl(var(--border-subtle))] pt-6">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={isHome ? link.href : `/${link.href}`}
              onClick={() => {
                onClose()
                onSectionNavigate(link.sectionId)
              }}
              className="block rounded-2xl px-3 py-3 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--surface-muted))]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 rounded-3xl bg-[hsl(var(--surface-muted))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))]">
            Soporte
          </p>
          <div className="mt-3 space-y-3">
            <a
              href="https://wa.me/573003094854"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-[hsl(var(--foreground))]"
            >
              <MessageCircle className="h-4 w-4 text-[hsl(var(--success))]" />
              WhatsApp de asesoría
            </a>
            <a
              href="mailto:info@capishop.com"
              className="flex items-center gap-3 text-sm text-[hsl(var(--foreground))]"
            >
              <Mail className="h-4 w-4 text-[hsl(var(--brand))]" />
              info@capishop.com
            </a>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  )
}
