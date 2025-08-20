'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Tipos de datos
export interface CartItem {
  id: number
  name: string
  brand: string
  price: number
  originalPrice: number
  image: string
  quantity: number
  inStock: boolean
  stockCount: number
  category: string
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
}

// Tipos de acciones
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

// Estado inicial
const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
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
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.stockCount),
              }
            : item
        )
      } else {
        // Si es nuevo, agregarlo con cantidad 1
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items
        .map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  Math.min(action.payload.quantity, item.stockCount)
                ),
              }
            : item
        )
        .filter(item => item.quantity > 0)

      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0 }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'LOAD_CART': {
      const total = action.payload.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      const itemCount = action.payload.reduce(
        (sum, item) => sum + item.quantity,
        0
      )

      return { ...state, items: action.payload, total, itemCount }
    }

    default:
      return state
  }
}

// Contexto
interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

// Proveedor del contexto
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('capishop-cart')
      if (savedCart) {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('capishop-cart', JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state.items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: number, quantity: number) => {
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

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook para usar el contexto
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
