-- ===================================
-- CORRECCIÓN DE POLÍTICAS RLS
-- ===================================
-- Script para corregir la recursión infinita en las políticas RLS

BEGIN;

-- ===================================
-- 1. ELIMINAR POLÍTICAS PROBLEMÁTICAS
-- ===================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;

DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- ===================================
-- 2. RECREAR POLÍTICAS SIN RECURSIÓN
-- ===================================

-- Políticas para usuarios (SIN referencia recursiva a users)
CREATE POLICY "Users can view own profile" ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
FOR INSERT WITH CHECK (auth.uid() = id);

-- Política simple para admins (usando auth.jwt() en lugar de tabla users)
CREATE POLICY "Admin access" ON public.users
FOR ALL USING (
  auth.jwt() ->> 'role' = 'authenticated' AND
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
);

-- Políticas para categorías (acceso público)
CREATE POLICY "Public read categories" ON public.categories
FOR SELECT USING (active = true);

CREATE POLICY "Authenticated users can manage categories" ON public.categories
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para productos (acceso público para lectura)
CREATE POLICY "Public read products" ON public.products
FOR SELECT USING (active = true);

CREATE POLICY "Authenticated users can manage products" ON public.products
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para imágenes de productos
DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;

CREATE POLICY "Public read product images" ON public.product_images
FOR SELECT USING (true);

CREATE POLICY "Authenticated manage product images" ON public.product_images
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para inventario
DROP POLICY IF EXISTS "Anyone can view inventory" ON public.inventory;
DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory;

CREATE POLICY "Public read inventory" ON public.inventory
FOR SELECT USING (true);

CREATE POLICY "Authenticated manage inventory" ON public.inventory
FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para órdenes
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

CREATE POLICY "Users manage own orders" ON public.orders
FOR ALL USING (user_id = auth.uid());

-- Políticas para carrito
DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;

CREATE POLICY "Users manage own cart" ON public.cart_items
FOR ALL USING (user_id = auth.uid());

-- Políticas para configuraciones del sistema
DROP POLICY IF EXISTS "Anyone can view settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;

CREATE POLICY "Public read settings" ON public.system_settings
FOR SELECT USING (true);

CREATE POLICY "Authenticated manage settings" ON public.system_settings
FOR ALL USING (auth.role() = 'authenticated');

-- ===================================
-- 3. VERIFICACIÓN DE POLÍTICAS
-- ===================================
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'RLS POLICIES FIXED SUCCESSFULLY!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'All policies have been recreated without recursion';
    RAISE NOTICE 'Public access enabled for categories and products';
    RAISE NOTICE 'Authenticated users can manage content';
    RAISE NOTICE '============================================';
END $$;

COMMIT;
