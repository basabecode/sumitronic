import { loadEnvConfig } from '@next/env'
import { google } from 'googleapis'

loadEnvConfig(process.cwd())

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Falta la variable de entorno requerida: ${name}`)
  }

  return value
}

async function testGoogleSheetsConnection() {
  log('VALIDACION DE GOOGLE SHEETS - SUMITRONIC', 'cyan')
  console.log('='.repeat(60))

  const serviceAccountEmail = getRequiredEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL')
  const privateKey = getRequiredEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n')
  const spreadsheetId = getRequiredEnv('GOOGLE_SHEET_ID')
  const sheetName = getRequiredEnv('GOOGLE_SHEET_NAME')
  const previewRange = `${sheetName}!A1:O5`

  log('1. Variables de entorno cargadas', 'cyan')
  log(`   GOOGLE_SERVICE_ACCOUNT_EMAIL: ${serviceAccountEmail}`, 'green')
  log(`   GOOGLE_SHEET_ID: ${spreadsheetId}`, 'green')
  log(`   GOOGLE_SHEET_NAME: ${sheetName}`, 'green')

  log('\n2. Creando autenticacion con service account', 'cyan')
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  log('   Cliente de Google Sheets creado correctamente', 'green')

  log('\n3. Consultando metadata del spreadsheet', 'cyan')
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'properties.title,sheets.properties.title',
  })

  const spreadsheetTitle = spreadsheet.data.properties?.title ?? '(sin titulo)'
  const sheetTitles =
    spreadsheet.data.sheets
      ?.map(sheet => sheet.properties?.title)
      .filter((title): title is string => Boolean(title)) ?? []

  log(`   Spreadsheet: ${spreadsheetTitle}`, 'green')
  log(`   Hojas detectadas: ${sheetTitles.join(', ') || 'ninguna'}`, 'green')

  if (!sheetTitles.includes(sheetName)) {
    throw new Error(`La hoja "${sheetName}" no existe dentro del spreadsheet configurado.`)
  }

  log('\n4. Leyendo muestra de datos', 'cyan')
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: previewRange,
  })

  const rows = response.data.values ?? []
  log(`   Rango consultado: ${previewRange}`, 'green')
  log(`   Filas obtenidas: ${rows.length}`, 'green')

  if (rows.length === 0) {
    log('   La conexion funciona, pero la hoja esta vacia en el rango consultado.', 'yellow')
    return
  }

  const [header, ...dataRows] = rows
  log(`   Encabezados detectados: ${header.length}`, 'green')
  log(`   Filas de muestra: ${dataRows.length}`, 'green')

  const firstDataRow = dataRows[0]
  if (firstDataRow) {
    log(`   Primera fila de datos: ${JSON.stringify(firstDataRow)}`, 'green')
  }

  log('\nRESULTADO: conexion con Google Sheets OK', 'green')
}

testGoogleSheetsConnection()
  .then(() => {
    console.log('='.repeat(60))
    process.exit(0)
  })
  .catch(error => {
    console.log('='.repeat(60))
    log(`ERROR: ${error instanceof Error ? error.message : 'Fallo desconocido'}`, 'red')
    process.exit(1)
  })
