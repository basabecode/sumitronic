'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
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
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { useCart } from '@/contexts/CartContext'
import ProductDetailsModal from './ProductDetailsModal'
import {
  Product,
  ProductsApiResponse,
  convertDatabaseProductsToProducts,
} from '@/lib/types/products'
import { cn } from '@/lib/utils'

type FilterChip = {
  key: string
  label: string
  onRemove: () => void
}

export function ProductsSection() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const { addItem, openCart, formatCurrency } = useCart()
  const [sortBy, setSortBy] = useState('featured')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const limit = 20
  useEffect(() => {
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
          const convertedProducts = convertDatabaseProductsToProducts(data.products)
          setProducts(convertedProducts)
          setTotalPages(data.pagination.totalPages)
          setTotalProducts(data.pagination.total)

          if (convertedProducts.length > 0 && minPrice === 0 && maxPrice === 1000000) {
            const prices = convertedProducts.map(item => item.price)
            const newMin = Math.min(...prices)
            const newMax = Math.max(...prices)
            setMinPrice(newMin)
            setMaxPrice(newMax)
            setPriceRange([newMin, newMax])
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [
    currentPage,
    featuredOnly,
    inStockOnly,
    limit,
    maxPrice,
    minPrice,
    priceRange,
    searchQuery,
    selectedBrands,
    selectedCategories,
    sortBy,
  ])

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
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

        const productsResponse = await fetch('/api/products?limit=1000')
        if (productsResponse.ok) {
          const productsData: ProductsApiResponse = await productsResponse.json()
          const uniqueBrands = Array.from(
            new Set(productsData.products.map(item => item.brand))
          )
            .filter(Boolean)
            .map(brand => ({ id: brand, name: brand }))
          setBrands(uniqueBrands)

          if (productsData.products.length > 0) {
            const prices = productsData.products.map(item => item.price)
            const newMin = Math.min(...prices)
            const newMax = Math.max(...prices)
            setMinPrice(newMin)
            setMaxPrice(newMax)
            setPriceRange([newMin, newMax])
          }
        }
      } catch (error) {
        console.error('Error fetching categories and brands:', error)
      }
    }

    fetchCategoriesAndBrands()
  }, [])
  useEffect(() => {
    const applyUrlFilter = () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const category = params.get('cat')
        if (category) {
          setSelectedCategories([category])
          setShowFilters(true)
        }
      } catch (error) {
        console.error('Error applying URL filter:', error)
      }
    }

    applyUrlFilter()
    window.addEventListener('popstate', applyUrlFilter)
    return () => window.removeEventListener('popstate', applyUrlFilter)
  }, [])

  useEffect(() => {
    const handleGlobalSearch = (event: Event) => {
      const detail = (event as CustomEvent<{ query: string }>).detail
      setSearchQuery(detail.query || '')
      setCurrentPage(1)
    }

    const handleCategoryEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ category: string | null }>).detail
      if (detail.category) {
        setSelectedCategories([detail.category])
        setShowFilters(true)
      } else {
        setSelectedCategories([])
      }
      setCurrentPage(1)
    }

    const handleOffersEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ showOffers: boolean }>).detail
      setFeaturedOnly(detail.showOffers)
      if (detail.showOffers) {
        setSortBy('featured')
      }
      setCurrentPage(1)
    }

    window.addEventListener('globalSearch', handleGlobalSearch as EventListener)
    window.addEventListener('categoryFilterChanged', handleCategoryEvent as EventListener)
    window.addEventListener('filterByOffers', handleOffersEvent as EventListener)

    return () => {
      window.removeEventListener('globalSearch', handleGlobalSearch as EventListener)
      window.removeEventListener('categoryFilterChanged', handleCategoryEvent as EventListener)
      window.removeEventListener('filterByOffers', handleOffersEvent as EventListener)
    }
  }, [])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(checked ? [categoryId] : [])
    setCurrentPage(1)
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    setSelectedBrands(prev => {
      if (checked) {
        return Array.from(new Set([...prev, brandId]))
      }
      return prev.filter(id => id !== brandId)
    })
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
    setCurrentPage(1)
  }

  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
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

  const getProductImage = (product: Product) => {
    const primary = product.product_images?.find(image => image.is_primary)

    return (
      (product as any).image ||
      (product as any).image_url ||
      primary?.image_url ||
      '/placeholder.svg'
    )
  }

  const resolveStockBadge = (product: Product) => {
    const stockCount =
      (product as any).stockCount ??
      (product as any).stock_quantity ??
      (product as any).stock ??
      0
    const available = product.inStock ?? stockCount > 0

    if (!available || stockCount <= 0) {
      return { label: 'Sin stock', className: 'bg-rose-100 text-rose-700' }
    }

    if (stockCount <= 10) {
      return { label: `Quedan ${stockCount}`, className: 'bg-amber-100 text-amber-700' }
    }

    return { label: `Stock ${stockCount}`, className: 'bg-emerald-100 text-emerald-700' }
  }

  const handleAddToCart = (product: Product) => {
    const image = getProductImage(product)
    const stockCount =
      (product as any).stockCount ??
      (product as any).stock_quantity ??
      (product as any).stock ??
      0

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
      image_url: image,
      brand: product.brand,
      stock: stockCount,
      stockCount,
    })
    openCart()
  }

  const handleProductView = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }
  const isInitialLoading = loading && products.length === 0
  const showingFrom = totalProducts === 0 ? 0 : (currentPage - 1) * limit + 1
  const showingTo = totalProducts === 0 ? 0 : Math.min(currentPage * limit, totalProducts)

  const categoryLabelMap = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach(category => map.set(category.id, category.name))
    return map
  }, [categories])

  const brandLabelMap = useMemo(() => {
    const map = new Map<string, string>()
    brands.forEach(brand => map.set(brand.id, brand.name))
    return map
  }, [brands])

  const hasCustomPriceRange =
    minPrice !== maxPrice && (priceRange[0] > minPrice || priceRange[1] < maxPrice)

  const activeFilterChips = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = []
    const trimmedSearch = searchQuery.trim()

    if (trimmedSearch) {
      chips.push({
        key: 'search',
        label: `Busqueda: "${trimmedSearch}"`,
        onRemove: () => setSearchQuery(''),
      })
    }

    const categoryId = selectedCategories[0]
    if (categoryId) {
      const label = categoryLabelMap.get(categoryId) ?? categoryId
      chips.push({
        key: `category-${categoryId}`,
        label: `Categoria: ${label}`,
        onRemove: () => setSelectedCategories([]),
      })
    }

    selectedBrands.forEach(brandId => {
      const label = brandLabelMap.get(brandId) ?? brandId
      chips.push({
        key: `brand-${brandId}`,
        label: `Marca: ${label}`,
        onRemove: () => setSelectedBrands(prev => prev.filter(id => id !== brandId)),
      })
    })

    if (inStockOnly) {
      chips.push({
        key: 'stock',
        label: 'Solo en stock',
        onRemove: () => setInStockOnly(false),
      })
    }

    if (featuredOnly) {
      chips.push({
        key: 'featured',
        label: 'Destacados',
        onRemove: () => setFeaturedOnly(false),
      })
    }

    if (hasCustomPriceRange) {
      chips.push({
        key: 'price',
        label: `Precio: ${formatCurrency(priceRange[0])} - ${formatCurrency(priceRange[1])}`,
        onRemove: () => setPriceRange([minPrice, maxPrice]),
      })
    }

    return chips
  }, [
    brandLabelMap,
    categoryLabelMap,
    featuredOnly,
    formatCurrency,
    hasCustomPriceRange,
    inStockOnly,
    minPrice,
    maxPrice,
    priceRange,
    searchQuery,
    selectedBrands,
    selectedCategories,
  ])

  const filtersCount = activeFilterChips.length

  const renderGridCard = (product: Product) => {
    const image = getProductImage(product)
    const stockBadge = resolveStockBadge(product)
    const originalPrice =
      (product as any).originalPrice ??
      (product as any).original_price ??
      null
    const originalValue =
      typeof originalPrice === 'number'
        ? originalPrice
        : originalPrice
        ? Number(originalPrice)
        : null
    const hasDiscount =
      typeof originalValue === 'number' && originalValue > product.price
    const discountPercent =
      hasDiscount && originalValue
        ? Math.round(((originalValue - product.price) / originalValue) * 100)
        : null

    return (
      <Card
        key={product.id}
        className="group flex h-full flex-col overflow-hidden border border-gray-100 bg-white transition-shadow hover:shadow-lg"
      >
        <div className="relative">
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 90vw"
            />
          </div>
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.featured && (
              <Badge variant="secondary" className="w-fit bg-orange-100 text-orange-700">
                Destacado
              </Badge>
            )}
            {hasDiscount && discountPercent !== null && (
              <Badge variant="destructive" className="w-fit bg-rose-100 text-rose-700">
                -{discountPercent}%
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase text-gray-500">
            <span className="text-orange-600">{product.brand || 'Marca'}</span>
            <span className={cn('rounded-full px-3 py-1 text-[0.75rem]', stockBadge.className)}>
              {stockBadge.label}
            </span>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <h3 className="line-clamp-2 text-base font-semibold text-gray-900">{product.name}</h3>
          </Link>
          {product.description && (
            <p className="line-clamp-2 text-sm text-gray-600">{product.description}</p>
          )}
          <div className="mt-auto space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && originalValue && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(originalValue)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="h-11 flex-1 rounded-full text-sm font-semibold"
                onClick={() => handleAddToCart(product)}
                disabled={stockBadge.label === 'Sin stock'}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {stockBadge.label === 'Sin stock' ? 'Sin stock' : 'Agregar'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full border-gray-200"
                onClick={() => handleProductView(product)}
                aria-label={`Ver detalles de ${product.name}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-full text-gray-500 hover:text-orange-600"
                aria-label="Agregar a favoritos"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderListCard = (product: Product) => {
    const image = getProductImage(product)
    const stockBadge = resolveStockBadge(product)
    const originalPrice =
      (product as any).originalPrice ??
      (product as any).original_price ??
      null
    const originalValue =
      typeof originalPrice === 'number'
        ? originalPrice
        : originalPrice
        ? Number(originalPrice)
        : null
    const hasDiscount =
      typeof originalValue === 'number' && originalValue > product.price

    return (
      <Card
        key={`list-${product.id}`}
        className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-stretch"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 sm:max-w-[220px]">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-contain p-6"
            sizes="(min-width: 1024px) 220px, 50vw"
          />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase text-gray-500">
            <span className="text-orange-600">{product.brand || 'Marca'}</span>
            <span className={cn('rounded-full px-3 py-1 text-[0.75rem]', stockBadge.className)}>
              {stockBadge.label}
            </span>
            {product.category && <span className="text-gray-400">/ {product.category}</span>}
          </div>
          <Link
            href={`/products/${product.id}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          </Link>
          {product.description && <p className="text-sm text-gray-600">{product.description}</p>}
          <div className="mt-auto flex flex-wrap items-center gap-4">
            <div className="flex items-baseline gap-2 text-gray-900">
              <span className="text-2xl font-bold">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && originalValue && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(originalValue)}
                </span>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                className="h-11 rounded-full px-6 text-sm font-semibold"
                onClick={() => handleAddToCart(product)}
                disabled={stockBadge.label === 'Sin stock'}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {stockBadge.label === 'Sin stock' ? 'Sin stock' : 'Agregar'}
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full px-6 text-sm font-semibold"
                onClick={() => handleProductView(product)}
              >
                Ver detalles
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }
  return (
    <section id="productos" className="bg-gray-50 py-12">
      <div className="container space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
            Catalogo
          </p>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Nuestros productos
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
            Explora tecnologia, energia y soluciones de seguridad seleccionadas para equipos profesionales y hogares conectados.
          </p>
        </header>

        <div className="sticky top-[calc(var(--nav-height)+1rem)] z-20 space-y-3 rounded-2xl border border-gray-100 bg-white/95 px-4 py-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm font-medium text-gray-700">
              {totalProducts === 0
                ? '0 productos'
                : `Mostrando ${showingFrom}-${showingTo} de ${totalProducts} productos`}
            </p>
            <div className="flex w-full flex-wrap items-center gap-3 lg:justify-end">
              <div className="relative w-full max-w-[360px]">
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={event => handleSearchInput(event.target.value)}
                  placeholder="Buscar productos..."
                  className="h-11 rounded-full border-gray-200 pl-11 text-sm focus:border-orange-400 focus:ring-orange-400"
                />
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(prev => !prev)}
                className={cn(
                  'flex items-center gap-2 rounded-full border-gray-200 px-4 py-2 text-sm font-semibold transition',
                  showFilters
                    ? 'border-orange-300 bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:border-orange-200 hover:text-orange-600'
                )}
                aria-pressed={showFilters}
              >
                <Filter className="h-4 w-4" />
                Filtros
                {filtersCount > 0 && (
                  <span className="flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-orange-100 px-2 text-xs text-orange-700">
                    {filtersCount}
                  </span>
                )}
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 w-[200px] rounded-full border-gray-200 bg-white text-sm font-semibold focus:border-orange-400 focus:ring-orange-400">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="featured">Destacados</SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="price">Precio: menor a mayor</SelectItem>
                  <SelectItem value="created_at">Mas recientes</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center rounded-full border border-gray-200 bg-white p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={cn(
                    'h-9 w-9 rounded-full',
                    viewMode === 'grid'
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'text-gray-600 hover:text-orange-600'
                  )}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  className={cn(
                    'h-9 w-9 rounded-full',
                    viewMode === 'list'
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'text-gray-600 hover:text-orange-600'
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.map(chip => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  <span>{chip.label}</span>
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-orange-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[280px_1fr]">
          <aside
            className={cn(
              'space-y-6',
              showFilters ? 'block' : 'hidden lg:block',
              'lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)]'
            )}
            aria-label="Filtros"
          >
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">Filtrar por</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-orange-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Limpiar
                  </Button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Categorias</h4>
                    <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                      {categories.map(category => (
                        <label key={category.id} className="flex items-center gap-3 text-sm text-gray-700">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={checked =>
                              handleCategoryChange(category.id, checked === true)
                            }
                          />
                          <span>{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Marcas</h4>
                    <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                      {brands.map(brand => (
                        <label key={brand.id} className="flex items-center gap-3 text-sm text-gray-700">
                          <Checkbox
                            id={`brand-${brand.id}`}
                            checked={selectedBrands.includes(brand.id)}
                            onCheckedChange={checked =>
                              handleBrandChange(brand.id, checked === true)
                            }
                          />
                          <span>{brand.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
                      <span>Rango de precios</span>
                      <span className="text-xs text-gray-500">COP</span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      min={minPrice}
                      max={maxPrice}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
                      <span>{formatCurrency(priceRange[0])}</span>
                      <span>{formatCurrency(priceRange[1])}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-gray-700">
                      <Checkbox
                        id="in-stock"
                        checked={inStockOnly}
                        onCheckedChange={checked => setInStockOnly(checked === true)}
                      />
                      <span>Solo productos en stock</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-gray-700">
                      <Checkbox
                        id="featured"
                        checked={featuredOnly}
                        onCheckedChange={checked => setFeaturedOnly(checked === true)}
                      />
                      <span>Solo destacados</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="space-y-8">
            {loading && !isInitialLoading && (
              <div className="flex items-center justify-center gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-sm text-orange-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                Actualizando resultados...
              </div>
            )}

            <div
              className={cn(
                'grid gap-6',
                viewMode === 'grid'
                  ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-equal-rows'
                  : 'grid-cols-1'
              )}
            >
              {isInitialLoading
                ? Array.from({ length: viewMode === 'grid' ? 8 : 4 }, (_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5"
                    >
                      <div className="skeleton mb-5 aspect-square w-full rounded-2xl" />
                      <div className="skeleton h-4 w-24 rounded-full" />
                      <div className="skeleton mt-3 h-4 w-full rounded-full" />
                      <div className="skeleton mt-2 h-4 w-3/4 rounded-full" />
                      <div className="mt-auto space-y-3 pt-6">
                        <div className="skeleton h-5 w-28 rounded-full" />
                        <div className="skeleton h-11 w-full rounded-full" />
                      </div>
                    </div>
                  ))
                : products.map(product =>
                    viewMode === 'grid'
                      ? renderGridCard(product)
                      : renderListCard(product)
                  )}
            </div>

            {!loading && products.length === 0 && (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
                <p className="text-lg font-semibold text-gray-800">
                  No encontramos productos con esos filtros
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Ajusta la busqueda o limpia los filtros para ver mas resultados.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 h-11 rounded-full px-6"
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}

            {totalPages > 1 && (
              <nav
                className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row"
                aria-label="Paginacion"
              >
                <p className="text-sm text-gray-600">
                  Pagina {currentPage} de {totalPages}
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                    className="h-10 rounded-full px-4"
                    aria-label="Pagina anterior"
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                    className="h-10 rounded-full px-4"
                    aria-label="Pagina siguiente"
                  >
                    Siguiente
                  </Button>
                </div>
              </nav>
            )}
          </div>
        </div>

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
