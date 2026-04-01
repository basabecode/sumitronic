# Contrato de datos — Integración Google Sheets a CapiShop

Versión: 1.0 — 2026-04-01
Tabla destino: `public.products`
Base de datos: PostgreSQL (Supabase — Docker local / Supabase Cloud)

Este documento define el contrato oficial para el ingreso automatizado de
productos desde Google Sheets. Cualquier script de sincronización, Apps Script
o integración ETL debe respetar este contrato.

---

## Fuente de verdad

| Concepto              | Columna oficial          | Notas                                      |
|-----------------------|--------------------------|--------------------------------------------|
| Precio de venta       | `products.price`         | Siempre en COP, sin separadores            |
| Precio comparativo    | `products.compare_price` | Precio antes del descuento. NULL = sin oferta |
| Stock disponible      | `products.stock_quantity`| Fuente primaria de inventario              |
| Imagen principal      | `products.image_url`     | URL pública directa                        |
| Estado activo         | `products.active`        | TRUE = visible en tienda                   |

---

## Columnas del Google Sheet

### Orden recomendado de columnas en el Sheet

| Columna | Nombre en Sheet        | Campo en DB          | Obligatorio |
|---------|------------------------|----------------------|-------------|
| A       | nombre                 | `name`               | SI          |
| B       | descripcion            | `description`        | SI          |
| C       | precio                 | `price`              | SI          |
| D       | precio_comparativo     | `compare_price`      | NO          |
| E       | precio_costo           | `cost_price`         | NO          |
| F       | categoria_id           | `category_id`        | SI          |
| G       | marca                  | `brand`              | SI          |
| H       | imagen_url             | `image_url`          | SI          |
| I       | imagenes_adicionales   | `images`             | NO          |
| J       | stock                  | `stock_quantity`     | SI          |
| K       | sku                    | `sku`                | NO*         |
| L       | codigo_barras          | `barcode`            | NO          |
| M       | peso_kg                | `weight`             | NO          |
| N       | dimensiones            | `dimensions`         | NO          |
| O       | destacado              | `featured`           | NO          |
| P       | activo                 | `active`             | NO          |
| Q       | etiquetas              | `tags`               | NO          |

*`sku` debe ser unico si se provee. Dejar en blanco si no se tiene.

---

## Especificacion de cada campo

### `name` — Nombre del producto
- Tipo: texto
- Obligatorio: SI
- Unico: SI (no puede repetirse en la DB)
- Longitud maxima recomendada: 200 caracteres
- Ejemplo: `Camara IP Hikvision DS-2CD2143G2-I 4MP`

### `description` — Descripcion completa
- Tipo: texto largo
- Obligatorio: SI
- Puede contener saltos de linea (se almacena tal como viene)
- Ejemplo: `Camara domo IP de 4 megapixeles con vision nocturna AcuSense...`

### `price` — Precio de venta en COP
- Tipo: numero entero o decimal
- Obligatorio: SI
- Sin puntos ni comas de miles. Solo el numero.
- Ejemplo correcto: `285000`
- Ejemplo incorrecto: `285.000` o `$285,000`

### `compare_price` — Precio antes del descuento (opcional)
- Tipo: numero entero o decimal
- Obligatorio: NO
- Dejar en blanco si el producto no esta en oferta
- Debe ser mayor que `price` para que la UI muestre el descuento
- Ejemplo: `320000`

### `cost_price` — Precio de costo (interno, no visible en tienda)
- Tipo: numero entero o decimal
- Obligatorio: NO
- Ejemplo: `195000`

### `category_id` — ID de la categoria
- Tipo: UUID (texto de 36 caracteres)
- Obligatorio: SI
- Debe ser un UUID existente en la tabla `categories`
- Consultar tabla de categorias disponibles al final de este documento
- Ejemplo: `3f2e9a1b-4c8d-4e7f-a321-123456789abc`

### `brand` — Marca del producto
- Tipo: texto
- Obligatorio: SI
- Valores estandar del proyecto: `Hikvision`, `Dahua`, `Hanwha`, `Bosch`, `Paradox`
- Respetar mayusculas exactas para consistencia en filtros
- Ejemplo: `Hikvision`

### `image_url` — URL de la imagen principal
- Tipo: URL completa (texto)
- Obligatorio: SI
- Debe ser una URL publica accesible
- Formatos validos: jpg, jpeg, png, webp
- Ejemplo: `https://storage.googleapis.com/capishop/productos/hikvision-ds-2cd2143.jpg`

### `images` — URLs de imagenes adicionales (galeria)
- Tipo: lista de URLs separadas por coma
- Obligatorio: NO
- El script debe parsear esto como array antes de insertar
- Ejemplo: `https://ejemplo.com/img1.jpg,https://ejemplo.com/img2.jpg`

### `stock_quantity` — Cantidad en stock
- Tipo: numero entero
- Obligatorio: SI
- Minimo: 0
- Ejemplo: `15`

### `sku` — Codigo unico del producto
- Tipo: texto
- Obligatorio: NO (pero muy recomendado)
- Debe ser unico en toda la tabla si se provee
- Dejar celda vacia si no se tiene (el script debe enviar NULL, no string vacio)
- Ejemplo: `HVN-DS2CD2143G2-I`

