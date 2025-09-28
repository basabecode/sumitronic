import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leer las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Variables de entorno de Supabase no encontradas')
  process.exit(1)
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

// Leer el archivo SQL
const sqlFilePath = join(__dirname, '..', 'supabase', 'favorites_schema.sql')
const sql = readFileSync(sqlFilePath, 'utf8')

async function executeSQL() {
  try {
    console.log('Ejecutando esquema de favoritos...')

    // Ejecutar el SQL usando rpc (llamada a procedimiento remoto)
    // Como no tenemos un procedimiento específico, usaremos la función sql
    const { data, error } = await supabase.rpc('exec_sql', { sql })

    if (error) {
      console.error('Error ejecutando SQL:', error)
      process.exit(1)
    }

    console.log('Esquema de favoritos ejecutado exitosamente!')
    console.log('Resultado:', data)
  } catch (err) {
    console.error('Error inesperado:', err)
    process.exit(1)
  }
}

executeSQL()
