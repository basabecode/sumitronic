'use client'

import { formatPrice } from '@/lib/utils'
import React, { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react'
import { useAuth } from './AuthContext'

// Tipos de datos
export interface CartItem {
  id: string
  name: string
  description?: string
  brand?: string
  price: number
  originalPrice?: number
  image_url?: string
  image?: string
  quantity: number
  stock?: number
  stockCount?: number
  inStock?: boolean
  category?: string
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
  shipping: number
  tax: number
  subtotal: number
  isLoading?: boolean
}

// Tipos de acciones
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean }

// Estado inicial
const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
  shipping: 0,
  tax: 0,
  subtotal: 0,
  isLoading: false,
}

// Funcion para calcular totales
function calculateTotals(items: CartItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  // Los precios ya incluyen IVA, no se calcula adicional
  const tax = 0
  const shipping = subtotal > 100000 ? 0 : 15000 // Envio gratis por compras mayores a $100,000
  const total = subtotal + shipping // Total = subtotal + envío (el IVA ya está incluido en los precios)

  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.id === action.payload.id
      )

      let newItems: CartItem[]

      if (existingItem) {
        // Si el item ya existe, incrementar cantidad
        const maxQuantity =
          action.payload.stock || action.payload.stockCount || 999
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + (action.payload.quantity || 1), maxQuantity),
              }
            : item
        )
      } else {
        // Si es un item nuevo, agregarlo al carrito
        newItems = [
          ...state.items,
          {
            ...action.payload,
            quantity: action.payload.quantity || 1,
          },
        ]
      }

      const totals = calculateTotals(newItems)

      return {
        ...state,
        items: newItems,
        ...totals,
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const totals = calculateTotals(newItems)

      return {
        ...state,
        items: newItems,
        ...totals,
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items
        .map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: Math.min(
                  action.payload.quantity,
                  item.stock || item.stockCount || 999
                ),
              }
            : item
        )
        .filter(item => item.quantity > 0) // Remover items con cantidad 0

      const totals = calculateTotals(newItems)

      return {
        ...state,
        items: newItems,
        ...totals,
      }
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
      }
    }

    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    }

    case 'OPEN_CART': {
      return {
        ...state,
        isOpen: true,
      }
    }

    case 'CLOSE_CART': {
      return {
        ...state,
        isOpen: false,
      }
    }

    case 'LOAD_CART': {
      const totals = calculateTotals(action.payload)
      return {
        ...state,
        items: action.payload,
        ...totals,
      }
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      }
    }

    default:
      return state
  }
}

// Contexto
interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  formatCurrency: (amount: number) => string
}

const CartContext = createContext<CartContextType | null>(null)

// Hook personalizado
export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}

// Provider
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { user, loading: isAuthLoading } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)
  const isSyncingRef = useRef(false)

  // 1. Inicialización: Cargar desde localStorage primero
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  // 2. Sincronización con Backend al iniciar sesión
  useEffect(() => {
    const syncCartWithBackend = async () => {
      if (!user || !isInitialized || isAuthLoading) return

      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        // Obtener carrito del backend
        const response = await fetch('/api/cart')

        if (response.ok) {
          const data = await response.json()
          const backendItems = data.items || []

          // Estrategia de fusión:
          // Si hay items locales y backend está vacío -> Subir locales
          // Si hay items backend y local está vacío -> Bajar backend
          // Si hay ambos -> Fusionar (priorizar backend o sumar cantidades? Por simplicidad: Bajar backend y avisar o fusionar)

          // Implementación actual: Si hay items locales, enviarlos al backend (merge). Luego recargar.
          if (state.items.length > 0) {
            // Fusionar lógica simple: Enviar estado actual al backend
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: state.items }),
            })
          } else if (backendItems.length > 0) {
            // Si local está vacío pero backend tiene items, cargar backend
            dispatch({ type: 'LOAD_CART', payload: backendItems })
          }
        }
      } catch (error) {
        console.error('Error syncing cart:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    syncCartWithBackend()
  }, [user, isInitialized, isAuthLoading])

  // 3. Persistencia: Guardar en localStorage y Backend cuando cambia el estado
  useEffect(() => {
    if (!isInitialized) return

    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(state.items))

    // Guardar en Backend si el usuario está autenticado
    const saveToBackend = async () => {
      if (!user || isSyncingRef.current) return

      try {
        isSyncingRef.current = true
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: state.items }),
        })
      } catch (error) {
        console.error('Error saving cart to backend:', error)
      } finally {
        isSyncingRef.current = false
      }
    }

    // Debounce para no saturar la API
    const timeoutId = setTimeout(() => {
      if (user) saveToBackend()
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [state.items, isInitialized, user])

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const formatCurrency = (amount: number) => {
    return formatPrice(amount)
  }

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    formatCurrency,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}


