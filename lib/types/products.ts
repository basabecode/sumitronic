// ===================================
// TIPOS UNIFICADOS PARA SUMITRONIC
// ===================================

export interface DatabaseProduct {
  id: string
  name: string
  description: string
  price: number
  compare_price?: number
  category_id: string
  brand: string
  image_url: string
  images: string[] // Array de URLs de imágenes adicionales
  stock_quantity: number
  sku: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
  search_vector?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  image_url?: string
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text: string
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface ProductWithRelations extends DatabaseProduct {
  category: Category
  product_images: ProductImage[]
  inventory?: {
    id: string
    quantity_available: number
    reserved_quantity: number
    last_updated: string
  }
}

// Tipo para el frontend (compatible con componentes existentes)
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  rating?: number
  reviews?: number
  category: string
  brand: string
  image: string // URL principal
  images?: string[] // URLs adicionales
  badge?: string
  inStock: boolean
  stockCount: number
  sku?: string
  featured?: boolean
  // Campos adicionales para compatibilidad
  image_url?: string
  stock_quantity?: number
  categories?: Category
  product_images?: ProductImage[]
}

// Tipos para APIs
export interface ProductsApiResponse {
  products: ProductWithRelations[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  category_id: string
  brand: string
  image_url: string
  images?: string[]
  stock_quantity: number
  sku: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  featured?: boolean
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
}

// Tipos para filtros
export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'name' | 'price' | 'created_at' | 'featured'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
  inStockOnly?: boolean
  featured?: boolean
}

// Función helper para convertir DatabaseProduct a Product (frontend)
export const convertDatabaseProductToProduct = (
  dbProduct: ProductWithRelations
): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    originalPrice: dbProduct.compare_price && dbProduct.compare_price > dbProduct.price
      ? dbProduct.compare_price
      : undefined,
    category: dbProduct.category?.name || 'Sin categoría',
    brand: dbProduct.brand,
    image: dbProduct.image_url,
    images: dbProduct.images,
    inStock: dbProduct.stock_quantity > 0,
    stockCount: dbProduct.stock_quantity,
    sku: dbProduct.sku,
    featured: dbProduct.featured,
    // Compatibilidad con propiedades existentes
    image_url: dbProduct.image_url,
    stock_quantity: dbProduct.stock_quantity,
    categories: dbProduct.category,
    product_images: dbProduct.product_images,
  }
}

// Función helper para convertir array
export const convertDatabaseProductsToProducts = (
  dbProducts: ProductWithRelations[]
): Product[] => {
  return dbProducts.map(convertDatabaseProductToProduct)
}
