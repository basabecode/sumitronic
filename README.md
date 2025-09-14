# CapiShop - Tienda de Tecnología

E-commerce moderno desarrollado con Next.js 14, Supabase y TypeScript para Capishoping ## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 🔄 Historial de Correcciones

### Schema SQL (v1.1)

- **Corregido**: Header.tsx - Tipos de autenticación restaurados correctamente
  [// ...existing code...]

- **Impacto**: Build exitoso sin errores de compilación TypeScript

---

### Schema SQL (v1.1)

- **Corregido**: Error "functions in index expression must be marked IMMUTABLE"
- **Solución**: Uso explícito de `regconfig` en índices GIN y casting en funciones de fecha
- **Impacto**: Permite ejecución correcta del schema en Supabase sin errores de inmutabilidadgía.

## 🚀 Características

- ✅ **Catálogo de productos** con búsqueda y filtros
- ✅ **Sistema de autenticación** (registro/login)
- ✅ **Panel administrativo** para gestión de productos y pedidos
- ✅ **Base de datos** PostgreSQL con Supabase
- ✅ **Diseño responsive** con Tailwind CSS

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Despliegue**: Vercel

## 📦 Instalación

1. **Clonar el repositorio**

```

pnpm install
```

3. **Configurar variables de entorno**

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
