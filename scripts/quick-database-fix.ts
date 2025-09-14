/**
 * ===================================================
 * CAPISHOP - QUICK DATABASE FIX
 * ===================================================
 * Script rápido para diagnosticar y corregir problemas
 * comunes de la base de datos.
 */

import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

class QuickDatabaseFix {
  // ===================================
  // 1. DIAGNÓSTICO RÁPIDO
  // ===================================
  async quickDiagnosis() {
    console.log('🔍 EJECUTANDO DIAGNÓSTICO RÁPIDO...')
    console.log('=' + '='.repeat(50))

    // Test 1: Conexión básica
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('count')
        .limit(1)

      if (error) {
        console.log('❌ Error de conexión:', error.message)

        if (error.message.includes('infinite recursion')) {
          console.log(
            '🚨 PROBLEMA DETECTADO: Recursión infinita en políticas RLS'
          )
          console.log('💡 SOLUCIÓN: Ejecutar script de corrección de políticas')
          return 'RLS_RECURSION'
        }

        if (
          error.message.includes('relation') &&
          error.message.includes('does not exist')
        ) {
          console.log('🚨 PROBLEMA DETECTADO: Tablas no existen')
          console.log('💡 SOLUCIÓN: Ejecutar esquema de base de datos')
          return 'MISSING_SCHEMA'
        }

        return 'CONNECTION_ERROR'
      } else {
        console.log('✅ Conexión básica: OK')
      }
    } catch (error) {
      console.log('❌ Error de red:', error)
      return 'NETWORK_ERROR'
    }

    // Test 2: Acceso a productos
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name')
        .limit(1)

      if (error) {
        console.log('❌ Error accediendo a productos:', error.message)
        return 'PRODUCTS_ERROR'
      } else {
        console.log(
          `✅ Acceso a productos: OK (${products.length} productos encontrados)`
        )
      }
    } catch (error) {
      console.log('❌ Error en productos:', error)
      return 'PRODUCTS_ERROR'
    }

    // Test 3: Acceso a categorías
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name')
        .limit(1)

      if (error) {
        console.log('❌ Error accediendo a categorías:', error.message)
        return 'CATEGORIES_ERROR'
      } else {
        console.log(
          `✅ Acceso a categorías: OK (${categories.length} categorías encontradas)`
        )
      }
    } catch (error) {
      console.log('❌ Error en categorías:', error)
      return 'CATEGORIES_ERROR'
    }

    console.log(
      '\n🟢 DIAGNÓSTICO COMPLETADO: No se encontraron problemas críticos'
    )
    return 'HEALTHY'
  }

  // ===================================
  // 2. APLICAR CORRECCIONES AUTOMÁTICAS
  // ===================================
  async applyQuickFixes(problemType: string) {
    console.log('\n🔧 APLICANDO CORRECCIONES AUTOMÁTICAS...')
    console.log('=' + '='.repeat(50))

    switch (problemType) {
      case 'RLS_RECURSION':
        await this.fixRLSRecursion()
        break

      case 'MISSING_SCHEMA':
        console.log(
          '❌ SCHEMA FALTANTE: Este problema requiere intervención manual'
        )
        console.log(
          '💡 Ejecuta el archivo supabase/schema.sql en tu panel de Supabase'
        )
        break

      case 'PRODUCTS_ERROR':
      case 'CATEGORIES_ERROR':
        await this.createBasicData()
        break

      default:
        console.log(
          'ℹ️  No hay correcciones automáticas disponibles para este problema'
        )
    }
  }

  // ===================================
  // 3. CORRECCIÓN DE POLÍTICAS RLS
  // ===================================
  async fixRLSRecursion() {
    console.log('🔧 Intentando corregir políticas RLS...')

    // Nota: Este método no puede ejecutar SQL directamente con el cliente anon
    // Pero puede proporcionar instrucciones claras

    console.log('\n📋 INSTRUCCIONES PARA CORRECCIÓN MANUAL:')
    console.log('1. Abre tu panel de Supabase (https://supabase.com/dashboard)')
    console.log('2. Ve a SQL Editor')
    console.log('3. Ejecuta el archivo: supabase/fix-rls-policies.sql')
    console.log('4. O copia y pega este SQL:')
    console.log('\n' + '='.repeat(50))

    const fixSQL = `
-- CORRECCIÓN RÁPIDA DE POLÍTICAS RLS
BEGIN;

-- Eliminar políticas problemáticas
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Crear políticas simples
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (active = true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "Authenticated manage" ON public.categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated manage" ON public.products FOR ALL USING (auth.role() = 'authenticated');

COMMIT;
    `

    console.log(fixSQL)
    console.log('='.repeat(50))
    console.log(
      '\n💡 Después de ejecutar este SQL, reinicia tu aplicación Next.js'
    )
  }

  // ===================================
  // 4. CREAR DATOS BÁSICOS
  // ===================================
  async createBasicData() {
    console.log('🔧 Intentando crear datos básicos...')

    try {
      // Intentar crear una categoría básica
      const { data: category, error: catError } = await supabase
        .from('categories')
        .insert({
          name: 'General',
          slug: 'general',
          description: 'Categoría general',
          active: true,
        })
        .select()
        .single()

      if (catError) {
        console.log('❌ No se pudo crear categoría:', catError.message)
      } else {
        console.log('✅ Categoría básica creada')

        // Intentar crear un producto básico
        const { data: product, error: prodError } = await supabase
          .from('products')
          .insert({
            name: 'Producto de Prueba',
            description: 'Producto de prueba para validar funcionamiento',
            price: 100000,
            category_id: category.id,
            brand: 'CAPISHOP',
            image_url: '/placeholder.svg',
            stock_quantity: 10,
            active: true,
          })

        if (prodError) {
          console.log('❌ No se pudo crear producto:', prodError.message)
        } else {
          console.log('✅ Producto básico creado')
        }
      }
    } catch (error) {
      console.log('❌ Error creando datos básicos:', error)
    }
  }

  // ===================================
  // 5. MÉTODO PRINCIPAL
  // ===================================
  async runQuickFix() {
    console.log('🚀 CAPISHOP - QUICK DATABASE FIX')
    console.log('=' + '='.repeat(50))

    const problemType = await this.quickDiagnosis()

    if (problemType !== 'HEALTHY') {
      await this.applyQuickFixes(problemType)
    }

    console.log('\n🏁 QUICK FIX COMPLETADO')
    console.log('=' + '='.repeat(50))
    console.log(
      '💡 Para un diagnóstico completo, ejecuta: npm run test:database'
    )
    console.log(
      '🌐 Para testing visual, visita: http://localhost:3004/test/database'
    )
  }
}

// ===================================
// EJECUTOR PRINCIPAL
// ===================================
async function main() {
  const fixer = new QuickDatabaseFix()
  await fixer.runQuickFix()
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error)
}

export { QuickDatabaseFix }
