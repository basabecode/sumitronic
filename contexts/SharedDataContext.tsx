'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface SharedCategory {
  id: string
  name: string
  image: string
}

export interface SharedBrand {
  id: string
  name: string
}

interface SharedDataContextType {
  categories: SharedCategory[]
  brands: SharedBrand[]
  isLoadingCategories: boolean
  isLoadingBrands: boolean
  error: string | null
  refreshData: () => Promise<void>
}

const SharedDataContext = createContext<SharedDataContextType | null>(null)

export function SharedDataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<SharedCategory[]>([])
  const [brands, setBrands] = useState<SharedBrand[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isLoadingBrands, setIsLoadingBrands] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchCategories = useCallback(async () => {
    if (categories.length > 0) return
    setIsLoadingCategories(true)
    setError(null)
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data: { id: string; slug: string; name: string; image_url?: string | null }[] = await res.json()
        setCategories(
          data.map(cat => ({
            id: cat.slug,
            name: cat.name,
            image: cat.image_url || '/placeholder.svg',
          }))
        )
      } else {
        setError('Error cargando categorías')
      }
    } catch {
      setError('Error de red cargando categorías')
    } finally {
      setIsLoadingCategories(false)
    }
  }, [categories.length])

  const fetchBrands = useCallback(async () => {
    if (brands.length > 0) return
    setIsLoadingBrands(true)
    try {
      const res = await fetch('/api/brands')
      if (res.ok) {
        const data: SharedBrand[] = await res.json()
        setBrands(data)
      }
    } catch {
      // silencio — las marcas no son críticas
    } finally {
      setIsLoadingBrands(false)
    }
  }, [brands.length])

  const refreshData = useCallback(async () => {
    setHasLoaded(false)
    setCategories([])
    setBrands([])
    await Promise.all([fetchCategories(), fetchBrands()])
    setHasLoaded(true)
  }, [fetchCategories, fetchBrands])

  useEffect(() => {
    if (!hasLoaded) {
      Promise.all([fetchCategories(), fetchBrands()]).then(() => setHasLoaded(true))
    }
  }, [hasLoaded, fetchCategories, fetchBrands])

  return (
    <SharedDataContext.Provider
      value={{ categories, brands, isLoadingCategories, isLoadingBrands, error, refreshData }}
    >
      {children}
    </SharedDataContext.Provider>
  )
}

export function useSharedData() {
  const context = useContext(SharedDataContext)
  if (!context) throw new Error('useSharedData must be used within a SharedDataProvider')
  return context
}
