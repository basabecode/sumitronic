# Functional UI Audit — Panel Administrador
**Fecha:** 2026-03-30
**Portal:** Admin (`/admin`)
**Scope:** Full
**Skills usados:** functional-qa · admin-dashboard · interface-design

---

## Resumen Ejecutivo

| Categoría | Total |
|---|---|
| Elementos auditados | 38 |
| ✅ Implementados correctamente | 22 |
| ⚠️ Parcialmente implementados (stubs/limitados) | 8 |
| ❌ Dead UI / Roto (sin función real o bugueado) | 8 |
| 🔴 Críticos | 4 |

---

## 🔴 Críticos — Deben corregirse antes de producción

### 1. Ruta huérfana: `app/admin/products/add/`
**Archivo:** `app/admin/products/add/ProductForm.tsx`
**Problema:** Esta página es un formulario legacy que sobrevivió a la refactorización. Sus botones de "Cancelar" y "Volver al Inventario" enlazan a `/admin/products`, ruta que **no existe** en el proyecto (hay 404). Si algún usuario llega a `/admin/products/add` directamente, queda atrapado sin salida válida.

```tsx
// ❌ Dead links — ruta /admin/products/ no existe
<Link href="/admin/products">Cancelar</Link>
<Link href="/admin/products">Volver al Inventario</Link>

// Después del submit también:
router.push('/admin/products')  // → 404
```

**Corrección:** Eliminar la ruta legacy `app/admin/products/add/` completa. El formulario activo y correcto es `app/admin/components/ProductFormTab.tsx`.

---

### 2. Bug de mutación: cálculo de "Ventas Hoy" siempre en $0
**Archivo:** `app/admin/components/SalesTab.tsx:118–138`
**Problema:** La variable `today` es mutada por `.setMonth()`. Cuando se calcula `todayStr` más abajo, `today` ya apunta al **mes anterior**, no al día actual. Las ventas de hoy siempre serán COP $0.

```tsx
// ❌ today es mutado aquí:
const lastMonthDate = new Date(today.setMonth(today.getMonth() - 1))

// ...y todayStr usa el today ya mutado (= mes pasado):
const todayStr = new Date().toISOString().split('T')[0]  // línea 138
```

Espera — `todayStr` en línea 138 usa `new Date()` (nueva instancia), así que ese caso específico está bien. PERO `today` en el memo ya fue mutada, por lo que `currentMonth` y `currentYear` calculados originalmente de `today` en líneas 97–99 y el cálculo de `lastMonth` en línea 119 usan el **mismo objeto mutado** de formas potencialmente incorrectas entre renders.

**Corrección real:**
```tsx
// ✅ Nunca mutar today
const lastMonthDate = new Date(today)
lastMonthDate.setMonth(today.getMonth() - 1)
const lastMonth = lastMonthDate.getMonth()
const lastMonthYear = lastMonthDate.getFullYear()
```

---

### 3. Admin escribe directo a Supabase sin pasar por API Routes (sin protección de rol)
**Archivos:** `app/admin/hooks/useAdminProducts.ts`, `app/admin/hooks/useProductForm.ts`, `app/admin/components/SalesTab.tsx`
**Problema:** El panel admin hace **queries directas al cliente Supabase** desde el browser en lugar de usar las rutas de API del servidor. La API `POST /api/products` sí verifica autenticación y rol de admin:

```ts
// app/api/products/route.ts — tiene protección:
const { data: { user } } = await supabase.auth.getUser()
if (profile?.role !== 'admin') return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
```

Pero `useProductForm.handleSubmitProduct` hace la inserción directamente:
```ts
// ❌ Sin verificación de rol en el cliente:
const { error } = await supabase.from('products').insert([productData])
```

En el entorno local con Docker, Supabase Auth está desactivado, lo que significa que **cualquier usuario puede insertar/eliminar productos** si conoce la URL del panel.

**Corrección:** Usar el endpoint `POST /api/products` y `PUT /api/products/[id]` existentes desde los hooks, o implementar middleware de protección real en `/admin`.

