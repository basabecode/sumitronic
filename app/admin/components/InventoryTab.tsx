'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Package, Search, Filter, Plus, Eye, Edit, Trash2, Loader2, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
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
  deleteDialog: { open: boolean; product: Product | null }
  onPageChange: (page: number) => void
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onEdit: (product: Product) => void
  onAdd: () => void
  onDeleteRequest: (product: Product) => void
  onDeleteConfirm: (product: Product) => void
  onDeleteCancel: () => void
  onExportCSV: () => void
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
  deleteDialog,
  onPageChange,
  onSearchChange,
  onCategoryChange,
  onEdit,
  onAdd,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  onExportCSV,
  exportingCSV = false,
}: InventoryTabProps) {
  const activeFilters = (searchQuery ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0)

  return (
    <>
      <div className="space-y-6">
        {/* Quick stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Productos</p>
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
                  <p className="text-sm font-medium text-gray-600">Página Actual</p>
                  <p className="text-2xl font-bold">{currentPage} / {totalPages}</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Filtros Activos</p>
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
                  <p className="text-sm font-medium text-gray-600">Estado</p>
                  <p className="text-lg font-bold text-green-600">
                    {loadingProducts ? 'Cargando...' : 'Optimizado'}
                  </p>
                </div>
                <div className={`h-3 w-3 rounded-full ${loadingProducts ? 'bg-yellow-500' : 'bg-green-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                {isSearching ? (
                  <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                )}
                <Input
                  placeholder="Buscar por nombre o marca..."
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-0 pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Productos <span className="text-sm font-normal text-gray-500 hidden sm:inline-block">({totalProducts} total — Página {currentPage} de {totalPages})</span>
              <span className="text-sm font-normal text-gray-500 block sm:hidden">Total: {totalProducts}</span>
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
              <span className="text-sm text-gray-600 whitespace-nowrap px-2">{currentPage} / {totalPages}</span>
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
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
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
              <div className="overflow-x-auto">
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
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={product.image_url || '/placeholder.svg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.brand}</p>
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
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              product.stock_quantity > 10
                                ? 'bg-green-500'
                                : product.stock_quantity > 0
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`} />
                            {product.stock_quantity} unidades
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.featured && (
                            <Badge variant="default" className="text-xs">Destacado</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/products/${product.id}`} target="_blank">
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteRequest(product)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={open => !open && onDeleteCancel()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar &quot;{deleteDialog.product?.name}&quot;?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onDeleteCancel}>Cancelar</Button>
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
