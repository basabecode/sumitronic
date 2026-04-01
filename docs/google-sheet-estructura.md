# Estructura Del Google Sheet

La sincronización automática desde Google Sheets a Supabase espera una sola
hoja con la fila `1` reservada para encabezados.

## Encabezados Exactos

La fila `1` debe tener estas columnas, en este orden exacto:

```text
sku | name | description | price | compare_at_price | cost_price | brand | category_slug | stock_quantity | weight | featured | active | tags | image_url | extra_images
```

## Significado De Cada Columna

| Columna | Tipo esperado | Descripción |
|---------|---------------|-------------|
| `sku` | texto | Identificador único del producto. Se usa como clave de upsert. |
| `name` | texto | Nombre del producto. |
| `description` | texto | Descripción del producto. Si viene vacía se guarda como string vacío. |
| `price` | número | Precio de venta. Si no es válido se guarda `0`. |
| `compare_at_price` | número opcional | Precio anterior o de comparación en el Sheet. En la DB se sincroniza a `products.compare_price`. |
| `cost_price` | número opcional | Precio de costo interno. |
| `brand` | texto | Marca del producto. |
| `category_slug` | texto | Debe coincidir con `categories.slug`. Si no existe, `category_id` se guarda como `null`. |
| `stock_quantity` | entero | Cantidad disponible. Si no es válido se guarda `0`. |
| `weight` | número opcional | Peso del producto. Si viene vacío se guarda `null`. |
| `featured` | booleano | Debe ser exactamente `TRUE` o `FALSE`. Solo `TRUE` activa el campo. |
| `active` | booleano | Debe ser exactamente `TRUE` o `FALSE`. Solo `TRUE` activa el campo. |
| `tags` | texto | Valores separados por coma. Se transforman en array. |
| `image_url` | URL | Imagen principal del producto. |
| `extra_images` | texto | URLs separadas por coma. Son imágenes adicionales aparte de `image_url`. |

## Reglas Importantes

- `sku` no debe repetirse.
- `category_slug` debe existir en la tabla `categories` para resolver `category_id`.
- `featured` y `active` solo se consideran `true` cuando el valor en mayúsculas es exactamente `TRUE`.
- `tags` se separa por comas y se limpia con `trim`.
- `extra_images` se separa por comas y se guarda en `products.images`.

## Columnas Que No Van En El Sheet

Estas columnas no hacen parte del contrato del Google Sheet:

- `barcode`
- `dimensions`
- `search_vector`

Notas:

- `barcode` y `dimensions` se gestionan desde el admin.
- `search_vector` no se incluye en el Sheet.
