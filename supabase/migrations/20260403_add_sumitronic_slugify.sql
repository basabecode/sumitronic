-- ============================================================
-- SUMITRONIC: alias de slugify post-rebranding
-- Fecha: 3 de abril de 2026
--
-- CONTEXTO:
--   La función capishop_slugify existe desde la migración
--   20260329_restore_backup_compatibility.sql y es el contrato
--   técnico activo. No se renombra para no romper migraciones
--   históricas ni restore.
--
--   Esta migración crea sumitronic_slugify como wrapper, para
--   que código nuevo pueda usar el nombre correcto de marca.
--   Ambas funciones conviven hasta que se decida retirar
--   la versión legacy en una fase posterior.
-- ============================================================

CREATE OR REPLACE FUNCTION public.sumitronic_slugify(input_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT public.capishop_slugify(input_text);
$$;

COMMENT ON FUNCTION public.sumitronic_slugify IS
  'Alias de capishop_slugify post-rebranding a SUMITRONIC. '
  'La función original se mantiene por compatibilidad con migraciones históricas.';
