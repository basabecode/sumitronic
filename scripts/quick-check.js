#!/usr/bin/env node

/**
 * Script rápido para verificar el estado de Supabase
 * Ejecutar: node scripts/quick-check.js
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// Leer .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local no encontrado')
    return {}
  }

  const content = fs.readFileSync(envPath, 'utf8')
  const env = {}

  content.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '')
    }
  })

  return env
}

async function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, res => {
      let data = ''
      res.on('data', chunk => (data += chunk))
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) })
        } catch {
          resolve({ status: res.statusCode, data })
        }
      })
    })
    req.on('error', reject)
    req.end()
  })
}

async function quickCheck() {
  console.log('\n🔍 VERIFICACIÓN RÁPIDA DE SUPABASE\n')

  const env = loadEnv()
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.log('❌ Credenciales no configuradas en .env.local\n')
    return
  }

  console.log('✅ Credenciales encontradas')
  console.log(`📍 URL: ${url}\n`)

  // Verificar productos
  try {
    const productsUrl = `${url}/rest/v1/products?select=id,name,price,compare_price&active=eq.true&limit=10`
    const res = await makeRequest(productsUrl, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    })

    if (res.status === 200) {
      console.log(`✅ Conexión exitosa`)
      console.log(`📦 Productos encontrados: ${res.data.length}`)

      if (res.data.length > 0) {
        console.log('\n📋 Productos en la base de datos:')
        res.data.forEach((p, i) => {
          const hasOffer = p.compare_price && p.compare_price > p.price
          const offerText = hasOffer
            ? `🎁 OFERTA: $${p.price} (antes: $${p.compare_price})`
            : `$${p.price}`
          console.log(`   ${i + 1}. ${p.name} - ${offerText}`)
        })

        const withOffers = res.data.filter(p => p.compare_price && p.compare_price > p.price)
        console.log(`\n🎁 Productos con ofertas: ${withOffers.length}`)

        if (withOffers.length === 0) {
          console.log('\n⚠️  No hay productos con ofertas configuradas')
          console.log('💡 Para agregar ofertas:')
          console.log('   1. Ve a http://localhost:3003/admin')
          console.log('   2. Edita un producto')
          console.log('   3. Establece "Precio Original (Oferta)" > Precio actual')
        }
      } else {
        console.log('\n⚠️  No hay productos en la base de datos')
        console.log('💡 Agrega productos desde http://localhost:3003/admin')
      }
    } else {
      console.log(`❌ Error: ${res.status}`)
      console.log(res.data)
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`)
  }

  console.log('\n')
}

quickCheck()
