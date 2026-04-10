# Auditoria General del Proyecto

Fecha: 2026-03-30
Proyecto: CapiShop Web
Alcance: frontend, backend, base de datos, SEO, contenido, responsive design, UI/UX, functional QA, panel administrativo

## Registro de Tareas Realizadas

> Actualizado: 2026-03-30 (validación post-implementación). Se registran aquí todas las acciones de mejora ejecutadas sobre el proyecto, en orden cronológico, referenciando la fase del plan de priorización.

### Fase 1 — Consolidación técnica

#### ✅ 1.1 — Eliminar dependencia de `products.json` como fallback funcional (2026-03-30)

**Archivos modificados:**

- `app/api/products/route.ts` — eliminados 2 bloques de fallback (~220 líneas). Cuando Supabase/DB falla, ahora retorna HTTP 503 limpio en lugar de datos mock. De 464 → 247 líneas.
- `app/api/categories/route.ts` — eliminados 2 bloques de fallback. Mismo comportamiento. De 136 → 105 líneas.
- `components/layout/Header.tsx` — reemplazado import estático de `products.json` por fetch dinámico a `/api/categories` con `useEffect`. Las categorías del menú de navegación ahora vienen de la base de datos real.

**Estado:** `lib/products.json` ya no es referenciado por ninguna ruta de UI funcional. Solo persiste en `BlogSection.tsx` (pendiente Fase 3) y `scripts/migrate-products.ts` (script de migración, no UI).

**Build:** pasa sin errores.

#### ✅ 1.2 — Unificar tipos de `Product` y `Order` (2026-03-30)

**Diagnóstico:** Tres archivos de tipos con definiciones conflictivas de `Product`, `Order` y `Profile`:

- `lib/types/database.ts` (588 líneas) — Schema DB completo, fuente real. Usado por AuthContext para `Profile`.
- `lib/supabase/types.ts` (64 líneas) — Tipos legacy con `Product.image`, `Order.customer_info` — no importado por nadie.
- `lib/types/products.ts` (168 líneas) — Tipos de catálogo para UI — usado por 3 archivos.

**Archivos modificados:**

- `lib/supabase/types.ts` — **eliminado**. Dead code con tipos desactualizados que contradecían el schema real.
- `lib/index.ts` — eliminada la re-exportación del archivo borrado.

**Resultado:** Una sola definición activa por entidad. `lib/types/database.ts` = schema DB. `lib/types/products.ts` = tipos de UI/catálogo.

**Build:** pasa sin errores.

#### ✅ 1.3 — Dividir `AdminPanel.tsx` en módulos (2026-03-30)

**Antes:** 1526 líneas en un solo archivo con 7 responsabilidades mezcladas.

**Archivos creados:**

| Archivo                                   | Líneas | Responsabilidad                                                      |
| ----------------------------------------- | ------ | -------------------------------------------------------------------- |
| `app/admin/types.ts`                      | 50     | Interfaces `Product`, `ProductFormData`, `EMPTY_FORM`, `formatPrice` |
| `app/admin/hooks/useAdminProducts.ts`     | 125    | Estado de lista: fetch, paginación, búsqueda, filtros, eliminar      |
| `app/admin/hooks/useProductForm.ts`       | 235    | Estado de formulario: CRUD producto, imágenes, categorías, marcas    |
| `app/admin/components/DashboardTab.tsx`   | 154    | Cards de stats + acciones rápidas                                    |
| `app/admin/components/InventoryTab.tsx`   | 312    | Tabla de productos, filtros, paginación, diálogo de borrado          |
| `app/admin/components/ProductFormTab.tsx` | 366    | Formulario de creación/edición de producto                           |
| `app/admin/components/SalesTab.tsx`       | 331    | Ventas, analytics y métricas de ingresos                             |
| `app/admin/AdminPanel.tsx`                | 193    | Orquestador: auth check + nav de tabs + composición                  |

**Resultado:** 1526 líneas → 193 líneas el orquestador. Cada módulo tiene una sola responsabilidad. Testeable de forma independiente. `SalesTab` cubre la oportunidad de ventas/analytics identificada en §9.3.

**Build:** pasa sin errores.

