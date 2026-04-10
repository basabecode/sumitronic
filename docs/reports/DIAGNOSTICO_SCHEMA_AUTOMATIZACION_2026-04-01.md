# Diagnostico Del Schema Para Automatizacion

Fecha de auditoria: 2026-04-01
Fecha de cierre / saneamiento: 2026-04-01
Fecha de aplicacion en DB: 2026-04-01
Estado: COMPLETADO — migracion aplicada y verificada en base de datos real

---

## Resumen Ejecutivo

La auditoria identifico deriva entre el schema real de la base de datos, los tipos TypeScript del proyecto y la documentacion existente. Esa deriva representaba riesgo real para cualquier automatizacion de ingreso de productos.

**Todos los hallazgos de Fase 1 fueron resueltos en la misma sesion.** El schema esta ahora alineado, los tipos TypeScript fueron regenerados desde la DB real, y existe un contrato formal para integraciones externas.

---

## Archivos Creados o Modificados En Esta Sesion

| Archivo                                                   | Accion      | Descripcion                                                        |
| --------------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `supabase/migrations/20260401_sanear_schema_contrato.sql` | CREADO      | Migración SQL idempotente — unifica precios, sincroniza inventory  |
| `lib/types/database.ts`                                   | ACTUALIZADO | Tipos regenerados desde schema real, eliminados campos fantasma    |
| `docs/guides/CONTRATO_GOOGLE_SHEETS.md`                   | CREADO      | Contrato oficial para integracion automatizada desde Google Sheets |

---

## Estado Por Hallazgo

### Hallazgo 1 — Columna duplicada de precio comparativo

**Estado: RESUELTO**

- `compare_at_price` — ELIMINADA mediante migracion
- `compare_price` — columna oficial establecida

La migracion `20260401_sanear_schema_contrato.sql` copia los datos de `compare_at_price` a `compare_price` (solo donde `compare_price` sea NULL) y luego elimina la columna legacy con guard `IF EXISTS`.

Para aplicar cuando Docker este activo:

```bash
docker exec -i supabase_db_CapiShop_Web psql -U postgres -d postgres < supabase/migrations/20260401_sanear_schema_contrato.sql
```

---

### Hallazgo 2 — Doble modelo de inventario

**Estado: RESUELTO**

- Fuente oficial establecida: `products.stock_quantity`
- La tabla `inventory` se mantiene como tabla auxiliar sincronizada

La migracion inserta filas faltantes en `inventory` para todos los productos que no tengan una, usando `products.stock_quantity` como valor inicial. Agrega indice `idx_inventory_product_id`.

El contrato de Google Sheets documenta el SQL de sincronizacion que debe ejecutar cualquier script al actualizar stock.

---

### Hallazgo 3 — Tipos TypeScript desactualizados

**Estado: RESUELTO**

`lib/types/database.ts` fue regenerado. Campos fantasma eliminados:

| Campo eliminado             | Razon                                     |
| --------------------------- | ----------------------------------------- |
| `slug` (en products)        | No existe en la tabla real                |
| `short_description`         | No existe en la tabla real                |
| `track_inventory`           | No existe en la tabla real                |
| `inventory_quantity`        | No existe en la tabla real                |
| `featured_image`            | No existe en la tabla real                |
| `is_active` (en categories) | La DB usa `active`                        |
| `parent_id` (en categories) | No existe, no hay jerarquia de categorias |

Campos reales agregados:

| Campo agregado  | Tabla    |
| --------------- | -------- |
| `barcode`       | products |
| `brand`         | products |
| `image_url`     | products |
| `images`        | products |
| `featured`      | products |
| `active`        | products |
| `tags`          | products |
| `search_vector` | products |
| `cost_price`    | products |

Alias `Profile = Tables<'users'>` preservado para compatibilidad con `AuthContext.tsx` (unico consumidor del archivo).

---

### Hallazgo 4 — `supabase/schema.sql` desactualizado

**Estado: PENDIENTE — Fase 2**

Regenerar `supabase/schema.sql` desde la base viva una vez aplicada la migracion de saneamiento y cuando el entorno Docker este estable.

---

### Hallazgo 5 — `categories` con tipos inconsistentes

**Estado: RESUELTO**

`lib/types/database.ts` ahora usa `active` (no `is_active`) y no incluye `parent_id` para categories, alineado con la tabla real.

---

### Hallazgo 6 — `product_images` vacia en la practica

**Estado: DOCUMENTADO**

El contrato oficial establece que `products.image_url` es la imagen principal. `product_images` es tabla auxiliar opcional. El `ProductClient.tsx` fue actualizado separadamente para usar `image_url` como fallback cuando `product_images` este vacia.

---

## Estado De Riesgo — Post Saneamiento

| Automatizacion                      | Riesgo antes | Riesgo ahora                       |
| ----------------------------------- | ------------ | ---------------------------------- |
| Operacion actual de la tienda       | Medio        | Bajo                               |
| Automatizacion de precios           | Medio-alto   | Bajo (columna unificada)           |
| Automatizacion de inventario        | Alto         | Medio (sincronizacion documentada) |
| Generacion de codigo desde tipos TS | Alto         | Bajo (tipos regenerados)           |

