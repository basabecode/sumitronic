-- ===================================
-- VERIFICACIÓN DEL SCHEMA SUMITRONIC
-- ===================================
-- Script para verificar que todas las tablas, políticas y funciones
-- se hayan creado correctamente en Supabase

-- ===================================
-- 1. VERIFICAR TABLAS PRINCIPALES
-- ===================================
SELECT
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'products', 'orders', 'categories', 'cart_items')
ORDER BY tablename;

-- ===================================
-- 2. VERIFICAR ROW LEVEL SECURITY
-- ===================================
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'products', 'orders', 'categories', 'cart_items');

-- ===================================
-- 3. VERIFICAR POLÍTICAS DE SEGURIDAD
-- ===================================
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===================================
-- 4. VERIFICAR FUNCIONES CREADAS
-- ===================================
SELECT
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('update_updated_at_column', 'handle_new_user');

-- ===================================
-- 5. VERIFICAR TRIGGERS
-- ===================================
SELECT
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- ===================================
-- 6. VERIFICAR ÍNDICES
-- ===================================
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('users', 'products', 'orders', 'categories', 'cart_items')
ORDER BY tablename, indexname;

-- ===================================
-- 7. VERIFICAR STORAGE BUCKETS
-- ===================================
SELECT
    id,
    name,
    public,
    created_at
FROM storage.buckets
WHERE name = 'products';

-- ===================================
-- 8. VERIFICAR POLÍTICAS DE STORAGE
-- ===================================
SELECT
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects';

-- ===================================
-- 9. CONTAR REGISTROS DE EJEMPLO
-- ===================================
SELECT 'categories' as tabla, COUNT(*) as registros FROM public.categories
UNION ALL
SELECT 'products' as tabla, COUNT(*) as registros FROM public.products
UNION ALL
SELECT 'users' as tabla, COUNT(*) as registros FROM public.users
UNION ALL
SELECT 'orders' as tabla, COUNT(*) as registros FROM public.orders
ORDER BY tabla;

-- ===================================
-- 10. VERIFICAR CONSTRAINTS
-- ===================================
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('users', 'products', 'orders', 'categories', 'cart_items')
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- ===================================
-- RESUMEN DE VERIFICACIÓN
-- ===================================
SELECT
    'VERIFICACIÓN COMPLETADA' as status,
    'Ejecuta este script en Supabase SQL Editor para verificar la configuración' as instrucciones;