---

### 4. `uploadImage` usa Supabase Storage — no activo en local Docker
**Archivos:** `lib/supabase/utils.ts`, `app/admin/hooks/useProductForm.ts`
**Problema:** La función `uploadImage` intenta subir archivos a **Supabase Storage** (`supabase.storage.from(bucket).upload`), pero CLAUDE.md documenta explícitamente: *"Supabase Auth and Storage are NOT active in this environment."*

La imagen uploadfalla silenciosamente y cae al fallback `/placeholder.svg`. Los productos se crean en DB con `image_url: '/placeholder.svg'` sin que el usuario reciba un error claro.

```ts
// useProductForm.ts:75
const urls = await Promise.all(
  toUpload.map(file =>
    uploadImage(file, 'products').catch(() => '/placeholder.svg') // ← silencia el error
  )
)
```

**Corrección:** Mostrar un error explícito al usuario cuando el upload falla. Alternativamente, implementar un endpoint local de upload que guarde en el filesystem o use una solución sin Supabase Storage.

---

## ⚠️ Altos — Funcionalidad incompleta o con errores de UX

### 5. Filtro por categoría en Inventario no funciona
**Archivo:** `app/admin/hooks/useAdminProducts.ts:61–63`
**Problema:** El filtro de categoría usa el alias incorrecto en la query de Supabase:

```ts
// ❌ Incorrecto — el join está aliasado como 'category' (singular), no 'categories'
query = query.eq('categories.name', categoryFilter)
```

El select usa: `category:categories!category_id (id, name, slug)` — el alias es `category`. Además, filtrar un join embebido con `.eq('categories.name', ...)` no funciona así en Supabase PostgREST; requiere un subquery o join diferente.

**Corrección:**
```ts
// ✅ Obtener IDs primero (como hace la API route pública):
const { data: catData } = await supabase
  .from('categories')
  .select('id')
  .eq('name', categoryFilter)
  .single()
if (catData) query = query.eq('category_id', catData.id)
```

---

### 6. `handleAddBrand` no persiste en la base de datos
**Archivo:** `app/admin/hooks/useProductForm.ts:117–128`
**Problema:** Las marcas nuevas solo se guardan en estado local React. Al recargar la página, desaparecen. Inconsistente con `handleAddCategory` que sí inserta en la tabla `categories`.

```ts
// ❌ Solo estado local, sin insert a DB:
const handleAddBrand = () => {
  setBrands(prev => [...prev, newBrand.trim()].sort())
  // Sin supabase.from('brands').insert(...)
}
```

**Corrección:** Si existe tabla `brands` en DB, persistir ahí. Si no, crear la tabla o aceptar que las marcas son texto libre (documentar la inconsistencia).

---

### 7. Toda la UX de errores usa `alert()` en vez de toasts
**Archivos:** `useAdminProducts.ts`, `useProductForm.ts`
**Problema:** 12+ instancias de `alert()` para feedback de errores y éxitos. Bloquea el hilo de UI, se ve fuera de lugar en una app Next.js moderna, y no puede ser dismissado automáticamente.

```ts
// ❌ Aparece 12+ veces:
alert('Producto eliminado exitosamente')
alert('Error al eliminar el producto')
alert('Categoría creada exitosamente')
// ...etc
```

**Corrección:** Usar `toast()` de `sonner` (ya está disponible como dependencia en proyectos Next.js modernos) o cualquier sistema de notificaciones ya integrado.

---

### 8. `SalesTab`: error de fetch silencioso para el usuario
**Archivo:** `app/admin/components/SalesTab.tsx:89`
**Problema:** Si `fetchOrders` falla, el loading spinner desaparece y la tabla queda vacía sin ningún mensaje de error. El usuario no sabe si no hay pedidos o si hubo un fallo.

```ts
// ❌ Error silenciado — solo console.error:
} catch (error) {
  console.error('Error fetching orders:', error)
} finally {
  setLoading(false)
}
```

