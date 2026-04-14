# CLAUDE.md

Guía de referencia para Claude Code y el equipo de agentes autónomos.
**Idioma de trabajo: español siempre.**

---

## Escritura humana — skill /humanizalo

Todo texto que generes para SUMITRONIC debe sonar como lo escribió una persona real, no una IA. Eso aplica a descripciones de producto, copy del sitio, emails, posts para redes, respuestas al cliente, entradas de blog, y cualquier documentación dirigida al usuario final.

**Cuándo usar `/humanizalo`:** después de redactar cualquier texto de cara al público. También úsalo si notas que un borrador tuyo suena corporativo, genérico o lleno de frases de plantilla.

**Cuándo NO hace falta:** comentarios de código, mensajes de commit, documentación técnica interna (como este archivo). Eso puede quedar técnico.

### Patrones que debes evitar aunque no uses el skill

Estos son los errores más frecuentes en textos de ecommerce generados por IA — evítalos desde el primer borrador:

- Palabras de relleno IA: `crucial`, `innovador`, `robusto`, `solución integral`, `de alta gama`, `líder del mercado`, `potenciado por`
- Frases vacías: "con el compromiso de", "brindando la mejor experiencia", "a la vanguardia de la tecnología"
- Cierres de chatbot: "¡Esperamos que esto te ayude!", "No dudes en contactarnos", "¡Estamos aquí para ti!"
- Rayas em (—) en cualquier contexto
- Listas de tres elementos forzadas cuando dos bastan
- Adjetivos apilados sin respaldo concreto: "avanzado sistema de videovigilancia de última generación"

### Cómo escribir fichas de producto en SUMITRONIC

Las descripciones de producto deben responder preguntas reales del comprador colombiano, no sonar a catálogo de fábrica. Ejemplos:

**Mal:**

> La cámara Hikvision DS-2CD2143G2-I es una solución integral de videovigilancia con tecnología AcuSense de última generación que brinda una experiencia de seguridad inigualable para su hogar o empresa.

**Bien:**

> Detecta personas y vehículos, no mascotas ni ramas. Eso reduce las falsas alarmas a casi nada. La DS-2CD2143G2-I tiene visión nocturna a 60 metros y funciona con cualquier NVR Hikvision desde 2018. Si ya tienes cableado Cat5e, no necesitas cambiar nada.

### Flujo recomendado para contenido

```
1. Redacta el borrador en español
2. /humanizalo → pasa el texto por el skill
3. Revisa que el resultado suene colombiano y natural, no traducido del inglés
4. Si el texto tiene terminología técnica (nombres de productos, especificaciones), verificar que no se hayan alterado
```

---

## Visión del proyecto

**SUMITRONIC** es un ecommerce B2C/B2B especializado en productos de seguridad electrónica para el mercado colombiano.
Marcas: Hikvision, Dahua, Hanwha, Bosch, Paradox. Precios en COP (pesos colombianos).

---

## Stack técnico actual

| Capa          | Tecnología                                              |
| ------------- | ------------------------------------------------------- |
| Framework     | Next.js 14 App Router + TypeScript                      |
| Estilos       | Tailwind CSS + shadcn/ui + Radix UI                     |
| Base de datos | PostgreSQL en Docker local — cliente Supabase JS        |
| Auth          | Supabase Auth helpers (sesiones via middleware)         |
| Storage       | Supabase Storage (no activo en Docker local)            |
| Rate limiting | Upstash Redis (opcional, degrada sin errores si no hay) |
| Testing       | Vitest + jsdom + @testing-library/react                 |
| Deploy        | Vercel                                                  |
| Path alias    | `@/` → raíz del proyecto                                |

> **Nota DB:** El cliente Supabase JS apunta al Docker local (`localhost:54329`). Supabase Auth y Storage en la nube **no están activos** en este entorno. En producción apunta a Supabase cloud.

---

