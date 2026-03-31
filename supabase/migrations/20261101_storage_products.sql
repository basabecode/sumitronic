-- Ensure the products storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public Read Policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access to products'
    ) THEN
        CREATE POLICY "Public Access to products"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'products' );
    END IF;
END
$$;

-- Auth Insert Policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Auth Insert to products'
    ) THEN
        CREATE POLICY "Auth Insert to products"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK ( bucket_id = 'products' );
    END IF;
END
$$;

-- Auth Update Policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Auth Update to products'
    ) THEN
        CREATE POLICY "Auth Update to products"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING ( bucket_id = 'products' );
    END IF;
END
$$;

-- Auth Delete Policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Auth Delete to products'
    ) THEN
        CREATE POLICY "Auth Delete to products"
        ON storage.objects FOR DELETE
        TO authenticated
        USING ( bucket_id = 'products' );
    END IF;
END
$$;
