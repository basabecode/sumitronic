'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/utils'
import Link from 'next/link'
import Image from 'next/image'

interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  brand: string
  stock: number
  featured: boolean
  images: string[]
}

const categories = [
  'Cámaras de Seguridad',
  'Equipos de Red',
  'Accesorios',
  'DVR/NVR/XVR',
  'Cables y Conectores',
  'Fuentes de Poder',
  'Periféricos',
]

const brands = [
  'IMOU',
  'TP-Link',
  'Dahua',
  'Hikvision',
  'Logitech',
  'Mercusys',
  'Tapo',
  'Forza',
]

const ProductForm: React.FC = () => {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    stock: 0,
    featured: false,
    images: [],
  })

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Limitar a máximo 5 imágenes
    const remainingSlots = 5 - formData.images.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    if (filesToUpload.length < files.length) {
      alert(
        `Solo se pueden subir ${remainingSlots} imágenes más. Máximo 5 imágenes por producto.`
      )
    }

    setImageUploading(true)
    try {
      const uploadPromises = filesToUpload.map(async file => {
        try {
          const imageUrl = await uploadImage(file, 'products')
          return imageUrl
        } catch (error) {
          console.error('Error uploading image:', error)
          // Para desarrollo, usar placeholder
          return '/placeholder.svg'
        }
      })

      const imageUrls = await Promise.all(uploadPromises)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }))
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setImageUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.images.length === 0) {
      alert('Por favor, agrega al menos una imagen del producto')
      return
    }

    setLoading(true)
    try {
      // Primero obtenemos el category_id basado en el nombre de categoría
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', formData.category)
        .single()

      if (categoryError || !categoryData) {
        alert('Error: Categoría no encontrada')
        setLoading(false)
        return
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category_id: categoryData.id,
        brand: formData.brand,
        image_url: formData.images[0], // Primera imagen como principal
        images: formData.images, // Todas las imágenes
        stock_quantity: formData.stock,
        featured: formData.featured,
        active: true,
        sku: `${formData.brand.toUpperCase()}-${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`,
      }

      console.log('Insertando producto:', productData)

      // Intentar guardar en Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()

      if (error) {
        console.error('Error de Supabase:', error)
        alert(`Error al crear el producto: ${error.message}`)
        return
      }

      console.log('Producto creado exitosamente:', data)
      alert('Producto creado exitosamente')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error al crear el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inventario
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Agregar Producto
            </h1>
            <p className="text-gray-600">
              Completa los datos del nuevo producto
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
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
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
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
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Describe las características principales del producto..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={value =>
                        handleInputChange('category', value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca *</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={value => handleInputChange('brand', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(brand => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
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
                      value={formData.price}
                      onChange={e =>
                        handleInputChange(
                          'price',
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="250000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={e =>
                        handleInputChange(
                          'stock',
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={checked =>
                      handleInputChange('featured', checked)
                    }
                  />
                  <Label htmlFor="featured">Producto destacado</Label>
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
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Arrastra las imágenes aquí o haz clic para seleccionar
                        </p>
                        <p className="text-xs text-gray-500">
                          Máximo {5 - formData.images.length} imágenes más
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={imageUploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={imageUploading}
                          onClick={() =>
                            document.getElementById('image-upload')?.click()
                          }
                        >
                          {imageUploading
                            ? 'Subiendo...'
                            : 'Seleccionar Archivos'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vista previa de imágenes */}
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
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          {index === 0 && (
                            <Badge
                              className="absolute bottom-2 left-2"
                              variant="default"
                            >
                              Principal
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-between">
            <Button type="button" variant="outline" asChild>
              <Link href="/" target="_blank">
                🏪 Ver Tienda
              </Link>
            </Button>
            <div className="flex gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/products">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Producto'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm
