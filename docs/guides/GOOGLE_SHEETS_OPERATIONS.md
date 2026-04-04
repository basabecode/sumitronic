# Operacion de Google Sheets para Catalogo

Fecha de referencia: 3 de abril de 2026.

Esta es la guia canonica para estructura del Sheet, credenciales de Google y sincronizacion del catalogo.

## Alcance

Consolida y reemplaza la lectura separada de:

- `CONTRATO_GOOGLE_SHEETS.md`
- `GOOGLE_SHEETS_SERVICE_ACCOUNT_SETUP.md`
- `docs/google-sheet-estructura.md`

## Variables requeridas

```env
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GOOGLE_SHEET_NAME=
SYNC_SECRET=
```

## Como funciona hoy

- El codigo no usa OAuth interactivo.
- Usa una cuenta de servicio de Google.
- Lee exactamente el rango:

```text
${GOOGLE_SHEET_NAME}!A2:O
```

## Archivo y pestaña recomendados

- Nombre sugerido del archivo: `SUMITRONIC Catalogo Maestro`
- Nombre sugerido de la pestaña: `Catalogo`

El nombre del archivo es operativo; el codigo solo depende de `GOOGLE_SHEET_NAME` y `GOOGLE_SHEET_ID`.

## Encabezados oficiales del Sheet

Fila 1, en este orden exacto:

```text
sku | name | description | price | compare_price | cost_price | brand | category_slug | stock_quantity | weight | featured | active | tags | image_url | images
```

## Mapeo real

| Columna | Encabezado | Campo destino |
|---------|------------|---------------|
| A | `sku` | `sku` |
| B | `name` | `name` |
| C | `description` | `description` |
| D | `price` | `price` |
| E | `compare_price` | `compare_price` |
| F | `cost_price` | `cost_price` |
| G | `brand` | `brand` |
| H | `category_slug` | `category_id` por lookup |
| I | `stock_quantity` | `stock_quantity` |
| J | `weight` | `weight` |
| K | `featured` | `featured` |
| L | `active` | `active` |
| M | `tags` | `tags` |
| N | `image_url` | `image_url` |
| O | `images` | `images` |

## Reglas operativas

- `sku` debe tratarse como obligatorio operativo.
- `category_slug` debe existir en `categories.slug`.
- `featured` y `active` deben llegar de forma consistente.
- `tags` e `images` se parsean como listas separadas por coma.
- No agregues columnas intermedias entre `A` y `O`.

## Ejemplo de fila valida

| sku | name | description | price | compare_price | cost_price | brand | category_slug | stock_quantity | weight | featured | active | tags | image_url | images |
|-----|------|-------------|-------|---------------|------------|-------|---------------|----------------|--------|----------|--------|------|-----------|--------|
| HVN-DS2CD2143G2-I | Camara IP Hikvision DS-2CD2143G2-I 4MP | Camara domo IP de 4MP para exterior | 285000 | 320000 | 195000 | Hikvision | camaras-ip | 15 | 0.85 | TRUE | TRUE | camara,exterior,4mp | https://storage.ejemplo.com/hikvision-ds2cd2143.jpg | https://storage.ejemplo.com/hikvision-ds2cd2143-back.jpg |

## Configuracion de Google

1. Crear proyecto en Google Cloud.
2. Habilitar Google Sheets API.
3. Crear Service Account.
4. Generar llave JSON.
5. Compartir el Sheet con el `client_email` de la cuenta.
6. Cargar variables en `.env.local` o Vercel.

Nombres sugeridos:

- Proyecto: `sumitronic-sheets-sync`
- Service account: `sumitronic-sheets-reader`

## Formato de `GOOGLE_PRIVATE_KEY`

La variable debe llegar con `\\n` escapados. El codigo actual reemplaza esos saltos al cargar la credencial.

## Prueba de sincronizacion

```bash
curl -X POST http://localhost:3003/api/sync-products -H "x-sync-secret: tu-secreto"
```

Respuesta esperada:

```json
{
  "synced": 10,
  "errors": []
}
```

## Errores comunes

- `Missing required environment variable`
  Falta alguna variable en el entorno.
- `The caller does not have permission`
  La Service Account no tiene el Sheet compartido.
- `Requested entity was not found`
  `GOOGLE_SHEET_ID` o `GOOGLE_SHEET_NAME` no coinciden.
- `Unauthorized`
  `SYNC_SECRET` incorrecto o ausente.

