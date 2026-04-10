/**
 * Tests: POST /api/orders y GET /api/orders
 *
 * Foco principal: verificar que el servidor NUNCA usa precios enviados
 * por el cliente — siempre consulta la DB y recalcula los totales.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ─── Mocks — vi.hoisted() garantiza que las variables estén disponibles
//     cuando vi.mock() (que se hoisea) ejecuta sus factories ────────────
const { mockCreateClient, mockCreateAdminClient, mockRatelimitLimit } = vi.hoisted(() => ({
  mockCreateClient: vi.fn(),
  mockCreateAdminClient: vi.fn(),
  mockRatelimitLimit: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: mockCreateClient,
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: mockCreateAdminClient,
}))

vi.mock('@/lib/ratelimit', () => ({
  ratelimit: { limit: mockRatelimitLimit },
}))

// Evita llamadas HTTP reales al endpoint notify-order
global.fetch = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))

import { GET, POST } from '@/app/api/orders/route'

// ─── Fixtures ────────────────────────────────────────────────
const MOCK_USER = { id: 'user-abc-123', email: 'cliente@sumitronic.co' }

const MOCK_DB_PRODUCT = {
  id: 'prod-cam-001',
  name: 'Cámara Hikvision DS-2CD2143G2-I 4MP',
  price: 350_000, // precio real en la DB (COP)
  stock_quantity: 10,
}

// ─── Helpers ─────────────────────────────────────────────────
const makePostRequest = (body: object) =>
  new NextRequest('http://localhost/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

function setupServerClient(user: typeof MOCK_USER | null = MOCK_USER, extraFrom = {}) {
  mockCreateClient.mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: user ? null : 'No session' }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      ...extraFrom,
    }),
  })
}

function setupAdminClient(products: (typeof MOCK_DB_PRODUCT)[], insertResult: object) {
  const mockOrdersInsert = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: insertResult, error: null }),
    }),
  })

  mockCreateAdminClient.mockReturnValue({
    from: vi.fn((table: string) => {
      if (table === 'products') {
        return {
          select: vi.fn().mockReturnThis(),
          in: vi.fn().mockResolvedValue({ data: products, error: null }),
        }
      }
      return { insert: mockOrdersInsert }
    }),
  })

  return { mockOrdersInsert }
}

// ─── GET /api/orders ─────────────────────────────────────────
describe('GET /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRatelimitLimit.mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: 0 })
  })

  it('devuelve 401 si el usuario no está autenticado', async () => {
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: 'No session' }),
      },
    })

    const res = await GET(new NextRequest('http://localhost/api/orders', { method: 'GET' }))

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('No autorizado')
  })

  it('devuelve las órdenes del usuario autenticado', async () => {
    const mockOrders = [
      { id: 'order-001', total: 350_000, status: 'pending', created_at: '2026-04-10' },
    ]
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: MOCK_USER }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockOrders, error: null }),
      }),
    })

    const res = await GET(new NextRequest('http://localhost/api/orders', { method: 'GET' }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].id).toBe('order-001')
  })
})

// ─── POST /api/orders ────────────────────────────────────────
describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRatelimitLimit.mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: 0 })
    setupServerClient()
    global.fetch = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
  })

  it('devuelve 400 si el array de items está vacío', async () => {
    const res = await POST(makePostRequest({ items: [] }))

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/producto/i)
  })

  it('devuelve 400 si un item no tiene product_id', async () => {
    const res = await POST(
      makePostRequest({
        items: [{ quantity: 2 }], // product_id ausente
      })
    )

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/product_id/i)
  })

  it('devuelve 400 si el producto no existe en la base de datos', async () => {
    mockCreateAdminClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'products') {
          return {
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockResolvedValue({ data: [], error: null }), // vacío: no encontrado
          }
        }
        return {}
      }),
    })

    const res = await POST(
      makePostRequest({
        items: [{ product_id: 'prod-inexistente', quantity: 1, price: 100 }],
      })
    )

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/no encontrado/i)
  })

  it('SEGURIDAD: usa precio de la DB, nunca el precio manipulado por el cliente', async () => {
    const CANTIDAD = 2
    const PRECIO_REAL_DB = MOCK_DB_PRODUCT.price // $350,000 COP (real)
    const PRECIO_FRAUDULENTO = 1 // cliente intenta pagar $1
    const SUBTOTAL_ESPERADO = PRECIO_REAL_DB * CANTIDAD // $700,000 COP

    const { mockOrdersInsert } = setupAdminClient([MOCK_DB_PRODUCT], {
      id: 'order-new',
      subtotal: SUBTOTAL_ESPERADO,
      total: SUBTOTAL_ESPERADO,
      status: 'pending',
    })

    const res = await POST(
      makePostRequest({
        items: [
          {
            product_id: MOCK_DB_PRODUCT.id,
            quantity: CANTIDAD,
            price: PRECIO_FRAUDULENTO, // precio manipulado — el servidor debe ignorarlo
            name: 'Producto hackeado', // nombre manipulado — el servidor debe ignorarlo
          },
        ],
        shipping: 0,
      })
    )

    expect(res.status).toBe(201)

    // El insert debe haberse llamado con el precio REAL de la DB
    expect(mockOrdersInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        subtotal: SUBTOTAL_ESPERADO,
        total: SUBTOTAL_ESPERADO,
        items: expect.arrayContaining([
          expect.objectContaining({
            price: PRECIO_REAL_DB, // precio de la DB, no el del cliente
            name: MOCK_DB_PRODUCT.name, // nombre de la DB, no el del cliente
            quantity: CANTIDAD,
          }),
        ]),
      })
    )
  })

  it('incluye el costo de envío en el total calculado server-side', async () => {
    const SHIPPING = 15_000

    const { mockOrdersInsert } = setupAdminClient([MOCK_DB_PRODUCT], {
      id: 'order-ship',
      total: MOCK_DB_PRODUCT.price + SHIPPING,
      status: 'pending',
    })

    await POST(
      makePostRequest({
        items: [{ product_id: MOCK_DB_PRODUCT.id, quantity: 1 }],
        shipping: SHIPPING,
      })
    )

    expect(mockOrdersInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        subtotal: MOCK_DB_PRODUCT.price,
        shipping: SHIPPING,
        total: MOCK_DB_PRODUCT.price + SHIPPING,
      })
    )
  })

  it('permite órdenes de invitados (guest checkout) sin usuario autenticado', async () => {
    setupServerClient(null) // sin usuario
    setupAdminClient([MOCK_DB_PRODUCT], {
      id: 'order-guest',
      total: MOCK_DB_PRODUCT.price,
      status: 'pending',
    })

    const res = await POST(
      makePostRequest({
        items: [{ product_id: MOCK_DB_PRODUCT.id, quantity: 1 }],
        customer_info: { fullName: 'Invitado', email: 'guest@test.co', phone: '3001234567' },
        shipping: 0,
      })
    )

    expect(res.status).toBe(201)
  })

  it('devuelve 429 cuando se supera el rate limit', async () => {
    mockRatelimitLimit.mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now(),
    })

    const res = await POST(
      makePostRequest({
        items: [{ product_id: MOCK_DB_PRODUCT.id, quantity: 1 }],
      })
    )

    expect(res.status).toBe(429)
  })
})
