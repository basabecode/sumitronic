# Estado de la Migración Técnica: CapiShop → SUMITRONIC

Fecha de última actualización: 3 de abril de 2026.

Este documento reemplaza a `REBRANDING_PENDIENTES_TECNICOS.md`, que registraba los identificadores heredados de CapiShop que no podían cambiarse de forma indiscriminada.

Las etapas 1 a 4 fueron ejecutadas y verificadas el 3 de abril de 2026. La etapa 5 permanece bloqueada por dependencias externas fuera del código.

---

## Etapas completadas

### Etapa 1 — Persistencia local del panel administrativo

**Estado: completada**

Archivo modificado:

- `app/admin/hooks/useProductForm.ts`

Cambio aplicado:

- Clave activa de escritura cambiada a `sumitronic_admin_brands`
- Al iniciar, el hook lee primero `sumitronic_admin_brands`. Si no existe, migra automáticamente los datos desde `capishop_admin_brands` y escribe en la nueva clave
- La clave legacy no se elimina del navegador — se retira en una fase posterior cuando ya no haya administradores con datos solo en la clave antigua

Cómo retirar el fallback cuando ya no sea necesario:

```ts
// En loadBrandsFromStorage(), eliminar este bloque:
const legacy = localStorage.getItem(BRANDS_STORAGE_KEY_LEGACY)
if (legacy) {
  const parsed = JSON.parse(legacy)
  localStorage.setItem(BRANDS_STORAGE_KEY, legacy)
  return parsed
}
// Y eliminar la constante BRANDS_STORAGE_KEY_LEGACY
```

---

### Etapa 2 — Scripts, banners y comentarios internos

**Estado: completada**

Archivos actualizados (solo textos de diagnóstico, comentarios y banners):

| Archivo | Cambio |
| --- | --- |
| `scripts/quick-database-fix.ts` | Banner, título de log y `brand` del producto de prueba |
| `scripts/test-google-sheets.ts` | Título de log |
| `scripts/simple-db-test.js` | Banner y título de log |
| `scripts/test-supabase-connection.js` | Título de sección |
| `scripts/validate-supabase.js` | Título de sección |
| `scripts/deploy.bat` | Comentario REM |
| `lib/types/products.ts` | Banner de comentario |
| `lib/types/database.ts` | Banner de comentario |
| `supabase/archive/verification.sql` | Banner de comentario |
| `supabase/migrations/20251208_create_indexes.sql` | Banner de comentario |

Ninguno de estos cambios afecta lógica, contratos ni funcionalidad.

---

### Etapa 3 — Variables de entorno y scripts de restore

**Estado: completada**

Archivos modificados:

- `.env.example`
- `scripts/restore-local-postgres.ps1`

Cambios aplicados:

**`.env.example`**

- Agregadas variables `SUMITRONIC_DB_*` como nombres canónicos nuevos
- Variables `CAPISHOP_DB_*` mantenidas con nota de que son legacy/fallback
- Los valores actuales son los mismos en ambos grupos porque el contenedor Docker y el usuario de base de datos aún no se han renombrado en infraestructura real

**`restore-local-postgres.ps1`**

- El script lee `SUMITRONIC_DB_*` primero; si no existen, usa `CAPISHOP_DB_*` como fallback
- Los defaults internos (`capishop-postgres`, `capishop_admin`) se mantienen porque apuntan al contenedor Docker activo real
- Archivo temporal de restore cambiado de `capishop_restore.sql` a `sumitronic_restore.sql`
- Retrocompatible: cualquier equipo que solo tenga `CAPISHOP_DB_*` en su `.env` sigue funcionando sin cambios

Cuándo completar la migración de infraestructura:

1. Renombrar el contenedor Docker de `capishop-postgres` a `sumitronic-postgres`
2. Crear usuario `sumitronic_admin` en PostgreSQL
3. Actualizar los valores default en el script de restore
4. Eliminar las variables `CAPISHOP_DB_*` de `.env.example` y entornos del equipo

---

### Etapa 4 — Función SQL y tipos TypeScript

**Estado: completada**

Archivos afectados:

- `supabase/migrations/20260403_add_sumitronic_slugify.sql` (nuevo)
- `lib/types/database.ts`

**Intocado por diseño:**

- `supabase/config.toml` — `project_id = "CapiShop_Web"` es un identificador de la CLI de Supabase atado a infraestructura, no a branding
- `supabase/migrations/20260329_restore_backup_compatibility.sql` — migración histórica ya aplicada; `capishop_slugify` es el contrato técnico activo

**Cambios aplicados:**

Nueva migración `20260403_add_sumitronic_slugify.sql`:

- Crea `public.sumitronic_slugify()` como wrapper de `public.capishop_slugify()`
- El código nuevo debe usar `sumitronic_slugify`
- `capishop_slugify` sigue activa para restore, migraciones históricas y código existente

`lib/types/database.ts`:

- Agrega `sumitronic_slugify` al bloque `Functions` con comentarios que explican el origen de cada función
- `capishop_slugify` permanece declarada porque sigue siendo la función real en la base de datos

Cuándo retirar `capishop_slugify`:

Solo cuando todo el código que la invoque haya migrado a `sumitronic_slugify` y se haya validado en todos los ambientes. En ese punto se puede crear una migración final que renombre la función SQL y retire el alias.

---

## Etapa pendiente — Infraestructura externa

### Etapa 5 — Dominio, emails, redes sociales y pagos

**Estado: bloqueada por activos externos**

Esta etapa no depende del código sino de la existencia previa de activos externos reales.

#### 5a. Identidad digital (bloqueada)

Archivo: `lib/brand.ts`

Valores pendientes:

```ts
siteUrl: 'https://capishop-web.vercel.app'   // → dominio SUMITRONIC final
supportEmail: 'info@capishop.com'            // → correo SUMITRONIC oficial
orderSupportEmail: 'soporte@capishop.com'    // → correo de soporte oficial
logoUrl                                       // → asset SUMITRONIC final
faviconUrl                                   // → asset SUMITRONIC final
// enlaces sociales → handles @sumitronic reales
```

No cambiar hasta tener:

- Dominio final registrado y con DNS activo
- Certificado SSL configurado
- Redirección 301 desde el dominio anterior
- Cuentas de correo funcionales
- Handles en redes sociales creados y verificados

Hacer el cambio en una sola ventana de despliegue para evitar inconsistencia entre la marca visible y la infraestructura real.

#### 5b. Datos de pago (bloqueada)

Archivos: `lib/payments/constants.ts`, `lib/payments/README.md`

Valor pendiente:

```ts
accountHolder: 'CapiShop'   // → cambiar solo cuando la cuenta legal diga SUMITRONIC
```

No cambiar hasta validar con contabilidad o el titular bancario que las cuentas de Nequi, Daviplata y transferencia están registradas a nombre de SUMITRONIC. Actualizar código, copys, capturas y mensajes de soporte en el mismo despliegue.

---

## Estado general del rebranding técnico

| Etapa | Descripción | Estado |
| --- | --- | --- |
| 1 | localStorage `capishop_admin_brands` | Completada |
| 2 | Scripts, banners y comentarios internos | Completada |
| 3 | Variables de entorno y restore con soporte dual | Completada |
| 4 | Función SQL `sumitronic_slugify` y tipos TypeScript | Completada |
| 5a | `lib/brand.ts`: dominio, emails, redes sociales | Pendiente — activos externos |
| 5b | `lib/payments/constants.ts`: titular de pago | Pendiente — validación legal |

---

## Documentación histórica

Las carpetas `docs/reports/`, `docs/reportes/` y `docs/archive/` contienen auditorías y snapshots anteriores al rebranding. No se reescriben para preservar trazabilidad. Si alguno se consulta frecuentemente, agregar una nota al inicio indicando que es un documento previo al rebranding a SUMITRONIC.

---

## Regla vigente

Mientras un identificador heredado sostenga una conexión real con infraestructura, restore, base de datos, pagos o dominio activo, no se cambia por búsqueda global. Se migra con pruebas, fallback y una ventana técnica controlada.
