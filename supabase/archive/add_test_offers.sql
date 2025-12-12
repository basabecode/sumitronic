-- ===================================
-- SCRIPT: Agregar Productos de Prueba con Ofertas
-- ===================================
-- Este script agrega productos de ejemplo con compare_price configurado
-- para probar la funcionalidad de ofertas.
-- Ejecutar en Supabase SQL Editor

BEGIN;

-- Obtener ID de categoría (usando la primera categoría disponible)
DO $$
DECLARE
    cat_id UUID;
    prod_id UUID;
BEGIN
    -- Obtener una categoría existente
    SELECT id INTO cat_id FROM public.categories LIMIT 1;

    IF cat_id IS NULL THEN
        RAISE EXCEPTION 'No hay categorías en la base de datos. Ejecuta primero schema.sql';
    END IF;

    -- Producto 1: Cámara con 24% de descuento
    INSERT INTO public.products (
        name,
        description,
        price,
        compare_price,
        category_id,
        brand,
        image_url,
        stock_quantity,
        sku,
        featured,
        active
    ) VALUES (
        'Cámara IP IMOU Ranger 2 - OFERTA',
        'Cámara de seguridad IP con visión nocturna, detección de movimiento y audio bidireccional. Resolución 1080p Full HD. ¡OFERTA ESPECIAL!',
        189900,
        249900,
        cat_id,
        'IMOU',
        '/placeholder.svg?height=300&width=300',
        15,
        'IMOU-RNG2-OFFER',
        true,
        true
    )
    ON CONFLICT (name) DO UPDATE
    SET compare_price = 249900, price = 189900
    RETURNING id INTO prod_id;

    -- Crear inventario para el producto
    INSERT INTO public.inventory (product_id, quantity_available)
    VALUES (prod_id, 15)
    ON CONFLICT (product_id) DO UPDATE SET quantity_available = 15;

    RAISE NOTICE 'Producto 1 creado: Cámara IP IMOU (24%% descuento)';

    -- Producto 2: Router con 25% de descuento
    INSERT INTO public.products (
        name,
        description,
        price,
        compare_price,
        category_id,
        brand,
        image_url,
        stock_quantity,
        sku,
        featured,
        active
    ) VALUES (
        'Router TP-Link AX3000 - OFERTA',
        'Router WiFi 6 de alta velocidad con cobertura extendida. Perfecto para gaming y streaming. ¡PRECIO ESPECIAL!',
        299900,
        399900,
        cat_id,
        'TP-Link',
        '/placeholder.svg?height=300&width=300',
        8,
        'TPL-AX3000-OFFER',
        true,
        true
    )
    ON CONFLICT (name) DO UPDATE
    SET compare_price = 399900, price = 299900
    RETURNING id INTO prod_id;

    INSERT INTO public.inventory (product_id, quantity_available)
    VALUES (prod_id, 8)
    ON CONFLICT (product_id) DO UPDATE SET quantity_available = 8;

    RAISE NOTICE 'Producto 2 creado: Router TP-Link (25%% descuento)';

    -- Producto 3: DVR con 25% de descuento
    INSERT INTO public.products (
        name,
        description,
        price,
        compare_price,
        category_id,
        brand,
        image_url,
        stock_quantity,
        sku,
        featured,
        active
    ) VALUES (
        'DVR Dahua 8 Canales - OFERTA',
        'Grabador digital de video para 8 cámaras. Incluye disco duro de 1TB. ¡SUPER OFERTA!',
        449900,
        599900,
        cat_id,
        'Dahua',
        '/placeholder.svg?height=300&width=300',
        5,
        'DAHUA-DVR8-OFFER',
        true,
        true
    )
    ON CONFLICT (name) DO UPDATE
    SET compare_price = 599900, price = 449900
    RETURNING id INTO prod_id;

    INSERT INTO public.inventory (product_id, quantity_available)
    VALUES (prod_id, 5)
    ON CONFLICT (product_id) DO UPDATE SET quantity_available = 5;

    RAISE NOTICE 'Producto 3 creado: DVR Dahua (25%% descuento)';

    -- Producto 4: UPS con 22% de descuento
    INSERT INTO public.products (
        name,
        description,
        price,
        compare_price,
        category_id,
        brand,
        image_url,
        stock_quantity,
        sku,
        featured,
        active
    ) VALUES (
        'UPS Forza 1000VA - OFERTA',
        'Sistema de alimentación ininterrumpida. Protege tus equipos de cortes de energía. ¡OFERTA LIMITADA!',
        349900,
        449900,
        cat_id,
        'Forza',
        '/placeholder.svg?height=300&width=300',
        12,
        'FORZA-UPS1000-OFFER',
        true,
        true
    )
    ON CONFLICT (name) DO UPDATE
    SET compare_price = 449900, price = 349900
    RETURNING id INTO prod_id;

    INSERT INTO public.inventory (product_id, quantity_available)
    VALUES (prod_id, 12)
    ON CONFLICT (product_id) DO UPDATE SET quantity_available = 12;

    RAISE NOTICE 'Producto 4 creado: UPS Forza (22%% descuento)';

END $$;

-- Verificar productos con ofertas
SELECT
    name,
    price,
    compare_price,
    ROUND(((compare_price - price) / compare_price) * 100) as discount_percent,
    brand,
    stock_quantity
FROM public.products
WHERE compare_price IS NOT NULL
  AND compare_price > price
  AND active = true
ORDER BY discount_percent DESC;

COMMIT;

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'PRODUCTOS DE PRUEBA CON OFERTAS CREADOS!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Se crearon 4 productos con descuentos del 22-25%%';
    RAISE NOTICE 'Recarga http://localhost:3003 para ver la sección de ofertas';
    RAISE NOTICE '============================================';
END $$;
