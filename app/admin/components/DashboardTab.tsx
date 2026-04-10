'use client'

import { Package, Users, Settings, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      color: 'text-[hsl(var(--brand))]',
      icon: <Package className="h-8 w-8 text-[hsl(var(--brand))]" />,
    },
    {
      label: 'En Stock',
      value: dashboardStats.inStock,
      color: 'text-green-600',
      icon: (
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <div className="h-4 w-4 bg-green-600 rounded-full" />
        </div>
      ),
    },
    {
      label: 'Sin Stock',
      value: dashboardStats.outOfStock,
      color: 'text-red-600',
      icon: (
        <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
          <div className="h-4 w-4 bg-red-600 rounded-full" />
        </div>
      ),
    },
    {
      label: 'Destacados',
      value: dashboardStats.featured,
      color: 'text-yellow-600',
      icon: (
        <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <div className="h-4 w-4 bg-yellow-600 rounded-full" />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  {loadingProducts ? (
                    <Loader2 className={`h-6 w-6 animate-spin ${stat.color} mt-2`} />
                  ) : (
                    <p className="text-2xl md:text-3xl font-bold mt-1 text-gray-900">
                      {stat.value}
                    </p>
                  )}
                </div>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[hsl(var(--brand))]" />
              Gestión de Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Administra tu catálogo de productos</p>
            <div className="space-y-2">
              <Button onClick={onNavigateToInventory} className="w-full">
                Ver Inventario
              </Button>
              <Button onClick={onNavigateToAddProduct} variant="outline" className="w-full">
                Agregar Producto
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Administra usuarios del sistema</p>
            <Button variant="outline" className="w-full" disabled>
              Próximamente
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Configuración del sistema</p>
            <Button variant="outline" className="w-full" disabled>
              Próximamente
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
