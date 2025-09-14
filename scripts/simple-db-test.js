/**
 * ===================================================
 * CAPISHOP - STANDALONE DATABASE TESTER
 * ===================================================
 * Version standalone que no requiere tsx o dotenv externos
 */

const { readFileSync } = require('fs')
const path = require('path')

// Cargar variables de entorno manualmente
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '../.env.local')
    const envContent = readFileSync(envPath, 'utf-8')

    const envVars = {}
    envContent.split('\n').forEach(line => {
      line = line.trim()
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=')
        const value = valueParts.join('=')
        envVars[key] = value
        process.env[key] = value
      }
    })

    return envVars
  } catch (error) {
    console.error('❌ Error cargando .env.local:', error.message)
    return {}
  }
}

// Cargar variables
const envVars = loadEnvFile()
console.log('📝 Variables cargadas:', Object.keys(envVars))

// Importar supabase después de cargar variables
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  console.log('🔍 Variables encontradas:')
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET')
  console.log(
    '  NEXT_PUBLIC_SUPABASE_ANON_KEY:',
    supabaseKey ? 'SET' : 'NOT SET'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ===================================
// TESTER SIMPLE
// ===================================
async function runSimpleTest() {
  console.log('🚀 CAPISHOP - SIMPLE DATABASE TEST')
  console.log('=' + '='.repeat(50))
  console.log('🔗 Supabase URL:', supabaseUrl.substring(0, 30) + '...')
  console.log('🔑 Supabase Key:', supabaseKey.substring(0, 20) + '...')

  // Test 1: Conexión básica
  console.log('\n🔍 Test 1: Conexión básica...')
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1)

    if (error) {
      console.log('❌ Error de conexión:', error.message)

      if (error.message.includes('infinite recursion')) {
        console.log(
          '\n🚨 PROBLEMA DETECTADO: Recursión infinita en políticas RLS'
        )
        console.log('💡 SOLUCIÓN REQUERIDA:')
        console.log(
          '1. Abre tu panel de Supabase: https://supabase.com/dashboard'
        )
        console.log('2. Ve a SQL Editor')
        console.log('3. Ejecuta el archivo: supabase/fix-rls-policies.sql')
        console.log('4. Reinicia la aplicación Next.js')
        return false
      }

      return false
    } else {
      console.log('✅ Connexión básica: OK')
    }
  } catch (error) {
    console.log('❌ Error de red:', error.message)
    return false
  }

  // Test 2: Listar categorías
  console.log('\n🔍 Test 2: Acceso a categorías...')
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, active')
      .limit(5)

    if (error) {
      console.log('❌ Error accediendo a categorías:', error.message)
      return false
    } else {
      console.log(
        `✅ Acceso a categorías: OK (${categories.length} encontradas)`
      )
      if (categories.length > 0) {
        console.log('   📋 Categorías encontradas:')
        categories.forEach(cat => {
          console.log(
            `     - ${cat.name} (${cat.active ? 'activa' : 'inactiva'})`
          )
        })
      }
    }
  } catch (error) {
    console.log('❌ Error en categorías:', error.message)
    return false
  }

  // Test 3: Listar productos
  console.log('\n🔍 Test 3: Acceso a productos...')
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, active')
      .limit(5)

    if (error) {
      console.log('❌ Error accediendo a productos:', error.message)
      return false
    } else {
      console.log(`✅ Acceso a productos: OK (${products.length} encontrados)`)
      if (products.length > 0) {
        console.log('   📋 Productos encontrados:')
        products.forEach(prod => {
          console.log(
            `     - ${prod.name}: $${prod.price} (${
              prod.active ? 'activo' : 'inactivo'
            })`
          )
        })
      }
    }
  } catch (error) {
    console.log('❌ Error en productos:', error.message)
    return false
  }

  // Test 4: Relaciones
  console.log('\n🔍 Test 4: Relaciones productos-categorías...')
  try {
    const { data: productsWithCats, error } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        categories (
          name
        )
      `
      )
      .limit(3)

    if (error) {
      console.log('❌ Error en relaciones:', error.message)
      return false
    } else {
      console.log(
        `✅ Relaciones: OK (${productsWithCats.length} productos con categoría)`
      )
      if (productsWithCats.length > 0) {
        console.log('   📋 Relaciones encontradas:')
        productsWithCats.forEach(prod => {
          const categoryName = prod.categories
            ? prod.categories.name
            : 'Sin categoría'
          console.log(`     - ${prod.name} → ${categoryName}`)
        })
      }
    }
  } catch (error) {
    console.log('❌ Error en relaciones:', error.message)
    return false
  }

  console.log('\n🟢 TODOS LOS TESTS PASARON')
  console.log('=' + '='.repeat(50))
  console.log('💡 La base de datos está funcionando correctamente')
  console.log('🌐 Ahora puedes probar la aplicación en: http://localhost:3004')

  return true
}

// Ejecutar test
runSimpleTest().catch(error => {
  console.error('\n❌ ERROR CRÍTICO:', error.message)
  process.exit(1)
})
