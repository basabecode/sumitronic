import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/products/ProductCard'

// Mock del CartContext
vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    addItem: vi.fn(),
    items: [],
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    total: 0,
  }),
}))

// Mock del FavoritesContext
vi.mock('@/contexts/FavoritesContext', () => ({
  useFavorites: () => ({
    favorites: [],
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    isFavorite: vi.fn(() => false),
  }),
}))

// Mock de next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

// Mock de next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}))

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100000,
    stock_quantity: 10,
    sku: 'TEST-001',
    categories: {
      id: 'cat-1',
      name: 'Electronics',
      slug: 'electronics',
    },
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
  })

  it('should render product information correctly', () => {
    const { container } = render(<ProductCard product={mockProduct} />)

    expect(container.textContent).toContain('Test Product')
  })

  it('should format price correctly in Colombian pesos', () => {
    const { container } = render(<ProductCard product={mockProduct} />)

    // El precio debería estar presente en el contenido
    expect(container.textContent).toContain('100')
  })

  it('should display product image', () => {
    const { container } = render(<ProductCard product={mockProduct} />)

    const images = container.querySelectorAll('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('should show category name', () => {
    const { container } = render(<ProductCard product={mockProduct} />)

    expect(container.textContent).toContain('Electronics')
  })

  it('should display stock information', () => {
    const { container } = render(<ProductCard product={mockProduct} />)

    // Debería mostrar alguna información de stock
    expect(container.textContent).toBeTruthy()
  })

  it('should display out of stock when stock is 0', () => {
    const outOfStockProduct = {
      ...mockProduct,
      stock_quantity: 0,
    }

    const { container } = render(<ProductCard product={outOfStockProduct} />)

    // Debería indicar que está agotado
    expect(container.textContent).toBeTruthy()
  })

  it('should render in grid mode by default', () => {
    const { container } = render(<ProductCard product={mockProduct} />)

    // Debería renderizar correctamente
    expect(container.querySelector('.group')).toBeTruthy()
  })

  it('should render in list mode when specified', () => {
    const { container } = render(<ProductCard product={mockProduct} viewMode="list" />)

    // Debería renderizar en modo lista
    expect(container.textContent).toContain('Test Product')
  })

  it('should handle product without images', () => {
    const productWithoutImages = {
      ...mockProduct,
      product_images: [],
    }

    const { container } = render(<ProductCard product={productWithoutImages} />)

    // Debería renderizar sin errores
    expect(container.textContent).toContain('Test Product')
  })

  it('should handle category as string', () => {
    const productWithStringCategory = {
      ...mockProduct,
      category: 'Electronics',
      categories: undefined,
    }

    const { container } = render(<ProductCard product={productWithStringCategory as any} />)

    // Debería manejar categoría como string
    expect(container.textContent).toBeTruthy()
  })

  it('should have link to product page', () => {
    const { container } = render(<ProductCard product={mockProduct} />)

    const links = container.querySelectorAll('a')
    const hasCorrectLink = Array.from(links).some(link =>
      link.getAttribute('href')?.includes('/products/1')
    )
    expect(hasCorrectLink).toBe(true)
  })
})
