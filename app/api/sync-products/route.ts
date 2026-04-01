import { NextRequest, NextResponse } from 'next/server'
import { syncProductsFromSheet } from '@/lib/sync-products'

function getSyncSecret() {
  const syncSecret = process.env.SYNC_SECRET

  if (!syncSecret) {
    throw new Error('Missing required environment variable: SYNC_SECRET')
  }

  return syncSecret
}

function isAuthorized(secret: string | null, expectedSecret: string) {
  return Boolean(secret && secret === expectedSecret)
}

export async function POST(request: NextRequest) {
  try {
    const syncSecret = getSyncSecret()
    const providedSecret = request.headers.get('x-sync-secret')

    if (!isAuthorized(providedSecret, syncSecret)) {
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
    const syncSecret = getSyncSecret()
    const providedSecret = request.nextUrl.searchParams.get('secret')

    if (!isAuthorized(providedSecret, syncSecret)) {
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
