/**
 * Genera todos los iconos y assets del sitio desde el logo oficial de SUMITRONIC.
 * Fuente: public/logos/logo_sumitronic_3.png
 *
 * Uso: node scripts/generate-icons.mjs
 */

import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SOURCE = join(ROOT, 'public/logos/logo_sumitronic_3.png')
const PUBLIC = join(ROOT, 'public')

// Color de marca SUMITRONIC
const BRAND_DARK = { r: 0, g: 61, b: 82, alpha: 1 } // #003D52
const BRAND_PRIMARY = { r: 0, g: 163, b: 191, alpha: 1 } // #00A3BF
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 }
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

/**
 * Redimensiona el logo con fondo opcional.
 * Para iconos con fondo de color, hace contain (logo centrado con padding).
 * Para logos con transparencia, hace contain sin fondo.
 */
async function resizeLogo(src, { width, height, background = TRANSPARENT, padding = 0 }) {
  const innerW = width - padding * 2
  const innerH = height - padding * 2

  const resized = await sharp(src)
    .resize({
      width: innerW,
      height: innerH,
      fit: 'contain',
      background: TRANSPARENT,
    })
    .png()
    .toBuffer()

  if (padding === 0 && background === TRANSPARENT) {
    return resized
  }

  // Componer sobre fondo con padding
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background,
    },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer()
}

async function run() {
  const src = readFileSync(SOURCE)
  const meta = await sharp(src).metadata()
  console.log(`\nFuente: logo_sumitronic_3.png (${meta.width}x${meta.height}px)\n`)

  // ── 1. Favicons (fondo marca, padding 12% para que el escudo respire) ───────
  const faviconSizes = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'favicon-48x48.png', size: 48 },
    { file: 'favicon.png', size: 192 },
  ]

  for (const { file, size } of faviconSizes) {
    const pad = Math.round(size * 0.12)
    const buf = await resizeLogo(src, {
      width: size,
      height: size,
      background: BRAND_DARK,
      padding: pad,
    })
    writeFileSync(join(PUBLIC, file), buf)
    console.log(`✓ ${file} (${size}x${size}) — fondo #003D52 con padding ${pad}px`)
  }

  // ── 2. Apple Touch Icon (fondo blanco, padding 15%) ───────────────────────
  const appleSize = 180
  const applePad = Math.round(appleSize * 0.12)
  const appleBuf = await resizeLogo(src, {
    width: appleSize,
    height: appleSize,
    background: WHITE,
    padding: applePad,
  })
  writeFileSync(join(PUBLIC, 'apple-touch-icon.png'), appleBuf)
  console.log(`✓ apple-touch-icon.png (180x180) — fondo blanco`)

  // ── 3. Android Chrome / PWA (fondo marca, maskable) ──────────────────────
  const androidConfigs = [
    { file: 'android-chrome-192x192.png', size: 192 },
    { file: 'android-chrome-512x512.png', size: 512 },
  ]

  for (const { file, size } of androidConfigs) {
    const pad = Math.round(size * 0.15) // 15% padding para zona maskable segura
    const buf = await resizeLogo(src, {
      width: size,
      height: size,
      background: BRAND_DARK,
      padding: pad,
    })
    writeFileSync(join(PUBLIC, file), buf)
    console.log(`✓ ${file} (${size}x${size}) — fondo #003D52 maskable`)
  }

  // ── 4. Header logo (transparente, ancho fijo) ─────────────────────────────
  const headerBuf = await resizeLogo(src, {
    width: 320,
    height: 120,
    background: TRANSPARENT,
  })
  writeFileSync(join(PUBLIC, 'logos/logo-header.png'), headerBuf)
  console.log(`✓ logos/logo-header.png (320x120) — transparente`)

  // ── 5. OG Image social (1200x630, fondo oscuro marca) ────────────────────
  const ogW = 1200
  const ogH = 630
  const logoMaxH = Math.round(ogH * 0.55)
  const logoMaxW = Math.round(ogW * 0.55)

  const logoForOg = await sharp(src)
    .resize({
      width: logoMaxW,
      height: logoMaxH,
      fit: 'contain',
      background: TRANSPARENT,
    })
    .png()
    .toBuffer()

  // Fondo degradado simulado: rect oscuro + logo centrado
  const ogBuf = await sharp({
    create: {
      width: ogW,
      height: ogH,
      channels: 4,
      background: BRAND_DARK,
    },
  })
    .composite([
      // Banda cian decorativa izquierda
      {
        input: await sharp({
          create: { width: 12, height: ogH, channels: 4, background: BRAND_PRIMARY },
        })
          .png()
          .toBuffer(),
        left: 0,
        top: 0,
      },
      // Logo centrado
      { input: logoForOg, gravity: 'center' },
    ])
    .jpeg({ quality: 92 })
    .toBuffer()

  writeFileSync(join(PUBLIC, 'og-image.png'), ogBuf)
  console.log(`✓ og-image.png (1200x630) — fondo #003D52 con franja cian`)

  // ── 6. favicon.ico multi-tamaño (16 + 32 + 48) ───────────────────────────
  const icoSizes = [16, 32, 48]
  const icoBuffers = await Promise.all(
    icoSizes.map(s => resizeLogo(src, { width: s, height: s, background: TRANSPARENT }))
  )
  writeFileSync(join(PUBLIC, 'favicon.ico'), buildIco(icoBuffers, icoSizes))
  console.log(`✓ favicon.ico (16 + 32 + 48px embebidos)`)

  console.log('\n✅ Todos los iconos generados exitosamente desde logo_sumitronic_3.png\n')
}

/**
 * Construye un archivo .ico multi-tamaño con los buffers PNG dados.
 * Spec: https://en.wikipedia.org/wiki/ICO_(file_format)
 */
function buildIco(pngBuffers, sizes) {
  const count = pngBuffers.length
  const HEADER = 6
  const DIR_ENTRY = 16
  const dirSize = HEADER + DIR_ENTRY * count

  let offset = dirSize
  const offsets = pngBuffers.map(buf => {
    const o = offset
    offset += buf.length
    return o
  })

  const ico = Buffer.alloc(offset)

  // ICONDIR header
  ico.writeUInt16LE(0, 0) // reserved
  ico.writeUInt16LE(1, 2) // type = ICO
  ico.writeUInt16LE(count, 4)

  // Directory entries
  pngBuffers.forEach((buf, i) => {
    const base = HEADER + i * DIR_ENTRY
    const s = sizes[i]
    ico.writeUInt8(s >= 256 ? 0 : s, base) // width  (0 = 256)
    ico.writeUInt8(s >= 256 ? 0 : s, base + 1) // height
    ico.writeUInt8(0, base + 2) // color count
    ico.writeUInt8(0, base + 3) // reserved
    ico.writeUInt16LE(1, base + 4) // color planes
    ico.writeUInt16LE(32, base + 6) // bits per pixel
    ico.writeUInt32LE(buf.length, base + 8) // data size
    ico.writeUInt32LE(offsets[i], base + 12) // data offset
  })

  pngBuffers.forEach((buf, i) => buf.copy(ico, offsets[i]))

  return ico
}

run().catch(err => {
  console.error('Error generando iconos:', err.message)
  process.exit(1)
})
