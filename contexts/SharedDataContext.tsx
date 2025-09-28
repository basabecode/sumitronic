'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'

interface SharedData {
  categories: { id: string; name: string }[]
  brands: { id: string; name: string }[]
  isLoadingCategories: boolean
  isLoadingBrands: boolean
  error: string | null
}

interface SharedDataContextType extends SharedData {
  refreshData: () => Promise<void>
}

const SharedDataContext = createContext<SharedDataContextType | null>(null)

export function SharedDataProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  )
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isLoadingBrands, setIsLoadingBrands] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchCategories = useCallback(async () => {
    if (categories.length > 0) return // Already loaded

    setIsLoadingCategories(true)
    setError(null)
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(
          data.map((cat: any) => ({
            id: cat.slug,
            name: cat.name,
          }))
        )
      } else {
        setError('Error loading categories')
      }
    } catch (err) {
      setError('Network error loading categories')
      console.error('Error fetching categories:', err)
    } finally {
      setIsLoadingCategories(false)
    }
  }, [categories.length])

  const fetchBrands = useCallback(async () => {
    if (brands.length > 0) return // Already loaded

    setIsLoadingBrands(true)
    try {
      const response = await fetch('/api/products?limit=1000')
      if (response.ok) {
        const data = await response.json()
        const uniqueBrands = Array.from(
          new Set(data.products.map((item: any) => item.brand))
        )
          .filter(Boolean)
          .map((brand: string) => ({ id: brand, name: brand }))
        setBrands(uniqueBrands)
      }
    } catch (err) {
      console.error('Error fetching brands:', err)
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
      refreshData()
    }
  }, [hasLoaded, refreshData])

  return (
    <SharedDataContext.Provider
      value={{
        categories,
        brands,
        isLoadingCategories,
        isLoadingBrands,
        error,
        refreshData,
      }}
    >
      {children}
    </SharedDataContext.Provider>
  )
}

export function useSharedData() {
  const context = useContext(SharedDataContext)
  if (!context) {
    throw new Error('useSharedData must be used within a SharedDataProvider')
  }
  return context
}
