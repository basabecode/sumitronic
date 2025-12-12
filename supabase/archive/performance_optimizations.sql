-- ===================================
-- OPTIMIZACIONES DE ÍNDICES PARA FASE 3
-- ===================================
-- Índices adicionales para optimizar consultas críticas

-- Índices compuestos para filtros comunes
CREATE INDEX IF NOT EXISTS idx_products_active_category ON public.products(active, category_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_active_brand ON public.products(active, brand) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON public.products(active, featured) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_active_price ON public.products(active, price) WHERE active = true;

-- Índices para ordenamiento frecuente
CREATE INDEX IF NOT EXISTS idx_products_created_at_desc ON public.products(created_at DESC) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_updated_at_desc ON public.products(updated_at DESC) WHERE active = true;

-- Índices para búsquedas por rango de precio
CREATE INDEX IF NOT EXISTS idx_products_price_range ON public.products(price) WHERE active = true;

-- Índices para productos con stock
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON public.products(stock_quantity) WHERE active = true AND stock_quantity > 0;

-- Índices para categorías activas
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON public.categories(active, sort_order) WHERE active = true;

-- Índices para órdenes por usuario y fecha
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON public.orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders(status, created_at DESC);

-- Índices para favoritos
CREATE INDEX IF NOT EXISTS idx_favorites_user_created ON public.favorites(user_id, created_at DESC);

-- Función para actualizar search_vector automáticamente
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(NEW.brand, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para mantener search_vector actualizado
DROP TRIGGER IF EXISTS trigger_update_product_search_vector ON public.products;
CREATE TRIGGER trigger_update_product_search_vector
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();