#### ✅ 1.4 — Limpiar `console.log` residuales (2026-03-30)

**Archivos modificados:**

- `app/admin/products/add/ProductForm.tsx` — eliminados 2 `console.log` de debug: "Insertando producto" y "Producto creado exitosamente". Renombrado `console.error('Error de Supabase:')` a mensaje claro. Limpiada variable `data` sin usar.

**Nota:** `ProductForm.tsx` es un componente huérfano (sin `page.tsx` asociado, no es ruta activa). Su funcionalidad está cubierta por `app/admin/components/ProductFormTab.tsx`.

**Revisión global:** Los `console.log` restantes son legítimos — scripts CLI (`scripts/`), tests unitarios (`tests/`), logs con guard `debugMode` en `hooks/useAuth.ts`.

**Build:** pasa sin errores.

---

### ✅ Fase 1 completada — 2026-03-30

**Validación:** Todos los cambios verificados. Build de producción pasa sin errores (`npm run build`).

- `app/api/products/route.ts`: 247 líneas ✅ (sin fallback JSON)
- `app/api/categories/route.ts`: 105 líneas ✅ (sin fallback JSON)
- `components/layout/Header.tsx`: usa `fetch('/api/categories')` vía `useEffect` ✅
- `lib/supabase/types.ts`: eliminado ✅
- `lib/index.ts`: re-exportación del archivo eliminado removida ✅
- `app/admin/AdminPanel.tsx`: 193 líneas ✅ (orquestador puro)
- `app/admin/products/add/ProductForm.tsx`: sin `console.log` residuales ✅
- Referencias a `products.json` en código UI funcional: **0** ✅

---

### Fase 2 — Sistema visual (pendiente)

### ✅ Fase 3 — SEO y contenido (parcialmente implementada — 2026-03-30)

#### ✅ 3.1 — Blog con rutas reales por slug (2026-03-30)

**Contexto:** La recomendación §7.4.2 indicaba reemplazar el blog modal por rutas reales tipo `/blog/[slug]`.

**Archivos creados:**

- `app/blog/page.tsx` (79 líneas) — índice del blog, lista de artículos con links a slugs
- `app/blog/[slug]/page.tsx` (117 líneas) — artículo individual con metadata dinámica y JSON-LD
- `lib/content.ts` (205 líneas) — tipos `BlogPost`, `HelpArticle`, `Brand`, `CategoryContent` + datos de contenido editorial

**Resultado:** El blog ya no es modal. Cada artículo tiene su propia URL indexable. `BlogSection.tsx` en home ahora importa desde `lib/content` en lugar de `lib/blogPosts.json`.

**Build:** pasa sin errores.

#### ✅ 3.2 — Landings indexables para categorías y marcas (2026-03-30)

**Contexto:** La recomendación §7.4.1 indicaba crear landings indexables para categorías y marcas.

**Archivos creados:**

- `app/categorias/[slug]/page.tsx` (63 líneas) — landing de categoría con productos filtrados, metadata dinámica
- `app/marcas/[slug]/page.tsx` (63 líneas) — landing de marca con productos filtrados, metadata dinámica
- `lib/storefront.ts` (124 líneas) — helpers `getActiveCategories()`, `getActiveBrands()` para SSG desde DB

**Resultado:** Categorías y marcas tienen URLs propias indexables (`/categorias/camaras-ip`, `/marcas/hikvision`, etc.).

**Build:** pasa sin errores.

#### ✅ 3.3 — Help center con rutas por slug (2026-03-30)

**Contexto:** La recomendación §5.2 indicaba que la página de ayuda no era escalable como una sola URL.

**Archivos creados:**

- `app/help/[slug]/page.tsx` (106 líneas) — artículo de ayuda individual con metadata dinámica, breadcrumb y navegación

**Resultado:** El help center ahora soporta artículos individuales en `/help/[slug]`, indexables por Google.

**Build:** pasa sin errores.

---

### ✅ Fase 3 (parcial) — Completada — 2026-03-30

Implementadas las rutas SEO críticas: blog con slugs, categorías, marcas y help center indexables. Pendiente: clusters de contenido reales, schema `FAQPage`/`Article` completo, verificación de Search Console.

