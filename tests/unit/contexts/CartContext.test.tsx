import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { CartProvider, useCart } from '@/contexts/CartContext'
import { ReactNode } from 'react'

// Mock de AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}))

// Mock de Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: [],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: null,
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: null,
          error: null,
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: null,
          error: null,
        })),
      })),
    })),
  }),
}))

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('CartContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  )

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100000,
    stock_quantity: 10,
    sku: 'TEST-001',
    product_images: [
      {
        id: 'img-1',
        image_url: 'https://example.com/image.jpg',
        alt_text: 'Test Image',
        is_primary: true,
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.state.items).toEqual([])
    expect(result.current.state.total).toBe(0)
    expect(result.current.state.itemCount).toBe(0)
  })

  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    await waitFor(() => {
      expect(result.current.state.items.length).toBeGreaterThan(0)
    })

    expect(result.current.state.items[0].id).toBe('1')
    expect(result.current.state.items[0].quantity).toBe(1)
  })

  it('should increase quantity when adding existing item', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    await waitFor(() => {
      expect(result.current.state.items.length).toBe(1)
    })

    act(() => {
      result.current.addItem({ ...mockProduct, quantity: 2 })
    })

    await waitFor(() => {
      expect(result.current.state.items[0].quantity).toBeGreaterThan(1)
    })
  })

  it('should calculate total correctly', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem({ ...mockProduct, quantity: 2 })
    })

    await waitFor(() => {
      expect(result.current.state.total).toBeGreaterThan(0)
    })
  })

  it('should remove item from cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    await waitFor(() => {
      expect(result.current.state.items.length).toBe(1)
    })

    act(() => {
      result.current.removeItem('1')
    })

    await waitFor(() => {
      expect(result.current.state.items.length).toBe(0)
    })
  })

  it('should update item quantity', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    await waitFor(() => {
      expect(result.current.state.items.length).toBe(1)
    })

    act(() => {
      result.current.updateQuantity('1', 5)
    })

    await waitFor(() => {
      expect(result.current.state.items[0].quantity).toBe(5)
    })
  })

  it('should remove item when quantity is set to 0', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    await waitFor(() => {
      expect(result.current.state.items.length).toBe(1)
    })

    act(() => {
      result.current.updateQuantity('1', 0)
    })

    await waitFor(() => {
      expect(result.current.state.items.length).toBe(0)
    })
  })

  it('should clear cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.addItem({ ...mockProduct, id: '2' })
    })

    await waitFor(() => {
      expect(result.current.state.items.length).toBeGreaterThan(0)
    })

    act(() => {
      result.current.clearCart()
    })

    await waitFor(() => {
      expect(result.current.state.items.length).toBe(0)
      expect(result.current.state.total).toBe(0)
    })
  })

  it('should calculate item count correctly', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem({ ...mockProduct, quantity: 2 })
      result.current.addItem({ ...mockProduct, id: '2', quantity: 3 })
    })

    await waitFor(() => {
      expect(result.current.state.itemCount).toBeGreaterThan(0)
    })
  })

  it('should have formatCurrency function', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    const formatted = result.current.formatCurrency(100000)
    expect(formatted).toBeTruthy()
    expect(typeof formatted).toBe('string')
  })

  it('should toggle cart open/close', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.state.isOpen).toBe(false)

    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.state.isOpen).toBe(true)

    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.state.isOpen).toBe(false)
  })

  it('should open cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.openCart()
    })

    expect(result.current.state.isOpen).toBe(true)
  })

  it('should close cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.openCart()
    })

    expect(result.current.state.isOpen).toBe(true)

    act(() => {
      result.current.closeCart()
    })

    expect(result.current.state.isOpen).toBe(false)
  })
})
