# Sincronización de productos — Google Sheets

## Estructura del Sheet

El archivo Google Sheets debe tener una pestaña llamada **`catalogo`** (minúsculas, sin tilde).  
La **fila 1** es el encabezado (títulos). Los productos van desde la **fila 2** en adelante.

---

## Columnas — orden obligatorio A → O

| Col | Campo            | Tipo             | Requerido | Descripción                                                                                            |
| --- | ---------------- | ---------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| A   | `sku`            | Texto            | ✅        | Identificador único. Si ya existe en la DB, el producto se **actualiza** automáticamente.              |
| B   | `name`           | Texto            | ✅        | Nombre del producto                                                                                    |
| C   | `description`    | Texto            | ✅        | Descripción completa                                                                                   |
| D   | `price`          | Número entero    | ✅        | Precio en COP sin puntos ni símbolos (`285000`)                                                        |
| E   | `compare_price`  | Número entero    | ❌        | Precio original tachado. Debe ser **mayor que price**. Dejar vacío si no hay oferta.                   |
| F   | `cost_price`     | Número entero    | ❌        | Costo interno. Solo para control. Dejar vacío si no aplica.                                            |
| G   | `brand`          | Texto            | ✅        | Nombre de la marca (`Hikvision`, `Dahua`, `IMOU`...)                                                   |
| H   | `category_slug`  | Texto            | ✅        | Slug exacto de la categoría en la DB (ver tabla abajo)                                                 |
| I   | `stock_quantity` | Número entero    | ✅        | Unidades disponibles (`0` si está agotado)                                                             |
| J   | `weight`         | Número decimal   | ❌        | Peso en kg (`0.45`). Dejar vacío si no aplica.                                                         |
| K   | `featured`       | `TRUE` / `FALSE` | ✅        | `TRUE` = aparece en sección destacados. **Mayúsculas exactas.**                                        |
| L   | `active`         | `TRUE` / `FALSE` | ✅        | `TRUE` = visible en la tienda. **Mayúsculas exactas.**                                                 |
| M   | `tags`           | Texto            | ❌        | Etiquetas separadas por coma sin espacios (`seguridad,ip,4mp`)                                         |
| N   | `image_url`      | URL              | ❌        | URL directa de la imagen principal. Puede quedar vacío y agregar la imagen luego desde el panel admin. |
| O   | `extra_images`   | URLs             | ❌        | Imágenes adicionales separadas por coma. Vacío si solo hay una imagen.                                 |

---

## Slugs de categorías disponibles

Estos son los valores válidos para la columna H:

| Nombre visible       | Slug a usar en el Sheet |
| -------------------- | ----------------------- |
| Cámaras de Seguridad | `camaras-de-seguridad`  |
| DVR / NVR / XVR      | `dvr-nvr-xvr`           |
| Equipos de Red       | `equipos-de-red`        |
| Accesorios           | `accesorios`            |
| Cables y Conectores  | `cables-y-conectores`   |
| Fuentes de Poder     | `fuentes-de-poder`      |
| Periféricos          | `perifericos`           |

> Si necesitas una categoría nueva, créala primero desde el panel admin o ejecuta en Docker:
>
> ```bash
> docker exec supabase_db_CapiShop_Web psql -U postgres -d postgres -c "SELECT name, slug FROM categories WHERE active = true;"
> ```

---

## Ejemplo de fila completa

| A               | B                              | C                           | D        | E        | F        | G           | H                      | I    | J      | K      | L      | M                   | N                       | O         |
| --------------- | ------------------------------ | --------------------------- | -------- | -------- | -------- | ----------- | ---------------------- | ---- | ------ | ------ | ------ | ------------------- | ----------------------- | --------- |
| `HIK-DS2CD2143` | `Cámara IP Hikvision 4MP Domo` | `Domo IP 4MP IR 40m H.265+` | `285000` | `350000` | `180000` | `Hikvision` | `camaras-de-seguridad` | `12` | `0.45` | `TRUE` | `TRUE` | `seguridad,ip,domo` | `https://...imagen.jpg` | _(vacío)_ |

### Producto sin imagen (se agrega luego desde el panel admin)

| A                  | B                         | C                       | D        | E         | F         | G       | H                      | I   | J     | K       | L      | M                 | N         | O         |
| ------------------ | ------------------------- | ----------------------- | -------- | --------- | --------- | ------- | ---------------------- | --- | ----- | ------- | ------ | ----------------- | --------- | --------- |
| `DAH-IPC-HDW2831T` | `Cámara Dahua 8MP Bullet` | `Bullet 4K IP67 IR 60m` | `420000` | _(vacío)_ | _(vacío)_ | `Dahua` | `camaras-de-seguridad` | `5` | `0.6` | `FALSE` | `TRUE` | `dahua,4k,bullet` | _(vacío)_ | _(vacío)_ |

---

## Cómo sincronizar

### En desarrollo (local)

