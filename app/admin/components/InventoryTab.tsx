'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import {
  Package,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Download,
  Play,
  Pause,
  X,
  ChevronDown,
  ArrowDownAZ,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Product, formatPrice } from '../types'

interface InventoryTabProps {
  products: Product[]
  loadingProducts: boolean
  isSearching: boolean
  totalProducts: number
  totalPages: number
  currentPage: number
  searchQuery: string
  categoryFilter: string
  categories: string[]
  priceOp: 'gt' | 'lt'
  priceValue: string
  stockOp: 'gt' | 'lt'
  stockValue: string
  statusFilter: 'all' | 'active' | 'inactive'
  sortOrder: 'newest' | 'oldest' | 'az' | 'za'
  deleteDialog: { open: boolean; product: Product | null }
  onPageChange: (page: number) => void
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onPriceOpChange: (op: 'gt' | 'lt') => void
  onPriceValueChange: (val: string) => void
  onStockOpChange: (op: 'gt' | 'lt') => void
  onStockValueChange: (val: string) => void
  onStatusFilterChange: (s: 'all' | 'active' | 'inactive') => void
  onSortOrderChange: (s: 'newest' | 'oldest' | 'az' | 'za') => void
  onEdit: (product: Product) => void
  onAdd: () => void
  onDeleteRequest: (product: Product) => void
  onDeleteConfirm: (product: Product) => void
  onDeleteCancel: () => void
  onExportCSV: () => void
  onToggleActive: (product: Product) => void
  exportingCSV?: boolean
}

