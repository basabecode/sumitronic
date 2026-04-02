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

### Hoja y rango que consume el sincronizador actual

El codigo actual en `lib/sync-products.ts` lee:

```text
${GOOGLE_SHEET_NAME}!A2:O
```

Por lo tanto:

- La fila 1 es de encabezados.
- Los datos empiezan en la fila 2.
- El orden de columnas es posicional y no debe cambiar.

### Orden real de columnas en el Sheet

| Columna | Nombre recomendado en Sheet | Campo en DB          | Obligatorio |
|---------|-----------------------------|----------------------|-------------|
| A       | `sku`                       | `sku`                | SI recomendado |
| B       | `name`                      | `name`               | SI          |
| C       | `description`               | `description`        | SI          |
| D       | `price`                     | `price`              | SI          |
| E       | `compare_price`             | `compare_price`      | NO          |
| F       | `cost_price`                | `cost_price`         | NO          |
| G       | `brand`                     | `brand`              | SI          |
| H       | `category_slug`             | `category_id` por lookup de slug | SI |
| I       | `stock_quantity`            | `stock_quantity`     | SI          |
| J       | `weight`                    | `weight`             | NO          |
| K       | `featured`                  | `featured`           | NO          |
| L       | `active`                    | `active`             | NO          |
| M       | `tags`                      | `tags`               | NO          |
| N       | `image_url`                 | `image_url`          | NO          |
| O       | `images`                    | `images`             | NO          |

`sku` deberia tratarse como obligatorio operativo aunque tecnicamente el codigo lo acepta vacio.

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

### `category_slug` — Slug de la categoria
- Tipo: texto
- Obligatorio: SI
- Debe coincidir con `categories.slug`
- El sincronizador transforma ese slug a `category_id` consultando Supabase
- Ejemplo: `camaras-ip`

### `brand` — Marca del producto
- Tipo: texto
- Obligatorio: SI
- Valores estandar del proyecto: `Hikvision`, `Dahua`, `Hanwha`, `Bosch`, `Paradox`
- Respetar mayusculas exactas para consistencia en filtros
- Ejemplo: `Hikvision`

### `image_url` — URL de la imagen principal
- Tipo: URL completa (texto)
- Obligatorio: NO
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
- Obligatorio: NO a nivel de parser, pero SI recomendado a nivel operativo
- Debe ser unico en toda la tabla si se provee
- El parser actual envia string vacio si la celda viene vacia; por eso conviene no dejarlo en blanco
- Ejemplo: `HVN-DS2CD2143G2-I`

### `weight` — Peso en kilogramos
- Tipo: decimal
- Obligatorio: NO
- Ejemplo: `0.85`

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

## Columnas que NO deben incluirse dentro del rango sincronizado

Estas columnas son auto-generadas por la DB o por el sistema. El script de
sincronizacion nunca debe intentar escribirlas:

| Columna         | Razon                                        |
|-----------------|----------------------------------------------|
| `id`            | UUID auto-generado por la DB |
| `search_vector` | Mantenido por trigger de PostgreSQL |
| `created_at`    | Auto-generado |
| `updated_at`    | Auto-actualizado por trigger |
| `barcode`       | El parser actual no lo lee |
| `dimensions`    | El parser actual no lo lee |

---

## Logica de upsert recomendada

Para el script de sincronizacion, el comportamiento esperado es:

1. Si el producto ya existe:
   - Actualizar los campos del Sheet, sin tocar `id`, `created_at`
2. Si el producto no existe:
   - Insertar fila nueva
   - Crear fila en `product_images` con `image_url` como imagen primaria

Clave real de upsert hoy: `sku`

---

## Ejemplo de fila en Google Sheets

| sku | name | description | price | compare_price | cost_price | brand | category_slug | stock_quantity | weight | featured | active | tags | image_url | images |
|-----|------|-------------|-------|---------------|------------|-------|---------------|----------------|--------|----------|--------|------|-----------|--------|
| HVN-DS2CD2143G2-I | Camara IP Hikvision DS-2CD2143G2-I 4MP | Camara domo IP de 4 megapixeles con vision nocturna AcuSense, para exterior | 285000 | 320000 | 195000 | Hikvision | camaras-ip | 15 | 0.85 | FALSE | TRUE | camara,exterior,4mp,acusense | https://storage.ejemplo.com/hikvision-ds2cd2143.jpg | https://storage.ejemplo.com/hikvision-ds2cd2143-back.jpg |

---

## Validaciones que debe hacer el script antes de insertar

1. `name` no esta vacio
2. `price` es un numero mayor que 0
3. `compare_price`, si se provee, es mayor que `price`
4. `category_slug` existe en `categories.slug`
5. `image_url` empieza con `http://` o `https://`
6. `stock_quantity` es un entero mayor o igual a 0
7. `sku`, si se provee, no existe ya en la tabla para otro producto

---

## Categorias disponibles

Para obtener la lista actualizada de categorias y sus slugs, ejecutar:

```sql
SELECT name, slug, active
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
| `category_id` en Sheet | INVALIDO para el parser actual | `category_slug` |
| `barcode` en Sheet | IGNORADO por el parser actual | no usar |
| `dimensions` en Sheet | IGNORADO por el parser actual | no usar |

---

## Historial de versiones

| Version | Fecha      | Cambio                                           |
|---------|------------|--------------------------------------------------|
| 1.0     | 2026-04-01 | Version inicial. Contrato post-saneamiento DB.   |
|         |            | Elimina compare_at_price. Unifica fuente de stock|
