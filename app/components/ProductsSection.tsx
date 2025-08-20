'use client'

import { useState } from 'react'
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Filter,
  Grid,
  List,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { AspectRatio } from '@/components/ui/aspect-ratio'
import productsData from '../../lib/products.json'
import { useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import ProductDetailsModal from './ProductDetailsModal'

export default function ProductsSection() {
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const { addItem, openCart } = useCart()
  const [sortBy, setSortBy] = useState('featured')
  const [visibleCount, setVisibleCount] = useState(20)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Obtener rango real de precios del JSON
  const minPrice = Math.min(...productsData.map(p => p.price))
  const maxPrice = Math.max(...productsData.map(p => p.price))
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice])

  // Filtros seleccionados
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Extraer categorías y marcas únicas del JSON
  const categories = Array.from(new Set(productsData.map(p => p.category))).map(
    cat => ({ id: cat, name: cat })
  )
  const brands = Array.from(new Set(productsData.map(p => p.brand))).map(
    brand => ({ id: brand, name: brand })
  )

  // Aplicar filtro inicial desde query param ?cat=... y escuchar cambios
  useEffect(() => {
    const applyUrlFilter = () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const cat = params.get('cat')
        if (cat) {
          // Si la categoría existe en el conjunto, aplicarla
          const exists = productsData.find(p => p.category === cat)
          if (exists) {
            setSelectedCategories([cat])
            // opcional: abrir filtros en móvil
            setShowFilters(true)
          }
        } else {
          // Si no hay parámetro cat, limpiar filtros de categoría
          setSelectedCategories([])
        }
      } catch (err) {
        // noop
      }
    }

    // Aplicar filtro inicial
    applyUrlFilter()

    // Escuchar cambios en el historial del navegador
    const handlePopState = () => {
      applyUrlFilter()
    }

    // Escuchar evento personalizado desde Header
    const handleCategoryFilterChanged = (event: any) => {
      const { category } = event.detail
      if (category) {
        setSelectedCategories([category])
        setShowFilters(true)
      } else {
        setSelectedCategories([])
      }
    }

    // Escuchar búsqueda global
    const handleGlobalSearch = (event: any) => {
      const { query } = event.detail
      setSearchQuery(query || '')
    }

    // Escuchar filtro por ofertas desde hero
    const handleFilterByOffers = (event: any) => {
      const { showOffers } = event.detail
      setOnSaleOnly(showOffers)
      setShowFilters(true)
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener(
      'categoryFilterChanged',
      handleCategoryFilterChanged
    )
    window.addEventListener('globalSearch', handleGlobalSearch)
    window.addEventListener('filterByOffers', handleFilterByOffers)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener(
        'categoryFilterChanged',
        handleCategoryFilterChanged
      )
      window.removeEventListener('globalSearch', handleGlobalSearch)
      window.removeEventListener('filterByOffers', handleFilterByOffers)
    }
  }, []) // Remover dependencias para evitar bucle infinito

  // Filtrar productos según selección
  let filteredProducts = productsData.filter(product => {
    // Filtro por búsqueda global
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Filtro por precio
    if (product.price < priceRange[0] || product.price > priceRange[1])
      return false
    // Filtro por categoría
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category)
    )
      return false
    // Filtro por marca
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand))
      return false
    // Filtro por stock - solo productos con más de 0 unidades
    if (inStockOnly && product.stockCount <= 0) return false
    // Filtro por oferta (badge "Oferta" o precio rebajado)
    if (onSaleOnly) {
      const hasOfferBadge = product.badge === 'Oferta'
      const hasDiscountPrice = product.originalPrice > product.price
      if (!(hasOfferBadge || hasDiscountPrice)) return false
    }
    return true
  })

  // Ordenar según la opción seleccionada
  if (sortBy === 'price-low') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rating') {
    filteredProducts = filteredProducts.sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    )
  } else if (sortBy === 'newest') {
    // Asumimos que id más alto = más nuevo
    filteredProducts = filteredProducts.sort(
      (a, b) => (b.id || 0) - (a.id || 0)
    )
  }

  // Reiniciar visibles cuando cambian filtros/orden
  useEffect(() => {
    setVisibleCount(20)
  }, [
    priceRange,
    selectedCategories,
    selectedBrands,
    inStockOnly,
    onSaleOnly,
    sortBy,
    searchQuery,
  ])

  // Calcular productos visibles por paginación incremental
  const visibleProducts = filteredProducts.slice(0, visibleCount)

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock,
      stockCount: product.stockCount,
      category: product.category,
    })
    openCart()
  }

  const handleProductDetails = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  // Limpiar todos los filtros aplicados
  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setInStockOnly(false)
    setOnSaleOnly(false)
    setPriceRange([minPrice, maxPrice])
    setSearchQuery('')
    // opcional: cerrar panel de filtros en móvil
    setShowFilters(false)
  }

  // Mostrar botón de "Limpiar filtros" solo cuando haya filtros activos
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    inStockOnly ||
    onSaleOnly ||
    searchQuery.trim() !== '' ||
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice

  return (
    <section id="productos" className="py-16 bg-gray-50">
      <div className="mx-auto w-full max-w-[1720px] px-2 sm:px-4 md:px-6 xl:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestros Productos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre la mejor selección de productos electrónicos con precios
            increíbles
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  ×
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-900 mb-3 block">
                  Rango de Precio (COP)
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={minPrice}
                  max={maxPrice}
                  step={50000}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0].toLocaleString('es-CO')}</span>
                  <span>${priceRange[1].toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-900 mb-3 block">
                  Categorías
                </Label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={checked => {
                          if (checked === true) {
                            setSelectedCategories(prev => [
                              ...prev,
                              category.id,
                            ])
                          } else if (checked === false) {
                            setSelectedCategories(prev =>
                              prev.filter(id => id !== category.id)
                            )
                          }
                        }}
                      />
                      <Label
                        htmlFor={category.id}
                        className="text-sm text-gray-700 flex-1 cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-900 mb-3 block">
                  Marcas
                </Label>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand.id}
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={checked => {
                          if (checked === true) {
                            setSelectedBrands(prev => [...prev, brand.id])
                          } else if (checked === false) {
                            setSelectedBrands(prev =>
                              prev.filter(id => id !== brand.id)
                            )
                          }
                        }}
                      />
                      <Label
                        htmlFor={brand.id}
                        className="text-sm text-gray-700 flex-1 cursor-pointer"
                      >
                        {brand.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-3 block">
                  Disponibilidad
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in-stock"
                      checked={inStockOnly}
                      onCheckedChange={checked =>
                        setInStockOnly(checked === true)
                      }
                    />
                    <Label
                      htmlFor="in-stock"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      En Stock
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="on-sale"
                      checked={onSaleOnly}
                      onCheckedChange={checked =>
                        setOnSaleOnly(checked === true)
                      }
                    />
                    <Label
                      htmlFor="on-sale"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      En Oferta
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg p-4 shadow-lg mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden bg-transparent"
                    onClick={() => setShowFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>

                  <span className="text-sm text-gray-600">
                    Mostrando {visibleProducts.length} de{' '}
                    {filteredProducts.length} productos
                  </span>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={handleClearFilters}
                      title="Limpiar todos los filtros"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Limpiar filtros
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <Select
                    value={sortBy}
                    onValueChange={(val: string) => setSortBy(val)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destacados</SelectItem>
                      <SelectItem value="price-low">
                        Precio: Menor a Mayor
                      </SelectItem>
                      <SelectItem value="price-high">
                        Precio: Mayor a Menor
                      </SelectItem>
                      <SelectItem value="rating">Mejor Calificados</SelectItem>
                      <SelectItem value="newest">Más Nuevos</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div
              className={`grid gap-4 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5'
                  : 'grid-cols-1'
              }`}
            >
              {visibleProducts.map(product => (
                <div
                  key={product.id}
                  className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div
                    className={`relative overflow-hidden cursor-pointer ${
                      viewMode === 'list'
                        ? 'w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 flex-shrink-0'
                        : 'w-full'
                    }`}
                    onClick={() => handleProductDetails(product)}
                  >
                    {viewMode === 'list' ? (
                      <img
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        className={`w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === 'list' ? 'rounded-l-lg' : 'rounded-t-lg'
                        }`}
                      />
                    ) : (
                      <AspectRatio ratio={4 / 3} className="bg-gray-50">
                        <img
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </AspectRatio>
                    )}

                    {/* Badge */}
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-orange-600 text-white">
                        {product.badge}
                      </Badge>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0"
                        onClick={e => {
                          e.stopPropagation()
                          handleProductDetails(product)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Stock Indicator */}
                    {product.stockCount <= 0 && (
                      <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                        <span className="text-white font-semibold">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-2 min-w-0">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1 truncate">
                          {product.brand}
                        </p>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-base sm:text-lg font-bold text-orange-600">
                        ${product.price.toLocaleString('es-CO')}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          ${product.originalPrice.toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>

                    {/* Stock Count */}
                    {product.stockCount === 0 ? (
                      <p className="text-sm text-red-600 mb-4 font-semibold">
                        ¡Agotado!
                      </p>
                    ) : product.stockCount <= 10 && product.stockCount > 0 ? (
                      <p className="text-sm text-red-600 mb-4">
                        ¡Solo quedan {product.stockCount} unidades!
                      </p>
                    ) : null}

                    {/* Actions */}
                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        size="sm"
                        disabled={product.stockCount <= 0}
                        onClick={e => {
                          e.stopPropagation()
                          if (product.stockCount > 0) {
                            handleAddToCart(product)
                          }
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.stockCount > 0 ? 'Agregar' : 'Agotado'}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation()
                          handleProductDetails(product)
                        }}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {visibleProducts.length < filteredProducts.length && (
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 bg-transparent"
                  onClick={() =>
                    setVisibleCount(prev =>
                      Math.min(prev + 20, filteredProducts.length)
                    )
                  }
                >
                  Cargar Más Productos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles del Producto */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
      />
    </section>
  )
}
