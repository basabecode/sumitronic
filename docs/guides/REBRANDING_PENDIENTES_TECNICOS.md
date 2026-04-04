# Pendientes Tecnicos del Rebranding a SUMITRONIC

Fecha de referencia: 3 de abril de 2026.

Este documento registra los archivos y contratos que no se renombraron por completo durante el cambio de `CapiShop` a `SUMITRONIC` porque estan acoplados a infraestructura, compatibilidad operativa, APIs, persistencia local o base de datos.

La regla aplicada fue simple:

- Cambiar primero la marca visible y la documentacion vigente.
- Mantener temporalmente los identificadores tecnicos heredados que todavia sostienen integraciones reales.
- Evitar renombres profundos sin una migracion controlada y reversible.

## Objetivo de esta guia

- Dejar trazabilidad de lo que se mantuvo con naming legado.
- Evitar que alguien haga un reemplazo global inseguro.
- Dar una ruta progresiva para completar la migracion tecnica.

## Archivos y areas no tocadas por seguridad tecnica

### 1. Dominio, email y redes aun atados al naming anterior

Archivo principal:

- `lib/brand.ts`

Valores que siguen pendientes de migracion externa:

- `siteUrl: 'https://capishop-web.vercel.app'`
- `logoUrl`
- `faviconUrl`
- `supportEmail: 'info@capishop.com'`
- `orderSupportEmail: 'soporte@capishop.com'`
- enlaces sociales asociados a `capishop_col`

Motivo:

- Estos valores no son solo texto. Apuntan a dominio, correo, assets, perfiles sociales y configuraciones externas que deben existir antes del cambio.

Riesgo si se cambia sin coordinacion:

- URLs rotas en SEO, Open Graph, sitemap y manifest.
- Correos de soporte que no reciben mensajes.
- Redes sociales apuntando a handles inexistentes.
- Inconsistencia entre la marca visible y la infraestructura real.

Recomendacion:

- Cambiar solo cuando esten listos el dominio final, DNS, SSL, redireccion 301, cuentas de correo y handles sociales reales.
- Hacer el cambio en una sola ventana controlada para evitar mezcla de dominios.

### 2. Datos de pagos y titularidad legal

Archivos:

- `lib/payments/constants.ts`
- `lib/payments/README.md`

Valores que siguen con el naming anterior:

- `accountHolder: 'CapiShop'` en cuentas bancarias y billeteras

Motivo:

- El nombre del titular de pago no debe cambiarse por branding si la cuenta legal o financiera no ha sido actualizada oficialmente.

Riesgo si se cambia sin validacion:

- Instrucciones de pago inconsistentes para clientes.
- Friccion en conciliacion de pagos.
- Riesgo operativo o legal si el titular mostrado no coincide con la cuenta real.

Recomendacion:

- Validar titularidad bancaria, Nequi, Daviplata y cualquier medio de pago antes de editar estos campos.
- Cuando cambie, actualizar codigo, copys, capturas, documentacion y mensajes de soporte en el mismo bloque de despliegue.

### 3. Variables de entorno y scripts de restore local

Archivos:

- `.env.example`
- `scripts/restore-local-postgres.ps1`

Identificadores heredados:

- variables `CAPISHOP_DB_*`
- contenedor por defecto `capishop-postgres`
- usuario `capishop_admin`
- archivo temporal `capishop_restore.sql`

Motivo:

- Estos nombres estan conectados a scripts reales, restauracion local, entorno de pruebas y documentacion de recuperacion.

Riesgo si se cambia sin compatibilidad:

- Fallos en restore local.
- Ruptura de automatizaciones ya usadas por el equipo.
- Confusion entre variables antiguas y nuevas en entornos mixtos.

Recomendacion:

- Si se quiere migrar, hacerlo con soporte dual temporal.
- Leer primero `SUMITRONIC_DB_*` y usar `CAPISHOP_DB_*` como fallback durante una fase de transicion.
- Renombrar documentacion y scripts solo despues de validar recovery end to end.

### 4. Identificadores de proyecto y contrato de base de datos

Archivos:

- `supabase/config.toml`
- `supabase/migrations/20260329_restore_backup_compatibility.sql`
- `lib/types/database.ts`

Identificadores heredados:

- `project_id = "CapiShop_Web"`
- funcion SQL `public.capishop_slugify(...)`
- tipos generados que referencian `capishop_slugify`

Motivo:

