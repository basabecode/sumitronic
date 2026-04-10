'use client'

import Image from 'next/image'
import Link from 'next/link'
import { brand } from '@/lib/brand'
import { cn } from '@/lib/utils'

interface BrandProps {
  compact?: boolean
  onClick?: () => void
  logoClassName?: string
}

export function Brand({ compact = false, onClick, logoClassName }: BrandProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        'group inline-flex w-fit items-center rounded-full transition-colors hover:bg-[hsl(var(--surface-muted))]',
        compact ? 'gap-2.5 px-1.5 py-1' : 'gap-3.5 px-2 pt-1.5 pb-0'
      )}
    >
      <span
        className={cn(
          'relative shrink-0 transition-transform duration-300 group-hover:scale-105',
          compact ? 'h-11 w-11' : 'h-16 w-16'
        )}
      >
        <Image
          src="/logos/logo_sumitronic_3.png"
          alt={brand.name}
          fill
          priority
          sizes={compact ? '44px' : '64px'}
          className={cn('object-contain object-center p-1', logoClassName)}
        />
      </span>
      <div className="flex min-w-0 flex-col justify-center leading-none">
        <p
          className={cn(
            'font-display font-semibold uppercase text-[hsl(var(--brand-strong))]',
            compact ? 'truncate text-sm tracking-[0.1em]' : 'text-lg tracking-[0.16em]'
          )}
        >
          {brand.name}
        </p>
        {!compact && (
          <p className="mt-1 text-xs uppercase tracking-[0.10em] text-[hsl(var(--text-muted))]">
            Suministros Electrónicos
          </p>
        )}
      </div>
    </Link>
  )
}
