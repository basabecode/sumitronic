# Configurar Cuenta de Google para Google Sheets

Fecha de referencia: 1 de abril de 2026.

Esta guia explica como crear y configurar la cuenta de Google que necesita CapiShop para leer el archivo de Google Sheets usado en la sincronizacion del catalogo.

Aplica al flujo implementado hoy en:

- `lib/sync-products.ts`
- `app/api/sync-products/route.ts`

## Que usa el proyecto realmente

El proyecto no usa OAuth interactivo para leer Google Sheets.

Usa una cuenta de servicio de Google con estas variables:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GOOGLE_SHEET_NAME=
SUPABASE_SERVICE_ROLE_KEY=
SYNC_SECRET=
```

## Resultado esperado

Al terminar esta configuracion debes tener:

1. Un proyecto en Google Cloud.
2. La API de Google Sheets habilitada.
3. Una Service Account creada.
4. Una llave JSON descargada.
5. El Google Sheet compartido con el correo de la Service Account.
6. Las variables de entorno configuradas en `.env.local` o en Vercel.

## Estructura del Google Sheet que espera el codigo

El codigo actual lee exactamente el rango:

```text
${GOOGLE_SHEET_NAME}!A2:O
```

Eso significa:

- Solo se lee una pestaña del archivo.
- La fila `1` debe contener encabezados.
- Los datos empiezan en la fila `2`.
- El sincronizador espera exactamente 15 columnas, de `A` a `O`.

## Nombre recomendado del archivo y de la pestaña

### Nombre del archivo de Google Sheets

Recomendado:

```text
CapiShop Catalogo Maestro
```

El nombre del archivo no lo usa el codigo, pero conviene que sea claro para operacion.

### Nombre de la pestaña principal

Recomendado:

```text
Catalogo
```

Y en variables:

```env
GOOGLE_SHEET_NAME=Catalogo
```

Puedes usar otro nombre, pero debe coincidir exactamente con la pestaña real.

## Que "tablas" u hojas debes crear

En Google Sheets no necesitas tablas SQL. Lo que necesitas es al menos una hoja o pestaña principal.

### Hoja obligatoria

Nombre recomendado:

```text
Catalogo
```

Esta es la unica hoja que el sincronizador lee hoy.

### Hojas opcionales de apoyo

No son consumidas por el codigo, pero ayudan a operar:

- `Categorias`
- `Marcas`
- `Notas`

Importante:

- Si creas estas hojas auxiliares, no afectan la sincronizacion.
- El codigo solo lee la hoja cuyo nombre pongas en `GOOGLE_SHEET_NAME`.

## Encabezados exactos que debe llevar la hoja principal

La pestaña principal debe tener esta fila 1, en este orden exacto:

| Columna | Encabezado recomendado | Lo que interpreta el codigo |
|---------|------------------------|-----------------------------|
| A | `sku` | SKU del producto |
| B | `name` | Nombre |
| C | `description` | Descripcion |
| D | `price` | Precio |
| E | `compare_price` | Precio comparativo |
| F | `cost_price` | Precio costo |
| G | `brand` | Marca |
| H | `category_slug` | Slug de categoria |
| I | `stock_quantity` | Stock |
| J | `weight` | Peso |
| K | `featured` | Destacado |
| L | `active` | Activo |
| M | `tags` | Tags separados por coma |
| N | `image_url` | Imagen principal |
| O | `images` | Imagenes adicionales separadas por coma |

## Plantilla recomendada de la fila 1

Puedes copiar esta fila como encabezado:

```text
sku | name | description | price | compare_price | cost_price | brand | category_slug | stock_quantity | weight | featured | active | tags | image_url | images
```

## Ejemplo de una fila valida

| sku | name | description | price | compare_price | cost_price | brand | category_slug | stock_quantity | weight | featured | active | tags | image_url | images |
|-----|------|-------------|-------|---------------|------------|-------|---------------|----------------|--------|----------|--------|------|-----------|--------|
| HVN-DS2CD2143G2-I | Camara IP Hikvision DS-2CD2143G2-I 4MP | Camara domo IP de 4MP para exterior | 285000 | 320000 | 195000 | Hikvision | camaras-ip | 15 | 0.85 | TRUE | TRUE | camara,exterior,4mp | https://ejemplo.com/img-principal.jpg | https://ejemplo.com/img-2.jpg,https://ejemplo.com/img-3.jpg |

## Reglas importantes de esa hoja

- `category_slug` debe coincidir con el `slug` real de la tabla `categories` en Supabase.
- `featured` y `active` hoy se interpretan como `TRUE` cuando la celda contiene exactamente `TRUE`.
- `tags` e `images` deben ir separadas por coma.
- Si dejas vacia la columna `images`, no pasa nada.
- Si `sku` viene vacio, el comportamiento de sincronizacion se vuelve mas fragil; conviene siempre llenarlo.
- El sincronizador hoy identifica categorias por `slug`, no por `id`.

## Lo que NO debes poner en la hoja principal

No agregues columnas intermedias entre `A` y `O`.

Si agregas columnas extra:

- hazlo despues de `O`, o
- mejor no las uses en la hoja sincronizada.

El parser actual desestructura las columnas por posicion, no por nombre.

## Paso 1. Crear proyecto en Google Cloud

1. Entra a `https://console.cloud.google.com/`
2. Abre el selector de proyectos.
3. Haz clic en `New Project`.
4. Crea un proyecto con un nombre identificable, por ejemplo `capishop-sheets-sync`.
5. Espera a que Google lo cree y selecciona ese proyecto.

