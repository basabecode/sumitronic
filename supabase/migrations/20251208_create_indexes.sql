-- ============================================
-- ÍNDICES DE OPTIMIZACIÓN - CapiShop Database
-- ============================================
-- Fecha: 8 de Diciembre 2025
-- Propósito: Mejorar performance de queries frecuentes
-- Impacto esperado: 10-100x más rápido en consultas
-- ============================================

-- ============================================
-- PRODUCTOS
-- ============================================

-- Índice para filtrar por categoría (usado en página de productos)
CREATE INDEX IF NOT EXISTS idx_products_category_id
ON products(category_id)
WHERE active = true;

-- Índice para productos destacados (usado en homepage)
CREATE INDEX IF NOT EXISTS idx_products_featured
ON products(featured)
WHERE featured = true AND active = true;

-- Índice para productos activos (usado en listados generales)
CREATE INDEX IF NOT EXISTS idx_products_active
ON products(active)
WHERE active = true;

-- Índice compuesto para búsqueda y filtrado
CREATE INDEX IF NOT EXISTS idx_products_search
ON products(name, brand, category_id)
WHERE active = true;

-- Índice para ordenar por precio
CREATE INDEX IF NOT EXISTS idx_products_price
ON products(price)
WHERE active = true;

-- ============================================
-- PEDIDOS (ORDERS)
-- ============================================

-- Índice para obtener pedidos de un usuario (usado en /profile/orders)
CREATE INDEX IF NOT EXISTS idx_orders_user_id
ON orders(user_id, created_at DESC);

-- Índice para filtrar por estado de pedido
CREATE INDEX IF NOT EXISTS idx_orders_status
ON orders(status, created_at DESC);

-- Índice compuesto para admin dashboard
CREATE INDEX IF NOT EXISTS idx_orders_admin
ON orders(status, created_at DESC, user_id);

-- ============================================
-- CARRITO
-- ============================================

-- Índice para obtener carrito de un usuario
CREATE INDEX IF NOT EXISTS idx_carts_user_id
ON carts(user_id);

-- Índice para items del carrito
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id
ON cart_items(cart_id);

-- Índice para buscar producto en carrito
CREATE INDEX IF NOT EXISTS idx_cart_items_product
ON cart_items(cart_id, product_id);

-- ============================================
-- FAVORITOS
-- ============================================

-- Índice para obtener favoritos de un usuario
CREATE INDEX IF NOT EXISTS idx_favorites_user_id
ON favorites(user_id, created_at DESC);

-- Índice para verificar si producto está en favoritos
CREATE INDEX IF NOT EXISTS idx_favorites_user_product
ON favorites(user_id, product_id);

-- Índice para productos más favoritos (analytics)
CREATE INDEX IF NOT EXISTS idx_favorites_product_id
ON favorites(product_id);

-- ============================================
-- CATEGORÍAS
-- ============================================

-- Índice para categorías activas
CREATE INDEX IF NOT EXISTS idx_categories_active
ON categories(active)
WHERE active = true;

-- Índice para ordenar categorías
CREATE INDEX IF NOT EXISTS idx_categories_order
ON categories(sort_order, name);

-- ============================================
-- USUARIOS
-- ============================================

-- Índice para búsqueda por email (login)
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

-- Índice para filtrar por rol (admin queries)
CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role);

-- ============================================
-- VARIANTES DE PRODUCTO (si existe la tabla)
-- ============================================

-- Índice para obtener variantes de un producto
-- Solo se crea si la tabla existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_variants') THEN
        CREATE INDEX IF NOT EXISTS idx_product_variants_product_id
        ON product_variants(product_id);
    END IF;
END $$;
