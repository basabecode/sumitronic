/**
 * clean-catalogo.mjs
 * Limpia y corrige el CSV generado por el scraper antes de cargarlo a Google Sheets.
 *
 * Uso: node scripts/clean-catalogo.mjs
 * Salida: scripts/output/catalogo-limpio.csv
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const INPUT = join(__dirname, 'output/catalogo-proveedor.csv')
const OUTPUT = join(__dirname, 'output/catalogo-limpio.csv')

// ─── LÍNEAS A ELIMINAR ────────────────────────────────────────────────────────
// Índice 0 = header. Los números coinciden con el offset mostrado por el lector.
const ELIMINAR = new Set([
  102,
  103, // TP-Link Deco BE65 1-pack y 2-pack — precio $0 (agotado)
  113,
  114, // TP-Link Tapo RV20 Max / RV30 Max — robots aspiradores (fuera de foco)
  150, // Genius KM-200 — teclado + mouse (sin relación con smart home)
  218, // IMOU Cruiser Triple + SD 64GB — precio $0 (agotado)
  237,
  238, // TP-Link SG3428X y ER706W — productos enterprise >$10M COP
  240, // TP-Link Tapo RVA301 — mopas para robot aspirador
  242,
  243, // TP-Link Tapo RVA105/RVA202 — repuestos robot aspirador
  245,
  246, // TP-Link Tapo RV20/RV30 Max Plus — robots aspiradores premium
])

// ─── CORRECCIONES POR LÍNEA ───────────────────────────────────────────────────
// Clave = índice de la línea. Valor = { índiceColumna: nuevoValor }
// Columnas: 0=sku, 1=nombre, 2=descripcion, 3=precio, 4=precio_comparacion,
//           5=precio_costo, 6=marca, 7=categoria_slug, 8=stock, 9=peso,
//           10=destacado, 11=activo, 12=tags, 13=imagen_url, 14=imagenes_extra
const CORRECCIONES = {
  130: { 7: 'energia-respaldo' }, // Forza PS-1006B regleta 6 salidas → categoría correcta
  147: { 6: 'RUIJIE' }, // Switch PoE Ruijie: marca era el nombre completo del producto
  157: { 7: 'energia-respaldo' }, // Forza PS-611UL regleta → categoría correcta
  174: { 7: 'timbres-inteligentes' }, // TP-Link Tapo D230S1 timbre con video → categoría correcta
  189: { 6: 'POWEST' }, // Powest UPS 2200VA: campo marca vacío
  212: { 7: 'cerraduras-inteligentes' }, // IMOU Cubo1 cerradura digital WiFi → categoría correcta
  215: { 7: 'routers-redes' }, // IMOU Router HR300 — estaba en camaras-wifi
  216: { 7: 'routers-redes' }, // IMOU Router HR12F — estaba en camaras-wifi
  217: { 7: 'routers-redes' }, // IMOU Router HR12G — estaba en camaras-wifi
  224: { 0: 'EAP110-L' }, // Access Point EAP110: SKU duplicado con TL-SG1048, corregido
}

// ─── PARSER CSV SIMPLE (soporta campos entre comillas con comas internas) ──────
function parseLinea(linea) {
  const campos = []
  let actual = ''
  let enComillas = false
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i]
    if (c === '"') {
      enComillas = !enComillas
    } else if (c === ',' && !enComillas) {
      campos.push(actual)
      actual = ''
    } else {
      actual += c
    }
  }
  campos.push(actual)
  return campos
}

function camposALinea(campos) {
  return campos
    .map(f => (f.includes(',') || f.includes('"') ? `"${f.replace(/"/g, '""')}"` : f))
    .join(',')
}

// ─── PROCESAMIENTO ────────────────────────────────────────────────────────────
const lineas = readFileSync(INPUT, 'utf-8').split('\n')
const resultado = []
let eliminadas = 0
let corregidas = 0

for (let i = 0; i < lineas.length; i++) {
  const linea = lineas[i].trim()
  if (!linea) continue // ignorar líneas vacías al final del archivo

  // Header: siempre se mantiene
  if (i === 0) {
    resultado.push(linea)
    continue
  }

  // Eliminar líneas marcadas
  if (ELIMINAR.has(i)) {
    eliminadas++
    continue
  }

  const campos = parseLinea(linea)

  // Aplicar correcciones de categoría / marca / SKU
  if (CORRECCIONES[i]) {
    for (const [col, valor] of Object.entries(CORRECCIONES[i])) {
      campos[parseInt(col)] = valor
    }
    corregidas++
  }

  // Limpiar peso NaN → vacío
  if (campos[9] === 'NaN') campos[9] = ''

  resultado.push(camposALinea(campos))
}

writeFileSync(OUTPUT, resultado.join('\n') + '\n', 'utf-8')

const totalProductos = resultado.length - 1 // sin contar el header
console.log('\n✅ Catálogo limpio generado correctamente')
console.log(`   📦 Productos en el archivo final : ${totalProductos}`)
console.log(`   🗑️  Líneas eliminadas             : ${eliminadas}`)
console.log(`   ✏️  Líneas corregidas             : ${corregidas}`)
console.log(`   📄 Guardado en: scripts/output/catalogo-limpio.csv\n`)

// ─── REPORTE POR CATEGORÍA ────────────────────────────────────────────────────
const conteo = {}
for (let i = 1; i < resultado.length; i++) {
  const campos = parseLinea(resultado[i])
  const cat = campos[7] || 'sin-categoria'
  conteo[cat] = (conteo[cat] || 0) + 1
}
console.log('   Distribución por categoría:')
for (const [cat, n] of Object.entries(conteo).sort((a, b) => b[1] - a[1])) {
  console.log(`     ${cat.padEnd(28)} ${n} productos`)
}
console.log()
