-- ============================================================
-- MIGRACION: Agregar columna price a cart_items
-- Fecha: 2026-04-10
-- Descripcion:
--   La API de carrito (app/api/cart/route.ts) consulta e inserta
--   cart_items.price pero la columna no estaba en el schema original.
--   Esta migración la agrega de forma segura e idempotente.
--
-- Aplicar en: Supabase cloud antes del deploy a producción.
-- ============================================================

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'cart_items'
      AND column_name  = 'price'
  ) THEN
    ALTER TABLE public.cart_items
      ADD COLUMN price numeric NOT NULL DEFAULT 0;

    RAISE NOTICE 'Columna price agregada a cart_items con DEFAULT 0';
  ELSE
    RAISE NOTICE 'Columna price ya existe en cart_items — nada que hacer';
  END IF;
END $$;

-- Verificación final
DO $$
DECLARE
  col_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'cart_items'
      AND column_name  = 'price'
  ) INTO col_exists;

  IF col_exists THEN
    RAISE NOTICE 'OK: cart_items.price confirmada en el schema';
  ELSE
    RAISE EXCEPTION 'ERROR: cart_items.price no existe — revisar permisos';
  END IF;
END $$;

COMMIT;
