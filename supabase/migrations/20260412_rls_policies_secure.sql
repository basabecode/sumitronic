-- ============================================================
-- MIGRACIÓN: RLS Policies seguras para producción
-- Fecha: 2026-04-12
-- Propósito: Reemplaza el archivo archive/fix-rls-policies.sql
--            con políticas correctas y reproducibles.
--
-- Cambios clave respecto al archivo en archive/:
--   - Escritura en products/categories/inventory/product_images/
--     system_settings restringida a admins (no a cualquier auth).
--   - Función is_admin() con SECURITY DEFINER para evitar
--     recursión infinita al consultar la tabla users desde RLS.
--   - Admin ve TODAS las órdenes; usuario solo las propias.
--   - Carts: policy corregida (cart_id → carts.user_id).
-- ============================================================

BEGIN;

-- ============================================================
-- 0. FUNCIÓN HELPER: is_admin()
--    SECURITY DEFINER bypassa RLS para consultar users sin
--    recursión. Solo devuelve true si el uid autenticado tiene
--    role = 'admin' en public.users.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- 1. TABLA: users
--    - Cualquier usuario autenticado lee/edita su propio perfil
--    - Admin lee y gestiona todos los usuarios
-- ============================================================
DROP POLICY IF EXISTS "Users can view own profile"    ON public.users;
DROP POLICY IF EXISTS "Users can update own profile"  ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile"  ON public.users;
DROP POLICY IF EXISTS "Admins can view all users"     ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users"   ON public.users;
DROP POLICY IF EXISTS "Admin access"                  ON public.users;

-- El propio usuario puede leer su perfil
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- El propio usuario puede actualizar su perfil
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Inserción propia (registro inicial vía trigger/callback)
CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Solo admin puede eliminar usuarios
CREATE POLICY "users_delete_admin"
  ON public.users FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- 2. TABLA: categories
--    - Lectura pública (categorías activas)
--    - Escritura solo admin
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view active categories"          ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories"               ON public.categories;
DROP POLICY IF EXISTS "Public read categories"                     ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories"  ON public.categories;

CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (active = true OR public.is_admin());

CREATE POLICY "categories_write_admin"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "categories_update_admin"
  ON public.categories FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "categories_delete_admin"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- 3. TABLA: products
--    - Lectura pública (productos activos); admin ve todos
--    - Escritura solo admin
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view active products"            ON public.products;
DROP POLICY IF EXISTS "Admins can manage products"                 ON public.products;
DROP POLICY IF EXISTS "Public read products"                       ON public.products;
DROP POLICY IF EXISTS "Authenticated users can manage products"    ON public.products;

CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  USING (active = true OR public.is_admin());

CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- 4. TABLA: product_images
--    - Lectura pública
--    - Escritura solo admin
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view product images"      ON public.product_images;
DROP POLICY IF EXISTS "Admins can manage product images"    ON public.product_images;
DROP POLICY IF EXISTS "Public read product images"          ON public.product_images;
DROP POLICY IF EXISTS "Authenticated manage product images" ON public.product_images;

CREATE POLICY "product_images_select_public"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "product_images_insert_admin"
  ON public.product_images FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "product_images_update_admin"
  ON public.product_images FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "product_images_delete_admin"
  ON public.product_images FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- 5. TABLA: product_variants
--    - Lectura pública
--    - Escritura solo admin
-- ============================================================
DROP POLICY IF EXISTS "Public read product_variants"          ON public.product_variants;
DROP POLICY IF EXISTS "Authenticated manage product_variants" ON public.product_variants;

CREATE POLICY "product_variants_select_public"
  ON public.product_variants FOR SELECT
  USING (true);

CREATE POLICY "product_variants_insert_admin"
  ON public.product_variants FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "product_variants_update_admin"
  ON public.product_variants FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "product_variants_delete_admin"
  ON public.product_variants FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- 6. TABLA: inventory
--    - Lectura pública (el stock se muestra en el catálogo)
--    - Escritura solo admin
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view inventory"      ON public.inventory;
DROP POLICY IF EXISTS "Admins can manage inventory"    ON public.inventory;
DROP POLICY IF EXISTS "Public read inventory"          ON public.inventory;
DROP POLICY IF EXISTS "Authenticated manage inventory" ON public.inventory;

CREATE POLICY "inventory_select_public"
  ON public.inventory FOR SELECT
  USING (true);

