// ============================================================
// TIPOS TYPESCRIPT — BASE DE DATOS REAL DE SUMITRONIC
// Generado: 2026-04-01
// Fuente: supabase/schema.sql + migraciones aplicadas
//
// CONTRATO OFICIAL. No agregar campos que no existan en la DB.
// Para campos del frontend que no viven en la DB usar lib/types/products.ts
// ============================================================

// Helper type para JSON de PostgreSQL
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ──────────────────────────────────────────────────────
      // USUARIOS
      // Columnas reales: id, email, full_name, avatar_url,
      //   phone, address, role, created_at, updated_at
      // Nota: id referencia auth.users(id) en Supabase
      // ──────────────────────────────────────────────────────
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          address: Json | null
          role: 'admin' | 'customer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: Json | null
          role?: 'admin' | 'customer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: Json | null
          role?: 'admin' | 'customer'
          created_at?: string
          updated_at?: string
        }
      }

      // ──────────────────────────────────────────────────────
      // CATEGORIAS
      // Columnas reales: id, name, slug, description,
      //   image_url, active, sort_order, created_at, updated_at
      // NOTA: usa "active" (no "is_active"). No tiene "parent_id".
      // ──────────────────────────────────────────────────────
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }

      // ──────────────────────────────────────────────────────
      // PRODUCTOS
      // Columnas reales: id, name, description, price,
      //   compare_price, cost_price, category_id, brand,
      //   image_url, images, stock_quantity, sku, barcode,
      //   weight, dimensions, featured, active, tags,
      //   search_vector, created_at, updated_at
      //
      // COLUMNA OFICIAL DE OFERTA: compare_price
      // COLUMNA OFICIAL DE STOCK: stock_quantity
      // FUENTE ELIMINADA: compare_at_price (ya no existe)
      //
      // Campos que NO existen en la DB real y que NO deben usarse:
      //   slug, short_description, track_inventory,
      //   inventory_quantity, featured_image, is_active, is_featured
      // ──────────────────────────────────────────────────────
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          compare_price: number | null
          cost_price: number | null
          category_id: string | null
          brand: string
          image_url: string
          images: string[]
          stock_quantity: number
          sku: string | null
          barcode: string | null
          weight: number | null
          dimensions: Json | null
          featured: boolean
          active: boolean
          tags: string[] | null
          search_vector: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          compare_price?: number | null
          cost_price?: number | null
          category_id?: string | null
          brand: string
          image_url: string
          images?: string[]
          stock_quantity?: number
          sku?: string | null
          barcode?: string | null
          weight?: number | null
          dimensions?: Json | null
          featured?: boolean
          active?: boolean
          tags?: string[] | null
          search_vector?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          compare_price?: number | null
          cost_price?: number | null
          category_id?: string | null
          brand?: string
          image_url?: string
          images?: string[]
          stock_quantity?: number
          sku?: string | null
          barcode?: string | null
          weight?: number | null
          dimensions?: Json | null
          featured?: boolean
          active?: boolean
          tags?: string[] | null
          search_vector?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // ──────────────────────────────────────────────────────
      // IMAGENES DE PRODUCTO
      // ──────────────────────────────────────────────────────
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          is_primary: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          alt_text?: string | null
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          alt_text?: string | null
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
      }

      // ──────────────────────────────────────────────────────
      // VARIANTES DE PRODUCTO
      // ──────────────────────────────────────────────────────
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          sku: string | null
          price: number
          compare_price: number | null
          inventory_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          sku?: string | null
          price: number
          compare_price?: number | null
          inventory_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          sku?: string | null
          price?: number
          compare_price?: number | null
          inventory_quantity?: number
          created_at?: string
          updated_at?: string
        }
      }

      // ──────────────────────────────────────────────────────
      // INVENTARIO
      // Fuente auxiliar de stock.
      // Fuente primaria: products.stock_quantity
      // Ambas deben mantenerse sincronizadas.
      // ──────────────────────────────────────────────────────
      inventory: {
        Row: {
          id: string
          product_id: string
          quantity_available: number
          reserved_quantity: number
          low_stock_threshold: number
          last_updated: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity_available?: number
          reserved_quantity?: number
          low_stock_threshold?: number
          last_updated?: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity_available?: number
          reserved_quantity?: number
          low_stock_threshold?: number
          last_updated?: string
        }
      }

      // ──────────────────────────────────────────────────────
      // CARRITOS
      // ──────────────────────────────────────────────────────
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

      // ──────────────────────────────────────────────────────
      // ITEMS DE CARRITO
      // ──────────────────────────────────────────────────────
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

      // ──────────────────────────────────────────────────────
      // FAVORITOS
      // ──────────────────────────────────────────────────────
      favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
          updated_at?: string
        }
      }

      // ──────────────────────────────────────────────────────
      // PEDIDOS
      // Columnas reales: id, user_id, customer_info, items,
      //   subtotal, tax, shipping, total, status,
      //   payment_status, payment_method, payment_proof_url,
      //   tracking_number, notes, shipping_address,
      //   billing_address, order_number, created_at, updated_at
      // ──────────────────────────────────────────────────────
      orders: {
        Row: {
          id: string
          user_id: string | null
          customer_info: Json
          items: Json
          subtotal: number
          tax: number
          shipping: number
          total: number
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
          payment_method: string | null
          payment_proof_url: string | null
          tracking_number: string | null
          notes: string | null
          shipping_address: Json | null
          billing_address: Json | null
          order_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          customer_info: Json
          items: Json
          subtotal: number
          tax?: number
          shipping?: number
          total: number
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
          payment_method?: string | null
          payment_proof_url?: string | null
          tracking_number?: string | null
          notes?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          order_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          customer_info?: Json
          items?: Json
          subtotal?: number
          tax?: number
          shipping?: number
          total?: number
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
          payment_method?: string | null
          payment_proof_url?: string | null
          tracking_number?: string | null
          notes?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          order_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // ──────────────────────────────────────────────────────
      // ITEMS DE PEDIDO (tabla normalizada, post-migracion)
      // ──────────────────────────────────────────────────────
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          product_name: string
          product_sku: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          variant_id?: string | null
          product_name: string
          product_sku?: string | null
          quantity: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          variant_id?: string | null
          product_name?: string
          product_sku?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }

      // ──────────────────────────────────────────────────────
      // CONFIGURACION DEL SISTEMA
      // ──────────────────────────────────────────────────────
      system_settings: {
        Row: {
          id: string
          key: string
          value: Json | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }

    Views: {
      [_ in never]: never
    }

    Functions: {
      // Función original — contrato histórico activo. No renombrar.
      // Definida en: supabase/migrations/20260329_restore_backup_compatibility.sql
      capishop_slugify: {
        Args: { input_text: string }
        Returns: string
      }
      // Alias post-rebranding — usar este en código nuevo.
      // Definida en: supabase/migrations/20260403_add_sumitronic_slugify.sql
      sumitronic_slugify: {
        Args: { input_text: string }
        Returns: string
      }
    }

    Enums: {
      [_ in never]: never
    }
  }
}