### `barcode` — Codigo de barras EAN/UPC
- Tipo: texto
- Obligatorio: NO
- Ejemplo: `6941264078516`

### `weight_kg` — Peso en kilogramos
- Tipo: decimal
- Obligatorio: NO
- Ejemplo: `0.85`

### `dimensions` — Dimensiones (largo x ancho x alto en cm)
- Tipo: JSON serializado como texto en el Sheet
- Obligatorio: NO
- El script debe parsear esto como objeto JSON antes de insertar
- Formato en Sheet: `{"length":12.5,"width":12.5,"height":9.4}`
- Si se deja vacio, el script debe enviar NULL

### `featured` — Producto destacado en home
- Tipo: booleano
- Obligatorio: NO
- Valores validos en Sheet: `TRUE`, `FALSE`, `1`, `0`, `SI`, `NO`
- Predeterminado: `FALSE`

### `active` — Producto visible en tienda
- Tipo: booleano
- Obligatorio: NO
- Predeterminado: `TRUE`
- Poner `FALSE` para subir productos sin publicar

### `tags` — Etiquetas para busqueda
- Tipo: lista separada por coma
- Obligatorio: NO
- El script debe parsear esto como array de strings
- Ejemplo: `camara,exterior,4mp,acusense`

---

## Columnas que NO deben incluirse en el Sheet

Estas columnas son auto-generadas por la DB o por el sistema. El script de
sincronizacion nunca debe intentar escribirlas:

| Columna         | Razon                                        |
|-----------------|----------------------------------------------|
| `id`            | UUID auto-generado por la DB (gen_random_uuid) |
| `search_vector` | Mantenido por trigger de PostgreSQL          |
| `created_at`    | Auto-generado (now())                        |
| `updated_at`    | Auto-actualizado por trigger                 |

---

## Logica de upsert recomendada

Para el script de sincronizacion, el comportamiento esperado es:

1. Si el producto ya existe (identificado por `sku` o por `name`):
   - Actualizar los campos del Sheet, sin tocar `id`, `created_at`
2. Si el producto no existe:
   - Insertar fila nueva
   - Crear fila en `inventory` sincronizando `stock_quantity`
   - Crear fila en `product_images` con `image_url` como imagen primaria

Columna de deduplicacion preferida: `sku` (si no esta vacio)
Columna de deduplicacion secundaria: `name`

---

## Mantenimiento de sincronizacion de inventario

Cuando el script actualiza `products.stock_quantity`, debe tambien actualizar
`inventory.quantity_available` para mantener consistencia:

```sql
UPDATE public.inventory
SET quantity_available = $stock_quantity,
    last_updated = now()
WHERE product_id = $product_id;
```

Si no existe fila en `inventory` para ese producto:

```sql
INSERT INTO public.inventory (product_id, quantity_available, reserved_quantity, low_stock_threshold)
VALUES ($product_id, $stock_quantity, 0, 5);
```

---

## Ejemplo de fila en Google Sheets

| nombre | descripcion | precio | precio_comparativo | precio_costo | categoria_id | marca | imagen_url | imagenes_adicionales | stock | sku | codigo_barras | peso_kg | dimensiones | destacado | activo | etiquetas |
|--------|-------------|--------|-------------------|--------------|--------------|-------|------------|----------------------|-------|-----|---------------|---------|-------------|-----------|--------|-----------|
| Camara IP Hikvision DS-2CD2143G2-I 4MP | Camara domo IP de 4 megapixeles con vision nocturna AcuSense, para exterior, lente 2.8mm | 285000 | 320000 | 195000 | 3f2e9a1b-4c8d-4e7f-a321-123456789abc | Hikvision | https://storage.ejemplo.com/hikvision-ds2cd2143.jpg | https://storage.ejemplo.com/hikvision-ds2cd2143-back.jpg | 15 | HVN-DS2CD2143G2-I | 6941264078516 | 0.85 | {"length":12.5,"width":12.5,"height":9.4} | FALSE | TRUE | camara,exterior,4mp,acusense |

---

## Validaciones que debe hacer el script antes de insertar

1. `name` no esta vacio
2. `price` es un numero mayor que 0
3. `compare_price`, si se provee, es mayor que `price`
4. `category_id` es un UUID valido y existe en `categories`
5. `image_url` empieza con `http://` o `https://`
6. `stock_quantity` es un entero mayor o igual a 0
7. `sku`, si se provee, no existe ya en la tabla para otro producto
8. `dimensions`, si se provee, es JSON valido con keys `length`, `width`, `height`

---

## Categorias disponibles

Para obtener la lista actualizada de categorias y sus IDs, ejecutar:

```sql
SELECT id, name, slug, active
FROM public.categories
WHERE active = true
ORDER BY sort_order, name;
```

O via API:

```
GET /api/categories
```

---

## Campos deprecados — nunca usar

| Campo             | Estado      | Reemplazar por       |
|-------------------|-------------|----------------------|
| `compare_at_price`| ELIMINADO   | `compare_price`      |

---

## Historial de versiones

| Version | Fecha      | Cambio                                           |
|---------|------------|--------------------------------------------------|
| 1.0     | 2026-04-01 | Version inicial. Contrato post-saneamiento DB.   |
|         |            | Elimina compare_at_price. Unifica fuente de stock|