## Estructura de rutas (app/)

```
app/
├── layout.tsx                    → Layout raíz + 4 Context Providers
├── page.tsx                      → Home (hero, ofertas, marcas, etc.)
├── error.tsx                     → Página de error global
├── not-found.tsx                 → Página 404 global
├── icon.tsx                      → Favicon dinámico
├── robots.ts                     → SEO robots
├── sitemap.ts                    → Sitemap XML
│
├── admin/                        → Panel administrador (rol admin)
│   ├── page.tsx
│   ├── AdminPanel.tsx
│   ├── components/
│   │   ├── DashboardTab.tsx      → Analytics y métricas
│   │   ├── InventoryTab.tsx      → Gestión de inventario
│   │   ├── ProductFormTab.tsx    → CRUD de productos
│   │   └── SalesTab.tsx          → Ventas y reportes
│   ├── hooks/
│   │   ├── useAdminProducts.ts
│   │   └── useProductForm.ts
│   └── types.ts
│
├── api/                          → Serverless API Routes
│   ├── brands/route.ts           → GET marcas
│   ├── cart/route.ts             → GET / POST / DELETE carrito
│   ├── categories/route.ts       → GET categorías
│   ├── categories/[id]/route.ts  → GET categoría por ID
│   ├── favorites/route.ts        → GET / POST / DELETE favoritos
│   ├── notify-order/route.ts     → POST notificación de orden (email/WhatsApp)
│   ├── orders/route.ts           → GET / POST órdenes
│   ├── orders/[id]/route.ts      → GET / PATCH orden por ID
│   ├── products/route.ts         → GET productos (con filtros)
│   ├── products/[id]/route.ts    → GET producto por ID
│   ├── sync-products/route.ts    → POST sincronización catálogo desde Google Sheets
│   └── setup-favorites/route.ts
│
├── auth/
│   ├── callback/route.ts         → Callback OAuth de Supabase
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── products/
│   ├── page.tsx                  → Catálogo (wrapper de ProductsSection — no duplicar lógica aquí)
│   └── [id]/
│       ├── page.tsx
│       └── ProductClient.tsx     → Detalle de producto (client component)
│
├── cart/
│   ├── page.tsx
│   └── CartPageContent.tsx
│
├── checkout/
│   ├── page.tsx
│   ├── CheckoutPageContent.tsx
│   └── success/
│       ├── page.tsx
│       └── SuccessPageContent.tsx
│
├── categorias/[slug]/page.tsx
├── marcas/
│   ├── page.tsx                  → Índice de marcas
│   └── [slug]/page.tsx           → Página de marca individual
├── contacto/
│   ├── page.tsx
│   └── ContactoClient.tsx
├── nosotros/page.tsx
├── ofertas/page.tsx
├── blog/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── help/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── favorites/page.tsx
├── orders/page.tsx
└── profile/
    ├── layout.tsx
    ├── page.tsx
    ├── orders/page.tsx
    ├── password/page.tsx
    └── settings/page.tsx
```

---

## Componentes (components/)

