export interface Product {
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
  compare_price?: number | null
}

export interface ProductFormData {
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

export const EMPTY_FORM: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  compare_price: null,
  category: '',
  brand: '',
  stock: 0,
  featured: false,
  images: [],
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
