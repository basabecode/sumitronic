import { loadEnvConfig } from '@next/env'
import { google } from 'googleapis'

loadEnvConfig(process.cwd())

void (async () => {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!
  const privateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n')
  const sheetId = process.env.GOOGLE_SHEET_ID!
  const sheetName = process.env.GOOGLE_SHEET_NAME!

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: serviceAccountEmail, private_key: privateKey },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A2:O`,
  })

  const rows = response.data.values ?? []
  const validRows = rows.filter(row => (row[0] ?? '').trim() !== '')

  // Buscar el producto problemático
  const haloRows = rows.filter(row => (row[1] ?? '').toLowerCase().includes('halo'))

  console.log(`\nTotal filas válidas: ${validRows.length}`)
  console.log(`\nFilas con "halo" en el nombre:`)
  haloRows.forEach((row, i) => {
    console.log(`  [${i}] SKU="${row[0]}" | Nombre="${row[1]}"`)
  })

  // Detectar duplicados de SKU
  const skuCount = new Map<string, number>()
  for (const row of validRows) {
    const sku = (row[0] ?? '').trim()
    if (sku) skuCount.set(sku, (skuCount.get(sku) ?? 0) + 1)
  }
  const duplicateSKUs = Array.from(skuCount.entries()).filter(([, count]) => count > 1)
  console.log(`\nSKUs duplicados en el sheet: ${duplicateSKUs.length}`)
  duplicateSKUs
    .slice(0, 10)
    .forEach(([sku, count]) => console.log(`  SKU="${sku}" aparece ${count} veces`))

  // Detectar duplicados de nombre
  const nameCount = new Map<string, number>()
  for (const row of validRows) {
    const name = (row[1] ?? '').trim()
    if (name) nameCount.set(name, (nameCount.get(name) ?? 0) + 1)
  }
  const duplicateNames = Array.from(nameCount.entries()).filter(([, count]) => count > 1)
  console.log(`\nNombres duplicados en el sheet: ${duplicateNames.length}`)
  duplicateNames
    .slice(0, 10)
    .forEach(([name, count]) => console.log(`  Nombre="${name}" aparece ${count} veces`))
})()
