/**
 * Tests: POST /api/notify-order
 *
 * Foco principal: verificar que el endpoint solo acepta llamadas
 * del servidor interno mediante x-internal-secret.
 * Cualquier acceso externo debe recibir 401 o 503.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock fetch global para evitar llamadas reales a Resend
global.fetch = vi.fn()

import { POST } from '@/app/api/notify-order/route'

// ─── Fixtures ────────────────────────────────────────────────
const VALID_SECRET = 'super-secreto-interno-de-prueba-64chars'

const MOCK_ORDER = {
  id: 'order-abc-123',
  total: 700_000,
  customer_info: {
    fullName: 'Carlos Gómez',
    email: 'carlos@test.co',
    phone: '3001234567',
  },
  items: [{ name: 'Cámara Hikvision', quantity: 2, price: 350_000 }],
  payment_method: 'transferencia',
  shipping_address: {
    address: 'Calle 100 #15-20',
    city: 'Bogotá',
    department: 'Cundinamarca',
  },
}

// ─── Helper ──────────────────────────────────────────────────
const makeRequest = (body: object, headers: Record<string, string> = {}) =>
  new NextRequest('http://localhost/api/notify-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })

// ─── Tests ───────────────────────────────────────────────────
describe('POST /api/notify-order', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restaurar variables de entorno
    Object.assign(process.env, originalEnv)
    Object.keys(process.env).forEach(key => {
      if (!(key in originalEnv)) delete process.env[key]
    })
  })

  it('devuelve 503 si NOTIFY_ORDER_SECRET no está configurado', async () => {
    delete process.env.NOTIFY_ORDER_SECRET

    const res = await POST(makeRequest({ order: MOCK_ORDER }))

    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.error).toMatch(/no disponible/i)
  })

  it('devuelve 401 si no se envía el header x-internal-secret', async () => {
    process.env.NOTIFY_ORDER_SECRET = VALID_SECRET

    const res = await POST(makeRequest({ order: MOCK_ORDER }))
    // Sin header — debe rechazar

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/autorizado/i)
  })

  it('devuelve 401 si el secreto en el header es incorrecto', async () => {
    process.env.NOTIFY_ORDER_SECRET = VALID_SECRET

    const res = await POST(
      makeRequest({ order: MOCK_ORDER }, { 'x-internal-secret': 'secreto-incorrecto' })
    )

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/autorizado/i)
  })

  it('devuelve 400 si se envía el secreto correcto pero falta la orden', async () => {
    process.env.NOTIFY_ORDER_SECRET = VALID_SECRET

    const res = await POST(
      makeRequest({}, { 'x-internal-secret': VALID_SECRET }) // sin order
    )

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/orden/i)
  })

  it('retorna ok=true y skipped=true si no hay RESEND_API_KEY configurada', async () => {
    process.env.NOTIFY_ORDER_SECRET = VALID_SECRET
    delete process.env.RESEND_API_KEY

    const res = await POST(
      makeRequest({ order: MOCK_ORDER }, { 'x-internal-secret': VALID_SECRET })
    )

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.skipped).toBe(true)
  })

  it('llama a la API de Resend cuando hay RESEND_API_KEY y secreto válido', async () => {
    process.env.NOTIFY_ORDER_SECRET = VALID_SECRET
    process.env.RESEND_API_KEY = 're_test_key_123'
    process.env.ADMIN_NOTIFICATION_EMAIL = 'admin@sumitronic.co'
    process.env.RESEND_FROM_EMAIL = 'notificaciones@sumitronic.co'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'email-001' }), { status: 200 })
    )

    const res = await POST(
      makeRequest({ order: MOCK_ORDER }, { 'x-internal-secret': VALID_SECRET })
    )

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.skipped).toBeUndefined()

    // Verificar que se llamó a la API de Resend
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer re_test_key_123',
        }),
      })
    )
  })

  it('retorna ok=true aunque falle Resend (best-effort, no bloquea el flujo)', async () => {
    process.env.NOTIFY_ORDER_SECRET = VALID_SECRET
    process.env.RESEND_API_KEY = 're_test_key_123'
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response('Service Unavailable', { status: 503 })
    )

    const res = await POST(
      makeRequest({ order: MOCK_ORDER }, { 'x-internal-secret': VALID_SECRET })
    )

    // No debe romper el flujo de compra por un fallo de notificación
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
  })
})