---

## Fuente Unica De Verdad — Contrato Vigente

| Concepto                      | Columna oficial                 | Estado          |
| ----------------------------- | ------------------------------- | --------------- |
| Precio de venta               | `products.price`                | Activa          |
| Precio antes del descuento    | `products.compare_price`        | Activa          |
| ~~Precio comparativo legacy~~ | ~~`products.compare_at_price`~~ | ELIMINADA       |
| Stock disponible              | `products.stock_quantity`       | Fuente primaria |
| Inventario auxiliar           | `inventory.quantity_available`  | Sincronizado    |
| Imagen principal              | `products.image_url`            | Activa          |
| Galeria adicional             | `products.images` (array)       | Activa          |
| Estado visible                | `products.active`               | Activa          |
| Destacado en home             | `products.featured`             | Activa          |

---

## Contrato Para Integracion Google Sheets

Documento completo disponible en:

```
docs/guides/CONTRATO_GOOGLE_SHEETS.md
```

Incluye:

- 17 columnas del Sheet mapeadas a campos de DB (columnas A a Q)
- Especificacion de tipo, formato y obligatoriedad por campo
- Columnas prohibidas (auto-generadas por la DB)
- Logica de upsert recomendada (deduplicar por `sku`, secundario por `name`)
- SQL de sincronizacion de `inventory` al actualizar stock
- Validaciones que debe implementar el script
- Fila de ejemplo completa
- Registro de campos deprecados

---

## Plan De Reparacion — Estado Actualizado

### Fase 1. Saneamiento minimo — COMPLETADA

| #   | Tarea                                                          | Estado               | Archivo                                 |
| --- | -------------------------------------------------------------- | -------------------- | --------------------------------------- |
| 1   | Definir `compare_price` como columna oficial                   | LISTO                | `20260401_sanear_schema_contrato.sql`   |
| 2   | Migrar datos de `compare_at_price` a `compare_price`           | LISTO (en migracion) | `20260401_sanear_schema_contrato.sql`   |
| 3   | Eliminar `compare_at_price`                                    | LISTO (en migracion) | `20260401_sanear_schema_contrato.sql`   |
| 4   | Definir `products.stock_quantity` como fuente oficial de stock | LISTO                | Contrato + migracion                    |
| 5   | Regenerar `lib/types/database.ts` desde la base viva           | LISTO                | `lib/types/database.ts`                 |
| 6   | Documentar contrato oficial para automatizacion                | LISTO                | `docs/guides/CONTRATO_GOOGLE_SHEETS.md` |

**Migracion aplicada y verificada el 2026-04-01.** Resultados confirmados en DB:

- `compare_at_price`: eliminada (0 filas en information_schema)
- `compare_price`: presente y activa
- `products sin inventory`: 0 (todos sincronizados)
- `products.stock_quantity` = `inventory.quantity_available` para todos los productos

### Fase 2. Consolidacion tecnica — PENDIENTE

| #   | Tarea                                                       | Estado                            |
| --- | ----------------------------------------------------------- | --------------------------------- |
| 1   | Decidir arquitectura definitiva de `inventory`              | Pendiente                         |
| 2   | Sincronizar `inventory` para todos los productos existentes | En migracion (listo para aplicar) |
| 3   | Regenerar `supabase/schema.sql` post-migracion              | Pendiente                         |
| 4   | Limpiar migraciones residuales contradictorias              | Pendiente                         |

### Fase 3. Endurecimiento del contrato — PENDIENTE

| #   | Tarea                                                      | Estado    |
| --- | ---------------------------------------------------------- | --------- |
| 1   | Agregar constraints de validacion en DB                    | Pendiente |
| 2   | Agregar scripts de verificacion automatica pre-ETL         | Pendiente |
| 3   | Implementar trigger para mantener `inventory` sincronizado | Pendiente |

---

## Que Esta Bien

- Las tablas clave existen con FK correctas
- Hay indices utiles para catalogo
- `products`, `categories`, `product_images` e `inventory` tienen estructura suficiente para crecer
- El catalogo actual puede operar con el modelo vigente
- Los tipos TypeScript ahora reflejan el schema real
- Existe un contrato formal documentado para automatizaciones

---

## Verificacion Final — Estado Real De La DB (2026-04-01)

```
 total_products | total_inventory | productos_sin_inventory | columna_legacy_existe | columna_oficial_existe
----------------+-----------------+-------------------------+-----------------------+------------------------
              1 |               1 |                       0 |                     0 |                      1
```

- `compare_at_price` eliminada: SI
- `compare_price` presente: SI
- Todos los productos tienen fila en `inventory`: SI
- `stock_quantity` sincronizado con `inventory.quantity_available`: SI

La migracion es idempotente y puede correrse nuevamente sin riesgo ante nuevos productos que se agreguen.
