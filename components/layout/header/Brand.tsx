'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BrandProps {
  compact?: boolean
  onClick?: () => void
}

export function Brand({ compact = false, onClick }: BrandProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group inline-flex items-center gap-3 rounded-full px-2 py-1 transition-colors hover:bg-[hsl(var(--surface-muted))]"
    >
      <img
        src="/favicon.png"
        alt="CapiShop"
        className={cn(
          'rounded-full object-contain transition-transform duration-300 group-hover:scale-105',
          compact ? 'h-9 w-9' : 'h-11 w-11'
        )}
      />
      <div className="leading-none">
        <p className="font-display text-lg font-semibold uppercase tracking-[0.16em] text-[hsl(var(--brand-strong))]">
          CapiShop
        </p>
        {!compact && (
          <p className="text-xs uppercase tracking-[0.28em] text-[hsl(var(--text-muted))]">
            Seguridad y conectividad
          </p>
        )}
      </div>
    </Link>
  )
}
