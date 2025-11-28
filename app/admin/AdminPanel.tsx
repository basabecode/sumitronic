'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Upload,
  X,
  Save,
  ArrowLeft,
  ExternalLink,
  Users,
  Settings,
  Home,
  Loader2,
} from 'lucide-react'

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Hooks and Utils
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/utils'

// Types
interface Product {
  id: string
  name: string
  description: string
  price: number
  brand: string
  image_url: string
  images: string[]
  stock_quantity: number
  featured: boolean
  active: boolean
  created_at: string
  category?: {
    id: string
    name: string
    slug: string
  }
}

interface ProductFormData {
  name: string
  description: string
  price: number
  compare_price: number | null
  category: string
  brand: string
  stock: number
  featured: boolean
  images: string[]
}

export default function AdminDashboard() {
  const { user, loading, profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  // Estados generales
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Estados para categorías y marcas dinámicas
  const [categories, setCategories] = useState([
    'Cámaras de Seguridad',
    'Equipos de Red',
    'Accesorios',
    'DVR/NVR/XVR',
    'Cables y Conectores',
    'Fuentes de Poder',
    'Periféricos',
  ])

  const [brands, setBrands] = useState([
    'IMOU',
    'TP-Link',
    'Dahua',
    'Hikvision',
    'Logitech',
    'Mercusys',
    'Tapo',
    'Forza',
  ])

  // Estados para agregar nuevas categorías y marcas
  const [newCategory, setNewCategory] = useState('')
  const [newBrand, setNewBrand] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddBrand, setShowAddBrand] = useState(false)

  // Estados del formulario
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    compare_price: null,
    category: '',
    brand: '',
    stock: 0,
    featured: false,
    images: [],
  })

  // Estados del inventario
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    product: Product | null
  }>({
    open: false,
    product: null,
  })

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 50

  // Función para cargar categorías desde la base de datos
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name')

      if (!error && data) {
        const categoryNames = data.map(cat => cat.name)
        setCategories(prev => {
          // Combinar categorías existentes con las de la BD, sin duplicados
          const combined = [...new Set([...prev, ...categoryNames])]
          return combined.sort()
        })
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Debouncing para búsqueda - optimización UX
  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery) {
      setIsSearching(true)
    }

    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setIsSearching(false)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [searchQuery, debouncedSearchQuery])

  useEffect(() => {
    if (activeTab === 'inventory' || activeTab === 'dashboard') {
      fetchProducts()
    }
    if (activeTab === 'add-product') {
      fetchCategories()
    }
  }, [activeTab, currentPage, debouncedSearchQuery, categoryFilter])

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [debouncedSearchQuery, categoryFilter])

  // Validación de acceso
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-spin" />
            <p className="text-gray-600">Verificando autenticación...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !profile || profile.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Acceso Denegado
            </h2>
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

  // Funciones de productos
  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      // OPTIMIZACIÓN CRÍTICA: Usar JOIN + filtros en BD
      let query = supabase
        .from('products')
        .select(
          `
          *,
          category:categories!category_id (
            id,
            name,
            slug
          ),
          product_images (
            id,
            image_url,
            alt_text,
            is_primary,
            sort_order
          ),
          inventory (
            id,
            quantity_available,
            reserved_quantity,
            last_updated
          )
        `,
          { count: 'exact' }
        )
        .eq('active', true)

      // Aplicar filtros en la base de datos
      if (debouncedSearchQuery.trim()) {
        query = query.or(
          `name.ilike.%${debouncedSearchQuery}%,brand.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`
        )
      }

      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('categories.name', categoryFilter)
      }

      // Paginación
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Error fetching products:', error)
        alert('Error al cargar productos: ' + error.message)
        return
      }

      if (data) {
        setProducts(data)
        setTotalProducts(count || 0)
        setTotalPages(Math.ceil((count || 0) / itemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Error al cargar productos')
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) return

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

  // Funciones para agregar categorías y marcas
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    try {
      // Insertar la nueva categoría en la base de datos
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            name: newCategory.trim(),
            slug: newCategory
              .trim()
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w-]/g, ''),
          },
        ])
        .select()

      if (error) {
        console.error('Error creating category:', error)
        alert('Error al crear la categoría: ' + error.message)
        return
      }

      // Actualizar la lista local de categorías
      setCategories(prev => [...prev, newCategory.trim()].sort())
      setFormData(prev => ({ ...prev, category: newCategory.trim() }))
      setNewCategory('')
      setShowAddCategory(false)
      alert('Categoría creada exitosamente')
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Error al crear la categoría')
    }
  }

  const handleAddBrand = () => {
    if (!newBrand.trim()) return

    const brandName = newBrand.trim()
    if (brands.includes(brandName)) {
      alert('Esta marca ya existe')
      return
    }

    // Actualizar la lista local de marcas
    setBrands(prev => [...prev, brandName].sort())
    setFormData(prev => ({ ...prev, brand: brandName }))
    setNewBrand('')
    setShowAddBrand(false)
    alert('Marca agregada exitosamente')
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      compare_price: null,
      category: '',
      brand: '',
      stock: 0,
      featured: false,
      images: [],
    })
    setEditingProduct(null)
    setShowProductForm(false)
    // Reset new category/brand forms
    setNewCategory('')
    setNewBrand('')
    setShowAddCategory(false)
    setShowAddBrand(false)
  }

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      compare_price: (product as any).compare_price || null,
      category: product.category?.name || '',
      brand: product.brand,
      stock: product.stock_quantity,
      featured: product.featured,
      images: product.images || [product.image_url],
    })
    setEditingProduct(product)
    setShowProductForm(true)
    setActiveTab('add-product')
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.images.length === 0) {
      alert('Por favor, agrega al menos una imagen del producto')
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
        alert('Error: Categoría no encontrada')
        setFormLoading(false)
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
        sku: `${formData.brand.toUpperCase()}-${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`,
        updated_at: new Date().toISOString(),
      }

      let error
      if (editingProduct) {
        ;({ error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id))
      } else {
        ;({ error } = await supabase.from('products').insert([productData]))
      }

      if (error) {
        console.error('Error saving product:', error)
        alert(
          `Error al ${editingProduct ? 'actualizar' : 'crear'} el producto: ${
            error.message
          }`
        )
        return
      }

      alert(
        `Producto ${editingProduct ? 'actualizado' : 'creado'} exitosamente`
      )
      resetForm()
      fetchProducts()
      setActiveTab('inventory')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error al guardar el producto')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ active: false })
        .eq('id', product.id)

      if (error) {
        console.error('Error deleting product:', error)
        alert('Error al eliminar el producto')
        return
      }

      setProducts(products.filter(p => p.id !== product.id))
      setDeleteDialog({ open: false, product: null })
      alert('Producto eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    }
  }

  // OPTIMIZACIÓN: Ya no necesitamos filtrar en frontend
  // Los filtros se aplican en la base de datos
  const filteredProducts = products

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="text-gray-600">Bienvenido, {user.email}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/" target="_blank">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Tienda
          </Link>
        </Button>
      </div>

      {/* Stats Quick View */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
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
                  <p className="text-sm font-medium text-gray-600">
                    Página Actual
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Filtros Activos
                  </p>
                  <p className="text-2xl font-bold">
                    {(debouncedSearchQuery ? 1 : 0) +
                      (categoryFilter !== 'all' ? 1 : 0)}
                  </p>
                </div>
                <Filter className="h-8 w-8 text-orange-500" />
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
                <div
                  className={`h-3 w-3 rounded-full ${
                    loadingProducts ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manual Tabs Navigation - Replaced Radix UI for better control */}
      <div className="space-y-6">
        {/* Tabs List */}
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full grid grid-cols-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-2 ${
              activeTab === 'inventory'
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            <Package className="w-4 h-4" />
            Inventario
          </button>
          <button
            onClick={() => setActiveTab('add-product')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-2 ${
              activeTab === 'add-product'
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            <Plus className="w-4 h-4" />
            {editingProduct ? 'Editar' : 'Agregar'} Producto
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Productos
                    </p>
                    {loadingProducts ? (
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600 mt-2" />
                    ) : (
                      <p className="text-2xl font-bold">{products.length}</p>
                    )}
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      En Stock
                    </p>
                    {loadingProducts ? (
                      <Loader2 className="h-6 w-6 animate-spin text-green-600 mt-2" />
                    ) : (
                      <p className="text-2xl font-bold">
                        {products.filter(p => p.stock_quantity > 0).length}
                      </p>
                    )}
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Sin Stock
                    </p>
                    {loadingProducts ? (
                      <Loader2 className="h-6 w-6 animate-spin text-red-600 mt-2" />
                    ) : (
                      <p className="text-2xl font-bold">
                        {products.filter(p => p.stock_quantity === 0).length}
                      </p>
                    )}
                  </div>
                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-red-600 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Destacados
                    </p>
                    {loadingProducts ? (
                      <Loader2 className="h-6 w-6 animate-spin text-yellow-600 mt-2" />
                    ) : (
                      <p className="text-2xl font-bold">
                        {products.filter(p => p.featured).length}
                      </p>
                    )}
                  </div>
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Gestión de Productos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Administra tu catálogo de productos
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => setActiveTab('inventory')}
                    className="w-full"
                  >
                    Ver Inventario
                  </Button>
                  <Button
                    onClick={() => {
                      resetForm()
                      setActiveTab('add-product')
                    }}
                    variant="outline"
                    className="w-full"
                  >
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
                <p className="text-gray-600 mb-4">
                  Administra usuarios del sistema
                </p>
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
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    {isSearching ? (
                      <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    )}
                    <Input
                      placeholder="Buscar por nombre o marca..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    resetForm()
                    setActiveTab('add-product')
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>
                Productos ({totalProducts} total - Página {currentPage} de{' '}
                {totalPages})
              </CardTitle>
              {/* Controles de Paginación */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loadingProducts}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || loadingProducts}
                >
                  Siguiente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingProducts ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 mx-auto mb-4 text-blue-600 animate-spin" />
                  <p className="text-gray-600">Cargando productos...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">
                    {searchQuery || (categoryFilter && categoryFilter !== 'all')
                      ? 'No se encontraron productos'
                      : 'No hay productos en el inventario'}
                  </p>
                  <Button
                    onClick={() => {
                      resetForm()
                      setActiveTab('add-product')
                    }}
                  >
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
                      {filteredProducts.map(product => (
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
                                <p className="font-medium text-gray-900">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500">
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
                              ></span>
                              {product.stock_quantity} unidades
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {product.featured && (
                                <Badge variant="default" className="text-xs">
                                  Destacado
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link
                                  href={`/products/${product.id}`}
                                  target="_blank"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setDeleteDialog({ open: true, product })
                                }
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
        )}

        {/* Add/Edit Product Tab */}
        {activeTab === 'add-product' && (
          <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('inventory')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inventario
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>
              <p className="text-gray-600">
                {editingProduct
                  ? 'Modifica los datos del producto'
                  : 'Completa los datos del nuevo producto'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitProduct} className="space-y-8">
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="category">Categoría *</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddCategory(!showAddCategory)}
                          className="h-6 px-2 text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Nueva
                        </Button>
                      </div>

                      {showAddCategory && (
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Nueva categoría"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            className="text-sm"
                            onKeyPress={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddCategory()
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddCategory}
                            disabled={!newCategory.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="brand">Marca *</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddBrand(!showAddBrand)}
                          className="h-6 px-2 text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Nueva
                        </Button>
                      </div>

                      {showAddBrand && (
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Nueva marca"
                            value={newBrand}
                            onChange={e => setNewBrand(e.target.value)}
                            className="text-sm"
                            onKeyPress={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddBrand()
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddBrand}
                            disabled={!newBrand.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      <Select
                        value={formData.brand}
                        onValueChange={value =>
                          handleInputChange('brand', value)
                        }
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
                      <Label htmlFor="compare_price">
                        Precio Original (Oferta)
                      </Label>
                      <Input
                        id="compare_price"
                        type="number"
                        min="0"
                        step="1000"
                        value={formData.compare_price || ''}
                        onChange={e =>
                          handleInputChange(
                            'compare_price',
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        placeholder="350000"
                      />
                      <p className="text-xs text-gray-500">
                        Deja en blanco si no hay descuento
                      </p>
                      {formData.compare_price && formData.compare_price > formData.price && (
                        <p className="text-xs font-medium text-emerald-600">
                          Descuento: {Math.round(((formData.compare_price - formData.price) / formData.compare_price) * 100)}%
                        </p>
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
                    <Badge variant="secondary">
                      {formData.images.length}/5
                    </Badge>
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
                            Arrastra las imágenes aquí o haz clic para
                            seleccionar
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
                            disabled={
                              imageUploading || formData.images.length >= 5
                            }
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={
                              imageUploading || formData.images.length >= 5
                            }
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
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Tienda
                </Link>
              </Button>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('inventory')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingProduct ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingProduct ? 'Actualizar' : 'Crear'} Producto
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={open => setDeleteDialog({ open, product: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar el producto "
              {deleteDialog.product?.name}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, product: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteDialog.product &&
                handleDeleteProduct(deleteDialog.product)
              }
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
