// Tipos TypeScript para las tablas de Supabase
// Generados a partir del esquema de base de datos

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          phone: string | null
          address: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          phone?: string | null
          address?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          phone?: string | null
          address?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          sku: string | null
          price: number
          compare_price: number | null
          cost_price: number | null
          track_inventory: boolean
          inventory_quantity: number
          allow_backorder: boolean
          weight: number | null
          dimensions: Json | null
          category_id: string | null
          tags: string[] | null
          images: string[] | null
          featured_image: string | null
          is_featured: boolean
          is_active: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          sku?: string | null
          price: number
          compare_price?: number | null
          cost_price?: number | null
          track_inventory?: boolean
          inventory_quantity?: number
          allow_backorder?: boolean
          weight?: number | null
          dimensions?: Json | null
          category_id?: string | null
          tags?: string[] | null
          images?: string[] | null
          featured_image?: string | null
          is_featured?: boolean
          is_active?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          sku?: string | null
          price?: number
          compare_price?: number | null
          cost_price?: number | null
          track_inventory?: boolean
          inventory_quantity?: number
          allow_backorder?: boolean
          weight?: number | null
          dimensions?: Json | null
          category_id?: string | null
          tags?: string[] | null
          images?: string[] | null
          featured_image?: string | null
          is_featured?: boolean
          is_active?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          title: string
          price: number
          compare_price: number | null
          sku: string | null
          inventory_quantity: number
          weight: number | null
          option1: string | null
          option2: string | null
          option3: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          title: string
          price: number
          compare_price?: number | null
          sku?: string | null
          inventory_quantity?: number
          weight?: number | null
          option1?: string | null
          option2?: string | null
          option3?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          title?: string
          price?: number
          compare_price?: number | null
          sku?: string | null
          inventory_quantity?: number
          weight?: number | null
          option1?: string | null
          option2?: string | null
          option3?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id: string
          variant_id?: string | null
          quantity: number
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          product_id?: string
          variant_id?: string | null
          quantity?: number
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          email: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total: number
          billing_address: Json
          shipping_address: Json | null
          payment_method: string | null
          payment_gateway: string | null
          payment_gateway_order_id: string | null
          tracking_number: string | null
          shipped_at: string | null
          delivered_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id?: string | null
          email: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
          subtotal: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total: number
          billing_address: Json
          shipping_address?: Json | null
          payment_method?: string | null
          payment_gateway?: string | null
          payment_gateway_order_id?: string | null
          tracking_number?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          email?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total?: number
          billing_address?: Json
          shipping_address?: Json | null
          payment_method?: string | null
          payment_gateway?: string | null
          payment_gateway_order_id?: string | null
          tracking_number?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          product_name: string
          product_sku: string | null
          variant_title: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          product_name: string
          product_sku?: string | null
          variant_title?: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string | null
          product_name?: string
          product_sku?: string | null
          variant_title?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          type: 'percentage' | 'fixed_amount'
          value: number
          minimum_amount: number
          usage_limit: number | null
          used_count: number
          is_active: boolean
          starts_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          type: 'percentage' | 'fixed_amount'
          value: number
          minimum_amount?: number
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          starts_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          type?: 'percentage' | 'fixed_amount'
          value?: number
          minimum_amount?: number
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          starts_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inventory_movements: {
        Row: {
          id: string
          product_id: string
          variant_id: string | null
          movement_type: 'sale' | 'restock' | 'adjustment' | 'return'
          quantity_change: number
          previous_quantity: number
          new_quantity: number
          reference_type: string | null
          reference_id: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          variant_id?: string | null
          movement_type: 'sale' | 'restock' | 'adjustment' | 'return'
          quantity_change: number
          previous_quantity: number
          new_quantity: number
          reference_type?: string | null
          reference_id?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          variant_id?: string | null
          movement_type?: 'sale' | 'restock' | 'adjustment' | 'return'
          quantity_change?: number
          previous_quantity?: number
          new_quantity?: number
          reference_type?: string | null
          reference_id?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos de conveniencia
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Tipos específicos para usar en la aplicación
export type Profile = Tables<'profiles'>
export type Category = Tables<'categories'>
export type Product = Tables<'products'>
export type ProductVariant = Tables<'product_variants'>
export type Cart = Tables<'carts'>
export type CartItem = Tables<'cart_items'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type Coupon = Tables<'coupons'>
export type InventoryMovement = Tables<'inventory_movements'>

// Tipos para inserción
export type ProductInsert = TablesInsert<'products'>
export type CategoryInsert = TablesInsert<'categories'>
export type OrderInsert = TablesInsert<'orders'>

// Tipos extendidos con relaciones
export type ProductWithCategory = Product & {
  category: Category | null
}

export type CartItemWithProduct = CartItem & {
  product: Product
  variant?: ProductVariant | null
}

export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    product: Product
    variant?: ProductVariant | null
  })[]
}

// Tipos para formularios
export type ProductForm = Omit<ProductInsert, 'id' | 'created_at' | 'updated_at'>
export type CategoryForm = Omit<CategoryInsert, 'id' | 'created_at' | 'updated_at'>

// Tipos para direcciones
export type Address = {
  street: string
  city: string
  state: string
  postal_code: string
  country: string
  full_name?: string
  phone?: string
}

// Helper type para JSON
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