**Opción 1 — Botón en el panel admin** _(recomendada)_  
Ve a `http://localhost:3003/admin` → botón **"Sincronizar Sheets"** en la esquina superior derecha.

**Opción 2 — URL directa en el navegador**

```
http://localhost:3003/api/sync-products?secret=capishop-sync-local-2026
```

**Respuesta exitosa:**

```json
{ "synced": 4, "errors": [] }
```

**Respuesta con error en un producto:**

```json
{ "synced": 3, "errors": ["SKU-001: Product not found after upsert"] }
```

### En producción (Vercel)

**Opción 1 — URL directa**

```
https://tu-dominio.vercel.app/api/sync-products?secret=TU_SYNC_SECRET
```

**Opción 2 — Cron automático en Vercel**  
Agrega en `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/sync-products?secret=TU_SYNC_SECRET",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Esto sincroniza automáticamente cada 6 horas.

---

## Flujo recomendado para agregar productos

```
1. Llenar fila en Google Sheets (imagen puede quedar vacía)
      ↓
2. Sincronizar (botón en admin o URL)
      ↓
3. Verificar que aparece en Inventario del panel admin
      ↓
4. Editar el producto → subir imagen desde el panel admin
      ↓
5. Producto visible en la tienda ✅
```

---

## Errores comunes

| Error                                | Causa                                                   | Solución                                             |
| ------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------- |
| `synced: 0`                          | El Sheet está vacío o la pestaña no se llama `catalogo` | Verificar nombre de la pestaña                       |
| Categoría no asignada                | El slug de la col H no existe en la DB                  | Usar uno de los slugs de la tabla de arriba          |
| Producto no aparece en tienda        | Columna L tiene `FALSE`                                 | Cambiar a `TRUE` y sincronizar de nuevo              |
| `compare_price` no muestra descuento | El valor es menor o igual al `price`                    | El precio original debe ser mayor                    |
| `TRUE`/`FALSE` no reconocido         | Están en minúsculas                                     | Deben ser exactamente `TRUE` o `FALSE` en mayúsculas |

---

## Alternativas a Google Sheets para carga automatizada

Si el proyecto ya está desplegado en **Vercel** y la base de datos está en **Supabase**, además del panel administrador existen otras formas de cargar productos de manera automatizada usando tablas o archivos CSV.

### Opción 1 — CSV manual desde el panel admin

Agregar una sección de **Importar CSV** en el panel admin.

**Flujo:**

1. El administrador sube un archivo `.csv`
2. La API en Vercel procesa el archivo
3. Se validan columnas obligatorias
4. Se hace `upsert` en `products` usando `sku` como clave única
5. Si el CSV incluye imágenes por URL, también se llenan `image_url` y `product_images`

**Ventajas:**

- Más simple que Google Sheets
- Permite trabajar offline y luego subir el archivo
- Fácil de versionar o guardar como respaldo

**Caso ideal:** cuando el catálogo se actualiza por lotes y una persona prepara el archivo antes de importarlo.

---

### Opción 2 — CSV almacenado en Supabase Storage

Subir el archivo CSV a un bucket como por ejemplo:

```text
imports/products.csv
```

Luego una ruta privada en Vercel lo procesa y sincroniza productos.

**Flujo:**

1. Se sube `products.csv` a Supabase Storage
2. Una API route privada descarga el archivo
3. Se parsea y valida
4. Se actualizan `products` y `product_images`

**Ventajas:**

- No depende de Google
- El archivo queda centralizado dentro de la misma infraestructura
- Sirve para flujos internos o integraciones simples

---

### Opción 3 — Tabla intermedia de importación en Supabase

Crear una tabla tipo:

```text
product_import_staging
```

Esta tabla recibe los datos crudos del CSV antes de pasarlos a `products`.

**Flujo:**

1. El CSV se carga a la tabla staging
2. Se revisan errores de formato, categorías o duplicados
3. Un proceso posterior promueve los registros válidos a `products`
4. Se registran errores sin romper la importación completa

**Ventajas:**

- Más seguro para catálogos grandes
- Permite auditoría
- Facilita detectar productos inválidos antes de publicarlos

**Caso ideal:** cuando se quiere trazabilidad o validar datos antes de que lleguen a tienda.

---

### Opción 4 — Cron automático en Vercel

Si el CSV se actualiza periódicamente, Vercel puede procesarlo con un cron.

**Ejemplo de uso:**

- actualizar inventario
- refrescar precios
- sincronizar productos nuevos cada cierto tiempo

**Ventajas:**

- automatización completa
- no requiere entrar al panel admin cada vez
- ideal para catálogos recurrentes

**Caso ideal:** cuando un proveedor entrega archivos actualizados cada día o varias veces por semana.

---

### Opción 5 — Webhook privado para importar productos

Exponer una ruta privada en Vercel para disparar importaciones bajo demanda.

**Ejemplo:**

```text
POST /api/import-products
```

Con autenticación por token o secret.

**Uso típico:**

- otro sistema sube el CSV
- luego llama al webhook
- Vercel procesa el archivo y sincroniza

**Ventajas:**

- permite integraciones externas
- útil para automatización futura
- no depende del panel admin

---

## Opción recomendada para este proyecto

La opción más práctica y robusta para esta tienda es:

```text
CSV + Supabase Storage + API privada en Vercel
```

**Flujo recomendado:**

1. Subir archivo CSV
2. Guardarlo en Supabase Storage
3. Ejecutar una API route privada en Vercel
4. Validar columnas y categorías
5. Hacer `upsert` por `sku`
6. Registrar imágenes en `products` y `product_images`

Esto reduce dependencia de Google Sheets y deja la sincronización dentro del stack actual del proyecto.

---

## Manejo de imágenes cuando no están en una URL pública

Si las imágenes están en tu PC y no en internet, el CSV por sí solo no basta.  
En ese caso se recomienda uno de estos flujos:

### Opción A — CSV + ZIP de imágenes

**Flujo:**

1. Subir `productos.csv`
2. Subir un archivo `.zip` con imágenes organizadas por SKU
3. El importador extrae o procesa las imágenes
4. Las sube a **Supabase Storage**
5. Guarda la imagen principal en `products.image_url`
6. Guarda las imágenes adicionales en `product_images`

**Ejemplo de estructura:**

```text
images/
  SKU-001/
    principal.jpg
    2.jpg
    3.jpg
  SKU-002/
    principal.png
