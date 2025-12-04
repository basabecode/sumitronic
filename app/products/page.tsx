'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Grid, List } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ProductCard } from '@/app/components/ProductCard'
import { PaginationComponent } from '@/app/components/PaginationComponent'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { ErrorBoundary } from '../components/ErrorBoundary'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  sku: string
  categories: {
    id: string
    name: string
    slug: string
  }
  product_images: Array<{
    id: string
    image_url: string
    alt_text: string
    is_primary: boolean
  }>
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="py-8">
            <div className="container mx-auto px-4">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-8 w-1/2"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow">
                      <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <ErrorBoundary>
        <ProductsPageContent />
      </ErrorBoundary>
    </Suspense>
  )
}

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  )
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') || 'created_at'
  )
  const [sortOrder, setSortOrder] = useState(
    searchParams.get('sortOrder') || 'desc'
  )

  // Paginación
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  )
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Listen for global search event
  useEffect(() => {
    const handleGlobalSearch = (e: CustomEvent) => {
      setSearchTerm(e.detail.query)
      setCurrentPage(1)
    }

    window.addEventListener('globalSearch', handleGlobalSearch as EventListener)
    return () => {
      window.removeEventListener('globalSearch', handleGlobalSearch as EventListener)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, sortBy, sortOrder, debouncedSearchTerm])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (response.ok) {
        // Aplanar categorías jerárquicas para el filtro
        const flatCategories: Category[] = []
        const flattenCategories = (cats: any[]) => {
          cats.forEach(cat => {
            flatCategories.push({ id: cat.id, name: cat.name, slug: cat.slug })
            if (cat.children?.length > 0) {
              flattenCategories(cat.children)
            }
          })
        }
        flattenCategories(data.categories)
        setCategories(flatCategories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder,
      })

      if (selectedCategory && selectedCategory !== 'all')
        params.append('category', selectedCategory)
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm)
      if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString())
      if (priceRange[1] < 1000000)
        params.append('maxPrice', priceRange[1].toString())

      const response = await fetch(`/api/products?${params}`)
      const data: ProductsResponse = await response.json()

      if (response.ok) {
        setProducts(data.products)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    // No longer needed to manually trigger fetch, as debouncedSearchTerm change will trigger it
    // But we might want to force immediate update if user presses Enter?
    // For now, let's rely on the effect.
    // Actually, if user presses Enter, we might want to clear the timeout and fetch immediately.
    // But simpler is to just let the effect run.
    setCurrentPage(1)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
    fetchProducts()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="mt-2 text-gray-600">
              Descubre nuestra amplia gama de productos tecnológicos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar de filtros */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Búsqueda */}
                  <div>
                    <Label htmlFor="search">Buscar productos</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        id="search"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSearch()}
                      />
                      <Button onClick={handleSearch} size="sm">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Categorías */}
                  <div>
                    <Label>Categoría</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todas las categorías
                        </SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Rango de precios */}
                  <div>
                    <Label>Rango de precios</Label>
                    <div className="mt-4 px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={1000000}
                        min={0}
                        step={50000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{formatCurrency(priceRange[0])}</span>
                        <span>{formatCurrency(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleFilterChange} className="w-full">
                    Aplicar filtros
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Lista de productos */}
            <div className="lg:col-span-3">
              {/* Controles de vista y ordenamiento */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {pagination.total} productos encontrados
                  </span>
                  {selectedCategory && selectedCategory !== 'all' && (
                    <Badge variant="secondary">
                      {categories.find(c => c.slug === selectedCategory)?.name}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* Ordenamiento */}
                  <Select
                    value={`${sortBy}-${sortOrder}`}
                    onValueChange={value => {
                      const [newSortBy, newSortOrder] = value.split('-')
                      setSortBy(newSortBy)
                      setSortOrder(newSortOrder)
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at-desc">
                        Más recientes
                      </SelectItem>
                      <SelectItem value="created_at-asc">
                        Más antiguos
                      </SelectItem>
                      <SelectItem value="price-asc">
                        Precio: menor a mayor
                      </SelectItem>
                      <SelectItem value="price-desc">
                        Precio: mayor a menor
                      </SelectItem>
                      <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                      <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Modo de vista */}
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Grid/Lista de productos */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                      <div className="bg-gray-300 h-4 rounded mb-2"></div>
                      <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No se encontraron productos
                    </h3>
                    <p className="text-gray-500 text-center">
                      Intenta ajustar tus filtros de búsqueda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }
                  >
                    {products.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>

                  {/* Paginación */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-8">
                      <PaginationComponent
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={setCurrentPage}
                        hasNext={pagination.hasNext}
                        hasPrev={pagination.hasPrev}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
