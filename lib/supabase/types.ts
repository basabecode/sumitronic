// Database Types - Consolidated
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  image: string
  images: string[]
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  customer_info: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed'
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'admin' | 'customer'
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'admin' | 'customer'
  created_at: string
  updated_at: string
}