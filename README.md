# CapiShop - Tienda de Tecnología

E-commerce moderno para Capishoping, desarrollado con Next.js 14, Supabase y TypeScript.

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

## � Características

- ✅ Catálogo de productos con búsqueda y filtros
- ✅ Sistema de autenticación (registro/login)
- ✅ Panel administrativo para gestión de productos y pedidos
- ✅ Base de datos PostgreSQL con Supabase
- ✅ Diseño responsive con Tailwind CSS

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Despliegue**: Vercel

---

## 📦 Instalación y Configuración

1. Clonar el repositorio

```bash
git clone <url>
cd CapiShop_Web
pnpm install
```

2. Configurar variables de entorno

- Copiar `.env.local.example` a `.env.local`
- Completar con tus credenciales de Supabase

3. Configurar base de datos

- Crear proyecto en Supabase
- Ejecutar `supabase/schema.sql` en el SQL Editor

4. Ejecutar en desarrollo

```bash
pnpm dev
```

## 📁 Estructura del Proyecto

```
CapiShop_Web/
...existing code...
```

---

## 🧹 OPTIMIZACIÓN COMPLETADA

**Archivo:** OPTIMIZACION_COMPLETADA.md

### Limpieza Realizada

- Archivos duplicados eliminados: ProtectedRoute.tsx, use-mobile.tsx, use-toast.ts, globals.css, supabase.ts, middleware.ts.bak, middleware-stable.ts, package-lock.json

### Estructura Optimizada

Componentes únicos, hooks centralizados, configuración Supabase organizada.

### Beneficios

1. Eliminación de conflictos de importación
2. Reducción de tamaño (~30% más liviano)
3. Mejor performance
4. Mantenibilidad
5. Imports limpios y consistentes

---

## 📋 AUDITORÍA DE PRODUCTOS

**Archivo:** AUDITORIA_PRODUCTOS_COMPLETADA.md

### Diagnóstico Inicial

Identificación y eliminación de archivos duplicados y vacíos relacionados con productos.

### Correcciones Realizadas

1. Eliminación de duplicados: ProductsSectionNew.tsx, ProductCardEnhanced.tsx, ProductDetailPage.tsx
2. Corrección del formulario admin de productos (estructura y campos)

---

## 🧪 SISTEMA DE TESTING DE BASE DE DATOS

**Archivo:** docs/DATABASE_TESTING.md

### Descripción General

Sistema completo de validación y testing de la integración entre Supabase y el frontend de CapiShop.

### Archivos del Sistema

- Scripts: database-health-check.ts, migrate-json-to-supabase.ts, migrate-products.ts
- Librerías: database-tester.ts
- Interfaces Web: app/test/database/page.tsx

### Objetivos

- Validar operabilidad entre base de datos, frontend, APIs, tipos TypeScript y performance.
- Métodos de ejecución, interpretación de resultados y solución de problemas documentados.

---

## 🛡️ GOOGLE OAUTH SETUP

**Archivo:** docs/GOOGLE_OAUTH_SETUP.md
Actualmente vacío.

---

## � HISTORIAL DE CORRECCIONES

**Archivo:** README.md

### Schema SQL (v1.1)

- Corregido: Header.tsx - Tipos de autenticación restaurados correctamente
- Impacto: Build exitoso sin errores de compilación TypeScript

### Schema SQL (v1.1)

- Corregido: Error "functions in index expression must be marked IMMUTABLE"
- Solución: Uso explícito de `regconfig` en índices GIN y casting en funciones de fecha
- Impacto: Permite ejecución correcta del schema en Supabase sin errores de inmutabilidad

---

## � RESUMEN FINAL

Este README integra toda la documentación relevante del proyecto, incluyendo optimizaciones, auditorías, testing y correcciones históricas. Para detalles específicos, consulta los archivos originales mencionados.

```bash
cp .env.local.example .env.local
```

Editar `.env.local` con las credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

4. **Configurar base de datos**

- Ir a [Supabase Dashboard](https://supabase.com/dashboard)
- Crear nuevo proyecto
- Ejecutar el script `supabase/schema.sql` en el SQL Editor

5. **Ejecutar en desarrollo**

```bash
pnpm dev
```

## 🗄️ Base de Datos

La base de datos incluye:

- **users**: Perfiles de usuario con roles
- **products**: Catálogo de productos
- **orders**: Pedidos y transacciones
- **categories**: Categorías de productos
- **cart_items**: Carrito de compras

Para configurar la base de datos, ejecutar `supabase/schema.sql` en Supabase.

### ⚠️ Notas Importantes del Schema

- **Índices de texto completo**: Los índices GIN para búsqueda de texto usan `regconfig` explícito para evitar errores de inmutabilidad
- **Funciones de fecha**: Las funciones `date_trunc` en índices requieren casting explícito para estabilidad
- **RLS habilitado**: Todas las tablas tienen Row Level Security para seguridad

### 🔧 Solución de Problemas Comunes

**Error "functions in index expression must be marked IMMUTABLE":**

- Los índices GIN y funciones en expresiones de índice requieren configuración específica
- El schema corregido incluye las correcciones necesarias

**Error de permisos RLS:**

- Verificar que el usuario tenga rol 'admin' para acceso administrativo
- Comprobar que las políticas RLS estén correctamente configuradas

**Errores de TypeScript en componentes:**

- ✅ Corregido: Header.tsx - Tipos de usuario y perfil
- ✅ Corregido: ProductDetailsModal.tsx - Incompatibilidad de tipos de ID y propiedades del carrito
- Comprobar que las políticas RLS estén correctamente configuradas

## 👤 Usuario Administrador

Después de registrarse en la aplicación, ejecutar en Supabase:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'tu-email@admin.com';
```

## 🚀 Despliegue

1. **Conectar con Vercel**

```bash
vercel --prod
```

2. **Configurar variables de entorno en Vercel**

- Agregar las mismas variables de `.env.local`

## 📁 Estructura del Proyecto

```
CapiShop_Web/
├── app/                    # App Router de Next.js
│   ├── components/         # Componentes de la aplicación
│   ├── api/               # API Routes
│   ├── admin/             # Panel administrativo
│   └── auth/              # Páginas de autenticación
├── components/            # Componentes UI (shadcn/ui)
├── contexts/              # Context providers
├── lib/                   # Utilidades y configuración
├── public/                # Archivos estáticos
└── supabase/              # Schema de base de datos
```

## 🔧 Scripts Disponibles

```bash
pnpm dev          # Desarrollo
pnpm build        # Construir para producción
pnpm start        # Ejecutar en producción
pnpm lint         # Verificar código
```

## � Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Equipo

- **TecniBro** - Desarrollo principal
- **Arquitectura**: Next.js 14 + Supabase
- **UI/UX**: Tailwind CSS + shadcn/ui

---

**¡Construido con ❤️ para la tienda Capishoping!**
