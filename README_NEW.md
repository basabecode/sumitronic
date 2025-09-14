# CapiShop - Tienda de Tecnología

E-commerce moderno para Capishoping, desarrollado con Next.js 14, Supabase y TypeScript.

---

## 🚀 Características

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
├── app/                    # App Router de Next.js
│   ├── components/         # Componentes de la aplicación
│   ├── api/                # API Routes
│   ├── admin/              # Panel administrativo
│   └── auth/               # Páginas de autenticación
├── components/             # Componentes UI (shadcn/ui)
├── contexts/               # Context providers
├── hooks/                  # Custom hooks
├── lib/                    # Utilidades y configuración Supabase
├── public/                 # Archivos estáticos
└── supabase/               # Schema de base de datos
```

## ✅ Checklist de funcionalidades

### 1. Autenticación y roles

- [x] Registro y login de usuarios
- [x] Protección de rutas por rol (admin/user)
- [x] Carga de perfil y validación de rol desde Supabase

### 2. Panel administrativo

- [x] Acceso solo para usuarios con rol `admin`
- [x] Gestión de productos (crear, editar, eliminar)
- [x] Visualización de pedidos

### 3. Catálogo y productos

- [x] Listado de productos desde JSON y Supabase
- [x] Búsqueda y filtros
- [x] Detalle de producto y modal

### 4. Carrito y pedidos

- [x] Añadir productos al carrito
- [x] Checkout y registro de pedido
- [x] Visualización de pedidos por usuario

### 5. Optimización y limpieza

- [x] Eliminación de archivos duplicados y obsoletos
- [x] Centralización de hooks y componentes
- [x] Imports limpios y consistentes

### 6. Despliegue

- [x] Configuración en Vercel
- [x] Variables de entorno en producción
- [x] Pruebas de build y producción

### 7. Documentación

- [x] README actualizado y consolidado
- [x] Troubleshooting y preguntas frecuentes
- [x] Guía de actualización y optimización

---

## 👤 Usuario Administrador

Después de registrarse en la aplicación, ejecutar en Supabase:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'tu-email@admin.com';
```

## 🚀 Despliegue

1. Conectar con Vercel
   ```bash
   vercel --prod
   ```
2. Configurar variables de entorno en Vercel
   - Agregar las mismas variables de `.env.local`

## 🔧 Scripts Disponibles

```bash
pnpm dev          # Desarrollo
pnpm build        # Construir para producción
pnpm start        # Ejecutar en producción
pnpm lint         # Verificar código
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Equipo

- **TecniBro** - Desarrollo principal
- **Arquitectura**: Next.js 14 + Supabase
- **UI/UX**: Tailwind CSS + shadcn/ui

---

**¡Construido con ❤️ para la tienda Capishoping!**
