'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'

// Tipos de datos
export interface FavoriteItem {
  id: string
  name: string
  price: number
  image_url?: string
  image?: string
  brand?: string
  category?: string
  stock?: number
  discount_percentage?: number
  addedAt: Date
}

export interface FavoritesState {
  items: FavoriteItem[]
  isLoading: boolean
  isOpen: boolean
}

// Tipos de acciones
type FavoritesAction =
  | { type: 'ADD_ITEM'; payload: FavoriteItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'SET_ITEMS'; payload: FavoriteItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'OPEN_FAVORITES' }
  | { type: 'CLOSE_FAVORITES' }

// Estado inicial
const initialState: FavoritesState = {
  items: [],
  isLoading: false,
  isOpen: false,
}

// Reducer
function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.items.some(item => item.id === action.payload.id)) {
        return state
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      }
    case 'CLEAR_FAVORITES':
      return {
        ...state,
        items: [],
      }
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'OPEN_FAVORITES':
      return {
        ...state,
        isOpen: true,
      }
    case 'CLOSE_FAVORITES':
      return {
        ...state,
        isOpen: false,
      }
    default:
      return state
  }
}

// Contexto
const FavoritesContext = createContext<{
  state: FavoritesState
  addItem: (item: Omit<FavoriteItem, 'addedAt'>) => void
  removeItem: (id: string) => void
  clearFavorites: () => void
  isFavorite: (id: string) => boolean
  openFavorites: () => void
  closeFavorites: () => void
} | null>(null)

// Provider
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState)
  const { user } = useAuth()

  // Cargar favoritos desde Supabase cuando el usuario cambia
  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
      dispatch({ type: 'SET_ITEMS', payload: [] })
    }
  }, [user])

  const loadFavorites = async () => {
    if (!user) return

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        const items = data.map((item: any) => ({
          ...item,
          addedAt: new Date(item.added_at || item.created_at),
        }))
        dispatch({ type: 'SET_ITEMS', payload: items })
      } else {
        // Si la API falla, mantener items vacíos pero no mostrar error
        console.warn('Failed to load favorites from API:', response.status)
        dispatch({ type: 'SET_ITEMS', payload: [] })
      }
    } catch (error) {
      // Si hay error de conexión, mantener items vacíos
      console.warn('Error loading favorites:', error)
      dispatch({ type: 'SET_ITEMS', payload: [] })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addItem = async (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (!user) return

    const favoriteItem: FavoriteItem = {
      ...item,
      addedAt: new Date(),
    }

    // Optimistic update
    dispatch({ type: 'ADD_ITEM', payload: favoriteItem })

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: item.id,
        }),
      })

      if (!response.ok) {
        // Revert on error
        dispatch({ type: 'REMOVE_ITEM', payload: item.id })
        console.error('Error adding favorite')
      }
    } catch (error) {
      // Revert on error
      dispatch({ type: 'REMOVE_ITEM', payload: item.id })
      console.error('Error adding favorite:', error)
    }
  }

  const removeItem = async (id: string) => {
    if (!user) return

    // Optimistic update
    dispatch({ type: 'REMOVE_ITEM', payload: id })

    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: id,
        }),
      })

      if (!response.ok) {
        // Revert on error - would need to add back, but for simplicity, just log
        console.error('Error removing favorite')
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const clearFavorites = async () => {
    if (!user) return

    dispatch({ type: 'CLEAR_FAVORITES' })

    try {
      await fetch('/api/favorites', {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error clearing favorites:', error)
    }
  }

  const isFavorite = (id: string) => {
    return state.items.some(item => item.id === id)
  }

  const openFavorites = () => {
    dispatch({ type: 'OPEN_FAVORITES' })
  }

  const closeFavorites = () => {
    dispatch({ type: 'CLOSE_FAVORITES' })
  }

  return (
    <FavoritesContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        clearFavorites,
        isFavorite,
        openFavorites,
        closeFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

// Hook
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
