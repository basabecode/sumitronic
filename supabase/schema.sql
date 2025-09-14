-- ===================================
-- CAPISHOP DATABASE SCHEMA (VERSIÓN CORREGIDA)
-- ===================================
-- Script para configurar las tablas en Supabase.
-- Se puede ejecutar múltiples veces sin errores.

BEGIN;

-- ===================================
-- 1. TABLA DE USUARIOS (PROFILES)
-- ===================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    phone TEXT,
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) para users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
CREATE POLICY "Admins can manage all users" ON public.users FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ===================================
-- 2. TABLA DE CATEGORÍAS (MOVIDA ANTES DE PRODUCTOS)
-- ===================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (active = true OR auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ===================================
-- 3. TABLA DE PRODUCTOS (DESPUÉS DE CATEGORÍAS)
-- ===================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand TEXT NOT NULL,
    image_url TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    sku TEXT UNIQUE,
    weight DECIMAL(8,2),
    dimensions JSONB,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    search_vector tsvector
);

-- RLS para products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (active = true OR auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ===================================
-- 3.1. TABLA DE IMÁGENES DE PRODUCTOS
-- ===================================
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para product_images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;
CREATE POLICY "Admins can manage product images" ON public.product_images FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ===================================
-- 3.2. TABLA DE INVENTARIO
-- ===================================
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
    quantity_available INTEGER DEFAULT 0 CHECK (quantity_available >= 0),
    reserved_quantity INTEGER DEFAULT 0 CHECK (reserved_quantity >= 0),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para inventory
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view inventory" ON public.inventory;
CREATE POLICY "Anyone can view inventory" ON public.inventory FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory;
CREATE POLICY "Admins can manage inventory" ON public.inventory FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ===================================
-- 4. TABLA DE PEDIDOS
-- ===================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    customer_info JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax DECIMAL(10,2) NOT NULL CHECK (tax >= 0),
    shipping DECIMAL(10,2) NOT NULL CHECK (shipping >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ===================================
-- 5. TABLA DE CARRITO
-- ===================================
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- RLS para cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;
CREATE POLICY "Users can manage own cart" ON public.cart_items FOR ALL USING (user_id = auth.uid());

-- ===================================
-- 6. TABLA DE CONFIGURACIONES DEL SISTEMA
-- ===================================
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view settings" ON public.system_settings;
CREATE POLICY "Anyone can view settings" ON public.system_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;
CREATE POLICY "Admins can manage settings" ON public.system_settings FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ===================================
-- 7. FUNCIONES Y TRIGGERS
-- ===================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para vector de búsqueda de productos
CREATE OR REPLACE FUNCTION products_search_vector_update()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector := to_tsvector('spanish', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.description, '') || ' ' || COALESCE(NEW.brand, ''));
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'customer'
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Función para actualizar inventario después de una orden
CREATE OR REPLACE FUNCTION update_inventory_after_order()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
    product_uuid UUID;
    item_quantity INTEGER;
BEGIN
    IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
        -- Iterar sobre los items de la orden
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
            product_uuid := (item->>'product_id')::UUID;
            item_quantity := (item->>'quantity')::INTEGER;

            -- Actualizar inventario
            UPDATE public.inventory
            SET quantity_available = quantity_available - item_quantity,
                last_updated = NOW()
            WHERE product_id = product_uuid;

            -- Actualizar stock en productos
            UPDATE public.products
            SET stock_quantity = stock_quantity - item_quantity,
                updated_at = NOW()
            WHERE id = product_uuid;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar inventario en tiempo real
CREATE OR REPLACE FUNCTION update_inventory_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ===================================
-- 8. CREACIÓN DE TRIGGERS
-- ===================================

-- Trigger para crear usuario automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para vector de búsqueda
DROP TRIGGER IF EXISTS tsvectorupdate ON public.products;
CREATE TRIGGER tsvectorupdate
    BEFORE INSERT OR UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

-- Trigger para actualizar inventario
DROP TRIGGER IF EXISTS update_inventory_last_updated ON public.inventory;
CREATE TRIGGER update_inventory_last_updated
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION update_inventory_last_updated();

-- Trigger para actualizar inventario después de orden
DROP TRIGGER IF EXISTS update_inventory_after_order_trigger ON public.orders;
CREATE TRIGGER update_inventory_after_order_trigger
    AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_inventory_after_order();

-- ===================================
-- 9. ÍNDICES PARA RENDIMIENTO
-- ===================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(active);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON public.products USING gin(search_vector);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON public.product_images(is_primary);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_total ON public.orders(total);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);

-- ===================================
-- 10. CONFIGURACIONES INICIALES DEL SISTEMA
-- ===================================
INSERT INTO public.system_settings (key, value, description)
VALUES
    ('store_name', '"CAPISHOP"', 'Nombre de la tienda'),
    ('currency', '"COP"', 'Moneda utilizada'),
    ('tax_rate', '0.19', 'Tasa de impuestos (19%)'),
    ('free_shipping_threshold', '100000', 'Monto mínimo para envío gratis'),
    ('shipping_cost', '15000', 'Costo de envío estándar'),
    ('store_email', '"info@capishop.com"', 'Email de contacto de la tienda'),
    ('store_phone', '"+57 300 123 4567"', 'Teléfono de contacto'),
    ('store_address', '{"street": "Calle 123 #45-67", "city": "Bogotá", "country": "Colombia"}', 'Dirección de la tienda')
ON CONFLICT (key) DO NOTHING;

-- ===================================
-- 11. DATOS DE EJEMPLO
-- ===================================

