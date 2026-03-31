BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.capishop_slugify(input_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(both '-' from regexp_replace(lower(coalesce(input_text, '')), '[^a-z0-9]+', '-', 'g'));
$$;

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS image_url text;

-- image_url already set in initial schema; skip old column renaming
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='image') THEN
    UPDATE public.categories SET image_url = COALESCE(image_url, image) WHERE image_url IS NULL;
  END IF;
END $$;

WITH category_slugs AS (
  SELECT
    id,
    CASE
      WHEN row_number() OVER (
        PARTITION BY NULLIF(public.capishop_slugify(name), '')
        ORDER BY created_at NULLS LAST, id
      ) = 1
      THEN COALESCE(NULLIF(public.capishop_slugify(name), ''), 'categoria')
      ELSE COALESCE(NULLIF(public.capishop_slugify(name), ''), 'categoria') || '-' || left(replace(id::text, '-', ''), 8)
    END AS computed_slug
  FROM public.categories
)
UPDATE public.categories AS categories
SET slug = category_slugs.computed_slug
FROM category_slugs
WHERE categories.id = category_slugs.id
  AND (categories.slug IS NULL OR categories.slug = '');

ALTER TABLE public.categories
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug_unique
  ON public.categories (slug);

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS compare_price numeric(10, 2),
  ADD COLUMN IF NOT EXISTS category_id uuid,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS weight numeric,
  ADD COLUMN IF NOT EXISTS dimensions jsonb;

-- image/stock columns only exist in old Supabase backup; skip if not present
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='image') THEN
    UPDATE public.products SET image_url = COALESCE(image_url, image) WHERE image_url IS NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='stock') THEN
    UPDATE public.products SET stock_quantity = COALESCE(stock_quantity, stock, 0) WHERE stock_quantity IS NULL;
  END IF;
END $$;

-- category text column only exists in old backup; skip if not present
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category') THEN
    UPDATE public.products AS products
    SET category_id = categories.id
    FROM public.categories AS categories
    WHERE products.category_id IS NULL
      AND lower(trim(products.category)) = lower(trim(categories.name));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_category_id_fkey'
      AND conrelid = 'public.products'::regclass
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_category_id_fkey
      FOREIGN KEY (category_id)
      REFERENCES public.categories(id);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_products_category_id
  ON public.products (category_id);

CREATE INDEX IF NOT EXISTS idx_products_compare_price
  ON public.products (compare_price)
  WHERE compare_price IS NOT NULL AND compare_price > 0;

CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  is_primary boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT
  products.id,
  products.image_url,
  products.name,
  true,
  0
FROM public.products AS products
WHERE COALESCE(products.image_url, '') <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM public.product_images AS product_images
    WHERE product_images.product_id = products.id
      AND product_images.is_primary = true
  );

CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_available integer NOT NULL DEFAULT 0,
  reserved_quantity integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 5,
  last_updated timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.inventory (product_id, quantity_available, reserved_quantity, low_stock_threshold, last_updated)
SELECT
  products.id,
  COALESCE(products.stock_quantity, 0),
  0,
  5,
  now()
FROM public.products AS products
WHERE NOT EXISTS (
  SELECT 1
  FROM public.inventory AS inventory
  WHERE inventory.product_id = products.id
);

CREATE TABLE IF NOT EXISTS public.carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_carts_user_id_unique
  ON public.carts (user_id)
  WHERE user_id IS NOT NULL;

-- user_id on cart_items only exists in old backup schema; skip if not present
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='user_id') THEN
    INSERT INTO public.carts (user_id)
    SELECT DISTINCT cart_items.user_id
    FROM public.cart_items AS cart_items
    WHERE cart_items.user_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1
        FROM public.carts AS carts
        WHERE carts.user_id = cart_items.user_id
      );
  END IF;
END $$;

ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS cart_id uuid,
  ADD COLUMN IF NOT EXISTS variant_id uuid,
  ADD COLUMN IF NOT EXISTS price numeric(10, 2);

-- cart_items.user_id only exists in old backup; skip update if not present
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart_items' AND column_name='user_id') THEN
    UPDATE public.cart_items AS cart_items
    SET
      cart_id = carts.id,
      price = COALESCE(
        cart_items.price,
        (
          SELECT products.price
          FROM public.products AS products
          WHERE products.id = cart_items.product_id
        )
      )
    FROM public.carts AS carts
    WHERE cart_items.user_id = carts.user_id
      AND (cart_items.cart_id IS NULL OR cart_items.price IS NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'cart_items_cart_id_fkey'
      AND conrelid = 'public.cart_items'::regclass
  ) THEN
    ALTER TABLE public.cart_items
      ADD CONSTRAINT cart_items_cart_id_fkey
      FOREIGN KEY (cart_id)
      REFERENCES public.carts(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'cart_items_product_id_fkey'
      AND conrelid = 'public.cart_items'::regclass
  ) THEN
    ALTER TABLE public.cart_items
      ADD CONSTRAINT cart_items_product_id_fkey
      FOREIGN KEY (product_id)
      REFERENCES public.products(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_cart_product_unique
  ON public.cart_items (cart_id, product_id)
  WHERE cart_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_number text,
  ADD COLUMN IF NOT EXISTS payment_proof_url text,
  ADD COLUMN IF NOT EXISTS shipping_address jsonb,
  ADD COLUMN IF NOT EXISTS billing_address jsonb;

UPDATE public.orders
SET
  shipping_address = COALESCE(shipping_address, customer_info -> 'shipping_address', customer_info -> 'address'),
  billing_address = COALESCE(billing_address, customer_info -> 'billing_address', customer_info -> 'address')
WHERE shipping_address IS NULL
   OR billing_address IS NULL;

UPDATE public.orders
SET order_number = 'ORD-' || to_char(COALESCE(created_at, now()), 'YYYYMMDD') || '-' || upper(left(replace(id::text, '-', ''), 6))
WHERE order_number IS NULL OR order_number = '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number_unique
  ON public.orders (order_number);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id uuid,
  product_name text NOT NULL,
  product_sku text,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10, 2) NOT NULL DEFAULT 0,
  total_price numeric(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.order_items (
  order_id,
  product_id,
  product_name,
  product_sku,
  quantity,
  unit_price,
  total_price,
  created_at
)
SELECT
  orders.id,
  CASE
    WHEN COALESCE(item ->> 'product_id', '') ~* '^[0-9a-f-]{36}$' THEN (item ->> 'product_id')::uuid
    ELSE NULL
  END,
  COALESCE(item ->> 'name', item ->> 'product_name', 'Producto'),
  item ->> 'sku',
  GREATEST(COALESCE((item ->> 'quantity')::integer, 1), 1),
  COALESCE((item ->> 'price')::numeric, (item ->> 'unit_price')::numeric, 0),
  GREATEST(COALESCE((item ->> 'quantity')::integer, 1), 1) *
    COALESCE((item ->> 'price')::numeric, (item ->> 'unit_price')::numeric, 0),
  orders.created_at
FROM public.orders AS orders
CROSS JOIN LATERAL jsonb_array_elements(
  CASE
    WHEN jsonb_typeof(orders.items) = 'array' THEN orders.items
    ELSE '[]'::jsonb
  END
) AS item
WHERE NOT EXISTS (
  SELECT 1
  FROM public.order_items AS order_items
  WHERE order_items.order_id = orders.id
);

COMMIT;
