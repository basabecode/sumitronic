import { NextRequest, NextResponse } from 'next/server'
import { syncProductsFromSheet } from '@/lib/sync-products'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function getExpectedSecrets() {
  return [process.env.CRON_SECRET, process.env.SYNC_SECRET].filter((value): value is string =>
    Boolean(value)
  )
}

function extractBearerToken(value: string | null) {
  if (!value?.startsWith('Bearer ')) {
    return null
  }

  return value.slice('Bearer '.length).trim() || null
}

function isSecretValid(providedSecret: string | null, expectedSecrets: string[]) {
  return Boolean(providedSecret && expectedSecrets.some(secret => secret === providedSecret))
}

function getRequestSecret(request: NextRequest) {
  // El secreto solo se acepta via headers — nunca via query param
  // (los query params quedan expuestos en logs de Vercel e historial del navegador)
  return (
    request.headers.get('x-sync-secret') ?? extractBearerToken(request.headers.get('authorization'))
  )
}

async function isAdminSession(): Promise<boolean> {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) return false

    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    return profile?.role === 'admin'
  } catch {
    return false
  }
}

async function handleSync(request: NextRequest) {
  const providedSecret = getRequestSecret(request)
  const expectedSecrets = getExpectedSecrets()

  // Autenticación: secreto válido (cron/scripts) O sesión de admin activa
  const authorizedBySecret = isSecretValid(providedSecret, expectedSecrets)
  const authorizedBySession = authorizedBySecret ? false : await isAdminSession()

  if (!authorizedBySecret && !authorizedBySession) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const result = await syncProductsFromSheet()
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  try {
    return await handleSync(request)
  } catch (error) {
    console.error('[sync-products] Error:', error)
    const message = error instanceof Error ? error.message : 'Error interno del servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    return await handleSync(request)
  } catch (error) {
    console.error('[sync-products] Error:', error)
    const message = error instanceof Error ? error.message : 'Error interno del servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