## Paso 2. Habilitar Google Sheets API

1. En el proyecto abierto, entra a `APIs & Services`.
2. Haz clic en `Enable APIs and Services`.
3. Busca `Google Sheets API`.
4. Entra al resultado oficial.
5. Haz clic en `Enable`.

Recomendado:

1. Busca tambien `Google Drive API`.
2. Habilitala si planeas administrar permisos o archivos de Drive desde la misma cuenta.

Para el codigo actual, la API indispensable es `Google Sheets API`.

## Paso 3. Crear la Service Account

1. Ve a `IAM & Admin`.
2. Entra a `Service Accounts`.
3. Haz clic en `Create Service Account`.
4. Usa un nombre claro, por ejemplo `capishop-sheets-reader`.
5. Continua sin complicarte con permisos avanzados si solo la usaras para leer Sheets compartidos manualmente.
6. Finaliza la creacion.

## Paso 4. Generar la llave JSON

1. Abre la Service Account que acabas de crear.
2. Ve a la pestaña `Keys`.
3. Haz clic en `Add Key`.
4. Selecciona `Create new key`.
5. Elige formato `JSON`.
6. Descarga el archivo.

Ese JSON contiene los dos datos que el proyecto necesita:

- `client_email`  -> `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key`   -> `GOOGLE_PRIVATE_KEY`

## Paso 5. Compartir el Google Sheet con la Service Account

Este paso es el que mas se olvida.

1. Abre el Google Sheet del catalogo.
2. Haz clic en `Compartir`.
3. Copia el correo `client_email` de la Service Account.
4. Comparte el Sheet con ese correo.
5. Dale permiso de `Viewer` si solo va a leer datos.

Si no compartes el archivo con ese correo, la sincronizacion fallara aunque la llave JSON sea correcta.

## Paso 6. Obtener el `GOOGLE_SHEET_ID`

Abre el Sheet en el navegador. La URL tiene esta forma:

```text
https://docs.google.com/spreadsheets/d/GOOGLE_SHEET_ID/edit#gid=0
```

Debes copiar la parte entre `/d/` y `/edit`.

Ejemplo:

```text
https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890/edit#gid=0
```

Entonces:

