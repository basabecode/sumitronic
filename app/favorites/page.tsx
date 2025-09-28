'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'date-asc'
  | 'date-desc'
type ViewMode = 'grid' | 'list'

interface FavoriteProduct {
  id: string
  name: string
  price: number
  image_url?: string
  image?: string
  brand?: string
  category?: string
  stock?: number
  discount_percentage?: number
  added_at: string
}

export default function FavoritesPage() {
  const { state: favoritesState, removeItem, clearFavorites } = useFavorites()
  const { addItem, openCart, formatCurrency } = useCart()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Datos de ejemplo para demostración (se pueden quitar cuando la BD esté configurada)
  const demoFavorites: FavoriteProduct[] = [
    {
      id: 'demo-1',
      name: 'Producto de Ejemplo 1',
      price: 29990,
      image_url: '/productos/demo1.jpg',
      brand: 'Marca Demo',
      category: 'Electrónicos',
      stock: 50,
      discount_percentage: 10,
      added_at: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
    },
    {
      id: 'demo-2',
      name: 'Producto de Ejemplo 2',
      price: 15990,
      image_url: '/productos/demo2.jpg',
      brand: 'Marca Demo',
      category: 'Ropa',
      stock: 25,
      discount_percentage: 0,
      added_at: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
    },
    {
      id: 'demo-3',
      name: 'Producto de Ejemplo 3',
      price: 45990,
      image_url: '/productos/demo3.jpg',
      brand: 'Otra Marca',
      category: 'Hogar',
      stock: 10,
      discount_percentage: 15,
      added_at: new Date(Date.now() - 259200000).toISOString(), // 3 días atrás
    },
  ]

  // Convertir datos de demo al formato correcto
  const formattedDemoFavorites = demoFavorites.map(item => ({
    ...item,
    addedAt: new Date(item.added_at),
  }))

  // Usar datos de demostración si no hay datos reales y estamos en desarrollo
  const displayItems =
    favoritesState.items.length > 0
      ? favoritesState.items
      : process.env.NODE_ENV === 'development'
      ? formattedDemoFavorites
      : []

  // Obtener opciones únicas para filtros
  const { brands, categories } = useMemo(() => {
    const brands = Array.from(
      new Set(displayItems.map(item => item.brand).filter(Boolean))
    )
    const categories = Array.from(
      new Set(displayItems.map(item => item.category).filter(Boolean))
    )
    return { brands, categories }
  }, [displayItems])

  // Filtrar y ordenar productos
  const filteredAndSortedItems = useMemo(() => {
    let items = [...displayItems]

    // Aplicar filtros
    if (selectedBrands.length > 0) {
      items = items.filter(item => selectedBrands.includes(item.brand || ''))
    }
    if (selectedCategories.length > 0) {
      items = items.filter(item =>
        selectedCategories.includes(item.category || '')
      )
    }

    // Aplicar ordenamiento
    items.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'date-asc':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
        case 'date-desc':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        default:
          return 0
      }
    })

    return items
  }, [displayItems, selectedBrands, selectedCategories, sortBy])

  const handleAddToCart = (favorite: any) => {
    const image = favorite.image_url || favorite.image || '/placeholder.svg'
    addItem({
      id: favorite.id,
      name: favorite.name,
      price: favorite.price,
      image,
      image_url: image,
      brand: favorite.brand,
      stock: favorite.stock || 999,
      stockCount: favorite.stock || 999,
    })
    openCart()
  }

  const handleRemoveFavorite = (id: string) => {
    // Si es un item de demostración, quitarlo de la lista local
    if (id.startsWith('demo-')) {
      // Para demo, simplemente filtrar el item (esto es temporal hasta que la BD esté configurada)
      const updatedDemoItems = demoFavorites.filter(item => item.id !== id)
      // Aquí podríamos actualizar el estado local si quisiéramos persistencia temporal
      console.log('Demo item removed:', id)
      return
    }

    // Para items reales, usar la API
    removeItem(id)
  }

  const handleClearAll = () => {
    if (
      window.confirm(
        '¿Estás seguro de que quieres eliminar todos los favoritos?'
      )
    ) {
      clearFavorites()
    }
  }

  const handleBrandFilter = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands(prev => [...prev, brand])
    } else {
      setSelectedBrands(prev => prev.filter(b => b !== brand))
    }
  }

  const handleCategoryFilter = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category])
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category))
    }
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCategories([])
  }

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Mis Favoritos
            </h1>
            <p className="text-gray-600 mb-8">
              Debes iniciar sesión para ver y gestionar tus productos favoritos.
            </p>
            <div className="space-x-4">
              <Link href="/auth/login">
                <Button>Iniciar Sesión</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline">Crear Cuenta</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la tienda
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:flex"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Select
                value={viewMode}
                onValueChange={(value: ViewMode) => setViewMode(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">
                    <div className="flex items-center">
                      <Grid className="w-4 h-4 mr-2" />
                      Cuadrícula
                    </div>
                  </SelectItem>
                  <SelectItem value="list">
                    <div className="flex items-center">
                      <List className="w-4 h-4 mr-2" />
                      Lista
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Favoritos
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredAndSortedItems.length} producto
                {filteredAndSortedItems.length !== 1 ? 's' : ''} guardado
                {filteredAndSortedItems.length !== 1 ? 's' : ''}
              </p>
            </div>
            {favoritesState.items.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar todo
              </Button>
            )}
          </div>
        </div>

        {/* Filtros móviles */}
        {showFilters && (
          <div className="md:hidden bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filtros</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar
              </Button>
            </div>

            {brands.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Marcas</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={checked =>
                          handleBrandFilter(brand, checked as boolean)
                        }
                      />
                      <label htmlFor={`brand-${brand}`} className="text-sm">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {categories.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Categorías</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={checked =>
                          handleCategoryFilter(category, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar de filtros (desktop) */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Filtros</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpiar
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Ordenar por
                  </label>
                  <Select
                    value={sortBy}
                    onValueChange={(value: SortOption) => setSortBy(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Más recientes</SelectItem>
                      <SelectItem value="date-asc">Más antiguos</SelectItem>
                      <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                      <SelectItem value="name-desc">Nombre Z-A</SelectItem>
                      <SelectItem value="price-asc">Precio menor</SelectItem>
                      <SelectItem value="price-desc">Precio mayor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {brands.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Marcas</h4>
                    <div className="space-y-2">
                      {brands.map(brand => (
                        <div
                          key={brand}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={checked =>
                              handleBrandFilter(brand, checked as boolean)
                            }
                          />
                          <label htmlFor={`brand-${brand}`} className="text-sm">
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {categories.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Categorías</h4>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={checked =>
                              handleCategoryFilter(category, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {error && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div
                className={cn(
                  'grid gap-6',
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {favoritesState.items.length === 0
                    ? 'No tienes productos favoritos'
                    : 'No se encontraron productos'}
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {favoritesState.items.length === 0
                    ? 'Explora nuestros productos y guarda los que más te gusten para una futura compra.'
                    : 'Prueba ajustando los filtros para ver más productos.'}
                </p>
                <div className="space-x-4">
                  <Link href="/#productos">
                    <Button>Explorar Productos</Button>
                  </Link>
                  {favoritesState.items.length > 0 && (
                    <Button variant="outline" onClick={clearFilters}>
                      Limpiar Filtros
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  'grid gap-6',
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                {filteredAndSortedItems.map(favorite => {
                  const image =
                    favorite.image_url || favorite.image || '/placeholder.svg'
                  return (
                    <Card
                      key={favorite.id}
                      className="group overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <div className="aspect-square overflow-hidden bg-gray-50">
                          <Image
                            src={image}
                            alt={favorite.name}
                            fill
                            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                            sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 90vw"
                          />
                        </div>
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveFavorite(favorite.id)}
                            aria-label="Quitar de favoritos"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {favorite.discount_percentage &&
                          favorite.discount_percentage > 0 && (
                            <div className="absolute top-3 left-3">
                              <Badge variant="destructive" className="text-xs">
                                -{favorite.discount_percentage}%
                              </Badge>
                            </div>
                          )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase text-gray-500 mb-2">
                          <span className="text-orange-600">
                            {favorite.brand || 'Marca'}
                          </span>
                          {favorite.category && (
                            <Badge variant="secondary" className="text-xs">
                              {favorite.category}
                            </Badge>
                          )}
                        </div>
                        <Link
                          href={`/products/${favorite.id}`}
                          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                        >
                          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                            {favorite.name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(favorite.price)}
                            </span>
                            {favorite.discount_percentage &&
                              favorite.discount_percentage > 0 && (
                                <span className="text-xs text-gray-500 line-through">
                                  {formatCurrency(
                                    favorite.price /
                                      (1 - favorite.discount_percentage / 100)
                                  )}
                                </span>
                              )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(favorite)}
                            className="h-8 px-3 text-xs bg-orange-600 hover:bg-orange-700"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Agregar
                          </Button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Agregado{' '}
                          {new Date(favorite.addedAt).toLocaleDateString(
                            'es-ES'
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
