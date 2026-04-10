/**
 * Tests: lib/supabase/middleware.ts — updateSession
 *
 * Verifica que las rutas protegidas redirijan correctamente y que
 * las rutas públicas pasen sin verificación de auth.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// ─── Mock de @supabase/ssr ───────────────────────────────────
const mockGetUser = vi.fn()
const mockFrom = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}))

import { updateSession } from '@/lib/supabase/middleware'

// ─── Fixtures ────────────────────────────────────────────────
const MOCK_CUSTOMER = { id: 'user-customer-123', email: 'cliente@test.co' }
const MOCK_ADMIN = { id: 'user-admin-456', email: 'admin@sumitronic.co' }

const makeRequest = (pathname: string) =>
  new NextRequest(`http://localhost${pathname}`, { method: 'GET' })

// ─── Tests ───────────────────────────────────────────────────
describe('updateSession — rutas públicas', () => {
  // Las rutas públicas no deben llamar a Supabase Auth (optimización de rendimiento)
  it('pasa sin llamar a Auth en la página de inicio (/)', async () => {
    const res = await updateSession(makeRequest('/'))

    // No redirige
    expect(res.status).not.toBe(302)
    // No llamó a getUser (optimización: evita llamada HTTP extra en rutas públicas)
    expect(mockGetUser).not.toHaveBeenCalled()
  })

  it('pasa sin verificar auth en el catálogo de productos', async () => {
    const res = await updateSession(makeRequest('/products'))
    expect(res.status).not.toBe(302)
    expect(mockGetUser).not.toHaveBeenCalled()
  })

  it('pasa sin verificar auth en páginas de marca', async () => {
    const res = await updateSession(makeRequest('/marcas/hikvision'))
    expect(res.status).not.toBe(302)
    expect(mockGetUser).not.toHaveBeenCalled()
  })
})

describe('updateSession — rutas protegidas (requieren auth)', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54329'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  afterEach(() => {
    Object.assign(process.env, originalEnv)
  })

  it('redirige a /auth/login si no hay sesión activa en /profile', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

    const res = await updateSession(makeRequest('/profile'))

    expect(res.status).toBe(307) // redirect
    const location = res.headers.get('location') || ''
    expect(location).toContain('/auth/login')
    expect(location).toContain('redirectTo=%2Fprofile')
  })

  it('redirige a /auth/login si no hay sesión en /orders', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

    const res = await updateSession(makeRequest('/orders'))

    expect(res.status).toBe(307)
    const location = res.headers.get('location') || ''
    expect(location).toContain('/auth/login')
  })

  it('permite el acceso a /profile cuando hay sesión válida', async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_CUSTOMER }, error: null })

    const res = await updateSession(makeRequest('/profile'))

    expect(res.status).not.toBe(307)
  })

  it('permite el acceso a /favorites con sesión válida', async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_CUSTOMER }, error: null })

    const res = await updateSession(makeRequest('/favorites'))

    expect(res.status).not.toBe(307)
  })
})

describe('updateSession — rutas admin (/admin)', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54329'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  afterEach(() => {
    Object.assign(process.env, originalEnv)
  })

  it('redirige a /auth/login si no hay sesión en /admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

    const res = await updateSession(makeRequest('/admin'))

    expect(res.status).toBe(307)
    const location = res.headers.get('location') || ''
    expect(location).toContain('/auth/login')
  })

  it('redirige a / si el usuario autenticado no tiene rol admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_CUSTOMER }, error: null })

    // El perfil del usuario tiene role: 'customer' (no admin)
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { role: 'customer' },
        error: null,
      }),
    })

    const res = await updateSession(makeRequest('/admin'))

    expect(res.status).toBe(307)
    const location = res.headers.get('location') || ''
    expect(location).toContain('/?error=unauthorized')
  })

  it('permite el acceso a /admin con usuario con rol admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_ADMIN }, error: null })

    // El perfil tiene role: 'admin'
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { role: 'admin' },
        error: null,
      }),
    })

    const res = await updateSession(makeRequest('/admin'))

    // Sin redirect
    expect(res.status).not.toBe(307)
  })

  it('redirige a / si el perfil del usuario no existe en la DB', async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_CUSTOMER }, error: null })

    // Sin perfil en la tabla users
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })

    const res = await updateSession(makeRequest('/admin'))

    expect(res.status).toBe(307)
    const location = res.headers.get('location') || ''
    expect(location).toContain('error=unauthorized')
  })
})