```
components/
├── ui/                        → shadcn/ui base. NO editar directamente.
│   ├── ErrorBoundary.tsx      → Error boundary global (excepción: sí es editable)
│   ├── MobileToast.tsx        → Toast optimizado para mobile (excepción: sí es editable)
│   └── PaginationComponent.tsx → Paginación reutilizable (excepción: sí es editable)
├── admin/
│   └── SyncProductsButton.tsx → Botón de sincronización de productos desde Google Sheets
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ForgotPasswordForm.tsx
│   └── ProtectedRoute.tsx
├── cart/
│   ├── CartSidebar.tsx
│   └── FavoritesSidebar.tsx
├── products/
│   ├── ProductCard.tsx
│   ├── ProductDetailsModal.tsx
│   └── ProductsSection.tsx
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BottomNav.tsx
│   ├── DynamicBreadcrumbs.tsx
│   └── header/
│       ├── Brand.tsx
│       ├── HeaderActions.tsx
│       ├── SearchBar.tsx
│       ├── MobileDrawer.tsx
│       ├── headerData.ts      → Datos de navegación
│       └── types.ts
├── payments/
│   ├── DigitalWalletPayment.tsx
│   ├── PaymentMethodSelector.tsx
│   └── index.ts
├── sections/                  → Secciones de la home
│   ├── HeroSection.tsx
│   ├── OffersSection.tsx
│   ├── BrandsSection.tsx
│   ├── FeaturesSection.tsx
│   ├── CTASection.tsx
│   ├── FAQSection.tsx
│   ├── BlogSection.tsx
│   └── TestimonialsSection.tsx
├── features/
│   └── WhatsAppFAB.tsx        → Botón flotante WhatsApp
└── theme-provider.tsx         → Proveedor de tema (dark/light)
```

> **Regla `components/ui/`:** No editar los archivos shadcn/ui generados. Los tres archivos marcados como "excepción" (`ErrorBoundary`, `MobileToast`, `PaginationComponent`) son componentes propios que viven en esa carpeta por conveniencia — sí se pueden editar.

---

## Contextos y estado global (contexts/)

```
contexts/
├── AuthContext.tsx             → Sesión del usuario, login/logout
├── CartContext.tsx             → Carrito (guest: localStorage / auth: DB)
├── FavoritesContext.tsx        → Favoritos
└── SharedDataContext.tsx       → Datos compartidos entre componentes
```

Los 4 providers envuelven la app en `app/layout.tsx`.
`CartContext` fusiona el carrito local con el de la DB al hacer login.

---

## Librerías utilitarias (lib/)

```
lib/
├── supabase/
│   ├── client.ts              → Cliente browser
│   ├── server.ts              → Cliente RSC/SSR
│   ├── admin.ts               → Cliente con service role key (bypassa RLS — solo server-side)
│   ├── middleware.ts          → Helpers de auth en middleware
│   └── utils.ts
├── payments/
│   ├── constants.ts
│   ├── types.ts
│   ├── validation.ts
│   ├── index.ts
│   └── __tests__/
├── types/
│   ├── database.ts            → Tipos TypeScript del schema real (contrato oficial)
│   └── products.ts            → Tipos de productos para el frontend
├── brand.ts                   → Datos de la empresa (nombre, contacto, redes) — usar en lugar de strings hardcodeados
├── brands.ts                  → Perfiles SEO de cada marca (BrandProfile[]) — para páginas /marcas/[slug]
├── catalogManager.ts          → Gestión del catálogo de productos
├── content.ts                 → Contenido estático (FAQ, features, etc.)
├── formatting.ts              → Formateo de precios, fechas
├── productImages.ts           → Helpers para URLs y gestión de imágenes de producto
├── ratelimit.ts               → Rate limiting con Upstash Redis
├── salesContent.ts            → Contenido para páginas de ventas y ofertas
├── storefront.ts              → Lógica de productos y categorías
├── sync-products.ts           → Lógica de sincronización desde Google Sheets
├── utils.ts                   → Utilidades generales
├── index.ts                   → Barrel export de lib/
├── mock-data.ts               → Datos mock de desarrollo
└── products.json              → Catálogo JSON de respaldo
```

> **`lib/brand.ts` vs `lib/brands.ts`:** `brand.ts` tiene los datos de la empresa SUMITRONIC (teléfono, redes, nombre). `brands.ts` tiene los perfiles de las marcas que vende (Hikvision, Dahua, etc.).

---

## Base de datos (PostgreSQL / Supabase)

**Docker local:** contenedor `capishop-postgres` | Puerto `54329` | DB `postgres` | Usuario `capishop_admin`
Estos nombres técnicos siguen vigentes como legado de compatibilidad.

### Tablas principales

