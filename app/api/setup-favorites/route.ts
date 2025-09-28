import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Not allowed in production' },
        { status: 403 }
      )
    }

    // Leer las variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error:
            'Missing Supabase configuration. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local',
        },
        { status: 500 }
      )
    }

    // Crear cliente con service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Leer el archivo SQL
    const sqlFilePath = join(process.cwd(), 'supabase', 'favorites_schema.sql')
    const sql = readFileSync(sqlFilePath, 'utf8')

    // Ejecutar el SQL
    const { data, error } = await supabase.rpc('exec', { query: sql })

    if (error) {
      console.error('Error executing SQL:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Favorites schema executed successfully',
      data,
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