---

### Fase 4 — QA y hardening (pendiente)

---

## 1. Resumen Ejecutivo

El proyecto tiene una base funcional recuperable y ya muestra avance real en estructura, catálogo, autenticación, panel administrativo y experiencia de compra. El estado actual no es de colapso técnico, pero sí de madurez intermedia: existe bastante interfaz y flujo visible, aunque todavía conviven varias capas incompletas, modelos de datos heredados, contenido estático y decisiones de diseño que no terminan de consolidarse como sistema.

Los puntos más fuertes hoy son:

- La aplicación compila correctamente en build de producción.
- Ya existe una base de datos local restaurada y migrada a un esquema compatible con la app.
- El catálogo, categorías, detalle de producto, carrito, favoritos y panel admin tienen base implementada.
- Hay estructura de documentación, skills y componentes suficiente para seguir iterando sin rehacer el proyecto desde cero.

Los principales riesgos actuales son:

- La UI creció más rápido que la arquitectura de producto y diseño.
- El frontend aún mezcla datos reales con fallbacks mock o JSON.
- El panel admin concentra demasiada lógica en un solo archivo.
- El contenido SEO y editorial todavía es insuficiente para competir de verdad.
- Persisten brechas de QA funcional y de mantenimiento técnico.

## 2. Estado General del Sistema

### 2.1 Estado operativo

- `npm run build` pasa correctamente.
- La base local fue restaurada desde backup y ajustada con una migración de compatibilidad.
- Existen tablas y columnas necesarias para el flujo principal de catálogo.
- El proyecto ya no depende del fetch local circular durante el build del detalle de producto.
- El rate limiting quedó con fallback local cuando no existe configuración de Upstash.

### 2.2 Estado de madurez

El proyecto se encuentra en una etapa donde:

- ya no corresponde reconstruir desde cero
- sí corresponde consolidar criterios, reducir deuda y normalizar sistemas

En términos prácticos, esto significa que el trabajo prioritario no es agregar nuevas features aisladas, sino estabilizar el producto actual.

## 3. Base de Datos y Backend

### 3.1 Hallazgos

Se detectó y resolvió un desfase importante entre el backup restaurado y el esquema que consume la aplicación actual.

Se dejó aplicada una migración de compatibilidad que:

- agrega `slug` e `image_url` a `categories`
- agrega `category_id`, `image_url`, `stock_quantity`, `compare_price`, `sku`, `weight`, `dimensions` a `products`
- crea `product_images`
- crea `inventory`
- crea `carts`
- crea `favorites`
- extiende `cart_items`
- completa campos faltantes en `orders`
- crea `order_items`

### 3.2 Situación actual

La base quedó en un estado utilizable para el flujo principal, pero todavía hay señales de transición entre dos modelos:

- modelo antiguo basado en estructuras más simples y datos JSON
- modelo actual más cercano a catálogo normalizado

### 3.3 Riesgos backend

- Existen pocos endpoints para todo lo que la UI pretende hacer.
- No hay todavía endpoints administrativos especializados para métricas, operación y observabilidad.
- El frontend solicita algunas agregaciones que deberían resolverse en endpoints dedicados.
- Aún falta una separación más clara entre capa de datos, capa de negocio y capa de UI.

### 3.4 Recomendaciones backend

1. Dejar una sola fuente de verdad para catálogo y categorías.
2. Eliminar gradualmente la dependencia de `lib/products.json` como fallback funcional.
3. Crear endpoints dedicados para:
   - métricas admin
   - órdenes admin
   - filtros de catálogo
   - contenido editorial
4. Consolidar tipados para que no convivan múltiples modelos de producto y orden.

## 4. Frontend

### 4.1 Hallazgos

El frontend ya es amplio y cubre muchas pantallas:

- home
- productos
- detalle de producto
- carrito
- checkout
- favoritos
- perfil
- ayuda
- admin

La arquitectura visual actual es funcional, pero todavía se percibe como una suma de piezas bien intencionadas más que como un sistema frontend consolidado.

### 4.2 Problemas detectados