| Tabla              | Descripción                                                |
| ------------------ | ---------------------------------------------------------- |
| `users`            | Perfiles de usuario (id, email, name, role, address)       |
| `products`         | Productos (precio, stock, imágenes, SEO, variantes)        |
| `categories`       | Categorías con slug                                        |
| `product_images`   | Imágenes adicionales por producto                          |
| `product_variants` | Variantes de producto (talla, color, etc.)                 |
| `inventory`        | Stock disponible y reservado por producto                  |
| `carts`            | Carritos (user_id o session_id para guests)                |
| `cart_items`       | Ítems del carrito                                          |
| `orders`           | Órdenes — `items` es columna **JSONB** (no tabla separada) |
| `favorites`        | Favoritos por usuario                                      |
| `system_settings`  | Configuración del sistema (key/value JSONB)                |

### Esquema y migraciones

```
supabase/
├── schema.sql                 → Schema completo
├── config.toml
├── migrations/                → Migraciones históricas
└── db_cluster-04-09-2025@04-34-20.backup.gz
```

---

## Autenticación y middleware

- `middleware.ts` (raíz) intercepta todas las requests y delega a `lib/supabase/middleware.ts`
- `app/auth/callback/route.ts` maneja el callback OAuth de Supabase
- Rutas protegidas redirigen a `/auth/login`
- Roles: `admin` y `customer` (campo en tabla `users`)
- `lib/supabase/admin.ts` — cliente con `SUPABASE_SERVICE_ROLE_KEY`, bypassa RLS. **Solo usar en API routes server-side.**
- Supabase Auth **no está activo** en Docker local

---

## Hooks globales (hooks/)

```
hooks/
├── useAuth.ts
├── use-mobile.tsx
├── useProtectedRoute.ts
└── use-toast.ts
```

---

## Tests (tests/unit/)

```
tests/
├── setup.ts
├── reports/                   → Reportes de cobertura y fallos
└── unit/
    ├── components/ProductCard.test.tsx
    ├── contexts/CartContext.test.tsx
    └── lib/
        ├── content.test.ts
        ├── formatting.test.ts
        ├── payments/validation.test.ts
        └── utils.test.ts
```

Cobertura mínima: 80%. No mockear la DB en tests de integración.

---

## Scripts (scripts/)

```
scripts/
├── restore-local-postgres.ps1       → Restaurar backup en Docker
├── validate-db.ts                   → Validar conexión a DB
├── quick-database-fix.ts            → Fixes rápidos de DB
├── migrate-products.ts              → Migrar productos JSON a DB
├── setup-favorites.js               → Setup de tabla favoritos
├── generate-icons.mjs               → Regenerar favicon e iconos
├── test-google-sheets.ts            → Probar integración Google Sheets
├── test-payments.ts                 → Probar lógica de pagos
├── sync-products.ts                 → Sincronizar catálogo desde Google Sheets
├── validate-supabase.js             → Validar conexión Supabase
├── test-supabase-connection.js      → Test de conexión Supabase
├── simple-db-test.js                → Test de DB simplificado
├── quick-check.js                   → Check rápido de estado
├── deploy.bat                       → Script de deploy Windows
└── apply_performance_optimizations.sh → Optimizaciones de rendimiento
```

---

## Comandos

```bash
# Desarrollo
npm run dev              # Dev server en puerto 3003
npm run build            # Build de producción
npm run lint             # ESLint

# Testing
npm run test             # Vitest una vez
npm run test:watch       # Modo watch
npm run test:coverage    # Reporte de cobertura (umbral 80%)
npm run test:ui          # Vitest con interfaz visual
npx vitest tests/unit/lib/formatting.test.ts   # Un solo archivo
npx vitest --grep "formatPrice"                # Por patrón

# Base de datos
npm run db:restore:local      # Restaurar backup en Docker
npm run test:database         # Health-check de conexión (alias: db:validate)
npm run fix:database          # Fixes rápidos (alias: db:fix)
npm run db:quick-check        # Check rápido de estado
npm run db:test:connection    # Test de conexión Supabase
npm run db:migrate:products   # Migrar catálogo JSON a DB

# Integraciones
npm run test:google-sheets    # Probar conexión a Google Sheets

# Iconos y favicon
node scripts/generate-icons.mjs   # Regenerar desde public/logos/logo_sumitronic_3.png

# Docker DB — conectar directo
docker exec -it capishop-postgres psql -U capishop_admin -d postgres
```