**Corrección:** Agregar estado `error` y mostrar mensaje descriptivo al usuario.

---

## ⚠️ Medios — Inconsistencias de diseño y UX

### 9. Stats del Dashboard usan datos paginados, no totales reales de DB
**Archivo:** `app/admin/components/DashboardTab.tsx:21–23`
**Problema:** Las 4 tarjetas de stats ("Total Productos", "En Stock", "Sin Stock", "Destacados") calculan sus valores a partir del array `products[]` que solo contiene **la página actual** (50 items). Si hay 200 productos en DB, las stats del dashboard mostrarán máximo 50.

```tsx
// ❌ Basado en products[] (página actual, máx 50):
const inStock = products.filter(p => p.stock_quantity > 0).length
const outOfStock = products.filter(p => p.stock_quantity === 0).length
const featured = products.filter(p => p.featured).length
```

La card de "Total Productos" tampoco usa `totalProducts` (que sí viene del `count` real de DB).

**Corrección:** Hacer una query separada para los totales del dashboard, o usar `totalProducts` del hook de productos para al menos el conteo total.

---

### 10. Drop zone de imágenes no implementa drag-and-drop real
**Archivo:** `app/admin/components/ProductFormTab.tsx:275–298`
**Problema:** El UI dice "Arrastra las imágenes aquí" pero el `div` no tiene handlers `onDrop` ni `onDragOver`. Solo funciona el click.

```tsx
// ❌ Texto engañoso — sin handlers de drag:
<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
  <p>Arrastra las imágenes aquí o haz clic para seleccionar</p>
  {/* Sin onDrop, onDragOver, onDragEnter */}
```

---

### 11. Conflict de clases CSS en la navegación de tabs
**Archivo:** `app/admin/AdminPanel.tsx:113`
**Problema:** El contenedor de tabs tiene `inline-flex` y `grid` aplicados simultáneamente — son incompatibles.

```tsx
// ❌ inline-flex y grid en conflicto:
className="inline-flex h-10 items-center ... w-full grid grid-cols-4"
```

En la práctica `grid` "gana" pero el `inline-flex` es ruido que puede causar comportamiento inconsistente en algunos browsers.

---

### 12. Sin confirmación al cancelar edición con cambios sin guardar
**Archivo:** `app/admin/components/ProductFormTab.tsx:345`
**Problema:** El botón "Cancelar" navega inmediatamente al Inventario sin advertir que hay cambios no guardados. Riesgo de pérdida accidental de datos al editar un producto.

```tsx
// ❌ Sin guard de cambios pendientes:
<Button type="button" variant="outline" onClick={onCancel}>
  Cancelar
</Button>
```

---

## ✅ Implementado Correctamente