- El layout global sigue usando una base visual muy estándar.
- Se depende de `Inter` en [app/layout.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/layout.tsx), lo que debilita la identidad visual.
- [app/globals.css](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/globals.css) mezcla tokens base, utilidades, hacks móviles y efectos visuales en un único archivo.
- [components/layout/Header.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/components/layout/Header.tsx) concentra demasiadas responsabilidades:
  - navegación
  - búsqueda
  - auth
  - carrito
  - favoritos
  - drawer móvil
  - categorías
- [components/layout/BottomNav.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/components/layout/BottomNav.tsx) usa branching con `window.innerWidth` para ocultarse en desktop, lo cual no es la mejor estrategia para un sistema robusto.

### 4.3 Recomendaciones frontend

1. Separar el layout en shells claros:
   - header shell
   - mobile drawer
   - search experience
   - account actions
   - cart and favorites entrypoints
2. Reducir lógica visual y de interacción concentrada en componentes gigantes.
3. Crear un sistema visual más explícito:
   - tipografía principal
   - tipografía secundaria
   - tokens semánticos
   - escala de spacing
   - sistema de superficies
   - sistema de motion
4. Mover hacks y utilidades globales a una convención más controlada.

## 5. UI, UX e Interface Design

### 5.1 Diagnóstico general

La UI actual es usable, limpia y bastante completa, pero todavía no tiene una identidad memorable fuerte. El lenguaje visual se apoya casi siempre en el patrón:

- fondo blanco
- grises neutros
- acento naranja
- cards redondeadas
- sombras suaves

Este patrón funciona, pero todavía no alcanza una firma visual distintiva.

### 5.2 Observaciones por área

#### Home

[app/page.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/page.tsx) está bien estructurada, pero la composición visual aún puede evolucionar.

Fortalezas:

- la home tiene secciones claras
- existe hero, catálogo, ofertas, testimonios, FAQ, blog y CTA

Debilidades:

- el hero todavía se percibe como componente promocional estándar
- la jerarquía entre secciones podría tener más intención editorial
- falta una narrativa de marca más sólida

#### Catálogo

[components/products/ProductsSection.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/components/products/ProductsSection.tsx) es una de las piezas más maduras visualmente.

Fortalezas:

- mejor jerarquía que otras vistas
- filtros visibles
- chips activos
- dos modos de vista
- paginación clara

Debilidades:

- depende de eventos globales para coordinar búsqueda y filtros
- mezcla lógica de negocio, filtros, render y estados en un solo componente muy largo

#### Detalle de producto

[app/products/[id]/ProductClient.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/products/[id]/ProductClient.tsx) resuelve lo básico, pero aún no exprime el potencial comercial.

Falta:

- bloque de confianza más sólido
- beneficios diferenciales reales
- comparativas
- FAQs por producto
- cross-sell más estratégico
- señales más fuertes de decisión de compra

#### Ayuda

[app/help/page.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/help/page.tsx) es útil, pero sigue siendo una sola gran página con navegación lateral interna.

Esto sirve para soporte básico, pero no para una estrategia seria de contenido indexable o centro de ayuda escalable.

### 5.3 Recomendaciones UI/UX

1. Escoger una dirección de producto clara para toda la marca:
   - retail-tech editorial
   - seguridad y conectividad profesional
   - tecnología cercana con foco en confianza
2. Reforzar la identidad por medio de:
   - tipografía menos genérica
   - lenguaje de superficies más propio
   - iconografía consistente
   - motion más intencional
3. Rediseñar detalle de producto como página de conversión real, no solo ficha informativa.
4. Separar con más claridad:
   - storefront
   - panel interno
   - help center

## 6. Responsive Design

### 6.1 Hallazgos

Hay varias optimizaciones mobile-first ya incorporadas en [app/globals.css](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/globals.css):

- safe areas
- touch targets
- mejoras para iOS
- scroll snap
- bottom nav safe
- animaciones

Esto demuestra intención clara hacia móvil.

### 6.2 Debilidades

- Muchas reglas responsive están sueltas en CSS global.
- No hay un sistema suficientemente unificado de escalas fluidas.
- Faltan más patrones basados en contenido y no solo en breakpoints.
- Algunos comportamientos dependen de lógica runtime en lugar de CSS/layout responsivo puro.

