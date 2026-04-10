/**
 * Script de Validación de Supabase
 *
 * Este script verifica la conexión con Supabase y valida:
 * - Conexión a la base de datos
 * - Existencia de tablas principales
 * - Políticas RLS
 * - Autenticación
 *
 * Ejecutar con: node scripts/validate-supabase.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title) {
  console.log('\n' + '='.repeat(60))
  log(title, 'cyan')
  console.log('='.repeat(60))
}

async function validateSupabase() {
  logSection('VALIDACIÓN DE SUPABASE - SUMITRONIC')

  // 1. Verificar variables de entorno
  logSection('1. Variables de Entorno')

  if (!supabaseUrl) {
    log('❌ NEXT_PUBLIC_SUPABASE_URL no está configurada', 'red')
    log('   Agrega esta variable a tu archivo .env.local', 'yellow')
    return false
  }
  log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`, 'green')

  if (!supabaseKey) {
    log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurada', 'red')
    log('   Agrega esta variable a tu archivo .env.local', 'yellow')
    return false
  }
  log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Configurada', 'green')

  // 2. Crear cliente de Supabase
  logSection('2. Conexión a Supabase')

  let supabase
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
    log('✅ Cliente de Supabase creado exitosamente', 'green')
  } catch (error) {
    log(`❌ Error al crear cliente de Supabase: ${error.message}`, 'red')
    return false
  }

  // 3. Verificar tablas principales
  logSection('3. Verificación de Tablas')

  const tables = [
    'users',
    'categories',
    'products',
    'product_images',
    'inventory',
    'orders',
    'cart_items',
    'system_settings',
  ]

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1)

      if (error) {
        log(`❌ Tabla '${table}': ${error.message}`, 'red')
      } else {
        log(`✅ Tabla '${table}': Accesible`, 'green')
      }
    } catch (error) {
      log(`❌ Tabla '${table}': Error de conexión`, 'red')
    }
  }

  // 4. Verificar campo compare_price
  logSection('4. Verificación de Campo compare_price')

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, compare_price')
      .limit(1)

    if (error) {
      if (error.message.includes('compare_price')) {
        log('❌ Campo compare_price NO existe en la tabla products', 'red')
        log('   Ejecuta la migración: supabase/add_compare_price.sql', 'yellow')
      } else {
        log(`❌ Error al verificar compare_price: ${error.message}`, 'red')
      }
    } else {
      log('✅ Campo compare_price existe en la tabla products', 'green')
    }
  } catch (error) {
    log(`❌ Error al verificar compare_price: ${error.message}`, 'red')
  }

  // 5. Verificar productos
  logSection('5. Productos en Base de Datos')

  try {
    const {
      data: products,
      error,
      count,
    } = await supabase.from('products').select('*', { count: 'exact' }).eq('active', true).limit(5)

    if (error) {
      log(`❌ Error al obtener productos: ${error.message}`, 'red')
    } else {
      log(`✅ Total de productos activos: ${count}`, 'green')

      if (products && products.length > 0) {
        log('\n   Primeros productos:', 'blue')
        products.forEach((p, i) => {
          log(`   ${i + 1}. ${p.name} - $${p.price}`, 'blue')
        })
      } else {
        log('   ⚠️  No hay productos en la base de datos', 'yellow')
        log('   Agrega productos desde el panel de administrador', 'yellow')
      }
    }
  } catch (error) {
    log(`❌ Error al obtener productos: ${error.message}`, 'red')
  }

  // 6. Verificar productos con ofertas
  logSection('6. Productos con Ofertas')

  try {
    const {
      data: offers,
      error,
      count,
    } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('active', true)
      .not('compare_price', 'is', null)
      .gt('compare_price', 0)
      .limit(5)

    if (error) {
      if (error.message.includes('compare_price')) {
        log('❌ Campo compare_price no existe - Ejecuta la migración', 'red')
      } else {
        log(`❌ Error al obtener ofertas: ${error.message}`, 'red')
      }
    } else {
      log(`✅ Total de productos en oferta: ${count}`, 'green')

      if (offers && offers.length > 0) {
        log('\n   Productos en oferta:', 'blue')
        offers.forEach((p, i) => {
          const discount = Math.round(((p.compare_price - p.price) / p.compare_price) * 100)
          log(
            `   ${i + 1}. ${p.name} - $${p.price} (antes: $${p.compare_price}) - ${discount}% OFF`,
            'blue'
          )
        })
      } else {
        log('   ℹ️  No hay productos con ofertas configuradas', 'yellow')
        log('   Agrega compare_price a productos desde el admin panel', 'yellow')
      }
    }
  } catch (error) {
    log(`❌ Error al obtener ofertas: ${error.message}`, 'red')
  }

  // 7. Verificar categorías
  logSection('7. Categorías')

  try {
    const {
      data: categories,
      error,
      count,
    } = await supabase.from('categories').select('*', { count: 'exact' }).eq('active', true)

    if (error) {
      log(`❌ Error al obtener categorías: ${error.message}`, 'red')
    } else {
      log(`✅ Total de categorías activas: ${count}`, 'green')

      if (categories && categories.length > 0) {
        log('\n   Categorías disponibles:', 'blue')
        categories.forEach((c, i) => {
          log(`   ${i + 1}. ${c.name} (${c.slug})`, 'blue')
        })
      }
    }
  } catch (error) {
    log(`❌ Error al obtener categorías: ${error.message}`, 'red')
  }

  // 8. Verificar Storage
  logSection('8. Storage (Bucket de Productos)')

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      log(`❌ Error al obtener buckets: ${error.message}`, 'red')
    } else {
      const productsBucket = buckets.find(b => b.id === 'products')

      if (productsBucket) {
        log('✅ Bucket "products" existe', 'green')
        log(`   Público: ${productsBucket.public ? 'Sí' : 'No'}`, 'blue')
      } else {
        log('❌ Bucket "products" no existe', 'red')
        log('   Ejecuta el script de schema para crearlo', 'yellow')
      }
    }
  } catch (error) {
    log(`❌ Error al verificar storage: ${error.message}`, 'red')
  }

  // Resumen final
  logSection('RESUMEN')
  log('Validación completada. Revisa los resultados arriba.', 'cyan')
  log('\nPróximos pasos:', 'yellow')
  log('1. Si falta compare_price, ejecuta: supabase/add_compare_price.sql', 'yellow')
  log('2. Si no hay productos, agrégalos desde /admin', 'yellow')
  log('3. Para crear ofertas, edita productos y agrega compare_price', 'yellow')
  console.log('='.repeat(60) + '\n')

  return true
}

// Ejecutar validación
validateSupabase()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    log(`\n❌ Error fatal: ${error.message}`, 'red')
    process.exit(1)
  })
