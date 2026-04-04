'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Save, ExternalLink, Plus, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Product, ProductFormData } from '../types'

interface ProductFormTabProps {
  formData: ProductFormData
  editingProduct: Product | null
  formLoading: boolean
  imageUploading: boolean
  categories: string[]
  brands: string[]
  newCategory: string
  newBrand: string
  showAddCategory: boolean
  showAddBrand: boolean
  onInputChange: (field: keyof ProductFormData, value: unknown) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
  onAddCategory: () => void
  onAddBrand: () => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  onSetNewCategory: (v: string) => void
  onSetNewBrand: (v: string) => void
  onToggleAddCategory: (v: boolean) => void
  onToggleAddBrand: (v: boolean) => void
  formDirty?: boolean
  onDropFiles?: (files: File[]) => void
}

export default function ProductFormTab({
  formData,
  editingProduct,
  formLoading,
  imageUploading,
  categories,
  brands,
  newCategory,
  newBrand,
  showAddCategory,
  showAddBrand,
  onInputChange,
  onImageUpload,
  onRemoveImage,
  onAddCategory,
  onAddBrand,
  onSubmit,
  onCancel,
  onSetNewCategory,
  onSetNewBrand,
  onToggleAddCategory,
  onToggleAddBrand,
  formDirty,
  onDropFiles,
}: ProductFormTabProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const discountPct =
    formData.compare_price && formData.compare_price > formData.price
      ? Math.round(((formData.compare_price - formData.price) / formData.compare_price) * 100)
      : null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (onDropFiles && e.dataTransfer.files?.length > 0) {
      onDropFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleCancelGuard = () => {
    if (formDirty) {
      if (window.confirm('Tienes cambios sin guardar. ¿Seguro que quieres descartarlos?')) {
        onCancel()
      }
    } else {
      onCancel()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={handleCancelGuard} className="min-h-[44px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {editingProduct ? 'Modifica los datos del producto' : 'Completa los datos del nuevo producto'}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={e => onInputChange('name', e.target.value)}
                  placeholder="Ej: Cámara IP IMOU Ranger 2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => onInputChange('description', e.target.value)}
                  placeholder="Describe las características principales del producto..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Categoría */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Categoría *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => onToggleAddCategory(!showAddCategory)}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Nueva
                    </Button>
                  </div>
                  {showAddCategory && (
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Nueva categoría"
                        value={newCategory}
                        onChange={e => onSetNewCategory(e.target.value)}
                        className="text-sm"
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAddCategory() } }}
                      />
                      <Button type="button" size="sm" onClick={onAddCategory} disabled={!newCategory.trim()}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <Select value={formData.category} onValueChange={v => onInputChange('category', v)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Marca */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Marca *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => onToggleAddBrand(!showAddBrand)}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Nueva
                    </Button>
                  </div>
                  {showAddBrand && (
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Nueva marca"
                        value={newBrand}
                        onChange={e => onSetNewBrand(e.target.value)}
                        className="text-sm"
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAddBrand() } }}
                      />
                      <Button type="button" size="sm" onClick={onAddBrand} disabled={!newBrand.trim()}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <Select value={formData.brand} onValueChange={v => onInputChange('brand', v)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (COP) *</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.price === 0 ? '' : formData.price}
                    onChange={e => onInputChange('price', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                    placeholder="250000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compare_price">Precio Original (Oferta)</Label>
                  <Input
                    id="compare_price"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.compare_price ?? ''}
                    onChange={e => onInputChange('compare_price', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="350000"
                  />
                  <p className="text-xs text-gray-500">Deja en blanco si no hay descuento</p>
                  {discountPct !== null && (
                    <p className="text-xs font-medium text-emerald-600">Descuento: {discountPct}%</p>
                  )}
                  {formData.compare_price && formData.compare_price <= formData.price && (
                    <p className="text-xs font-medium text-rose-600">
                      El precio original debe ser mayor al precio actual
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    required
                    min="0"
                    value={formData.stock === 0 ? '' : formData.stock}
                    onChange={e => onInputChange('stock', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                    placeholder="10"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={checked => onInputChange('featured', checked)}
                  className="scale-110"
                />
                <Label htmlFor="featured" className="text-base cursor-pointer">Producto destacado</Label>
              </div>
            </CardContent>
          </Card>

          {/* Imágenes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Imágenes del Producto
                <Badge variant="secondary">{formData.images.length}/5</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.images.length < 5 && (
                <div className="space-y-2">
                  <Label>Subir Imágenes *</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragging ? 'border-[hsl(var(--brand))] bg-[hsl(var(--surface-highlight))]' : 'border-gray-300 bg-transparent'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className={`mx-auto mb-4 h-12 w-12 ${isDragging ? 'text-[hsl(var(--brand))]' : 'text-gray-400'}`} />
                    <p className="text-sm text-gray-600">Arrastra las imágenes aquí o haz clic para seleccionar</p>
                    <p className="text-xs text-gray-500 mt-1">Máximo {5 - formData.images.length} imágenes más</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={onImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={imageUploading || formData.images.length >= 5}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      disabled={imageUploading || formData.images.length >= 5}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {imageUploading ? 'Subiendo...' : 'Seleccionar Archivos'}
                    </Button>
                  </div>
                </div>
              )}

              {formData.images.length > 0 && (
                <div className="space-y-2">
                  <Label>Vista Previa</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onRemoveImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2" variant="default">Principal</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:justify-between border-t pt-6">
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto h-11">
            <Link href="/" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Tienda
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button type="button" variant="outline" onClick={handleCancelGuard} className="w-full sm:w-auto h-11">
              Cancelar
            </Button>
            <Button type="submit" disabled={formLoading} className="w-full sm:w-auto h-11">
              {formLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingProduct ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