### 6.3 Recomendaciones responsive

1. Introducir tipografía fluida con `clamp()`.
2. Definir escala de spacing fluida.
3. Usar más container patterns y menos ajustes manuales.
4. Evitar branching por `window.innerWidth` dentro de componentes.
5. Auditar:
   - navegación móvil
   - filtros en catálogo
   - tablas del panel admin
   - formularios largos

## 7. SEO

### 7.1 Hallazgos técnicos

El proyecto ya tiene elementos SEO base:

- metadata global en [app/layout.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/layout.tsx)
- `robots.ts` en [app/robots.ts](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/robots.ts)
- sitemap dinámico en [app/sitemap.ts](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/sitemap.ts)
- JSON-LD de `Organization`
- metadata para producto dinámico

### 7.2 Debilidades SEO

- La metadata general sigue siendo bastante genérica.
- La verificación de Google Search Console es placeholder.
- Faltan páginas indexables para categorías, marcas y contenido editorial real.
- El blog actual es mock y modal-based, no indexable como estrategia de tráfico.
- La página de ayuda agrupa demasiados temas en una sola URL.
- Falta ampliar schema más allá de `Organization` y `Product` básico.

### 7.3 Riesgos SEO

- Dependencia excesiva de páginas comerciales sin clúster de soporte.
- Bajo volumen de contenido indexable real.
- Riesgo de estancamiento en visibilidad orgánica por falta de arquitectura editorial.

### 7.4 Recomendaciones SEO

1. Crear landings indexables para:
   - categorías
   - marcas
   - guías de compra
   - comparativas
   - soporte
2. Reemplazar blog modal por rutas reales tipo `/blog/[slug]`.
3. Crear piezas de contenido con intención de búsqueda:
   - guías
   - tutoriales
   - comparativas
   - FAQs
4. Ampliar schema:
   - `Product`
   - `BreadcrumbList`
   - `FAQPage`
   - `Article`
   - `Organization` completo
5. Conectar verificación real de Search Console.

## 8. Contenido y Estrategia Editorial

### 8.1 Estado actual

El proyecto tiene secciones de contenido visibles, pero todavía no una estrategia de contenido real.

[components/sections/BlogSection.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/components/sections/BlogSection.tsx) y [lib/blogPosts.json](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/lib/blogPosts.json) funcionan más como placeholder editorial que como sistema de adquisición.

### 8.2 Brechas de contenido

- solo existen pocos artículos
- no hay taxonomía editorial real
- no hay rutas por slug
- no hay clusters
- no hay estrategia por intención de compra

### 8.3 Propuesta de pilares

Se recomiendan estos pilares de contenido:

1. Seguridad para hogar y negocio
2. Redes y conectividad
3. Energía y respaldo
4. Guías de compra tecnológicas
5. Instalación, mantenimiento y soporte

### 8.4 Tipos de contenido recomendados

- comparativas: “X vs Y”
- guías de compra por categoría
- tutoriales de instalación
- FAQs comerciales
- resolución de objeciones
- contenido local para Colombia
- reviews técnicas con foco en confianza

## 9. Panel Admin y Dashboards

### 9.1 Hallazgos

El admin ya tiene bastante trabajo adelantado, pero hoy está más cerca de un panel operativo inicial que de un dashboard de producto maduro.

[app/admin/AdminPanel.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/admin/AdminPanel.tsx) concentra:

- control de acceso
- carga de productos
- inventario
- categorías
- marcas
- creación/edición
- ventas

### 9.2 Problemas detectados

- demasiada responsabilidad en un único archivo
- difícil mantenimiento
- difícil testeo
- UI del panel no tiene una jerarquía operativa suficientemente clara
- faltan métricas ejecutivas y operativas más útiles

### 9.3 Oportunidades de mejora

Agregar tabs o módulos para:

- resumen ejecutivo
- salud del catálogo
- ventas recientes
- alertas de stock
- pedidos
- integraciones y estado del sistema
- acciones rápidas

### 9.4 Recomendaciones de estructura

Separar el panel en componentes y módulos:

