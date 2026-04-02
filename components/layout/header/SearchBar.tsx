'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (query: string) => void
  onClear?: () => void
  autoFocus?: boolean
  className?: string
}

export function SearchBar({
  value,
  onChange,
  onClear,
  autoFocus = false,
  className,
}: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--text-soft))]" />
      <Input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={event => onChange(event.target.value)}
        placeholder="Busca por marca, categoría o referencia"
        className="h-12 appearance-none rounded-full border-[hsl(var(--border-strong))] bg-[hsl(var(--surface-0))] pl-11 pr-11 text-sm shadow-sm transition-all [::-webkit-search-cancel-button]:appearance-none [::-webkit-search-decoration]:appearance-none focus-visible:ring-[hsl(var(--ring))]"
      />
      {onClear && value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--text-soft))] transition-colors hover:text-[hsl(var(--foreground))]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
