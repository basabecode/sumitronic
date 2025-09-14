'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Heart,
  ShoppingCart,
  Eye,
  Filter,
  Grid,
  List,
  XCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { useCart } from '@/contexts/CartContext'
import ProductDetailsModal from './ProductDetailsModal'
import {
  Product,
  ProductsApiResponse,
  convertDatabaseProductsToProducts,
} from '@/lib/types/products'

export function ProductsSection() {
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const { addItem, openCart, formatCurrency } = useCart()
  const [sortBy, setSortBy] = useState('featured')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Estados para productos y filtros
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  )
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [priceRange, setPriceRange] = useState([0, 1000000])

  // Filtros seleccionados
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const limit = 20

  // Obtener productos de Supabase
  useEffect(() => {
    fetchProducts()
  }, [
    currentPage,
    sortBy,
    selectedCategories,
    selectedBrands,
    inStockOnly,
    featuredOnly,
    searchQuery,
    priceRange,
  ])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const searchParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sortBy: sortBy === 'featured' ? 'featured' : sortBy,
        sortOrder: sortBy === 'price' ? 'asc' : 'desc',
      })

      if (selectedCategories.length > 0) {
        searchParams.append('category', selectedCategories[0])
      }

      if (selectedBrands.length > 0) {
        // Para múltiples marcas, podrías necesitar modificar la API
        // Por ahora, usaremos la primera marca seleccionada
        searchParams.append('brand', selectedBrands[0])
      }

      if (searchQuery.trim()) {
        searchParams.append('search', searchQuery.trim())
      }

      if (inStockOnly) {
        searchParams.append('inStockOnly', 'true')
      }

      if (featuredOnly) {
        searchParams.append('featured', 'true')
      }

      if (priceRange[0] > minPrice) {
        searchParams.append('minPrice', priceRange[0].toString())
      }

      if (priceRange[1] < maxPrice) {
        searchParams.append('maxPrice', priceRange[1].toString())
      }

      const response = await fetch(`/api/products?${searchParams}`)
      const data: ProductsApiResponse = await response.json()

      if (response.ok) {
        const convertedProducts = convertDatabaseProductsToProducts(
          data.products
        )
        setProducts(convertedProducts)
        setTotalPages(data.pagination.totalPages)
        setTotalProducts(data.pagination.total)

        // Actualizar rangos de precios basado en productos obtenidos
        if (convertedProducts.length > 0) {
          const prices = convertedProducts.map(p => p.price)
          const newMinPrice = Math.min(...prices)
          const newMaxPrice = Math.max(...prices)

          // Solo actualizar si es la primera carga
          if (minPrice === 0 && maxPrice === 1000000) {
            setMinPrice(newMinPrice)
            setMaxPrice(newMaxPrice)
            setPriceRange([newMinPrice, newMaxPrice])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Obtener categorías y marcas
  useEffect(() => {
    fetchCategoriesAndBrands()
  }, [])

  const fetchCategoriesAndBrands = async () => {
    try {
      // Obtener categorías
      const categoriesResponse = await fetch('/api/categories')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(
          categoriesData.map((cat: any) => ({
            id: cat.slug,
            name: cat.name,
          }))
        )
      }

      // Obtener marcas únicas de los productos
      const productsResponse = await fetch('/api/products?limit=1000')
      if (productsResponse.ok) {
        const productsData: ProductsApiResponse = await productsResponse.json()
        const uniqueBrands = Array.from(
          new Set(productsData.products.map(p => p.brand))
        ).map(brand => ({ id: brand, name: brand }))
        setBrands(uniqueBrands)

        // Establecer rango de precios inicial
        if (productsData.products.length > 0) {
          const prices = productsData.products.map(p => p.price)
          const newMinPrice = Math.min(...prices)
          const newMaxPrice = Math.max(...prices)
          setMinPrice(newMinPrice)
          setMaxPrice(newMaxPrice)
          setPriceRange([newMinPrice, newMaxPrice])
        }
      }
    } catch (error) {
      console.error('Error fetching categories and brands:', error)
    }
  }

  // Aplicar filtro desde URL
  useEffect(() => {
    const applyUrlFilter = () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const cat = params.get('cat')
        if (cat && !selectedCategories.includes(cat)) {
          setSelectedCategories([cat])
        }
      } catch (error) {
        console.error('Error applying URL filter:', error)
      }
    }

    applyUrlFilter()
    window.addEventListener('popstate', applyUrlFilter)
    return () => window.removeEventListener('popstate', applyUrlFilter)
  }, [selectedCategories])

  // Handlers para filtros
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([categoryId]) // Solo una categoría por ahora
    } else {
      setSelectedCategories([])
    }
    setCurrentPage(1) // Resetear página
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands(prev => [...prev, brandId])
    } else {
      setSelectedBrands(prev => prev.filter(id => id !== brandId))
    }
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setInStockOnly(false)
    setFeaturedOnly(false)
    setSearchQuery('')
    setPriceRange([minPrice, maxPrice])
    setCurrentPage(1)
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
    })
  }

  const handleProductView = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando productos...</span>
      </div>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nuestros Productos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encuentra los mejores productos de tecnología y seguridad
          </p>
        </div>

        {/* Barra de búsqueda y controles */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
                <SelectItem value="price">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="created_at">Más Recientes</SelectItem>
              </SelectContent>
            </Select>

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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel de filtros */}
          {showFilters && (
            <div className="w-full lg:w-80 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Filtros</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Limpiar
                    </Button>
                  </div>

                  {/* Categorías */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Categorías</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {categories.map(category => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={checked =>
                                handleCategoryChange(
                                  category.id,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`category-${category.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Marcas */}
                    <div>
                      <h4 className="font-medium mb-3">Marcas</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {brands.map(brand => (
                          <div
                            key={brand.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`brand-${brand.id}`}
                              checked={selectedBrands.includes(brand.id)}
                              onCheckedChange={checked =>
                                handleBrandChange(brand.id, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={`brand-${brand.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {brand.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rango de precios */}
                    <div>
                      <h4 className="font-medium mb-3">Precio</h4>
                      <div className="px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={handlePriceRangeChange}
                          max={maxPrice}
                          min={minPrice}
                          step={10000}
                          className="mb-4"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{formatCurrency(priceRange[0])}</span>
                          <span>{formatCurrency(priceRange[1])}</span>
                        </div>
                      </div>
                    </div>

                    {/* Filtros adicionales */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="in-stock"
                          checked={inStockOnly}
                          onCheckedChange={checked =>
                            setInStockOnly(checked === true)
                          }
                        />
                        <Label htmlFor="in-stock" className="text-sm">
                          Solo productos en stock
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={featuredOnly}
                          onCheckedChange={checked =>
                            setFeaturedOnly(checked === true)
                          }
                        />
                        <Label htmlFor="featured" className="text-sm">
                          Solo productos destacados
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Grid de productos */}
          <div className="flex-1">
            {/* Información de resultados */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Mostrando {products.length} de {totalProducts} productos
              </p>
            </div>

            {/* Loading overlay */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Cargando...</span>
              </div>
            )}

            {/* Grid de productos */}
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {products.map(product => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                      <img
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                      {product.badge && (
                        <Badge className="absolute top-2 left-2">
                          {product.badge}
                        </Badge>
                      )}
                      {product.featured && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 right-2"
                        >
                          Destacado
                        </Badge>
                      )}

                      {/* Overlay con acciones */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleProductView(product)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4">
                    <div className="w-full">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.brand}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-xs ${
                              product.inStock
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {product.inStock
                              ? `Stock: ${product.stockCount}`
                              : 'Agotado'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  Anterior
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage(prev => Math.min(totalPages, prev + 1))
                  }
                >
                  Siguiente
                </Button>
              </div>
            )}

            {/* Mensaje si no hay productos */}
            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No se encontraron productos
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Modal de detalles */}
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProduct(null)
          }}
        />
      </div>
    </section>
  )
}

export default ProductsSection