```

### Opción B — CSV con nombres de archivo

El CSV no trae URLs, sino nombres esperados de archivo.

**Ejemplo:**

- `main_image = SKU-001_principal.jpg`
- `extra_images = SKU-001_2.jpg,SKU-001_3.jpg`

Luego el sistema busca esos archivos en un bucket temporal o carpeta de importación y los publica en el bucket `products`.

---

## Recomendación final

Para corto plazo:

```text
Importar productos por CSV
```

Para mediano plazo:

```text
CSV + imágenes en Supabase Storage + procesamiento automático en Vercel
```

Para catálogos grandes o de proveedor:

```text
tabla staging + cron o webhook
```

Ese enfoque mantiene la operación dentro del stack actual del proyecto, evita depender de Google Sheets y permite automatizar tanto productos como imágenes de forma más controlada.

---

## Ejemplo de conversión de imágenes con Sharp

Si las imágenes están en tu PC y quieres reducir peso antes de subirlas a Supabase Storage, una opción simple es convertirlas a `WebP` o `AVIF` usando `sharp`.

> Recomendación práctica: empezar con `WebP`.  
> `AVIF` puede comprimir más, pero normalmente tarda más en procesar.

### Instalar Sharp

```bash
npm install sharp
```

### Script simple para convertir imágenes en la misma carpeta

Guarda este archivo como:

```text
scripts/convert-images-to-modern-format.js
```

```js
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const targetDir = process.argv[2] || path.join(process.cwd(), 'imports', 'images')
const outputFormat = (process.argv[3] || 'webp').toLowerCase()

const validInputExtensions = new Set(['.jpg', '.jpeg', '.png'])

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      await walk(fullPath)
      continue
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (!validInputExtensions.has(ext)) {
      continue
    }

    const outputPath = path.join(dir, `${path.basename(entry.name, ext)}.${outputFormat}`)

    try {
      let pipeline = sharp(fullPath)

      if (outputFormat === 'avif') {
        await pipeline.avif({ quality: 50 }).toFile(outputPath)
      } else {
        await pipeline.webp({ quality: 75 }).toFile(outputPath)
      }

      console.log(`OK  ${fullPath} -> ${outputPath}`)
    } catch (error) {
      console.error(`ERR ${fullPath}: ${error.message}`)
    }
  }
}

walk(targetDir).catch(error => {
  console.error(error)
  process.exit(1)
})
```

### Ejecutar en una carpeta local

Ejemplo para convertir todo a `WebP`:

```bash
node scripts/convert-images-to-modern-format.js .\imports\images webp
```

Ejemplo para convertir todo a `AVIF`:

```bash
node scripts/convert-images-to-modern-format.js .\imports\images avif
```

### Resultado esperado

Si tienes esta estructura:

```text
imports/images/
  SKU-001/
    principal.jpg
    2.png
  SKU-002/
    principal.jpeg
```

Después de ejecutar el script podrías obtener:

```text
imports/images/
  SKU-001/
    principal.jpg
    principal.webp
    2.png
    2.webp
  SKU-002/
    principal.jpeg
    principal.webp
```

### Variante: reemplazar el archivo original manualmente

No se recomienda borrar automáticamente los originales en la primera versión.  
Lo más seguro es:

1. convertir primero
2. revisar peso y calidad
3. subir solo los `.webp` o `.avif`

### Siguiente paso recomendado

Una vez convertidas las imágenes:

1. subirlas a `Supabase Storage`
2. obtener la URL pública
3. usar esa URL en `image_url` y `extra_images`
4. ejecutar la sincronización de productos
