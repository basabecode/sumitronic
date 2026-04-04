# 🚀 Guía de Aplicación de Índices en Supabase

## 📋 Resumen

Se han creado **20+ índices optimizados** para mejorar el rendimiento de las consultas en la base de datos.

**Impacto esperado**: Queries 10-100x más rápidas en:
- Listado de productos
- Carrito de compras
- Favoritos
- Historial de pedidos
- Panel de administración

---

## 🎯 Método 1: Aplicar vía Supabase Dashboard (Recomendado)

### Paso 1: Acceder al SQL Editor

1. Ve a [supabase.com](https://supabase.com)
2. Selecciona tu proyecto **SUMITRONIC**
3. En el menú lateral, haz clic en **SQL Editor**

### Paso 2: Ejecutar el Script

1. Haz clic en **New Query**
2. Copia todo el contenido del archivo:
   ```
   supabase/migrations/20251208_create_indexes.sql
   ```
3. Pega el contenido en el editor
4. Haz clic en **Run** (o presiona `Ctrl + Enter`)

### Paso 3: Verificar

Ejecuta esta query para confirmar que los índices se crearon:

```sql
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

Deberías ver aproximadamente **20 índices** nuevos.

---

## 🎯 Método 2: Aplicar vía Supabase CLI (Avanzado)

### Requisitos Previos

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Login
supabase login

# Vincular proyecto
supabase link --project-ref pmvhtxlciekynczjspja
```

### Aplicar Migración

```bash
# Desde la raíz del proyecto
cd supabase

# Aplicar migración
supabase db push
```

---

## 📊 Índices Creados

### Productos (6 índices)
- ✅ `idx_products_category_id` - Filtrar por categoría
- ✅ `idx_products_featured` - Productos destacados
- ✅ `idx_products_active` - Productos activos
- ✅ `idx_products_search` - Búsqueda y filtrado
- ✅ `idx_products_price` - Ordenar por precio

### Pedidos (3 índices)
- ✅ `idx_orders_user_id` - Pedidos por usuario
- ✅ `idx_orders_status` - Filtrar por estado
- ✅ `idx_orders_admin` - Dashboard admin

### Carrito (3 índices)
- ✅ `idx_carts_user_id` - Carrito por usuario
- ✅ `idx_cart_items_cart_id` - Items del carrito
- ✅ `idx_cart_items_product` - Producto en carrito

### Favoritos (3 índices)
- ✅ `idx_favorites_user_id` - Favoritos por usuario
- ✅ `idx_favorites_user_product` - Verificar favorito
- ✅ `idx_favorites_product_id` - Analytics de favoritos

### Otros (5 índices)
- ✅ Categorías, Usuarios, Variantes

---

## 🔍 Verificar Impacto

### Antes vs Después

Ejecuta estas queries para comparar:

```sql
-- Ver tamaño de índices
SELECT
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Ver uso de índices
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Probar Performance

```sql
-- Query SIN índice (antes)
EXPLAIN ANALYZE
SELECT * FROM products WHERE category_id = 1;

-- Query CON índice (después)
-- Debería mostrar "Index Scan using idx_products_category_id"
EXPLAIN ANALYZE
SELECT * FROM products WHERE category_id = 1 AND is_active = true;
```

---

## ⚠️ Consideraciones

### Espacio en Disco

Los índices ocupan espacio adicional:
- **Estimado**: ~5-10 MB para 1,000 productos
- **Crecimiento**: Proporcional al número de registros

### Mantenimiento

Los índices se mantienen automáticamente por PostgreSQL. No requieren acción manual.

### Impacto en Escrituras

Los índices pueden hacer que los `INSERT` y `UPDATE` sean ligeramente más lentos (~5-10%), pero las lecturas serán 10-100x más rápidas.

**Balance**: Totalmente favorable para un e-commerce (más lecturas que escrituras).

---

## 🎯 Próximos Pasos

Después de aplicar los índices:

1. ✅ Monitorear performance en Supabase Dashboard
2. ✅ Verificar que las queries usen los índices (`EXPLAIN ANALYZE`)
3. ✅ Continuar con la siguiente mejora: **Consolidar Componentes**

---

## 📚 Referencias

- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Supabase Performance](https://supabase.com/docs/guides/database/performance)
- [Index Tuning](https://wiki.postgresql.org/wiki/Index_Maintenance)

---

**Creado**: 8 de Diciembre 2025
**Aplicado**: ⏳ Pendiente
**Tiempo estimado**: 5 minutos
