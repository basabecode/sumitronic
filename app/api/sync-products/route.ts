import { NextRequest, NextResponse } from 'next/server'
import { syncProductsFromSheet } from '@/lib/sync-products'

function getExpectedSecrets() {
  const secrets = [
    process.env.CRON_SECRET,
    process.env.SYNC_SECRET,
  ].filter((value): value is string => Boolean(value))

  if (secrets.length === 0) {
    throw new Error(
      'Missing required environment variable: CRON_SECRET or SYNC_SECRET'
    )
  }

  return secrets
}

function extractBearerToken(value: string | null) {
  if (!value?.startsWith('Bearer ')) {
    return null
  }

  return value.slice('Bearer '.length).trim() || null
}

function isAuthorized(providedSecret: string | null, expectedSecrets: string[]) {
  return Boolean(
    providedSecret && expectedSecrets.some(secret => secret === providedSecret)
  )
}

function getRequestSecret(request: NextRequest) {
  return (
    request.headers.get('x-sync-secret') ??
    extractBearerToken(request.headers.get('authorization')) ??
    request.nextUrl.searchParams.get('secret')
  )
}

export async function POST(request: NextRequest) {
  try {
    const expectedSecrets = getExpectedSecrets()
    const providedSecret = getRequestSecret(request)

    if (!isAuthorized(providedSecret, expectedSecrets)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await syncProductsFromSheet()
    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error interno del servidor'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const expectedSecrets = getExpectedSecrets()
    const providedSecret = getRequestSecret(request)

    if (!isAuthorized(providedSecret, expectedSecrets)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await syncProductsFromSheet()
    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error interno del servidor'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