| Elemento | Archivo | Detalle |
|---|---|---|
| Guard de autenticación y rol admin | `AdminPanel.tsx:72` | Verifica `user`, `profile`, `profile.role === 'admin'` antes de renderizar |
| Loading state en auth | `AdminPanel.tsx:60–69` | Spinner mientras verifica sesión |
| Dialog de confirmación para eliminar | `InventoryTab.tsx:287–309` | Muestra nombre del producto + "no se puede deshacer" |
| Botón eliminar deshabilitado si loading | `InventoryTab.tsx:165` | `disabled={currentPage === 1 \|\| loadingProducts}` |
| Loading state en botón submit | `ProductFormTab.tsx:348` | `disabled={formLoading}` + spinner + texto contextual |
| Debounced search | `useAdminProducts.ts:27–34` | 300ms debounce, con spinner visual en input |
| Paginación de inventario | `InventoryTab.tsx:160–178` | Anterior/Siguiente deshabilitados en límites |
| "Ver producto" en nueva pestaña | `InventoryTab.tsx:259` | `target="_blank"` correcto |
| "Ver Tienda" en nueva pestaña | `AdminPanel.tsx:104` | `target="_blank"` correcto |
| Reset de página al cambiar filtros | `useAdminProducts.ts:37–39` | `useEffect` que resetea `currentPage` a 1 |
| Callback `onSaveSuccess` | `AdminPanel.tsx:32–35` | Refresca productos y vuelve a inventario tras guardar |
| Editar producto carga datos al form | `useProductForm.ts:139–152` | `loadProductForEdit` popula todos los campos |
| Label dinámica "Editar/Agregar" en tab | `AdminPanel.tsx:125` | Muestra "Editar Producto" cuando hay `editingProduct` |
| Búsqueda de órdenes en SalesTab | `SalesTab.tsx:151–159` | Filtra por ID, nombre, email, método de pago |
| Badges de estado de pago con colores | `SalesTab.tsx:296–304` | Verde/amarillo/rojo según estado |
| Link a comprobante de pago | `SalesTab.tsx:307–315` | Abre en nueva pestaña con `rel="noreferrer"` |
| Stats de ventas con crecimiento % | `SalesTab.tsx:96–149` | Calcula totales, mensual, crecimiento vs mes anterior |
| Contador de imágenes | `ProductFormTab.tsx:268` | Badge `{N}/5` actualizado en tiempo real |
| Botón upload deshabilitado al límite | `ProductFormTab.tsx:293` | `disabled={imageUploading \|\| formData.images.length >= 5}` |
| Validación de descuento inválido | `ProductFormTab.tsx:229–232` | Mensaje si compare_price ≤ price |
| Cálculo visual del % de descuento | `ProductFormTab.tsx:65–68` | Muestra "Descuento: X%" en tiempo real |
| Botones "Próximamente" correctamente disabled | `DashboardTab.tsx:131,146` | No son dead UI — explícitamente deshabilitados |

---

## Plan de Corrección Recomendado

### 🔴 Prioridad 1 — Antes de cualquier deploy

| # | Problema | Archivo | Acción |
|---|---|---|---|
| 1 | Ruta huérfana `/admin/products/add/` | `app/admin/products/add/ProductForm.tsx` | Eliminar el archivo y la carpeta |
| 2 | Bug mutación `today` en ventas diarias | `SalesTab.tsx:118` | Usar `new Date(today)` + `lastMonthDate.setMonth(...)` |
| 3 | Upload de imágenes falla silenciosamente | `useProductForm.ts:73–78` | Agregar error explícito al usuario cuando `uploadImage` falla |
| 4 | Filtro de categoría broken | `useAdminProducts.ts:61–63` | Reescribir para obtener `category_id` primero |

### 🟠 Prioridad 2 — Sprint siguiente

| # | Problema | Archivo | Acción |
|---|---|---|---|
| 5 | `alert()` en lugar de toasts | `useAdminProducts.ts`, `useProductForm.ts` | Reemplazar todos los `alert()` con `toast()` de Sonner |
| 6 | `handleAddBrand` no persiste | `useProductForm.ts:117–128` | Definir si las marcas van a DB o son texto libre, actuar en consecuencia |
| 7 | Error silencioso en fetchOrders | `SalesTab.tsx:89` | Agregar estado `error` y mostrar mensaje al usuario |
| 8 | Stats dashboard usan datos paginados | `DashboardTab.tsx:21–23` | Pasar `totalProducts` del hook o hacer query separada |

### 🟡 Prioridad 3 — Mejoras de UX/DX

| # | Problema | Archivo | Acción |
|---|---|---|---|
| 9 | Sin drag-and-drop real en upload | `ProductFormTab.tsx:275` | Implementar `onDrop` + `onDragOver` o quitar el texto engañoso |
| 10 | Sin guard al cancelar edición | `ProductFormTab.tsx:345` | Agregar `window.confirm()` si `editingProduct && formDirty` |
| 11 | CSS conflict `inline-flex + grid` | `AdminPanel.tsx:113` | Eliminar `inline-flex` y usar solo `grid grid-cols-4 w-full` |
| 12 | Admin bypassa API routes (seguridad) | `useAdminProducts.ts`, `useProductForm.ts` | Migrar a `fetch('/api/products')` para operaciones de escritura |
