'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Product } from '../types'

const ITEMS_PER_PAGE = 50

export interface DashboardStats {
  totalProducts: number
  inStock: number
  outOfStock: number
  featured: number
}

export function useAdminProducts() {
  const supabase = createClient()

  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    featured: 0,
  })
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    product: Product | null
  }>({ open: false, product: null })

  // Debounce search
  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery) setIsSearching(true)
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, debouncedSearchQuery])

  // Reset page on filter change
  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1)
  }, [debouncedSearchQuery, categoryFilter])

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      let query = supabase
        .from('products')
        .select(
          `*,
          category:categories!category_id (id, name, slug),
          product_images (id, image_url, alt_text, is_primary, sort_order),
          inventory (id, quantity_available, reserved_quantity, last_updated)`,
          { count: 'exact' }
        )
        .eq('active', true)

      if (debouncedSearchQuery.trim()) {
        query = query.or(
          `name.ilike.%${debouncedSearchQuery}%,brand.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`
        )
      }

      // Fix: filter by category_id, not by joined table name
      if (categoryFilter !== 'all') {
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categoryFilter)
          .single()

        if (catData) {
          query = query.eq('category_id', catData.id)
        }
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, from + ITEMS_PER_PAGE - 1)

      if (error) {
        console.error('Error fetching products:', error)
        toast.error('Error al cargar los productos')
        return
      }

      setProducts(data ?? [])
      setTotalProducts(count ?? 0)
      setTotalPages(Math.ceil((count ?? 0) / ITEMS_PER_PAGE))
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error al cargar los productos')
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const [totalRes, inStockRes, outOfStockRes, featuredRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true).gt('stock_quantity', 0),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true).eq('stock_quantity', 0),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true).eq('featured', true),
      ])

      setDashboardStats({
        totalProducts: totalRes.count ?? 0,
        inStock: inStockRes.count ?? 0,
        outOfStock: outOfStockRes.count ?? 0,
        featured: featuredRes.count ?? 0,
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ active: false })
        .eq('id', product.id)

      if (error) {
        console.error('Error deleting product:', error)
        toast.error('Error al eliminar el producto')
        return
      }

      setProducts(prev => prev.filter(p => p.id !== product.id))
      setDeleteDialog({ open: false, product: null })
      toast.success('Producto eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error al eliminar el producto')
    }
  }

  return {
    products,
    loadingProducts,
    isSearching,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    categoryFilter,
    setCategoryFilter,
    currentPage,
    setCurrentPage,
    totalProducts,
    totalPages,
    dashboardStats,
    deleteDialog,
    setDeleteDialog,
    fetchProducts,
    fetchDashboardStats,
    handleDeleteProduct,
  }
}