export default function InventoryTab({
  products,
  loadingProducts,
  isSearching,
  totalProducts,
  totalPages,
  currentPage,
  searchQuery,
  categoryFilter,
  categories,
  priceOp,
  priceValue,
  stockOp,
  stockValue,
  statusFilter,
  sortOrder,
  deleteDialog,
  onPageChange,
  onSearchChange,
  onCategoryChange,
  onPriceOpChange,
  onPriceValueChange,
  onStockOpChange,
  onStockValueChange,
  onStatusFilterChange,
  onSortOrderChange,
  onEdit,
  onAdd,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  onExportCSV,
  onToggleActive,
  exportingCSV = false,
}: InventoryTabProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeFilters =
    (searchQuery ? 1 : 0) +
    (categoryFilter !== 'all' ? 1 : 0) +
    (priceValue !== '' ? 1 : 0) +
    (stockValue !== '' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (sortOrder !== 'newest' ? 1 : 0)

  const clearAllFilters = () => {
    onCategoryChange('all')
    onPriceValueChange('')
    onStockValueChange('')
    onStatusFilterChange('all')
    onSortOrderChange('newest')
  }

  return (
    <>
      <div className="space-y-6">
        {/* Quick stats bar */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--text-muted))]">
                    Total Productos
                  </p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--text-muted))]">Página Actual</p>
                  <p className="text-2xl font-bold">
                    {currentPage} / {totalPages}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--text-muted))]">
                    Filtros Activos
                  </p>
                  <p className="text-2xl font-bold">{activeFilters}</p>
                </div>
                <Filter className="h-8 w-8 text-[hsl(var(--brand))]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--text-muted))]">Estado</p>
                  <p className="text-lg font-bold text-green-600">
                    {loadingProducts ? 'Cargando...' : 'Optimizado'}
                  </p>
                </div>
                <div
                  className={`h-3 w-3 rounded-full ${loadingProducts ? 'bg-yellow-500' : 'bg-green-500'}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            {/* Top row: search + filter toggle + actions */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                {isSearching ? (
                  <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--border-strong))] h-4 w-4" />
                )}
                <Input
                  placeholder="Buscar por nombre o marca..."
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter toggle button with badge */}
              <button
                onClick={() => setFiltersOpen(prev => !prev)}
                className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  filtersOpen || activeFilters > 0
                    ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'border-[hsl(var(--border-subtle))] bg-white text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--surface-muted))]'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filtros
                {activeFilters > 0 && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {activeFilters}
                  </span>
                )}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    filtersOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <Button onClick={onAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
              <Button
                variant="outline"
                onClick={onExportCSV}
                disabled={exportingCSV || totalProducts === 0}
                title="Descargar todos los productos como CSV"
              >
                {exportingCSV ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {exportingCSV ? 'Exportando...' : 'Exportar CSV'}
              </Button>
            </div>

            {/* Collapsible filter panel */}
            {filtersOpen && (
              <div className="mt-4 rounded-lg border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[hsl(var(--text-muted))]">
                    Filtros avanzados
                  </p>
                  {activeFilters > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                      Limpiar filtros
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {/* Categoría */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide">
                      Categoría
                    </label>
                    <Select value={categoryFilter} onValueChange={onCategoryChange}>
                      <SelectTrigger className="h-9 bg-white">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Precio */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide">
                      Precio
                    </label>
                    <div className="flex gap-1.5">
                      <Select
                        value={priceOp}
                        onValueChange={v => onPriceOpChange(v as 'gt' | 'lt')}
                      >
                        <SelectTrigger className="h-9 w-[120px] shrink-0 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lt">Menor que</SelectItem>
                          <SelectItem value="gt">Mayor que</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="0"
                        value={priceValue}
                        onChange={e => onPriceValueChange(e.target.value)}
                        className="h-9 bg-white"
                        min={0}
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide">
                      Stock
                    </label>
                    <div className="flex gap-1.5">
                      <Select
                        value={stockOp}
                        onValueChange={v => onStockOpChange(v as 'gt' | 'lt')}
                      >
                        <SelectTrigger className="h-9 w-[120px] shrink-0 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gt">Mayor que</SelectItem>
                          <SelectItem value="lt">Menor que</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="0"
                        value={stockValue}
                        onChange={e => onStockValueChange(e.target.value)}
                        className="h-9 bg-white"
                        min={0}
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide">
                      Estado
                    </label>
                    <div className="flex gap-1.5">
                      {(['all', 'active', 'inactive'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => onStatusFilterChange(s)}
                          className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                            statusFilter === s
                              ? s === 'active'
                                ? 'border-emerald-400 bg-emerald-100 text-emerald-700'
                                : s === 'inactive'
                                  ? 'border-amber-400 bg-amber-100 text-amber-700'
                                  : 'border-blue-400 bg-blue-100 text-blue-700'
                              : 'border-[hsl(var(--border-subtle))] bg-white text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--surface-muted))]'
                          }`}
                        >
                          {s === 'all' ? (
                            'Todos'
                          ) : s === 'active' ? (
                            <span className="flex items-center justify-center gap-1">
                              <Play className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                              Publicado
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1">
                              <Pause className="h-3 w-3 fill-amber-600 text-amber-600" />
                              Pausado
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orden */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[hsl(var(--text-muted))] uppercase tracking-wide flex items-center gap-1">
                      <ArrowDownAZ className="h-3.5 w-3.5" />
                      Orden
                    </label>
                    <Select
                      value={sortOrder}
                      onValueChange={v => onSortOrderChange(v as 'newest' | 'oldest' | 'az' | 'za')}
                    >
                      <SelectTrigger className="h-9 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Más reciente</SelectItem>
                        <SelectItem value="oldest">Más antiguo</SelectItem>
                        <SelectItem value="az">Nombre A → Z</SelectItem>
                        <SelectItem value="za">Nombre Z → A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-0 pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Productos{' '}
              <span className="text-sm font-normal text-[hsl(var(--text-muted))] hidden sm:inline-block">
                ({totalProducts} total — Página {currentPage} de {totalPages})
              </span>
              <span className="text-sm font-normal text-[hsl(var(--text-muted))] block sm:hidden">
                Total: {totalProducts}
              </span>
            </CardTitle>
            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1">
              <Button
                variant="outline"
                size="sm"
                className="min-h-[44px] sm:min-h-0"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loadingProducts}
              >
                Anterior
              </Button>
              <span className="text-sm text-[hsl(var(--text-muted))] whitespace-nowrap px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="min-h-[44px] sm:min-h-0"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loadingProducts}
              >
                Siguiente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <div className="text-center py-12">
                <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[hsl(var(--brand))]" />
                <p className="text-[hsl(var(--text-muted))]">Cargando productos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--border-strong))]" />
                <p className="text-[hsl(var(--text-muted))] mb-4">
                  {searchQuery || categoryFilter !== 'all'
                    ? 'No se encontraron productos'
                    : 'No hay productos en el inventario'}
                </p>
                <Button onClick={onAdd}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Producto
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {products.map(product => (
                    <div
                      key={`mobile-${product.id}`}
                      className="rounded-xl border border-[hsl(var(--border-subtle))] bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[hsl(var(--surface-muted))]">
                          <Image
                            src={product.image_url || '/placeholder.svg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 font-medium text-[hsl(var(--foreground))]">
                            {product.name}
                          </p>
                          <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
                            {product.brand}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">
                              {product.category?.name || 'Sin categoría'}
                            </Badge>
                            {product.featured && (
                              <Badge variant="default" className="text-xs">
                                Destacado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-[hsl(var(--text-muted))]">Precio</p>
                          <p className="font-semibold text-[hsl(var(--foreground))]">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[hsl(var(--text-muted))]">Stock</p>
                          <div className="flex items-center gap-2 font-medium text-[hsl(var(--foreground))]">
                            <span
                              className={`inline-block h-2 w-2 rounded-full ${
                                product.stock_quantity > 10
                                  ? 'bg-green-500'
                                  : product.stock_quantity > 0
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                            />
                            {product.stock_quantity} unidades
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5">
                        {/* Estado toggle */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleActive(product)}
                          title={
                            product.active ? 'Pausar (ocultar de tienda)' : 'Publicar en tienda'
                          }
                          className={`h-10 px-3 font-medium text-xs ${
                            product.active
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800'
                              : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800'
                          }`}
                        >
                          {product.active ? (
                            <>
                              <Pause className="h-3.5 w-3.5 mr-1" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="h-3.5 w-3.5 mr-1" />
                              Publicar
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" asChild className="h-10 flex-1">
                          <Link href={`/products/${product.id}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(product)}
                          className="h-10 flex-1"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteRequest(product)}
                          className="h-10 border-red-200 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map(product => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[hsl(var(--surface-muted))]">
                                <Image
                                  src={product.image_url || '/placeholder.svg'}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-[hsl(var(--foreground))]">
                                  {product.name}
                                </p>
                                <p className="text-sm text-[hsl(var(--text-muted))]">
                                  {product.brand}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {product.category?.name || 'Sin categoría'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatPrice(product.price)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  product.stock_quantity > 10
                                    ? 'bg-green-500'
                                    : product.stock_quantity > 0
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                }`}
                              />
                              {product.stock_quantity} unidades
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1.5">
                              {/* Publicación toggle */}
                              <button
                                onClick={() => onToggleActive(product)}
                                title={product.active ? 'Pausar publicación' : 'Publicar en tienda'}
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                                  product.active
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                }`}
                              >
                                {product.active ? (
                                  <>
                                    <Play className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                                    Publicado
                                  </>
                                ) : (
                                  <>
                                    <Pause className="h-3 w-3 fill-amber-600 text-amber-600" />
                                    Pausado
                                  </>
                                )}
                              </button>
                              {product.featured && (
                                <Badge variant="default" className="text-xs w-fit">
                                  Destacado
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" asChild title="Ver producto">
                                <Link href={`/products/${product.id}`} target="_blank">
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(product)}
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteRequest(product)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={open => !open && onDeleteCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar &quot;{deleteDialog.product?.name}&quot;? Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onDeleteCancel}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog.product && onDeleteConfirm(deleteDialog.product)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
