#!/usr/bin/env node

/**
 * Script de Validación de Supabase (Sin dependencias externas)
 *
 * Ejecutar con: node scripts/test-supabase-connection.js
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// Leer variables de entorno desde .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local')

  if (!fs.existsSync(envPath)) {
    return {}
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}

  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      env[key] = value
    }
  })

  return env
}

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
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

// Hacer petición HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
          })
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
          })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.end()
  })
}

async function validateSupabase() {
  logSection('VALIDACIÓN DE CONEXIÓN A SUPABASE - SUMITRONIC')

  // 1. Cargar variables de entorno
  const env = loadEnvFile()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 2. Verificar variables de entorno
  logSection('1. Variables de Entorno')

  if (!supabaseUrl) {
    log('❌ NEXT_PUBLIC_SUPABASE_URL no está configurada en .env.local', 'red')
    log('', 'yellow')
    log('Pasos para configurar:', 'yellow')
    log('1. Ve a https://supabase.com/dashboard', 'yellow')
    log('2. Selecciona tu proyecto', 'yellow')
    log('3. Ve a Settings > API', 'yellow')
    log('4. Copia la URL del proyecto y la clave anon/public', 'yellow')
    log('5. Agrégalas a .env.local:', 'yellow')
    log('   NEXT_PUBLIC_SUPABASE_URL=tu-url-aqui', 'yellow')
    log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-aqui', 'yellow')
    return false
  }
  log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`, 'green')

  if (!supabaseKey) {
    log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurada en .env.local', 'red')
    return false
  }
  log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Configurada (oculta por seguridad)', 'green')

  // 3. Probar conexión básica
  logSection('2. Prueba de Conexión')

  try {
    const testUrl = `${supabaseUrl}/rest/v1/`
    const response = await makeRequest(testUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    })

    if (response.status === 200 || response.status === 404) {
      log('✅ Conexión a Supabase exitosa', 'green')
    } else {
      log(`⚠️  Respuesta inesperada: ${response.status}`, 'yellow')
    }
  } catch (error) {
    log(`❌ Error de conexión: ${error.message}`, 'red')
    log('   Verifica que la URL de Supabase sea correcta', 'yellow')
    return false
  }

  // 4. Verificar tabla de productos
  logSection('3. Verificación de Tabla de Productos')

  try {
    const productsUrl = `${supabaseUrl}/rest/v1/products?select=id,name,price&limit=1`
    const response = await makeRequest(productsUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 200) {
      log('✅ Tabla "products" es accesible', 'green')

      if (response.data && response.data.length > 0) {
        log(`   Productos encontrados: ${response.data.length}`, 'green')
      } else {
        log('   ℹ️  La tabla está vacía - agrega productos desde /admin', 'yellow')
      }
    } else if (response.status === 401) {
      log('❌ Error de autenticación - verifica tu ANON_KEY', 'red')
    } else if (response.status === 404) {
      log('❌ Tabla "products" no existe', 'red')
      log('   Ejecuta el script: supabase/schema.sql', 'yellow')
    } else {
      log(`⚠️  Respuesta inesperada: ${response.status}`, 'yellow')
    }
  } catch (error) {
    log(`❌ Error al verificar productos: ${error.message}`, 'red')
  }

  // 5. Verificar tabla de categorías
  logSection('4. Verificación de Tabla de Categorías')

  try {
    const categoriesUrl = `${supabaseUrl}/rest/v1/categories?select=id,name&limit=5`
    const response = await makeRequest(categoriesUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 200) {
      log('✅ Tabla "categories" es accesible', 'green')

      if (response.data && response.data.length > 0) {
        log(`   Categorías encontradas: ${response.data.length}`, 'green')
      }
    } else if (response.status === 404) {
      log('❌ Tabla "categories" no existe', 'red')
      log('   Ejecuta el script: supabase/schema.sql', 'yellow')
    }
  } catch (error) {
    log(`❌ Error al verificar categorías: ${error.message}`, 'red')
  }

  // Resumen final
  logSection('RESUMEN')
  log('✅ Validación básica completada', 'green')
  log('', 'cyan')
  log('Próximos pasos:', 'yellow')
  log('1. Si las tablas no existen, ejecuta supabase/schema.sql en Supabase SQL Editor', 'yellow')
  log('2. Para agregar soporte de ofertas, ejecuta supabase/add_compare_price.sql', 'yellow')
  log('3. Accede a /admin para agregar productos', 'yellow')
  log('4. Revisa docs/SECURITY_AUDIT.md para más detalles', 'yellow')
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
    console.error(error)
    process.exit(1)
  })
