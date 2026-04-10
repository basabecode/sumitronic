import { createClient } from '@/lib/supabase/client'
import productsData from '@/lib/products.json'

// Script para migrar productos del JSON a Supabase
async function migrateProducts() {
  const supabase = createClient()

  console.log('🚀 Iniciando migración de productos...')

  // Obtener categorías existentes
  const { data: categories } = await supabase.from('categories').select('*')

  console.log('📁 Categorías encontradas:', categories?.length)

  // Mapeo de categorías JSON a slugs de Supabase
  const categoryMapping: Record<string, string> = {
    camaras: 'camaras-de-seguridad',
    'equipos-red': 'equipos-de-red',
    dvr: 'dvr-nvr-xvr',
    accesorios: 'accesorios',
    fuentes: 'fuentes-de-poder',
    perifericos: 'perifericos',
  }

  let successCount = 0
  let errorCount = 0

  for (const product of productsData as any[]) {
    try {
      // Encontrar la categoría correspondiente
      const categorySlug = categoryMapping[product.category] || 'accesorios'
      const categoryData = categories?.find(cat => cat.slug === categorySlug)

      if (!categoryData) {
        console.warn(`⚠️ Categoría no encontrada para: ${product.category}`)
        continue
      }

      // Preparar datos del producto
      const productData = {
        name: product.name,
        description: `${product.name} - ${product.brand}. Stock disponible: ${product.stockCount}`,
        price: product.price,
        category_id: categoryData.id,
        brand: product.brand,
        image_url: product.image,
        images: [product.image],
        stock_quantity: product.stockCount || 0,
        sku: `${product.brand.toUpperCase()}-${product.id.toString().padStart(3, '0')}`,
        featured: product.id <= 4, // Los primeros 4 como destacados
        active: true,
      }

      // Verificar si el producto ya existe
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('name', productData.name)
        .single()

      if (existingProduct) {
        console.log(`⏭️ Producto ya existe: ${productData.name}`)
        continue
      }

      // Insertar producto
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()

      if (productError) {
        console.error(`❌ Error creando producto ${productData.name}:`, productError)
        errorCount++
        continue
      }

      // Insertar imagen principal
      if (newProduct) {
        await supabase.from('product_images').insert({
          product_id: newProduct.id,
          image_url: productData.image_url,
          alt_text: productData.name,
          is_primary: true,
          sort_order: 0,
        })

        // Insertar inventario
        await supabase.from('inventory').insert({
          product_id: newProduct.id,
          quantity_available: productData.stock_quantity,
          reserved_quantity: 0,
        })

        console.log(`✅ Producto migrado: ${productData.name}`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ Error procesando producto ${product.name}:`, error)
      errorCount++
    }
  }

  console.log(`🎉 Migración completada:`)
  console.log(`   ✅ Productos migrados: ${successCount}`)
  console.log(`   ❌ Errores: ${errorCount}`)
}

// Ejecutar migración
migrateProducts().catch(console.error)
