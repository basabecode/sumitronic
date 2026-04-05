'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Package, Plus, DollarSign, ExternalLink, Loader2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

import { useAdminProducts } from './hooks/useAdminProducts'
import { useProductForm } from './hooks/useProductForm'
import DashboardTab from './components/DashboardTab'
import InventoryTab from './components/InventoryTab'
import ProductFormTab from './components/ProductFormTab'
import SalesTab from './components/SalesTab'

type Tab = 'dashboard' | 'sales' | 'inventory' | 'add-product'

const TAB_BUTTONS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: Home },
  { id: 'sales', label: 'Ventas', Icon: DollarSign },
  { id: 'inventory', label: 'Inventario', Icon: Package },
  { id: 'add-product', label: 'Agregar Producto', Icon: Plus },
]

type SyncStatus = { state: 'idle' } | { state: 'loading' } | { state: 'ok'; synced: number } | { state: 'error'; message: string }

function escapeCSV(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export default function AdminDashboard() {
  const { user, loading, profile } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ state: 'idle' })
  const [exportingCSV, setExportingCSV] = useState(false)

  const handleExportCSV = async () => {
    setExportingCSV(true)
    try {
      const res = await fetch('/api/products?limit=1000&sortBy=created_at&sortOrder=asc')
      const data = await res.json()
      const allProducts = data.products ?? []

      const headers = ['sku', 'name', 'description', 'price', 'compare_price', 'cost_price', 'brand', 'category_slug', 'stock_quantity', 'weight', 'featured', 'active', 'tags', 'image_url', 'extra_images']

      const rows = allProducts.map((p: any) => [
        p.sku ?? '',
        p.name ?? '',
        p.description ?? '',
        p.price ?? 0,
        p.compare_price ?? '',
        '',
        p.brand ?? '',
        p.category?.slug ?? '',
        p.stock_quantity ?? 0,
        p.weight ?? '',
        p.featured ? 'TRUE' : 'FALSE',
        p.active !== false ? 'TRUE' : 'FALSE',
        Array.isArray(p.tags) ? p.tags.join(',') : '',
        p.image_url ?? '',
        Array.isArray(p.images) && p.images.length > 1
          ? p.images.slice(1).join(',')
          : '',
      ])

      const csv = [headers, ...rows].map(row => row.map(escapeCSV).join(',')).join('\n')
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `sumitronic-productos-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exportando CSV:', err)
    } finally {
      setExportingCSV(false)
    }
  }

  const handleSyncSheets = async () => {
    setSyncStatus({ state: 'loading' })
    try {
      const secret = process.env.NEXT_PUBLIC_SYNC_SECRET
      const res = await fetch(`/api/sync-products?secret=${secret}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al sincronizar')
      setSyncStatus({ state: 'ok', synced: data.synced })
      products.fetchProducts()
      setTimeout(() => setSyncStatus({ state: 'idle' }), 4000)
    } catch (err) {
      setSyncStatus({ state: 'error', message: err instanceof Error ? err.message : 'Error desconocido' })
      setTimeout(() => setSyncStatus({ state: 'idle' }), 5000)
    }
  }

  const products = useAdminProducts()
  const form = useProductForm({
    onSaveSuccess: () => {
      products.fetchProducts()
      setActiveTab('inventory')
    },
  })

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'dashboard') {
      products.fetchDashboardStats()
    }
    if (activeTab === 'inventory' || activeTab === 'dashboard') {
      products.fetchProducts()
    }
    if (activeTab === 'add-product') {
      form.fetchCategories()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, products.currentPage, products.debouncedSearchQuery, products.categoryFilter])

  const handleEditProduct = (product: Parameters<typeof form.loadProductForEdit>[0]) => {
    form.loadProductForEdit(product)
    setActiveTab('add-product')
  }

  const handleAddProduct = () => {
    form.resetForm()
    setActiveTab('add-product')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[hsl(var(--brand))]" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile || profile.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Acceso Denegado</h2>
            <p className="text-gray-600 mb-4">
              Necesitas permisos de administrador para acceder a esta página.
            </p>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Volver al Inicio</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-sm md:text-base text-gray-600">Bienvenido, {user.email}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto min-h-[44px] gap-2"
            onClick={handleSyncSheets}
            disabled={syncStatus.state === 'loading'}
          >
            {syncStatus.state === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : syncStatus.state === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : syncStatus.state === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {syncStatus.state === 'loading' && 'Sincronizando...'}
            {syncStatus.state === 'ok' && `${syncStatus.synced} producto(s) sincronizados`}
            {syncStatus.state === 'error' && syncStatus.message}
            {syncStatus.state === 'idle' && 'Sincronizar Sheets'}
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto min-h-[44px]">
            <Link href="/" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Tienda
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tab Navigation — completely responsive and scalable */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <div className="inline-flex min-w-full md:grid md:grid-cols-4 items-center rounded-lg bg-muted p-1.5 text-muted-foreground gap-1 md:gap-0">
            {TAB_BUTTONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-3 md:py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-2 min-h-[44px] ${
                  activeTab === id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:bg-background/50 hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 md:w-4 md:h-4 shrink-0" />
                <span>{id === 'add-product' && form.editingProduct ? 'Editar Producto' : label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-2 text-foreground">
          {activeTab === 'sales' && <SalesTab />}

          {activeTab === 'dashboard' && (
            <DashboardTab
              dashboardStats={products.dashboardStats}
              loadingProducts={products.loadingProducts}
              onNavigateToInventory={() => setActiveTab('inventory')}
              onNavigateToAddProduct={handleAddProduct}
            />
          )}

        {activeTab === 'inventory' && (
          <InventoryTab
            products={products.products}
            loadingProducts={products.loadingProducts}
            isSearching={products.isSearching}
            totalProducts={products.totalProducts}
            totalPages={products.totalPages}
            currentPage={products.currentPage}
            searchQuery={products.searchQuery}
            categoryFilter={products.categoryFilter}
            categories={form.categories}
            deleteDialog={products.deleteDialog}
            onPageChange={products.setCurrentPage}
            onSearchChange={products.setSearchQuery}
            onCategoryChange={products.setCategoryFilter}
            onEdit={handleEditProduct}
            onAdd={handleAddProduct}
            onDeleteRequest={p => products.setDeleteDialog({ open: true, product: p })}
            onDeleteConfirm={products.handleDeleteProduct}
            onDeleteCancel={() => products.setDeleteDialog({ open: false, product: null })}
            onExportCSV={handleExportCSV}
            exportingCSV={exportingCSV}
          />
        )}

        {activeTab === 'add-product' && (
          <ProductFormTab
            formData={form.formData}
            formDirty={form.formDirty}
            editingProduct={form.editingProduct}
            formLoading={form.formLoading}
            imageUploading={form.imageUploading}
            categories={form.categories}
            brands={form.brands}
            newCategory={form.newCategory}
            newBrand={form.newBrand}
            showAddCategory={form.showAddCategory}
            showAddBrand={form.showAddBrand}
            onInputChange={form.handleInputChange}
            onImageUpload={form.handleImageUpload}
            onDropFiles={form.processImageFiles}
            onRemoveImage={form.removeImage}
            onAddCategory={form.handleAddCategory}
            onAddBrand={form.handleAddBrand}
            onSubmit={form.handleSubmitProduct}
            onCancel={() => setActiveTab('inventory')}
            onSetNewCategory={form.setNewCategory}
            onSetNewBrand={form.setNewBrand}
            onToggleAddCategory={form.setShowAddCategory}
            onToggleAddBrand={form.setShowAddBrand}
          />
        )}
        </div>
      </div>
    </div>
  )
}
