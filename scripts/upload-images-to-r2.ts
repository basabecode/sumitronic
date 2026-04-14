/**
 * Sube imágenes de productos al bucket Cloudflare R2 `sumitronic-images`.
 *
 * Requisitos:
 *   - wrangler autenticado: `wrangler login`
 *   - wrangler instalado globalmente o en devDependencies
 *
 * Uso:
 *   npm run upload:images
 *   # o con ruta personalizada:
 *   IMAGES_DIR=./public/fotos npx ts-node scripts/upload-images-to-r2.ts
 */

import { execFileSync } from 'child_process'
import { readdirSync } from 'fs'
import path from 'path'

const BUCKET_NAME = 'sumitronic-images'
const IMAGES_DIR = process.env.IMAGES_DIR ?? './public/images/productos'
const R2_PREFIX = 'productos'

function uploadImages() {
  let files: string[]
  try {
    files = readdirSync(IMAGES_DIR).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.error(`Directorio no encontrado: ${IMAGES_DIR}`)
      console.log('Ajusta IMAGES_DIR o pásala como variable de entorno.')
      console.log('Ejemplo: IMAGES_DIR=./public/fotos npx ts-node scripts/upload-images-to-r2.ts')
      process.exit(1)
    }
    throw err
  }

  if (files.length === 0) {
    console.log('No se encontraron imágenes en:', IMAGES_DIR)
    process.exit(0)
  }

  console.log(`Subiendo ${files.length} imágenes a R2 (bucket: ${BUCKET_NAME})...`)
  console.log(`Directorio origen: ${IMAGES_DIR}`)
  console.log(`Prefijo R2: ${R2_PREFIX}/\n`)

  let success = 0
  let failed = 0

  for (const file of files) {
    const localPath = path.join(IMAGES_DIR, file)
    const r2Key = `${R2_PREFIX}/${file}`

    try {
      // execFileSync evita inyección de comandos cuando file/path tienen caracteres especiales
      execFileSync(
        'wrangler',
        ['r2', 'object', 'put', `${BUCKET_NAME}/${r2Key}`, `--file=${localPath}`],
        { stdio: 'pipe', timeout: 30_000 }
      )
      console.log(`OK  ${file}`)
      success++
    } catch {
      console.error(`ERR ${file}`)
      failed++
    }
  }

  console.log(`\nCompletado: ${success} subidas, ${failed} errores`)

  if (failed > 0) {
    console.log('\nPara reintentar los errores, revisa que wrangler esté autenticado:')
    console.log('  wrangler login')
    process.exit(1)
  }
}

uploadImages()
