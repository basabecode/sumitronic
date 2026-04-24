'use client'

import { Package, Star, TrendingDown, BarChart3, Loader2, Plus, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardStats } from '../hooks/useAdminProducts'

interface DashboardTabProps {
  dashboardStats: DashboardStats
  loadingProducts: boolean
  onNavigateToInventory: () => void
  onNavigateToAddProduct: () => void
}

export default function DashboardTab({
  dashboardStats,
  loadingProducts,
  onNavigateToInventory,
  onNavigateToAddProduct,
}: DashboardTabProps) {
  const stats = [
    {
      label: 'Total Productos',
      value: dashboardStats.totalProducts,
      icon: Package,
      iconBg: 'bg-[hsl(var(--surface-highlight))]',
      iconColor: 'text-[hsl(var(--brand-strong))]',
      valueColor: 'text-[hsl(var(--foreground))]',
    },
    {
      label: 'En Stock',
      value: dashboardStats.inStock,
      icon: BarChart3,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700',
    },
    {
      label: 'Sin Stock',
      value: dashboardStats.outOfStock,
      icon: TrendingDown,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      valueColor: 'text-red-600',
    },
    {
      label: 'Destacados',
      value: dashboardStats.featured,
      icon: Star,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      valueColor: 'text-amber-700',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor, valueColor }) => (
          <div
            key={label}
            className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide">
                  {label}
                </p>
                {loadingProducts ? (
                  <Loader2 className={`mt-2 h-5 w-5 animate-spin ${iconColor}`} />
                ) : (
                  <p className={`mt-1 font-display text-3xl font-bold ${valueColor}`}>{value}</p>
                )}
              </div>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
              >
                <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-[hsl(var(--border-subtle))] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-[hsl(var(--brand))]" aria-hidden="true" />
          <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">
            Acciones rápidas
          </h3>
        </div>
        <p className="text-sm text-[hsl(var(--text-muted))] mb-5">
          Gestiona el catálogo de productos desde aquí.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onNavigateToInventory} className="flex-1 gap-2 rounded-xl">
            <List className="h-4 w-4" aria-hidden="true" />
            Ver Inventario
          </Button>
          <Button
            onClick={onNavigateToAddProduct}
            variant="outline"
            className="flex-1 gap-2 rounded-xl border-[hsl(var(--brand))] text-[hsl(var(--brand-strong))] hover:bg-[hsl(var(--surface-highlight))]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar Producto
          </Button>
        </div>
      </div>
    </div>
  )
}
