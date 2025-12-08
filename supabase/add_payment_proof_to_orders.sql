-- Add payment_proof_url to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;

-- Update RLS policies to ensure admins can read this column (already covered by "Admins can view all orders" generally, but good to be safe if specific field policies existed - which they don't generally in Supabase default setup, but we'll stick to the column addition).
