# CapiShop - Tienda de Tecnología

E-commerce moderno y robusto desarrollado para **Capishoping**, enfocado en la venta de tecnología y servicios técnicos. Construido con las últimas tecnologías web para garantizar rendimiento, escalabilidad y una experiencia de usuario premium.

---

## 🛠️ Tech Stack (Tecnologías)

Este proyecto utiliza una arquitectura moderna basada en **Next.js 14 (App Router)** y **Supabase**.

### Core
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Autenticación:** Supabase Auth

### Frontend & UI
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/) (basado en Radix UI)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Animaciones:** Tailwindcss-animate
- **Gestión de Estado:** React Context API + Hooks personalizados
- **Formularios:** React Hook Form + Zod (validación)

### Herramientas & DevOps
- **Despliegue:** [Vercel](https://vercel.com/)
- **Linting:** ESLint
- **Gestor de Paquetes:** npm / pnpm
- **Integración AI:** Soporte para MCP (Model Context Protocol)

---

## 📁 Estructura del Proyecto

A continuación se detalla la organización de carpetas y archivos principales:

```
CapiShop_Web/
├── app/                        # Next.js App Router (Páginas y Rutas)
│   ├── admin/                  # Panel de administración (protegido)
│   ├── api/                    # API Routes (Backend serverless)
│   ├── auth/                   # Páginas de autenticación (Login, Register)
│   ├── cart/                   # Página del carrito de compras
│   ├── checkout/               # Proceso de pago
│   ├── products/               # Catálogo y detalles de productos
│   ├── profile/                # Perfil de usuario y pedidos
│   ├── layout.tsx              # Layout principal (Header, Footer)
│   └── page.tsx                # Página de inicio (Home)
│
├── components/                 # Componentes Reutilizables
│   ├── ui/                     # Componentes base de shadcn/ui (Button, Input, etc.)
│   └── ...                     # Componentes específicos (ProductCard, CartDrawer, etc.)
│
├── contexts/                   # React Context Providers
│   ├── auth-context.tsx        # Estado de autenticación global
│   ├── cart-context.tsx        # Lógica del carrito de compras
│   └── ...
│
├── docs/                       # Documentación del proyecto
│   ├── SECURITY_AUDIT.md       # Auditoría de seguridad
│   ├── SUPABASE_INTEGRATION.md # Guía de integración con base de datos
│   └── ...
│
├── hooks/                      # Custom React Hooks
│   ├── use-toast.ts            # Sistema de notificaciones
│   └── ...
│
├── lib/                        # Utilidades y Configuración
│   ├── supabase.ts             # Cliente de Supabase
│   ├── utils.ts                # Funciones auxiliares (cn, formatPrice)
│   └── ...
│
├── mcp/                        # Configuración Model Context Protocol
│   ├── supabase-config.json    # Configuración para agentes AI (Supabase)
│   └── README.md               # Instrucciones de MCP
│
├── public/                     # Archivos estáticos (imágenes, iconos)
│
├── scripts/                    # Scripts de mantenimiento y testing
│   ├── test-supabase-connection.js # Verificación de conexión DB
│   └── ...
│
├── supabase/                   # SQL y Migraciones
│   ├── schema.sql              # Esquema base de la base de datos
│   ├── add_compare_price.sql   # Migraciones de ofertas
│   └── ...
│
└── .env.local                  # Variables de entorno (No commitear)
```

---

## 🚀 Instalación y Configuración

### 1. Prerrequisitos
- Node.js 18+ instalado.
- Cuenta en Supabase.

### 2. Clonar el repositorio
```bash
git clone https://github.com/basabecode/CapiShop_Web.git
cd CapiShop_Web
npm install
# o
pnpm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto y agrega tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-publica
```

### 4. Configurar Base de Datos
1. Ve a tu proyecto en Supabase > **SQL Editor**.
2. Ejecuta el contenido de `supabase/schema.sql` para crear las tablas.
3. (Opcional) Ejecuta `supabase/add_compare_price.sql` para habilitar ofertas.

### 5. Ejecutar en Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3003`.

---

## 🤖 Integración MCP (Model Context Protocol)

Este proyecto está configurado para trabajar con agentes de IA avanzados mediante MCP.
- Las configuraciones se encuentran en la carpeta `/mcp`.
- Permite a los agentes leer y escribir en la base de datos de Supabase de forma segura para tareas de mantenimiento y desarrollo.

---

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run lint`: Ejecuta el linter para verificar calidad de código.
- `node scripts/test-supabase-connection.js`: Prueba la conexión con la base de datos.

---

## 👤 Administración

Para convertir un usuario en administrador:
1. Regístrate en la aplicación.
2. Ejecuta el siguiente SQL en Supabase:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado por [BasabeCode](https://github.com/basabecode)**
