-- ============================================================
-- MIGRACION: Saneamiento de schema para contrato Google Sheets
-- Fecha: 2026-04-01
-- Descripcion:
--   1. Unifica precio comparativo (compare_at_price -> compare_price)
--   2. Sincroniza tabla inventory desde products.stock_quantity
--   3. Elimina columna legacy compare_at_price
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────────────────
-- PASO 1: Migrar datos de compare_at_price -> compare_price
--
-- Solo actualiza filas donde compare_price es NULL y
-- compare_at_price tiene valor. Nunca sobreescribe datos
-- validos ya existentes en compare_price.
-- ────────────────────────────────────────────────────────────

DO $$
DECLARE
  filas_migradas INTEGER;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'products'
      AND column_name  = 'compare_at_price'
  ) THEN
    UPDATE public.products
    SET compare_price = compare_at_price
    WHERE compare_price IS NULL
      AND compare_at_price IS NOT NULL
      AND compare_at_price > 0;

    GET DIAGNOSTICS filas_migradas = ROW_COUNT;
    RAISE NOTICE 'compare_at_price -> compare_price: % filas migradas', filas_migradas;
  ELSE
    RAISE NOTICE 'Columna compare_at_price no existe, nada que migrar';
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────
-- PASO 2: Asegurar que compare_price tiene indice
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_compare_price
  ON public.products (compare_price)
  WHERE compare_price IS NOT NULL AND compare_price > 0;

-- ────────────────────────────────────────────────────────────
-- PASO 3: Eliminar columna legacy compare_at_price
-- ────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'products'
      AND column_name  = 'compare_at_price'
  ) THEN
    ALTER TABLE public.products DROP COLUMN compare_at_price;
    RAISE NOTICE 'Columna compare_at_price eliminada';
  ELSE
    RAISE NOTICE 'Columna compare_at_price ya no existe, nada que eliminar';
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────
-- PASO 4: Sincronizar inventory desde products.stock_quantity
--
-- Para cada producto que no tenga fila en inventory, inserta
-- una fila usando products.stock_quantity como cantidad
-- disponible inicial. No modifica filas existentes.
-- ────────────────────────────────────────────────────────────

DO $$
DECLARE
  filas_insertadas INTEGER;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name   = 'inventory'
  ) THEN
    INSERT INTO public.inventory (
      product_id,
      quantity_available,
      reserved_quantity,
      low_stock_threshold,
      last_updated
    )
    SELECT
      p.id,
      COALESCE(p.stock_quantity, 0),
      0,
      5,
      now()
    FROM public.products AS p
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.inventory AS inv
      WHERE inv.product_id = p.id
    );

    GET DIAGNOSTICS filas_insertadas = ROW_COUNT;
    RAISE NOTICE 'inventory: % filas nuevas insertadas desde products.stock_quantity', filas_insertadas;
  ELSE
    RAISE NOTICE 'Tabla inventory no existe';
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────
-- PASO 5: Agregar indice en inventory.product_id (si no existe)
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_inventory_product_id
  ON public.inventory (product_id);

-- ────────────────────────────────────────────────────────────
-- VERIFICACION FINAL: mostrar estado post-migracion
-- ────────────────────────────────────────────────────────────

DO $$
DECLARE
  total_products INTEGER;
  total_inventory INTEGER;
  sin_inventario INTEGER;
  con_compare_price INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_products FROM public.products;
  SELECT COUNT(*) INTO total_inventory FROM public.inventory;
  SELECT COUNT(*) INTO sin_inventario FROM public.products p
    WHERE NOT EXISTS (SELECT 1 FROM public.inventory i WHERE i.product_id = p.id);
  SELECT COUNT(*) INTO con_compare_price FROM public.products
    WHERE compare_price IS NOT NULL AND compare_price > 0;

  RAISE NOTICE '--- ESTADO POST-MIGRACION ---';
  RAISE NOTICE 'products total: %', total_products;
  RAISE NOTICE 'inventory total: %', total_inventory;
  RAISE NOTICE 'products sin fila en inventory: % (debe ser 0)', sin_inventario;
  RAISE NOTICE 'products con compare_price: %', con_compare_price;
END $$;

COMMIT;
