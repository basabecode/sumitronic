import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Cargar variables de entorno manualmente (parseo simple)
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
  const fileContent = fs.readFileSync(envLocalPath, 'utf8')
  fileContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').replace(/^["']|["']$/g, '') // Remover comillas simples
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Opcional, para validación profunda

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '❌ Error: Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
  process.exit(1)
}

// Usar Service Key si existe para saltar RLS, sino Anon Key
const supabase = createClient(supabaseUrl, serviceKey || supabaseKey)

const TABLES_TO_CHECK = [
  { name: 'users', required: true, description: 'Registro de usuarios y roles' },
  { name: 'products', required: true, description: 'Catálogo de productos' },
  { name: 'categories', required: true, description: 'Categorización de productos' },
  { name: 'favorites', required: true, description: 'Lista de deseos/favoritos' },
  { name: 'carts', required: true, description: 'Carritos de compra activos' },
  { name: 'cart_items', required: true, description: 'Items dentro de carritos' },
  { name: 'orders', required: true, description: 'Registro de ventas/pedidos' },
  { name: 'inventory', required: false, description: 'Control de stock avanzado' },
  { name: 'product_images', required: false, description: 'Imágenes adicionales' },
  {
    name: 'product_variants',
    required: false,
    description: 'Variantes de productos (talla/color)',
  },
]

async function validateSchema() {
  console.log('🔍 Iniciando validación de esquema de Base de Datos...\n')

  const results = []
  let allCriticalPassed = true

  for (const table of TABLES_TO_CHECK) {
    try {
      // Intentamos seleccionar 1 fila para verificar existencia y permisos
      const { data, error } = await supabase.from(table.name).select('*').limit(1)

      if (error) {
        // Ignoramos error de permisos (403, 401) si solo estamos verificando existencia
        // Pero code '42P01' es "undefined_table" (no existe)
        if (error.code === '42P01') {
          results.push({ ...table, status: '❌ NO EXISTE', detail: 'Tabla no encontrada en la BD' })
          if (table.required) allCriticalPassed = false
        } else {
          results.push({
            ...table,
            status: '⚠️ ACCESO RESTRINGIDO',
            detail: `Existe, pero error: ${error.message}`,
          })
          // Se considera "Pasada" en cuanto a existencia estructural, aunque RLS bloquee
        }
      } else {
        results.push({ ...table, status: '✅ OK', detail: 'Tabla accesible y operativa' })
      }
    } catch (e) {
      results.push({ ...table, status: '❌ ERROR CRÍTICO', detail: String(e) })
      if (table.required) allCriticalPassed = false
    }
  }

  console.table(
    results.map(r => ({
      Tabla: r.name,
      Estado: r.status,
      'Requerido Para': r.description,
      Detalle: r.detail,
    }))
  )

  console.log('\n-----------------------------------')
  if (allCriticalPassed) {
    console.log(
      '🎉 RESULTADO: La estructura de la Base de Datos PARECE COMPLETA y cumple con los requerimientos funcionales principales.'
    )
    console.log('   (Nota: Tablas con "Acceso Restringido" es normal si RLS está activo y seguro).')
  } else {
    console.log('⚠️ RESULTADO: Faltan tablas críticas para el funcionamiento del sistema.')
  }
}

validateSchema()
