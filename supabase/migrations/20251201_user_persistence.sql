-- Migración CORREGIDA y COMPLETA para persistencia
-- Este script crea todas las tablas necesarias si no existen

-- 0. Asegurar tabla de Variantes de Productos (Faltante)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    compare_price DECIMAL(10, 2),
    sku TEXT,
    inventory_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1. Tabla de Favoritos (Wishlist)
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Agregar columnas a favorites si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'favorites' AND column_name = 'user_id') THEN
        ALTER TABLE public.favorites ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'favorites' AND column_name = 'product_id') THEN
        ALTER TABLE public.favorites ADD COLUMN product_id UUID REFERENCES public.products(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Asegurar restricción única en favoritos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'favorites_user_id_product_id_key') THEN
        ALTER TABLE public.favorites ADD CONSTRAINT favorites_user_id_product_id_key UNIQUE(user_id, product_id);
    END IF;
END $$;

-- 2. Tabla Carts
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Agregar columnas a carts si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'carts' AND column_name = 'user_id') THEN
        ALTER TABLE public.carts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'carts' AND column_name = 'session_id') THEN
        ALTER TABLE public.carts ADD COLUMN session_id TEXT;
    END IF;
END $$;

-- 3. Tabla Cart Items
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Agregar columnas a cart_items si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'cart_id') THEN
        ALTER TABLE public.cart_items ADD COLUMN cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'product_id') THEN
        ALTER TABLE public.cart_items ADD COLUMN product_id UUID REFERENCES public.products(id) ON DELETE CASCADE;
    END IF;

    -- Aquí estaba el error: Ahora product_variants ya existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'variant_id') THEN
        ALTER TABLE public.cart_items ADD COLUMN variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'quantity') THEN
        ALTER TABLE public.cart_items ADD COLUMN quantity INTEGER DEFAULT 1;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'price') THEN
        ALTER TABLE public.cart_items ADD COLUMN price DECIMAL(10, 2) DEFAULT 0;
    END IF;
END $$;

-- 4. Habilitar RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
-- Habilitar RLS para product_variants si se desea, aunque es pública generalmente para lectura
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Variantes son públicas" ON public.product_variants FOR SELECT USING (true);


-- 5. Políticas de Seguridad (Recreación limpia)
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios favoritos" ON public.favorites;
DROP POLICY IF EXISTS "Usuarios pueden agregar sus propios favoritos" ON public.favorites;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus propios favoritos" ON public.favorites;

CREATE POLICY "Usuarios pueden ver sus propios favoritos" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden agregar sus propios favoritos" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden eliminar sus propios favoritos" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden ver su propio carrito" ON public.carts;
DROP POLICY IF EXISTS "Usuarios pueden crear su propio carrito" ON public.carts;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio carrito" ON public.carts;

CREATE POLICY "Usuarios pueden ver su propio carrito" ON public.carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden crear su propio carrito" ON public.carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden actualizar su propio carrito" ON public.carts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios pueden ver items de su carrito" ON public.cart_items;
DROP POLICY IF EXISTS "Usuarios pueden agregar items a su carrito" ON public.cart_items;
DROP POLICY IF EXISTS "Usuarios pueden actualizar items de su carrito" ON public.cart_items;
DROP POLICY IF EXISTS "Usuarios pueden eliminar items de su carrito" ON public.cart_items;

CREATE POLICY "Usuarios pueden ver items de su carrito" ON public.cart_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

CREATE POLICY "Usuarios pueden agregar items a su carrito" ON public.cart_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

CREATE POLICY "Usuarios pueden actualizar items de su carrito" ON public.cart_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

CREATE POLICY "Usuarios pueden eliminar items de su carrito" ON public.cart_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

-- 6. Índices
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