CREATE POLICY "inventory_insert_admin"
  ON public.inventory FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "inventory_update_admin"
  ON public.inventory FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "inventory_delete_admin"
  ON public.inventory FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- 7. TABLA: orders
--    - Usuario: ve y gestiona sus propias órdenes
--    - Admin: acceso completo a todas las órdenes
--    NOTA: la columna es user_id, no user_id en cart_items
-- ============================================================
DROP POLICY IF EXISTS "Users can view own orders"   ON public.orders;
DROP POLICY IF EXISTS "Users can create orders"     ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders"  ON public.orders;
DROP POLICY IF EXISTS "Admins can manage orders"    ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders"    ON public.orders;
DROP POLICY IF EXISTS "Users manage own orders"     ON public.orders;

-- Usuario ve sus propias órdenes
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

-- Usuario crea sus propias órdenes
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Solo admin puede actualizar estado de órdenes
CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- Solo admin puede eliminar órdenes
CREATE POLICY "orders_delete_admin"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- 8. TABLA: carts
--    - Cada usuario gestiona su propio carrito
--    - Admin puede leer todos (para soporte)
--    - Guest carts: session_id (sin user_id) → política permisiva
--      para anonimos (el frontend los gestiona por session_id)
-- ============================================================
DROP POLICY IF EXISTS "Users can manage own cart" ON public.carts;
DROP POLICY IF EXISTS "Users manage own cart"     ON public.carts;

CREATE POLICY "carts_select"
  ON public.carts FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin() OR user_id IS NULL);

CREATE POLICY "carts_insert"
  ON public.carts FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "carts_update"
  ON public.carts FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin() OR user_id IS NULL);

CREATE POLICY "carts_delete"
  ON public.carts FOR DELETE
  USING (user_id = auth.uid() OR public.is_admin() OR user_id IS NULL);

-- ============================================================
-- 9. TABLA: cart_items
--    - Acceso a través de la relación con carts
-- ============================================================
DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users manage own cart"     ON public.cart_items;

CREATE POLICY "cart_items_select"
  ON public.cart_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_id
        AND (c.user_id = auth.uid() OR public.is_admin() OR c.user_id IS NULL)
    )
  );

CREATE POLICY "cart_items_insert"
  ON public.cart_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_id
        AND (c.user_id = auth.uid() OR c.user_id IS NULL)
    )
  );

CREATE POLICY "cart_items_update"
  ON public.cart_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_id
        AND (c.user_id = auth.uid() OR public.is_admin() OR c.user_id IS NULL)
    )
  );

CREATE POLICY "cart_items_delete"
  ON public.cart_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_id
        AND (c.user_id = auth.uid() OR public.is_admin() OR c.user_id IS NULL)
    )
  );

-- ============================================================
-- 10. TABLA: favorites
--     - Cada usuario gestiona sus propios favoritos
-- ============================================================
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users manage own favorites"     ON public.favorites;

CREATE POLICY "favorites_select"
  ON public.favorites FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "favorites_insert"
  ON public.favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "favorites_delete"
  ON public.favorites FOR DELETE
  USING (user_id = auth.uid() OR public.is_admin());

-- ============================================================
-- 11. TABLA: system_settings
--     - Lectura pública (configuraciones no sensibles)
--     - Escritura solo admin
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view settings"       ON public.system_settings;
DROP POLICY IF EXISTS "Admins can manage settings"     ON public.system_settings;
DROP POLICY IF EXISTS "Public read settings"           ON public.system_settings;
DROP POLICY IF EXISTS "Authenticated manage settings"  ON public.system_settings;

CREATE POLICY "system_settings_select_public"
  ON public.system_settings FOR SELECT
  USING (true);

CREATE POLICY "system_settings_insert_admin"
  ON public.system_settings FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "system_settings_update_admin"
  ON public.system_settings FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "system_settings_delete_admin"
  ON public.system_settings FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'MIGRACIÓN 20260412_rls_policies_secure — COMPLETADA';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Función is_admin() creada con SECURITY DEFINER';
    RAISE NOTICE 'Tablas protegidas: users, categories, products,';
    RAISE NOTICE '  product_images, product_variants, inventory,';
    RAISE NOTICE '  orders, carts, cart_items, favorites, system_settings';
    RAISE NOTICE 'Escritura en tablas de catálogo: solo admin';
    RAISE NOTICE 'Órdenes/carrito/favoritos: usuario ve los suyos';
    RAISE NOTICE '====================================================';
END $$;

COMMIT;