-- Insertar categorías
INSERT INTO public.categories (name, slug, description, active) VALUES
    ('Cámaras de Seguridad', 'camaras-de-seguridad', 'Cámaras IP, análogas y de alta definición', true),
    ('Equipos de Red', 'equipos-de-red', 'Routers, switches y access points', true),
    ('DVR/NVR/XVR', 'dvr-nvr-xvr', 'Grabadores digitales de video', true),
    ('Accesorios', 'accesorios', 'Cables, conectores y accesorios varios', true),
    ('Fuentes de Poder', 'fuentes-de-poder', 'UPS y fuentes de alimentación', true),
    ('Periféricos', 'perifericos', 'Teclados, ratones y otros periféricos', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar productos de ejemplo
DO $$
DECLARE
    camaras_cat_id UUID;
    equipos_cat_id UUID;
    accesorios_cat_id UUID;
    perifericos_cat_id UUID;
    product_id UUID;
BEGIN
    -- Obtener IDs de categorías
    SELECT id INTO camaras_cat_id FROM public.categories WHERE slug = 'camaras-de-seguridad';
    SELECT id INTO equipos_cat_id FROM public.categories WHERE slug = 'equipos-de-red';
    SELECT id INTO accesorios_cat_id FROM public.categories WHERE slug = 'accesorios';
    SELECT id INTO perifericos_cat_id FROM public.categories WHERE slug = 'perifericos';

    -- Producto 1: Cámara IP IMOU Ranger 2
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Cámara IP IMOU Ranger 2') THEN
        INSERT INTO public.products (name, description, price, category_id, brand, image_url, images, stock_quantity, sku, featured, active) VALUES
        ('Cámara IP IMOU Ranger 2', 'Cámara de seguridad IP con visión nocturna, detección de movimiento y audio bidireccional. Resolución 1080p Full HD.', 250000, camaras_cat_id, 'IMOU', '/productos/imou/imou_ranger_dual_hogar.jpg', ARRAY['/productos/imou/imou_ranger_dual_hogar.jpg'], 25, 'IMOU-RNG2-001', true, true)
        RETURNING id INTO product_id;

        INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
        (product_id, '/productos/imou/imou_ranger_dual_hogar.jpg', 'Cámara IP IMOU Ranger 2', true, 0);

        INSERT INTO public.inventory (product_id, quantity_available) VALUES (product_id, 25);
    END IF;

    -- Producto 2: Router WiFi 7 TP-Link
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Router WiFi 7 TP-Link Archer BE800') THEN
        INSERT INTO public.products (name, description, price, category_id, brand, image_url, images, stock_quantity, sku, featured, active) VALUES
        ('Router WiFi 7 TP-Link Archer BE800', 'Router de alta velocidad con tecnología WiFi 7, 10 puertos Gigabit y cobertura extendida.', 450000, equipos_cat_id, 'TP-Link', '/productos/tplink/wifi7_tplink.jpg', ARRAY['/productos/tplink/wifi7_tplink.jpg'], 15, 'TPL-BE800-001', true, true)
        RETURNING id INTO product_id;

        INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
        (product_id, '/productos/tplink/wifi7_tplink.jpg', 'Router WiFi 7 TP-Link Archer BE800', true, 0);

        INSERT INTO public.inventory (product_id, quantity_available) VALUES (product_id, 15);
    END IF;

    -- Producto 3: Panel Solar IMOU
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Panel Solar IMOU') THEN
        INSERT INTO public.products (name, description, price, category_id, brand, image_url, images, stock_quantity, sku, featured, active) VALUES
        ('Panel Solar IMOU', 'Panel solar para cámaras de seguridad, alimentación continua y ecológica.', 180000, accesorios_cat_id, 'IMOU', '/productos/imou/imou_panel_solar_Z.jpg', ARRAY['/productos/imou/imou_panel_solar_Z.jpg'], 10, 'IMOU-SOL-001', false, true)
        RETURNING id INTO product_id;

        INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
        (product_id, '/productos/imou/imou_panel_solar_Z.jpg', 'Panel Solar IMOU', true, 0);

        INSERT INTO public.inventory (product_id, quantity_available) VALUES (product_id, 10);
    END IF;

    -- Producto 4: Mouse Gaming Logitech
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Mouse Gaming Logitech G502') THEN
        INSERT INTO public.products (name, description, price, category_id, brand, image_url, images, stock_quantity, sku, featured, active) VALUES
        ('Mouse Gaming Logitech G502', 'Mouse gaming con sensor HERO, iluminación RGB y pesos ajustables.', 120000, perifericos_cat_id, 'Logitech', '/productos/Logitech/mouse_logitech_led.png', ARRAY['/productos/Logitech/mouse_logitech_led.png'], 30, 'LOG-G502-001', false, true)
        RETURNING id INTO product_id;

        INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
        (product_id, '/productos/Logitech/mouse_logitech_led.png', 'Mouse Gaming Logitech G502', true, 0);

        INSERT INTO public.inventory (product_id, quantity_available) VALUES (product_id, 30);
    END IF;
END $$;

-- ===================================
-- 12. CONFIGURACIÓN DE STORAGE (BUCKET PARA IMÁGENES)
-- ===================================

-- Crear bucket para productos (ejecutar solo si no existe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'products') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
    END IF;
END $$;

-- Políticas de storage
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'products' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'products' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'products' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ===================================
-- 13. VERIFICACIÓN Y FINALIZACIÓN
-- ===================================
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'CAPISHOP DATABASE SCHEMA SETUP COMPLETED!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Tables created: users, categories, products, product_images, inventory, orders, cart_items, system_settings';
    RAISE NOTICE 'RLS policies configured for all tables';
    RAISE NOTICE 'Indexes created for performance optimization';
    RAISE NOTICE 'Triggers configured for automation';
    RAISE NOTICE 'Sample data inserted';
    RAISE NOTICE 'Storage bucket and policies configured';
    RAISE NOTICE '============================================';
END $$;

COMMIT;