// ──────────────────────────────────────────────────────────────
// TIPOS DE CONVENIENCIA
// ──────────────────────────────────────────────────────────────

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Tipos base por tabla
export type UserProfile       = Tables<'users'>
/** Alias de UserProfile para compatibilidad con AuthContext */
export type Profile           = Tables<'users'>
export type Category          = Tables<'categories'>
export type Product           = Tables<'products'>
export type ProductImage      = Tables<'product_images'>
export type ProductVariant    = Tables<'product_variants'>
export type Inventory         = Tables<'inventory'>
export type Cart              = Tables<'carts'>
export type CartItem          = Tables<'cart_items'>
export type Favorite          = Tables<'favorites'>
export type Order             = Tables<'orders'>
export type OrderItem         = Tables<'order_items'>
export type SystemSetting     = Tables<'system_settings'>

// Tipos de insercion
export type ProductInsert     = TablesInsert<'products'>
export type CategoryInsert    = TablesInsert<'categories'>
export type OrderInsert       = TablesInsert<'orders'>

// Tipos de actualizacion
export type ProductUpdate     = TablesUpdate<'products'>
export type CategoryUpdate    = TablesUpdate<'categories'>

// ──────────────────────────────────────────────────────────────
// TIPOS EXTENDIDOS CON RELACIONES
// ──────────────────────────────────────────────────────────────

export type ProductWithCategory = Product & {
  category: Category | null
}

export type ProductWithRelations = Product & {
  category: Category | null
  product_images: ProductImage[]
  inventory: Inventory | null
}

export type CartItemWithProduct = CartItem & {
  product: Product
  variant?: ProductVariant | null
}

export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    product: Product | null
  })[]
}

// ──────────────────────────────────────────────────────────────
// TIPOS PARA FORMULARIOS (sin campos auto-generados)
// ──────────────────────────────────────────────────────────────

export type ProductForm = Omit<
  ProductInsert,
  'id' | 'created_at' | 'updated_at' | 'search_vector'
>

export type CategoryForm = Omit<
  CategoryInsert,
  'id' | 'created_at' | 'updated_at'
>

// ──────────────────────────────────────────────────────────────
// TIPO DE DIRECCION (estructura JSON almacenada en orders
// y en users.address)
// ──────────────────────────────────────────────────────────────

export type Address = {
  full_name?: string
  phone?: string
  street: string
  city: string
  department: string
  postal_code?: string
  country?: string
}
