import { loadEnvConfig } from '@next/env'
import { syncProductsFromSheet } from '../lib/sync-products'

loadEnvConfig(process.cwd())

const start = Date.now()
console.log('⏱️  Iniciando sync con Google Sheets...')
console.log('='.repeat(50))

syncProductsFromSheet()
  .then(result => {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1)
    console.log('')
    console.log('=== RESULTADO ===')
    console.log('✅ Productos sincronizados:', result.synced)
    console.log('❌ Errores:', result.errors.length)
    if (result.errors.length > 0) {
      result.errors.slice(0, 10).forEach(e => console.log('  -', e))
    }
    console.log(`⏱️  Tiempo total: ${elapsed}s`)
    console.log('='.repeat(50))
    process.exit(0)
  })
  .catch(err => {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1)
    console.error('🔴 ERROR FATAL:', err instanceof Error ? err.message : err)
    console.error(`⏱️  Falló en: ${elapsed}s`)
    process.exit(1)
  })
