import { NextResponse } from 'next/server'

// Este endpoint fue deshabilitado por seguridad
export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
