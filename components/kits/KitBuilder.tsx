'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Share2,
  CheckCircle2,
  Loader2,
  ChevronRight,
  RotateCcw,
  RefreshCw,
  Search,
  X,
  Heart,
  Building2,
  Home,
  ShoppingBag,
  Factory,
  GraduationCap,
  Package2,
  Shield,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { KIT_FORMULAS, KitScale, ScenarioConfig, KitSlot, PriceHint } from '@/lib/kits/formulas'
import { formatPrice, cn } from '@/lib/utils'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface DbProduct {
  id: string
  name: string
  brand: string
  price: number
  stock_quantity: number
  image_url: string | null
}

interface KitItem {
  slot: KitSlot
  product: DbProduct | null
  pool: DbProduct[]
  qty: number
  loading: boolean
}

// ─── ICON MAP ─────────────────────────────────────────────────────────────────

const SCENARIO_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  oficina: Building2,
  hogar: Home,
  tienda: ShoppingBag,
  negocio: Factory,
  colegio: GraduationCap,
  almacen: Package2,
}

const SCALE_LABELS: Record<KitScale, string> = { S: 'Pequeño', M: 'Mediano', L: 'Grande' }
const SCALE_DESC: Record<KitScale, string> = {
  S: 'Básico',
  M: 'Estándar',
  L: 'Completo',
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function pickProduct(products: DbProduct[], hint: PriceHint): DbProduct | null {
  if (!products.length) return null
  const sorted = [...products].filter(p => p.price > 0).sort((a, b) => a.price - b.price)
  if (!sorted.length) return products[0]
  if (hint === 'low') return sorted[0]
  if (hint === 'high') return sorted[sorted.length - 1]
  return sorted[Math.floor(sorted.length / 2)]
}

async function fetchByCategory(categorySlug: string, brand?: string): Promise<DbProduct[]> {
  const params = new URLSearchParams({
    limit: '50',
    sortBy: 'price',
    sortOrder: 'asc',
    inStockOnly: 'true',
  })
  params.append('category', categorySlug)
  if (brand) params.append('brand', brand)
  const res = await fetch(`/api/products?${params}`)
  const data = await res.json()
  return (data.products ?? []) as DbProduct[]
}

// ─── PRODUCT SWAP PANEL ───────────────────────────────────────────────────────

function ProductSwapPanel({
  item,
  onSelect,
  onClose,
}: {
  item: KitItem
  onSelect: (product: DbProduct) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const { formatCurrency } = useCart()

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return item.pool
    return item.pool.filter(
      p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    )
  }, [search, item.pool])

  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Seleccionar alternativa — {item.slot.label}
        </p>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o marca..."
          className="h-9 pl-9 text-sm rounded-lg border-slate-200 bg-white"
          autoFocus
        />
      </div>

      <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-400">Sin resultados</p>
        )}
        {filtered.map(product => (
          <button
            key={product.id}
            onClick={() => {
              onSelect(product)
              onClose()
            }}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition hover:border-[hsl(var(--brand))] hover:bg-white',
              item.product?.id === product.id
                ? 'border-[hsl(var(--brand))] bg-white ring-1 ring-[hsl(var(--brand))]'
                : 'border-transparent bg-white/60'
            )}
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 line-clamp-2">{product.name}</p>
              <p className="text-[11px] text-slate-400">{product.brand}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-slate-800">{formatCurrency(product.price)}</p>
              {item.product?.id === product.id && (
                <span className="text-[10px] font-medium text-[hsl(var(--brand))]">Actual</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        {filtered.length} producto{filtered.length !== 1 ? 's' : ''} en esta categoría
      </p>
    </div>
  )
}

// ─── STEP 1 — Scenario selector ───────────────────────────────────────────────

function ScenarioSelector({ onSelect }: { onSelect: (s: ScenarioConfig) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand))]" />
          Paso 1 de 3
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          ¿Qué espacio quieres proteger?
        </h2>
        <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
          Selecciona el tipo de instalación y configuramos el kit de seguridad ideal con productos
          disponibles en stock.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {KIT_FORMULAS.map(scenario => {
          const Icon = SCENARIO_ICONS[scenario.id] ?? Shield
          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className="group relative flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:border-[hsl(var(--brand))] hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-[hsl(var(--surface-highlight))] group-hover:text-[hsl(var(--brand-strong))]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{scenario.label}</p>
                <p className="mt-0.5 text-xs text-slate-500 leading-snug">{scenario.description}</p>
              </div>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-200 transition group-hover:text-[hsl(var(--brand))]" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── STEP 2 — Scale selector ─────────────────────────────────────────────────

function ScaleSelector({
  scenario,
  onSelect,
  onBack,
}: {
  scenario: ScenarioConfig
  onSelect: (s: KitScale) => void
  onBack: () => void
}) {
  const Icon = SCENARIO_ICONS[scenario.id] ?? Shield

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand))]" />
          Paso 2 de 3
        </span>
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <Icon className="h-4 w-4 text-slate-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            {scenario.label} — ¿Qué escala?
          </h2>
        </div>
        <p className="text-slate-500 text-sm">Elige según la cantidad de áreas o personas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {(['S', 'M', 'L'] as KitScale[]).map(scale => {
          const config = scenario.scales[scale]
          const totalItems = config.slots.reduce((acc, s) => acc + s.qty, 0)
          return (
            <button
              key={scale}
              onClick={() => onSelect(scale)}
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-[hsl(var(--brand))] hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 text-sm font-black text-slate-400 transition group-hover:border-[hsl(var(--brand))] group-hover:text-[hsl(var(--brand))]">
                  {scale}
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-slate-500">
                  {SCALE_LABELS[scale]}
                </Badge>
              </div>
              <div>
                <p className="font-bold text-slate-900">{config.name}</p>
                <p className="mt-1 text-xs text-slate-500 leading-snug">{config.description}</p>
              </div>
              <div className="mt-auto pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400">{totalItems} unidades en el kit base</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Cambiar escenario
        </button>
      </div>
    </div>
  )
}

// ─── STEP 3 — Kit Builder ─────────────────────────────────────────────────────

function KitBuilderStep({
  scenario,
  scale,
  items,
  onQtyChange,
  onRemove,
  onSwap,
  onBack,
  onReset,
}: {
  scenario: ScenarioConfig
  scale: KitScale
  items: KitItem[]
  onQtyChange: (slotId: string, delta: number) => void
  onRemove: (slotId: string) => void
  onSwap: (slotId: string, product: DbProduct) => void
  onBack: () => void
  onReset: () => void
}) {
  const { addItem, openCart, formatCurrency } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } = useFavorites()
  const [addedAll, setAddedAll] = useState(false)
  const [swapOpen, setSwapOpen] = useState<string | null>(null)

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (!item.product || item.qty === 0) return sum
        return sum + item.product.price * item.qty
      }, 0),
    [items]
  )

  const activeItems = items.filter(i => i.product && i.qty > 0)
  const isLoading = items.some(i => i.loading)

  const handleAddAll = () => {
    activeItems.forEach(item => {
      addItem({
        id: item.product!.id,
        name: item.product!.name,
        price: item.product!.price,
        image_url: item.product!.image_url ?? undefined,
        image: item.product!.image_url ?? undefined,
        brand: item.product!.brand,
        stock: item.product!.stock_quantity,
        stockCount: item.product!.stock_quantity,
        quantity: item.qty,
      })
    })
    setAddedAll(true)
    openCart()
    setTimeout(() => setAddedAll(false), 3000)
  }

  const handleToggleFavorite = (item: KitItem) => {
    if (!item.product) return
    if (isFavorite(item.product.id)) {
      removeFromFavorites(item.product.id)
    } else {
      addToFavorites({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image_url: item.product.image_url ?? undefined,
        image: item.product.image_url ?? undefined,
        brand: item.product.brand,
      })
    }
  }

  const handleShareWhatsApp = () => {
    const lines = [
      `*Kit ${scenario.label} ${SCALE_LABELS[scale]} — Sumitronic*`,
      '',
      ...activeItems.map(
        i => `• ${i.qty}x ${i.product!.name} — ${formatCurrency(i.product!.price * i.qty)}`
      ),
      '',
      `*Total: ${formatCurrency(subtotal)}*`,
      '',
      `Ver en: ${window.location.origin}/kits`,
    ]
    const text = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/573003094854?text=${text}`, '_blank')
  }

  const Icon = SCENARIO_ICONS[scenario.id] ?? Shield

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <Icon className="h-6 w-6 text-slate-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-xs bg-[hsl(var(--brand-light))] text-[hsl(var(--brand-strong))] border-none"
              >
                Paso 3 de 3
              </Badge>
              <span className="text-sm font-semibold text-slate-500">— {SCALE_LABELS[scale]}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{scenario.scales[scale].name}</h2>
          </div>
        </div>
        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 sm:flex-none text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Cambiar
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Products column */}
        <div className="lg:col-span-8 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
              <Loader2 className="h-10 w-10 animate-spin text-[hsl(var(--brand))]" />
              <p className="text-slate-500 font-medium">Ensamblando tu kit ideal...</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.slot.id}
                className={cn(
                  'relative flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-2xl border bg-white p-5 shadow-sm transition-all hover:border-slate-300',
                  item.qty === 0 ? 'opacity-40 grayscale-[0.5]' : 'border-slate-200'
                )}
              >
                {item.product ? (
                  <>
                    {/* Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center">
                      <Image
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.name}
                        fill
                        className="object-contain p-2 mix-blend-multiply"
                      />
                    </div>

                    {/* Info details */}
                    <div className="flex-1 min-w-0 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                            {item.slot.role}
                          </span>
                        </div>
                        <Link
                          href={`/products/${item.product.id}`}
                          target="_blank"
                          className="group block mt-1"
                        >
                          <p className="text-base font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-[hsl(var(--brand))] transition-colors">
                            {item.product.name}
                          </p>
                        </Link>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                          {item.product.brand}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        {/* Secondary Actions */}
                        <button
                          onClick={() =>
                            setSwapOpen(prev => (prev === item.slot.id ? null : item.slot.id))
                          }
                          className={cn(
                            'flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                            swapOpen === item.slot.id
                              ? 'bg-[hsl(var(--brand-light))] text-[hsl(var(--brand-strong))] hover:bg-[hsl(var(--brand-light)/.8)]'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          )}
                          title="Cambiar por otro modelo"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />{' '}
                          <span className="hidden sm:inline">Cambiar</span>
                        </button>

                        <button
                          onClick={() => handleToggleFavorite(item)}
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-full transition',
                            isFavorite(item.product.id)
                              ? 'bg-rose-100 text-rose-500'
                              : 'text-slate-400 hover:bg-slate-100 hover:text-rose-400'
                          )}
                          title="Favorito"
                        >
                          <Heart
                            className={cn('h-4 w-4', isFavorite(item.product.id) && 'fill-current')}
                          />
                        </button>

                        <div className="sm:hidden ml-auto">
                          <p className="text-lg font-black text-slate-900">
                            {formatCurrency(item.product.price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="hidden sm:flex flex-col items-end gap-3 shrink-0 ml-auto border-l border-slate-100 pl-6 min-w-[140px]">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium mb-1">Precio unit.</p>
                        <p className="text-xl font-black text-slate-900 leading-none">
                          {formatCurrency(item.product.price)}
                        </p>
                      </div>

                      {/* Qty wrapper */}
                      <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-1">
                        <button
                          onClick={() => onQtyChange(item.slot.id, -1)}
                          disabled={item.qty === 0}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 hover:bg-slate-100 transition disabled:opacity-40"
                        >
                          <Minus className="h-4 w-4 text-slate-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-800">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onQtyChange(item.slot.id, +1)}
                          disabled={item.qty >= item.product.stock_quantity}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 hover:bg-slate-100 transition disabled:opacity-40"
                        >
                          <Plus className="h-4 w-4 text-slate-600" />
                        </button>
                      </div>

                      {item.qty > 1 && (
                        <p className="text-xs font-semibold text-slate-500 text-right w-full">
                          Total: {formatCurrency(item.product.price * item.qty)}
                        </p>
                      )}

                      {/* Remove */}
                      <button
                        onClick={() => onRemove(item.slot.id)}
                        className="absolute right-3 top-3 p-2 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full hover:bg-red-50"
                        title="Quitar"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Mobile controls row below content if small screen */}
                    <div className="flex sm:hidden w-full items-center justify-between border-t border-slate-100 pt-4 mt-2">
                      <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-1">
                        <button
                          onClick={() => onQtyChange(item.slot.id, -1)}
                          disabled={item.qty === 0}
                          className="h-8 w-8 flex items-center justify-center bg-slate-50 rounded-md"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                        <button
                          onClick={() => onQtyChange(item.slot.id, +1)}
                          disabled={item.qty >= item.product.stock_quantity}
                          className="h-8 w-8 flex items-center justify-center bg-slate-50 rounded-md"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemove(item.slot.id)}
                        className="flex items-center text-xs font-bold text-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Quitar
                      </button>
                    </div>

                    {/* Swap panel full-width foldout */}
                    {swapOpen === item.slot.id && (
                      <div className="absolute left-0 right-0 top-full z-10 -mt-2 bg-white rounded-b-2xl border-x border-b border-slate-300 shadow-xl p-4 origin-top animate-in fade-in slide-in-from-top-2">
                        <ProductSwapPanel
                          item={item}
                          onSelect={product => onSwap(item.slot.id, product)}
                          onClose={() => setSwapOpen(null)}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-4 w-full">
                    <div className="h-16 w-16 rounded-xl bg-slate-100 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.slot.role}
                      </span>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        Producto agotado o no disponible en esta categoría
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Summary sidecar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF7A00]">
                Resumen de Compra
              </p>
              <p className="text-lg font-bold mt-1">
                {scenario.label} — {SCALE_LABELS[scale]}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                {activeItems.map(item => (
                  <div key={item.slot.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">
                        {item.slot.role}
                      </p>
                      <p className="text-sm font-medium text-slate-200 line-clamp-1">
                        {item.qty > 1 && (
                          <span className="text-[#FF7A00] font-bold">{item.qty}× </span>
                        )}
                        {item.product!.name}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-white shrink-0 mt-3">
                      {formatCurrency(item.product!.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {activeItems.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-400">El kit está vacío</p>
              )}

              <div className="border-t border-white/10 pt-4 mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300 font-medium">Total</span>
                  <span className="text-2xl font-black text-white">{formatCurrency(subtotal)}</span>
                </div>
                {subtotal > 100000 && (
                  <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" /> Envío nacional sin costo
                  </p>
                )}
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  size="lg"
                  onClick={handleAddAll}
                  disabled={activeItems.length === 0 || addedAll}
                  className="w-full rounded-xl bg-[#FF7A00] font-bold text-white hover:bg-[#e66e00] disabled:opacity-60 disabled:hover:bg-[#FF7A00] h-12 text-base transition-colors"
                >
                  {addedAll ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" /> Agregado al carrito
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" /> LLEVAR EL KIT
                    </>
                  )}
                </Button>

                <button
                  onClick={handleShareWhatsApp}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-bold text-white transition hover:bg-white/10 hover:border-white/40"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir cotización
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function KitBuilder() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [scenario, setScenario] = useState<ScenarioConfig | null>(null)
  const [scale, setScale] = useState<KitScale | null>(null)
  const [items, setItems] = useState<KitItem[]>([])

  const loadKit = useCallback(async (sc: ScenarioConfig, sk: KitScale) => {
    const slots = sc.scales[sk].slots
    setItems(slots.map(slot => ({ slot, product: null, pool: [], qty: slot.qty, loading: true })))

    // Deduplicate fetches by category+brand
    const uniqueKeys = Array.from(
      new Map(slots.map(s => [`${s.categorySlug}:${s.brand ?? ''}`, s])).values()
    )
    const fetched = await Promise.all(uniqueKeys.map(s => fetchByCategory(s.categorySlug, s.brand)))
    const poolMap = new Map(
      uniqueKeys.map((s, i) => [`${s.categorySlug}:${s.brand ?? ''}`, fetched[i]])
    )

    setItems(
      slots.map(slot => {
        const pool = poolMap.get(`${slot.categorySlug}:${slot.brand ?? ''}`) ?? []
        const product = pickProduct(pool, slot.priceHint)
        return { slot, product, pool, qty: slot.qty, loading: false }
      })
    )
  }, [])

  const handleSelectScenario = (sc: ScenarioConfig) => {
    setScenario(sc)
    setStep(2)
  }

  const handleSelectScale = async (sk: KitScale) => {
    setScale(sk)
    setStep(3)
    await loadKit(scenario!, sk)
  }

  const handleQtyChange = (slotId: string, delta: number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.slot.id !== slotId || !item.product) return item
        const next = Math.max(0, Math.min(item.qty + delta, item.product.stock_quantity))
        return { ...item, qty: next }
      })
    )
  }

  const handleRemove = (slotId: string) => {
    setItems(prev => prev.map(item => (item.slot.id === slotId ? { ...item, qty: 0 } : item)))
  }

  const handleSwap = (slotId: string, product: DbProduct) => {
    setItems(prev =>
      prev.map(item => {
        if (item.slot.id !== slotId) return item
        const qty = Math.min(item.qty || 1, product.stock_quantity)
        return { ...item, product, qty }
      })
    )
  }

  const handleReset = () => {
    setStep(1)
    setScenario(null)
    setScale(null)
    setItems([])
  }

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Progress bar */}
      <div className="mb-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          {[
            { n: 1 as const, label: 'Escenario' },
            { n: 2 as const, label: 'Escala' },
            { n: 3 as const, label: 'Tu kit' },
          ].map(({ n, label }) => (
            <div key={n} className="flex flex-col items-center gap-2 sm:flex-row">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-sm',
                  step > n
                    ? 'bg-[hsl(var(--brand))] text-white border-none'
                    : step === n
                      ? 'border-2 border-[hsl(var(--brand))] text-[hsl(var(--brand))] bg-white'
                      : 'bg-white border text-slate-400'
                )}
              >
                {step > n ? <CheckCircle2 className="h-5 w-5" /> : n}
              </div>
              <span
                className={cn(
                  'text-xs font-bold uppercase tracking-wider',
                  step >= n ? 'text-slate-800' : 'text-slate-400'
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[hsl(var(--brand))] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step === 1 && <ScenarioSelector onSelect={handleSelectScenario} />}
      {step === 2 && scenario && (
        <ScaleSelector scenario={scenario} onSelect={handleSelectScale} onBack={() => setStep(1)} />
      )}
      {step === 3 && scenario && scale && (
        <KitBuilderStep
          scenario={scenario}
          scale={scale}
          items={items}
          onQtyChange={handleQtyChange}
          onRemove={handleRemove}
          onSwap={handleSwap}
          onBack={() => setStep(2)}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
