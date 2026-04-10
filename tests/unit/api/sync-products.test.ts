/**
 * Tests: GET y POST /api/sync-products
 *
 * Foco principal: verificar que el secreto de autorización solo se acepta
 * via headers (x-sync-secret o Authorization: Bearer), NUNCA via query param.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock de la lógica de sincronización para evitar llamadas reales a Google Sheets
vi.mock('@/lib/sync-products', () => ({
  syncProductsFromSheet: vi.fn().mockResolvedValue({
    synced: 10,
    updated: 3,
    errors: 0,
    message: 'Sincronización completada',
  }),
}))

import { GET, POST } from '@/app/api/sync-products/route'

// ─── Fixtures ────────────────────────────────────────────────
const VALID_SECRET = 'cron-secreto-valido-para-tests'

// ─── Helper ──────────────────────────────────────────────────
const makeRequest = (
  method: 'GET' | 'POST',
  headers: Record<string, string> = {},
  queryParams: Record<string, string> = {}
) => {
  const url = new URL(`http://localhost/api/sync-products`)
  Object.entries(queryParams).forEach(([k, v]) => url.searchParams.set(k, v))

  return new NextRequest(url.toString(), { method, headers })
}

// ─── Tests ───────────────────────────────────────────────────
describe('POST /api/sync-products — validación de secreto', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.CRON_SECRET = VALID_SECRET
  })

  afterEach(() => {
    Object.assign(process.env, originalEnv)
    Object.keys(process.env).forEach(key => {
      if (!(key in originalEnv)) delete process.env[key]
    })
  })

  it('devuelve 401 si no se envía ningún secreto', async () => {
    const res = await POST(makeRequest('POST'))

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('devuelve 401 si el secreto en el header es incorrecto', async () => {
    const res = await POST(makeRequest('POST', { 'x-sync-secret': 'secreto-incorrecto' }))

    expect(res.status).toBe(401)
  })

  it('SEGURIDAD: devuelve 401 si el secreto se envía como query param (método eliminado)', async () => {
    // El query param fue removido en la corrección de seguridad.
    // Aunque el secreto sea correcto, enviarlo por query param debe ser rechazado.
    const res = await POST(makeRequest('POST', {}, { secret: VALID_SECRET }))

    expect(res.status).toBe(401)
  })

  it('acepta el secreto via header x-sync-secret', async () => {
    const res = await POST(makeRequest('POST', { 'x-sync-secret': VALID_SECRET }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.synced).toBe(10)
  })

  it('acepta el secreto via Authorization: Bearer', async () => {
    const res = await POST(makeRequest('POST', { authorization: `Bearer ${VALID_SECRET}` }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.synced).toBe(10)
  })

  it('devuelve 500 si no hay CRON_SECRET ni SYNC_SECRET configurados', async () => {
    delete process.env.CRON_SECRET
    delete process.env.SYNC_SECRET

    const res = await POST(makeRequest('POST', { 'x-sync-secret': VALID_SECRET }))

    expect(res.status).toBe(500)
  })
})

describe('GET /api/sync-products — mismas reglas de autorización', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.CRON_SECRET = VALID_SECRET
  })

  afterEach(() => {
    Object.assign(process.env, originalEnv)
    Object.keys(process.env).forEach(key => {
      if (!(key in originalEnv)) delete process.env[key]
    })
  })

  it('devuelve 401 sin secreto', async () => {
    const res = await GET(makeRequest('GET'))
    expect(res.status).toBe(401)
  })

  it('acepta el secreto via x-sync-secret en GET', async () => {
    const res = await GET(makeRequest('GET', { 'x-sync-secret': VALID_SECRET }))
    expect(res.status).toBe(200)
  })

  it('SEGURIDAD: ignora secreto en query param también en GET', async () => {
    const res = await GET(makeRequest('GET', {}, { secret: VALID_SECRET }))
    expect(res.status).toBe(401)
  })
})