- Aqui ya no hablamos de branding visible sino de contrato tecnico entre base de datos, migrations, restore y tipos TypeScript.

Riesgo si se cambia sin diseno:

- Migrations rotas o inconsistentes.
- Tipos desalineados con el esquema.
- Scripts de restore o compatibilidad que dejan de funcionar.
- Riesgo de drift entre ambiente local, backup y entorno remoto.

Recomendacion:

- No renombrar funciones historicas dentro de migrations ya aplicadas.
- Si se necesita un nombre nuevo, crear una funcion nueva y dejar wrapper o compatibilidad temporal.
- Regenerar tipos solo despues de que el contrato SQL quede estable.

### 5. Persistencia local del panel administrativo

Archivo:

- `app/admin/hooks/useProductForm.ts`

Identificador heredado:

- `capishop_admin_brands`

Motivo:

- Esta clave vive en `localStorage`. Renombrarla directamente hace que el navegador deje de leer los datos guardados por administradores actuales.

Riesgo si se cambia sin migracion:

- Perdida aparente de datos locales.
- Experiencia inconsistente en formularios del admin.

Recomendacion:

- Implementar estrategia `read-old/write-new`.
- Leer primero la clave nueva y, si no existe, recuperar desde `capishop_admin_brands`.
- Cuando la lectura legacy deje de ser necesaria, retirar el fallback en una fase posterior.

### 6. Scripts tecnicos, banners y comentarios legacy

Archivos detectados:

- `scripts/quick-database-fix.ts`
- `scripts/test-google-sheets.ts`
- `scripts/simple-db-test.js`
- `scripts/test-supabase-connection.js`
- `scripts/validate-supabase.js`
- `scripts/deploy.bat`
- `lib/types/products.ts`
- `lib/types/database.ts`
- `supabase/archive/verification.sql`
- `supabase/migrations/20251208_create_indexes.sql`

Motivo:

- En varios casos el nombre viejo solo aparece en banners, comentarios, textos de diagnostico o ejemplos tecnicos.
- No era prioritario tocarlos durante el rebranding visible.

Riesgo si se cambia de forma indiscriminada:

- Bajo a medio. El mayor problema aqui no es romper negocio, sino mezclar comentarios, historicos y scripts que fueron escritos para contextos anteriores.

Recomendacion:

- Tratar esta limpieza como una fase de higiene tecnica.
- Corregir primero solo los textos activos que puedan confundir en operacion.
- Dejar intactos los comentarios historicos dentro de migrations ya publicadas salvo necesidad real.

### 7. Documentacion historica que conserva CAPISHOP

Carpetas:

- `docs/reports/`
- `docs/reportes/`
- `docs/archive/`

Motivo:

- Son auditorias, reportes o snapshots historicos del proyecto.

Riesgo si se reescriben:

- Se pierde trazabilidad.
- Se falsifica el contexto historico del documento.
- Puede quedar una lectura incorrecta de decisiones y estados anteriores.

Recomendacion:

- No reescribirlos en masa.
- Si hace falta, agregar una nota corta indicando que el documento es previo al rebranding a `SUMITRONIC`.

## Recomendaciones operativas

### Prioridad alta

- Confirmar dominio final, email oficial y redes antes de tocar `lib/brand.ts` otra vez.
- Validar con negocio o contabilidad si el titular de pagos ya puede mostrarse como `SUMITRONIC`.
- Mantener los identificadores `CAPISHOP_*` mientras sigan siendo los usados por scripts y restores.

### Prioridad media

- Crear una fase tecnica de migracion de variables y localStorage con compatibilidad temporal.
- Separar explicitamente en docs lo que es branding publico y lo que es identificador tecnico legado.

### Prioridad baja

- Limpiar comentarios, banners y textos internos de scripts.
- Agregar notas estandar de "pre-rebranding" a reportes historicos que sigan consultandose mucho.

## Ruta sugerida para una migracion segura

1. Cerrar primero los activos externos: dominio, correo, redes y activos graficos finales.
2. Actualizar luego pagos y soporte legal cuando la titularidad oficial ya este lista.
3. Ejecutar despues una fase tecnica con compatibilidad para variables, funciones SQL y claves locales.
4. Hacer al final una pasada de limpieza sobre scripts, comentarios y documentacion historica.

## Regla final

Mientras un identificador viejo siga sosteniendo una conexion real con infraestructura, restore, API, pagos o base de datos, no debe cambiarse por busqueda global. Debe migrarse con pruebas, fallback y una ventana tecnica controlada.
