'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/utils'
import { toast } from 'sonner'
import { Product, ProductFormData, EMPTY_FORM } from '../types'

const DEFAULT_CATEGORIES = [
  'Cámaras de Seguridad',
  'Equipos de Red',
  'Accesorios',
  'DVR/NVR/XVR',
  'Cables y Conectores',
  'Fuentes de Poder',
  'Periféricos',
]

const DEFAULT_BRANDS = [
  'IMOU', 'TP-Link', 'Dahua', 'Hikvision',
  'Logitech', 'Mercusys', 'Tapo', 'Forza',
]

const BRANDS_STORAGE_KEY = 'capishop_admin_brands'

function loadBrandsFromStorage(): string[] {
  if (typeof window === 'undefined') return DEFAULT_BRANDS
  try {
    const stored = localStorage.getItem(BRANDS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : DEFAULT_BRANDS
  } catch {
    return DEFAULT_BRANDS
  }
}

export function useProductForm(callbacks: {
  onSaveSuccess: () => void
}) {
  const supabase = createClient()
  const { onSaveSuccess } = callbacks

  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM)
  const [formDirty, setFormDirty] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [brands, setBrands] = useState<string[]>(loadBrandsFromStorage)
  const [newCategory, setNewCategory] = useState('')
  const [newBrand, setNewBrand] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddBrand, setShowAddBrand] = useState(false)

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name')

      if (!error && data) {
        const names = data.map(c => c.name)
        setCategories(prev => [...new Set([...prev, ...names])].sort())
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFormDirty(true)
  }

  // Accepts File[] directly — used by both input handler and drag-and-drop
  const processImageFiles = async (files: File[]) => {
    const remaining = 5 - formData.images.length
    const toUpload = files.slice(0, remaining)

    if (toUpload.length < files.length) {
      toast.error(`Solo se pueden subir ${remaining} imágenes más. Máximo 5 por producto.`)
    }

    setImageUploading(true)
    try {
      const results = await Promise.allSettled(
        toUpload.map(file => uploadImage(file, 'products'))
      )

      const urls: string[] = []
      let failed = 0
      for (const result of results) {
        if (result.status === 'fulfilled') {
          urls.push(result.value)
        } else {
          failed++
        }
      }

      if (failed > 0) {
        toast.error(
          `${failed} imagen(es) no se pudieron subir. ` +
          'Verifica que Supabase Storage esté activo y configurado.'
        )
      }

      if (urls.length > 0) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))
        setFormDirty(true)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Error al subir las imágenes')
    } finally {
      setImageUploading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    processImageFiles(Array.from(files))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setFormDirty(true)
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    try {
      const { error } = await supabase.from('categories').insert([{
        name: newCategory.trim(),
        slug: newCategory.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      }])

      if (error) {
        toast.error('Error al crear la categoría: ' + error.message)
        return
      }

      setCategories(prev => [...prev, newCategory.trim()].sort())
      setFormData(prev => ({ ...prev, category: newCategory.trim() }))
      setNewCategory('')
      setShowAddCategory(false)
      toast.success('Categoría creada exitosamente')
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Error al crear la categoría')
    }
  }

  const handleAddBrand = () => {
    if (!newBrand.trim()) return
    if (brands.includes(newBrand.trim())) {
      toast.error('Esta marca ya existe')
      return
    }
    const updated = [...brands, newBrand.trim()].sort()
    setBrands(updated)

    // Persist to localStorage so brands survive page reloads
    try {
      localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // localStorage not available — silent fail
    }

    setFormData(prev => ({ ...prev, brand: newBrand.trim() }))
    setNewBrand('')
    setShowAddBrand(false)
    toast.success('Marca agregada')
  }

  const resetForm = () => {
    setFormData(EMPTY_FORM)
    setFormDirty(false)
    setEditingProduct(null)
    setNewCategory('')
    setNewBrand('')
    setShowAddCategory(false)
    setShowAddBrand(false)
  }

  const loadProductForEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      compare_price: product.compare_price ?? null,
      category: product.category?.name ?? '',
      brand: product.brand,
      stock: product.stock_quantity,
      featured: product.featured,
      images: product.images?.length ? product.images : [product.image_url],
    })
    setFormDirty(false)
    setEditingProduct(product)
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.images.length === 0) {
      toast.error('Por favor, agrega al menos una imagen del producto')
      return
    }

    setFormLoading(true)
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', formData.category)
        .single()

      if (categoryError || !categoryData) {
        toast.error('Error: Categoría no encontrada')
        return
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        compare_price: formData.compare_price,
        category_id: categoryData.id,
        brand: formData.brand,
        image_url: formData.images[0],
        images: formData.images,
        stock_quantity: formData.stock,
        featured: formData.featured,
        active: true,
        sku: `${formData.brand.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        updated_at: new Date().toISOString(),
      }

      const { error } = editingProduct
        ? await supabase.from('products').update(productData).eq('id', editingProduct.id)
        : await supabase.from('products').insert([productData])

      if (error) {
        toast.error(`Error al ${editingProduct ? 'actualizar' : 'crear'} el producto: ${error.message}`)
        return
      }

      toast.success(`Producto ${editingProduct ? 'actualizado' : 'creado'} exitosamente`)
      resetForm()
      onSaveSuccess()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Error al guardar el producto')
    } finally {
      setFormLoading(false)
    }
  }

  return {
    formData,
    formDirty,
    editingProduct,
    formLoading,
    imageUploading,
    categories,
    brands,
    newCategory,
    setNewCategory,
    newBrand,
    setNewBrand,
    showAddCategory,
    setShowAddCategory,
    showAddBrand,
    setShowAddBrand,
    handleInputChange,
    handleImageUpload,
    processImageFiles,
    removeImage,
    handleAddCategory,
    handleAddBrand,
    handleSubmitProduct,
    resetForm,
    loadProductForEdit,
    fetchCategories,
  }
}