- `inventory-tab`
- `catalog-form`
- `sales-tab`
- `dashboard-summary`
- `admin-actions`
- hooks como `useAdminProducts`, `useAdminSales`, `useAdminFilters`

## 10. Functional QA

### 10.1 Hallazgos

No se detectó un panorama de UI muerta masiva, pero sí varios indicios de que hace falta una fase de QA funcional estructurada.

Se encontraron `console.log` residuales en:

- [app/admin/products/add/ProductForm.tsx](/c:/Users/Usuario/Desktop/tienda_Capi/CapiShop_Web/CapiShop_Web/app/admin/products/add/ProductForm.tsx)

También existe dependencia fuerte de varias llamadas `fetch('/api/...')` desde contexts y componentes, lo que exige validar bien:

- tiempos de carga
- errores de red
- sincronización de estado
- degradación cuando algo falla

### 10.2 Flujos críticos a validar manualmente

1. Login y logout
2. Carga de perfil
3. Listado de productos
4. Filtros y búsqueda
5. Detalle de producto
6. Favoritos
7. Carrito persistente
8. Checkout
9. Pedidos
10. Crear, editar y desactivar productos en admin

### 10.3 Áreas con mayor riesgo de QA

- sincronización entre estado local y backend en carrito
- favoritos con usuario autenticado
- filtros de catálogo y categorías
- estados vacíos
- panel admin en móvil
- help center y navegación interna

## 11. Skills y Documentación Operativa

### 11.1 Skills

Se revisaron skills importadas desde otro proyecto.

Hallazgos:

- no se encontraron referencias al nombre de este proyecto dentro de las skills
- sí se encontraron referencias heredadas a otro proyecto (`SomosTecnicos`) y a convenciones específicas de Claude

Acciones realizadas previamente:

- neutralización de referencias de proyecto heredado
- estandarización de varias skills para uso general

### 11.2 Documentación

La documentación del proyecto venía con señales de desactualización y mezcla histórica. Parte de eso ya fue corregido en iteraciones anteriores, pero todavía se recomienda mantener una sola fuente de verdad sobre:

- estado operativo
- base de datos
- scripts disponibles
- flujo de recuperación local
- roadmap técnico

## 12. Priorización Recomendada

### ✅ Fase 1: Consolidación técnica — COMPLETADA (2026-03-30)

- ✅ eliminar dependencias funcionales de mocks JSON
- ✅ cerrar modelos de datos duplicados (`lib/supabase/types.ts` eliminado)
- ✅ dividir el admin en módulos (7 archivos + orquestador)
- ✅ limpiar `console.log` de debug

### Fase 2: Sistema visual — PENDIENTE

- definir dirección visual de marca
- reemplazar decisiones genéricas (fuente Inter → tipografía de marca)
- reestructurar header, navegación y detalle de producto

### ✅ Fase 3: SEO y contenido — PARCIALMENTE COMPLETADA (2026-03-30)

- ✅ blog real por rutas (`/blog/[slug]`)
- ✅ categorías indexables (`/categorias/[slug]`)
- ✅ marcas indexables (`/marcas/[slug]`)
- ✅ help center indexable (`/help/[slug]`)
- ⏳ clusters de contenido reales (artículos con profundidad editorial)
- ⏳ schema markup extendido (`FAQPage`, `Article`, `BreadcrumbList`)
- ⏳ verificación Google Search Console

### Fase 4: QA y endurecimiento — PENDIENTE

- smoke tests manuales estructurados
- corrección de errores residuales
- limpieza de logs y acoplamientos
- preparación para releases más confiables

## 13. Conclusión

El proyecto no necesita reinicio. Necesita consolidación.

La base ya existe:

- hay producto
- hay catálogo
- hay panel
- hay arquitectura suficiente
- hay contenido inicial
- hay base de datos local funcional

Lo que sigue es convertir un conjunto de piezas prometedoras en un sistema coherente:

- una sola verdad de datos
- una identidad visual clara
- una arquitectura frontend más mantenible
- una estrategia SEO y editorial real
- un panel admin más profesional
- validación funcional sistemática

En resumen: el proyecto ya tiene sustancia. El siguiente tramo debe enfocarse en calidad, consistencia y profundidad.
