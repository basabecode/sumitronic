# Rebranding a SUMITRONIC

Fecha de referencia: 3 de abril de 2026.

Este documento define la politica actual de naming del proyecto despues del cambio de marca de `CapiShop` a `SUMITRONIC`.

## Objetivo

- La marca visible del ecommerce debe ser `SUMITRONIC`.
- El ecommerce mantiene su proposito: seguridad electronica, conectividad, energia y repuestos tecnicos, incluyendo tarjetas para televisores.
- El cambio inicial es de marca publica, no de infraestructura profunda.

## Que ya debe salir como SUMITRONIC

- Branding visible en UI.
- Metadata SEO y PWA.
- JSON-LD y textos comerciales.
- README y documentacion operativa vigente.
- Copys de soporte, blog, help center y mensajes de producto.

## Que sigue legado tecnico por compatibilidad

Estos identificadores no deben renombrarse sin una fase tecnica separada:

- Variables `CAPISHOP_*`
- Contenedor `capishop-postgres`
- Usuario `capishop_admin`
- Funcion SQL `capishop_slugify`
- Dominio actual `capishop-web.vercel.app`
- Emails y redes aun no migrados a su valor final
- Claves locales como `capishop_admin_brands`

## Regla de documentacion

- `docs/guides/` describe el estado vigente y debe usar `SUMITRONIC`.
- `docs/reports/` y `docs/archive/` pueden conservar `CapiShop` si son documentos historicos.
- Si un documento historico menciona el nombre anterior, no se reescribe salvo que induzca a error operativo actual.

## Fuente canonica de branding en codigo

La configuracion central de marca vive en:

- `lib/brand.ts`

Todo texto publico nuevo debe salir de ahi cuando aplique.

## Documento complementario

Los archivos que no se renombraron por completo por razones de compatibilidad tecnica, pagos, infraestructura o base de datos quedaron documentados en:

- `docs/guides/REBRANDING_PENDIENTES_TECNICOS.md`
