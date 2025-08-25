# Configuración Supabase para CapiShop

## Paso 1: Configurar Variables de Entorno

Copia el archivo `.env.local` y configura las siguientes variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# URL base del sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Paso 2: Ejecutar el Schema SQL

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor**
3. Copia y pega el contenido de `database/schema.sql`
4. Ejecuta el script

Esto creará:
- ✅ Todas las tablas necesarias
- ✅ Índices para optimización
- ✅ Políticas RLS (Row Level Security)
- ✅ Triggers automáticos
- ✅ Funciones auxiliares

## Paso 3: Configurar Storage (Opcional)

Para subida de imágenes de productos:

1. Ve a **Storage** en Supabase Dashboard
2. Crea un bucket llamado `product-images`
3. Configura las políticas de acceso:
   - Lectura pública para las imágenes
   - Escritura solo para usuarios autenticados con rol admin

## Paso 4: Crear Usuario Admin

1. Ve a **Authentication** > **Users**
2. Crea un nuevo usuario admin
3. Anota el UUID del usuario
4. Ejecuta en SQL Editor:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'uuid-del-usuario-admin';
```

## Estructura de la Base de Datos

### Tablas Principales

- **profiles**: Perfiles de usuario (extiende auth.users)
- **categories**: Categorías de productos
- **products**: Productos del catálogo
- **product_variants**: Variantes de productos (color, talla, etc.)
- **carts**: Carritos de compra
- **cart_items**: Items en el carrito
- **orders**: Órdenes de compra
- **order_items**: Items de las órdenes
- **coupons**: Cupones de descuento
- **inventory_movements**: Auditoría de inventario

### Funciones Automáticas

- **Numeración de órdenes**: Auto-genera números como CS20240825001
- **Actualización de timestamps**: Auto-actualiza `updated_at`
- **Creación de perfiles**: Auto-crea perfil al registrar usuario

### Seguridad (RLS)

- Los usuarios solo pueden ver/editar sus propios datos
- Los productos son de solo lectura para usuarios normales
- Los admins tienen acceso completo vía service role key

## Próximos Pasos

1. ✅ Configuración base completada
2. 🔄 Implementar autenticación
3. 🔄 API routes para productos
4. 🔄 Sistema de carrito
5. 🔄 Procesamiento de pagos

## Archivos Creados

- `lib/supabase/client.ts` - Cliente para el frontend
- `lib/supabase/server.ts` - Cliente para el backend
- `lib/supabase/middleware.ts` - Middleware de autenticación
- `lib/types/database.ts` - Tipos TypeScript
- `database/schema.sql` - Esquema de base de datos
- `middleware.ts` - Middleware de Next.js