---

## Variables de entorno

**Requeridas** (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=       # Docker local: http://localhost:54329 | Prod: https://*.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Requerida por el cliente JS
SUPABASE_SERVICE_ROLE_KEY=      # Para lib/supabase/admin.ts — NUNCA exponer al browser
```

**Opcionales:**

```
NEXT_PUBLIC_SITE_URL=           # URL pública del sitio (para emails, OG tags)
UPSTASH_REDIS_REST_URL=         # Rate limiting — degrada sin error si no está
UPSTASH_REDIS_REST_TOKEN=
GOOGLE_SERVICE_ACCOUNT_EMAIL=   # Para sincronización desde Google Sheets
```

Ver `.env.example` para la plantilla completa con variables legacy de Docker.

---

## Convenciones del proyecto

- **Idioma:** español en todo — comentarios, commits, respuestas, UI
- **Precios:** siempre en COP → `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })`
- **Componentes:** PascalCase | **Hooks:** camelCase con prefijo `use`
- **API routes:** siempre con `try/catch` y verificación de auth
- **Validación:** Zod en API routes y formularios
- **Imágenes:** siempre `<Image>` de `next/image`, nunca `<img>` nativa
- **shadcn/ui:** no editar `components/ui/` (excepción: `ErrorBoundary`, `MobileToast`, `PaginationComponent`)
- **Tests:** no mockear la DB en tests de integración
- **Tipos:** usar `lib/types/database.ts` como contrato oficial — no agregar campos que no existan en la DB

### Convenciones de UI (actualizadas 2026-04)

- **Tarjetas de producto:** `rounded-2xl`, `aspect-square` en imagen, `object-cover`, sombra `shadow-sm hover:shadow-md`
- **Botones primarios:** `rounded-xl`, color `bg-[hsl(var(--brand))]`, hover `bg-[hsl(var(--brand-strong))]`
- **Tokens CSS válidos:** `--brand`, `--brand-strong`, `--surface-highlight`, `--foreground`, `--text-muted`, `--border-subtle`, `--border-strong`, `--success`. NO usar tokens que no existen como `--surface-0`
- **No duplicar lógica:** `/products/page.tsx` reutiliza `ProductsSection` — no crear fetch propio en la página
- **Marca empresa:** importar de `lib/brand.ts` | **Perfiles de marcas:** importar de `lib/brands.ts`

---

## Equipo de agentes autónomos

Los agentes están definidos en `.claude/agents/`. Úsalos antes de trabajar en cada área.

| Agente                   | Responsabilidad                                                   | Cuándo invocarlo                                            |
| ------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------- |
| `@project-lead`          | Coordinación general, sprint planning, diagnóstico completo       | "estado del proyecto", "qué sigue", "planifica el sprint"   |
| `@db-architect`          | Schema SQL, API routes, queries, migraciones, Supabase            | "problema con DB", "diseña tabla", "API route falla"        |
| `@portal-guardian`       | Rutas Next.js, 404s, navegación, middleware, layouts              | "ruta no existe", "error 404", "revisa la navegación"       |
| `@security-auditor`      | OWASP Top 10, headers, XSS/CSRF/SQLi, Ley 1581 Colombia           | "audita seguridad", "vulnerabilidades", "datos expuestos"   |
| `@auth-specialist`       | Supabase Auth, sesiones, roles, rutas protegidas                  | "problema de login", "proteger ruta", "sesión expira"       |
| `@design-reviewer`       | UI/UX, responsive, breakpoints, Tailwind, componentes             | "revisa el diseño", "cómo se ve en móvil", "layout roto"    |
| `@content-strategist`    | SEO, metadata, blog, keywords, descripciones de producto          | "optimiza SEO", "crea contenido", "estrategia de marketing" |
| `@code-refactor`         | Refactorizar archivos, eliminar duplicación, aplicar convenciones | "refactoriza", "limpia el código", "hay duplicación"        |
| `@test-engineer`         | Vitest, cobertura ≥80%, tests unitarios e integración             | "escribe el test", "cobertura baja", "test falla"           |
| `@performance-engineer`  | Core Web Vitals, bundle, Server/Client Components, Lighthouse     | "carga lento", "lighthouse score", "bundle grande"          |
| `@devops-specialist`     | Vercel, Docker DB, variables de entorno, build, CI/CD             | "deploy falla", "error en vercel", "docker no arranca"      |
| `@payments-integrator`   | MercadoPago, checkout, webhooks HMAC, estados de orden            | "pago falla", "checkout error", "webhook de pago"           |
| `@accessibility-auditor` | WCAG 2.1 AA, a11y, Ley 1618 Colombia, ARIA, contraste             | "accesibilidad", "a11y", "lector de pantalla", "contraste"  |

### Flujo recomendado para los agentes

1. **Leer CLAUDE.md** antes de cualquier tarea
2. **Localizar los archivos relevantes** usando la estructura de directorios de arriba
3. **Usar `@project-lead`** si no sabes a qué agente acudir o necesitas coordinación
4. **No editar `components/ui/`** bajo ninguna circunstancia (salvo las excepciones documentadas)
5. **No mockear la DB** en tests de integración
6. **Verificar con `npm run build`** antes de dar una tarea por completada

---

## Skills de marketing (coreyhaines31/marketingskills)

Instalados en `.agents/skills/`. Se invocan con `/nombre-del-skill` en el chat.
**Contexto obligatorio:** Antes de usar cualquier skill de marketing, ejecuta `/product-marketing-context` para que Claude tenga el contexto completo de SUMITRONIC (producto, audiencia, diferenciadores, competidores). Solo es necesario hacerlo una vez por sesión.

### Flujo de trabajo recomendado

```
1. /product-marketing-context   → carga el contexto base (siempre primero)
2. /[skill-de-marketing]        → ejecuta la tarea específica
```

### Tabla de skills por fase del proyecto

#### Fase 1 — Lanzamiento (hacer primero al cargar productos)

| Skill                      | Cuándo usarlo                                                              | Ejemplo de prompt                                                                                           |
| -------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/launch-strategy`         | Planificar la entrada al mercado colombiano contra competidores nacionales | "crea estrategia de lanzamiento para SUMITRONIC atacando instaladores y empresas de vigilancia en Colombia" |
| `/page-cro`                | Optimizar páginas de producto, categoría, home y checkout para convertir   | "optimiza la página de producto de cámaras Hikvision para aumentar el add-to-cart"                          |
| `/competitor-alternatives` | Crear páginas que capturen tráfico de quienes buscan la competencia        | "crea página alternativa a [competidor] orientada a cámaras de seguridad en Colombia"                       |
| `/copywriting`             | Escribir copy de producto, hero, banners y CTAs                            | "escribe el hero de la home y 5 descripciones de producto para cámaras Dahua"                               |
| `/programmatic-seo`        | Generar páginas SEO a escala: por marca, categoría, ciudad, uso            | "diseña plantilla programmatic-seo para /camaras-[ciudad]-colombia"                                         |