```env
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

## Paso 7. Definir `GOOGLE_SHEET_NAME`

Este valor debe coincidir exactamente con el nombre de la pestaña dentro del archivo.

Ejemplos validos:

```env
GOOGLE_SHEET_NAME=Catalogo
GOOGLE_SHEET_NAME=Productos
GOOGLE_SHEET_NAME=Hoja 1
```

Si el nombre no coincide, Google Sheets respondera con error de rango o de hoja inexistente.

Recomendacion operativa:

- usa `Catalogo` como nombre de la pestaña principal
- evita espacios raros o nombres cambiantes

## Paso 8. Guardar las variables en `.env.local`

Ejemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

GOOGLE_SERVICE_ACCOUNT_EMAIL=capishop-sheets-reader@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\\nMIIEv...\\n-----END PRIVATE KEY-----\\n\"
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
GOOGLE_SHEET_NAME=Catalogo

SYNC_SECRET=un-secreto-largo-y-dificil
```

## Paso 9. Formatear correctamente `GOOGLE_PRIVATE_KEY`

La clave privada suele causar errores por formato.

Regla segura:

1. Copia el valor `private_key` del JSON.
2. Guarda el contenido en una sola linea.
3. Reemplaza los saltos de linea reales por `\\n`.
4. Mantenlo entre comillas si tu entorno lo requiere.

El codigo actual hace esto:

```ts
getRequiredEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n')
```

Eso significa que la variable debe llegar con `\\n` escapados, no con lineas rotas mal copiadas.

## Paso 10. Configurar el secreto de sincronizacion

La ruta `app/api/sync-products/route.ts` exige `SYNC_SECRET`.

Puedes invocarla de dos formas:

### Por `POST`

Enviando header:

```text
x-sync-secret: tu-secreto
```

### Por `GET`

Enviando query param:

```text
/api/sync-products?secret=tu-secreto
```

## Paso 11. Probar que la cuenta de Google funciona

Con la app corriendo, haz una prueba contra la ruta:

```bash
curl -X POST http://localhost:3003/api/sync-products -H "x-sync-secret: tu-secreto"
```

Si todo esta bien, deberias recibir una respuesta JSON con esta forma:

```json
{
  "synced": 10,
  "errors": []
}
```

Si devuelve `synced: 0`, revisa tambien que la hoja tenga datos desde la fila 2 y que la columna `A` no este vacia en las filas que quieres sincronizar.

## Errores frecuentes

### `Missing required environment variable: GOOGLE_SERVICE_ACCOUNT_EMAIL`

Falta cargar la variable en tu entorno.

### `Missing required environment variable: GOOGLE_PRIVATE_KEY`

No copiaste la llave JSON o el nombre de la variable no coincide.

### `The caller does not have permission`

La Service Account existe, pero el Google Sheet no fue compartido con su correo.

### `Requested entity was not found`

Normalmente significa una de estas dos cosas:

- `GOOGLE_SHEET_ID` es incorrecto.
- `GOOGLE_SHEET_NAME` no coincide con la pestaña real.

### `Unauthorized`

La ruta de sync esta recibiendo un `SYNC_SECRET` incorrecto o no lo estas enviando.

### Error por clave privada invalida

Casi siempre es formato incorrecto en `GOOGLE_PRIVATE_KEY`.

Revisa que:

- empiece con `-----BEGIN PRIVATE KEY-----`
- termine con `-----END PRIVATE KEY-----`
- use `\\n` escapados en vez de saltos mal pegados

## Recomendaciones operativas

- Usa una Service Account separada para este proyecto.
- No reutilices tu cuenta personal de Google.
- Comparte solo el Sheet necesario con esa cuenta.
- Guarda la llave JSON original en un lugar seguro fuera del repo.
- Si la llave se filtra, revocala y genera una nueva inmediatamente.

## Relacion con otras guias

- `docs/guides/CONTRATO_GOOGLE_SHEETS.md`
- `docs/guides/ENVIRONMENT_VARIABLES.md`
- `docs/ESTADO_ACTUAL_2026-04.md`
