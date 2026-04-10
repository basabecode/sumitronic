# Propuesta de flujo para imágenes de productos

## Objetivo

Definir un flujo simple y repetible para tomar imágenes que están en un PC local, convertirlas a un formato liviano, subirlas a Supabase Storage y obtener URLs públicas listas para usar en Google Sheets y en la sincronización de productos.

La idea es evaluar esta propuesta antes de implementarla, sin cambiar por ahora el flujo actual del proyecto.

---

## Problema actual

Hoy el proyecto puede sincronizar productos desde Google Sheets usando:

- `image_url`
- `extra_images`

El problema es que las imágenes están en el PC local y no en una URL pública. Por eso:

- no se pueden usar directamente en Google Sheets
- no conviene guardarlas en la base de datos
- tampoco conviene convertirlas a `.avi`, porque `AVI` es un formato de video, no de imagen

---

## Decisión recomendada

### Formato recomendado

Usar `WebP` como formato estándar para imágenes de productos.

Razones:

- pesa menos que PNG y normalmente menos que JPG
- mantiene buena calidad visual
- tiene amplia compatibilidad
- encaja bien con catálogos e-commerce

No se recomienda usar:

- `.avi`: no es formato de imagen
- `.bmp`: demasiado pesado
- `.png` como estándar general: útil solo cuando se necesita transparencia o calidad sin pérdida

---

## Flujo propuesto

```text
PC local
  -> convertir imágenes a WebP
  -> subir imágenes a Supabase Storage
  -> generar URLs públicas
  -> llenar columnas image_url y extra_images en Google Sheets
  -> ejecutar sincronización actual
```

---

## Arquitectura propuesta

### 1. Origen local

Las imágenes viven en una carpeta local organizada por `SKU`.

Ejemplo:

```text
imports/images/
  SKU-001/
    principal.jpg
    2.png
    3.jpeg
  SKU-002/
    principal.png
```

Reglas sugeridas:

- el nombre de la carpeta debe ser el `SKU`
- `principal.*` será la imagen principal
- las demás imágenes serán adicionales

---

### 2. Conversión local

Un script local convierte todas las imágenes válidas a `WebP`.

Formatos de entrada permitidos:

- `.jpg`
- `.jpeg`
- `.png`
- opcionalmente `.webp`

Formato de salida:

- `.webp`

Ejemplo:

```text
principal.jpg -> principal.webp
2.png -> 2.webp
3.jpeg -> 3.webp
```

Herramienta sugerida para implementación:

- `sharp`

---

### 3. Subida a Supabase Storage

Después de convertirlas, el script sube los archivos al bucket público `products`.

Estructura sugerida del bucket:

```text
products/SKU-001/principal.webp
products/SKU-001/2.webp
products/SKU-001/3.webp
products/SKU-002/principal.webp
```

Ventajas:

- URLs predecibles
- organización clara por producto
- fácil depuración

---

### 4. Generación de URLs públicas

Una vez subidas al bucket, Supabase devuelve URLs públicas como estas:

```text
https://TU-PROYECTO.supabase.co/storage/v1/object/public/products/SKU-001/principal.webp
```

Estas son las URLs que deben terminar en:

- columna `image_url`
- columna `extra_images`

del Google Sheets.

---

### 5. Sincronización actual del proyecto

No se cambia el flujo actual de sincronización.

La propuesta reutiliza lo que ya existe:

1. se generan URLs públicas
2. se copian o importan al Google Sheet
3. se ejecuta `/api/sync-products`
4. el producto queda con imagen principal y galería

Esto reduce el riesgo porque no obliga a cambiar inmediatamente la lógica actual de `lib/sync-products.ts`.

---

## Propuesta de script local

### Responsabilidad

Crear un script que:

- recorra carpetas por `SKU`
- convierta imágenes a `WebP`
- suba archivos al bucket `products`
- obtenga URLs públicas
- genere un archivo CSV de salida

### Variables de entorno necesarias

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Salida esperada

Un archivo como:

```text
outputs/product-images.csv
```

Con columnas:

- `sku`
- `image_url`
- `extra_images`
- `status`
- `error`

Ejemplo:

```csv
sku,image_url,extra_images,status,error
SKU-001,https://.../products/SKU-001/principal.webp,"https://.../products/SKU-001/2.webp,https://.../products/SKU-001/3.webp",ok,
SKU-002,https://.../products/SKU-002/principal.webp,,ok,
```

Ese archivo puede servir para:

- copiar valores al Google Sheets
- auditar qué se subió
- detectar errores de forma rápida

---

## Ventajas de esta propuesta

- no guarda imágenes en la base de datos
- mantiene la base de datos ligera
- centraliza activos en Supabase Storage
- produce URLs públicas utilizables por Google Sheets
- permite carga por lotes
- se adapta al flujo actual sin rehacer toda la sincronización

---

## Riesgos y consideraciones

### 1. Dependencia de convención por SKU

Si la carpeta local no coincide con el `SKU`, el script no podrá relacionar imágenes y productos correctamente.

### 2. Sobrescritura de imágenes

Se debe definir si una nueva subida reemplaza archivos anteriores o si se versionan rutas.

### 3. Tamaño y calidad

La compresión en `WebP` debe encontrar un balance entre:

- peso bajo
- buena nitidez
- velocidad de procesamiento

### 4. Seguridad

La subida debe hacerse con `SUPABASE_SERVICE_ROLE_KEY` solo desde entorno controlado local o script privado.

---

## Alternativas consideradas

### Opción A: subir imágenes manualmente desde panel admin

Ventajas:

- implementación más simple

Desventajas:

- lenta para lotes grandes
- no genera fácilmente URLs para Google Sheets

### Opción B: usar Google Drive o Dropbox como host de imágenes

Ventajas:

- da URLs relativamente rápido

Desventajas:

- dependencia externa
- control menor
- peor integración con el stack actual

### Opción C: convertir a AVIF

Ventajas:

- mejor compresión

Desventajas:

- conversión más lenta
- mayor complejidad operativa

Por eso, para una primera versión, `WebP` es la opción recomendada.

---

## Fases sugeridas

### Fase 1

Script local:

- convertir a WebP
- subir a Supabase Storage
- generar CSV con URLs

### Fase 2

Mejoras opcionales:

- modo `dry-run`
- control de sobrescritura
- validación de carpetas sin `principal`
- reporte más detallado

### Fase 3

Evolución posible:

- integrar este flujo al panel admin
- permitir subir CSV + ZIP de imágenes
- automatizar carga completa sin pasar por Google Sheets

---

## Recomendación final

La mejor opción para evaluar e implementar después es:

```text
Script local -> WebP -> Supabase Storage -> URLs públicas -> Google Sheets -> sincronización actual
```

Es la solución más alineada con el stack actual:

- `Vercel`
- `Supabase`
- `Google Sheets`
- catálogo administrado por `SKU`

Además, evita soluciones incorrectas como usar `.avi` y mantiene el sistema preparado para una futura automatización más completa.