#### Fase 2 — Medición y retención (al tener primeras ventas)

| Skill                   | Cuándo usarlo                                                                | Ejemplo de prompt                                                                        |
| ----------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `/analytics-tracking`   | Configurar eventos de conversión, funnel y revenue en GA4 / GTM              | "define todos los eventos de ecommerce que debo trackear en SUMITRONIC"                  |
| `/email-sequence`       | Crear flujos de carrito abandonado, postventa y reactivación                 | "crea secuencia de 4 emails para carrito abandonado en ecommerce de seguridad"           |
| `/marketing-psychology` | Aplicar principios de urgencia, escasez y prueba social en fichas y checkout | "identifica qué triggers psicológicos aplicar en la página de producto y en el checkout" |
| `/popup-cro`            | Pop-ups de captura de email, urgencia y exit-intent                          | "diseña popup de exit-intent para visitantes que no compraron"                           |

#### Fase 3 — Escala (al tener tracción)

| Skill                | Cuándo usarlo                                                         | Ejemplo de prompt                                                                  |
| -------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/paid-ads`          | Campañas Google Shopping, Search y Meta para Colombia                 | "crea estructura de campaña Google Shopping para categorías de SUMITRONIC"         |
| `/social-content`    | Contenido para Instagram, Facebook y TikTok                           | "crea calendario de contenido mensual para Instagram de SUMITRONIC"                |
| `/pricing-strategy`  | Estrategia de precios por segmento (hogar, empresas, instaladores)    | "analiza la estrategia de precios para competir en cámaras Hikvision en Colombia"  |
| `/content-strategy`  | Blog técnico sobre seguridad electrónica para tráfico orgánico        | "crea estrategia de blog para SUMITRONIC con keywords de instaladores en Colombia" |
| `/ai-seo`            | Optimizar para aparecer en respuestas de ChatGPT, Gemini y Perplexity | "optimiza el contenido de SUMITRONIC para AI search sobre seguridad electrónica"   |
| `/customer-research` | Sintetizar feedback de clientes y definir buyer personas              | "crea buyer personas para SUMITRONIC: instalador, empresa de vigilancia, hogar"    |

#### Skills de soporte (usar cuando aplique)

| Skill                | Cuándo usarlo                                                      |
| -------------------- | ------------------------------------------------------------------ |
| `/copy-editing`      | Revisar y mejorar copy ya escrito                                  |
| `/site-architecture` | Revisar estructura de URLs y navegación para SEO                   |
| `/form-cro`          | Optimizar formularios de contacto y cotización B2B                 |
| `/marketing-ideas`   | Generar ideas de marketing cuando haya bloqueo creativo            |
| `/cold-email`        | Outreach B2B hacia empresas de vigilancia e instaladores           |
| `/sales-enablement`  | Crear materiales para el canal B2B (fichas técnicas, comparativas) |
| `/lead-magnets`      | Crear guías o herramientas para capturar emails                    |

### Reglas de uso

- **Idioma:** pide siempre los outputs en español y adaptados al mercado colombiano
- **Precios:** recordar al skill que los precios son en COP y el mercado es Colombia
- **Competidores de referencia:** MercadoLibre, Linio, distribuidores locales de Hikvision/Dahua
- **No solapar con agentes existentes:** `/seo-audit` y `/seo-technical` ya están instalados como skills de desarrollo — para estrategia de contenido usar `/content-strategy` y `/programmatic-seo`
- **`/product-marketing-context`** debe actualizarse cada vez que cambien el catálogo, los precios o la propuesta de valor del negocio

---

## Archivos de configuración raíz

```
next.config.mjs        → Configuración Next.js (security headers, image domains, experimental turbo)
middleware.ts          → Auth middleware (intercepta todas las requests)
tailwind.config.js     → Tailwind CSS
tsconfig.json          → TypeScript (strict: false, noEmit: true)
components.json        → shadcn/ui config
vercel.json            → Deploy config
.env.local             → Variables de entorno (no en git)
.env.example           → Plantilla de variables (incluye vars legacy Docker)
```
