-- ===================================
-- MIGRATION: Add compare_price field to products table
-- ===================================
-- This migration adds support for product offers/discounts
-- by adding a compare_price field to the products table.
-- Execute this in your Supabase SQL Editor.

BEGIN;

-- Add compare_price column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10,2) CHECK (compare_price >= 0);

-- Add comment to explain the field
COMMENT ON COLUMN public.products.compare_price IS 'Original price for showing discounts. When set and greater than price, product is considered on offer.';

-- Create index for filtering products with offers
CREATE INDEX IF NOT EXISTS idx_products_compare_price ON public.products(compare_price) WHERE compare_price IS NOT NULL AND compare_price > 0;

-- Verification
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'COMPARE_PRICE MIGRATION COMPLETED!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Added compare_price column to products table';
    RAISE NOTICE 'Added index for offer filtering';
    RAISE NOTICE 'Products with compare_price > price will show as offers';
    RAISE NOTICE '============================================';
END $$;

COMMIT;
