# Guía de Integración con Supabase - CapiShop

## 📋 Resumen

Esta guía te ayudará a conectar tu proyecto CapiShop con Supabase para tener una base de datos funcional con autenticación, productos, y gestión de ofertas.

---

## 🚀 Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Completa los datos:
   - **Name:** CapiShop
   - **Database Password:** (guarda esta contraseña de forma segura)
   - **Region:** Selecciona la más cercana a tu ubicación
5. Haz clic en "Create new project"
6. Espera 2-3 minutos mientras se crea el proyecto

---

## 🔑 Paso 2: Obtener Credenciales

1. En tu proyecto de Supabase, ve a **Settings** (⚙️) > **API**
2. Copia las siguientes credenciales:
   - **Project URL** (ejemplo: `https://abcdefgh.supabase.co`)
   - **anon/public key** (una clave larga que empieza con `eyJ...`)

---

## ⚙️ Paso 3: Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo llamado `.env.local` (si no existe)
2. Agrega las siguientes líneas con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

3. **IMPORTANTE:** Verifica que `.env.local` esté en `.gitignore` (ya debería estarlo)

---

## 🗄️ Paso 4: Crear Tablas en la Base de Datos

1. En Supabase, ve a **SQL Editor** (icono de base de datos)
2. Haz clic en "+ New query"
3. Abre el archivo `supabase/schema.sql` de este proyecto
4. Copia TODO el contenido del archivo
5. Pégalo en el editor SQL de Supabase
6. Haz clic en "Run" (o presiona Ctrl+Enter)
7. Espera a que termine (verás mensajes de éxito)

**Resultado:** Se crearán todas las tablas necesarias:
- ✅ users (perfiles de usuario)
- ✅ categories (categorías de productos)
- ✅ products (catálogo de productos)
- ✅ product_images (imágenes de productos)
- ✅ inventory (control de inventario)
- ✅ orders (pedidos)
- ✅ cart_items (carrito de compras)
- ✅ system_settings (configuraciones)

---

## 🎁 Paso 5: Agregar Soporte para Ofertas

1. En el SQL Editor de Supabase, crea una nueva query
2. Abre el archivo `supabase/add_compare_price.sql`
3. Copia el contenido y pégalo en Supabase
4. Haz clic en "Run"

**Resultado:** Se agregará el campo `compare_price` a la tabla de productos para gestionar ofertas.

---

## ✅ Paso 6: Verificar la Conexión

Ejecuta el script de validación:

```bash
node scripts/test-supabase-connection.js
```

Deberías ver mensajes en verde indicando que la conexión es exitosa.

---

## 👤 Paso 7: Crear Usuario Administrador

### Opción A: Desde la Aplicación

1. Inicia el servidor: `npm run dev`
2. Ve a `http://localhost:3003`
3. Regístrate con tu email
4. Ve a Supabase > **SQL Editor**
5. Ejecuta este comando (reemplaza con tu email):

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'tu-email@ejemplo.com';
```

### Opción B: Desde Supabase Dashboard

1. Ve a **Authentication** > **Users**
2. Haz clic en "Add user"
3. Completa email y contraseña
4. Luego ejecuta el SQL del paso anterior

---

## 🛡️ Paso 8: Configurar Autenticación (Opcional pero Recomendado)

### Configurar Email de Verificación

1. Ve a **Authentication** > **Email Templates**
2. Personaliza las plantillas de email
3. Configura tu proveedor de email (SMTP) en **Settings** > **Auth**

### Configurar Redirect URLs

1. Ve a **Authentication** > **URL Configuration**
2. Agrega estas URLs autorizadas:
   - `http://localhost:3003/**`
   - `https://tu-dominio.com/**` (cuando tengas dominio)

---

## 🧪 Paso 9: Probar la Aplicación

1. Reinicia el servidor:
   ```bash
   npm run dev
   ```

2. Abre `http://localhost:3003`

3. Prueba lo siguiente:
   - ✅ Registro de usuario
   - ✅ Inicio de sesión
   - ✅ Ver productos (debería haber algunos de ejemplo)
   - ✅ Acceder a `/admin` (con usuario admin)
   - ✅ Crear un producto desde el admin
   - ✅ Agregar una oferta (precio original > precio actual)
   - ✅ Ver la sección de ofertas en la página principal

---

## 📊 Paso 10: Agregar Productos de Prueba

### Desde el Panel de Administrador

1. Ve a `http://localhost:3003/admin`
2. Inicia sesión con tu cuenta de administrador
3. Haz clic en "Agregar Producto"
4. Completa el formulario:
   - **Nombre:** Cámara IP IMOU Ranger 2
   - **Descripción:** Cámara de seguridad con visión nocturna
   - **Precio:** 189900
   - **Precio Original (Oferta):** 249900
   - **Categoría:** Cámaras de Seguridad
   - **Marca:** IMOU
   - **Stock:** 15
   - **Imagen:** Sube una imagen
5. Haz clic en "Guardar"

### Desde SQL (Más Rápido)

El script `schema.sql` ya incluye productos de ejemplo. Si no aparecen, verifica que se hayan creado correctamente.

---

## 🔒 Seguridad - Checklist

- [ ] Variables de entorno configuradas en `.env.local`
- [ ] `.env.local` está en `.gitignore`
- [ ] RLS (Row Level Security) habilitado en todas las tablas
- [ ] Usuario administrador creado
- [ ] Políticas de autenticación configuradas
- [ ] Redirect URLs autorizadas
- [ ] Middleware de autenticación activado (ver `middleware.ts`)

---

## 🐛 Solución de Problemas

### Error: "ENOTFOUND" o "Connection refused"

**Causa:** Variables de entorno no configuradas o incorrectas

**Solución:**
1. Verifica que `.env.local` existe
2. Verifica que las credenciales sean correctas
3. Reinicia el servidor: `npm run dev`

### Error: "relation 'products' does not exist"

**Causa:** Tablas no creadas en Supabase

**Solución:**
1. Ejecuta `supabase/schema.sql` en Supabase SQL Editor
2. Verifica que no haya errores en la ejecución

### Error: "compare_price column does not exist"

**Causa:** Migración de ofertas no ejecutada

**Solución:**
1. Ejecuta `supabase/add_compare_price.sql` en Supabase SQL Editor

### No puedo acceder a /admin

**Causa:** Usuario no tiene rol de administrador

**Solución:**
```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'tu-email@ejemplo.com';
```

### Los productos no aparecen en el frontend

**Causa:** Productos marcados como `active = false` o RLS bloqueando acceso

**Solución:**
1. Verifica que los productos tengan `active = true`
2. Verifica las políticas RLS en Supabase > **Authentication** > **Policies**

---

## 📚 Documentación Adicional

- **Auditoría de Seguridad:** `docs/SECURITY_AUDIT.md`
- **Esquema de Base de Datos:** `supabase/schema.sql`
- **Migración de Ofertas:** `supabase/add_compare_price.sql`
- **Documentación de Supabase:** [https://supabase.com/docs](https://supabase.com/docs)

---

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:

1. **Personaliza tu tienda:**
   - Agrega tus propios productos
   - Configura categorías personalizadas
   - Sube imágenes de productos reales

2. **Configura pagos:**
   - Integra pasarela de pagos (Stripe, PayPal, etc.)
   - Configura webhooks para confirmación de pagos

3. **Optimiza para producción:**
   - Configura dominio personalizado
   - Habilita HTTPS
   - Configura CDN para imágenes
   - Implementa caché

4. **Monitoreo:**
   - Revisa logs en Supabase Dashboard
   - Configura alertas para errores
   - Monitorea uso de base de datos

---

## ❓ ¿Necesitas Ayuda?

Si encuentras problemas:

1. Revisa `docs/SECURITY_AUDIT.md` para detalles de configuración
2. Ejecuta `node scripts/test-supabase-connection.js` para diagnóstico
3. Revisa los logs de Supabase en **Logs** > **Postgres Logs**
4. Consulta la documentación oficial de Supabase

---

**¡Listo! Tu tienda CapiShop debería estar completamente funcional con Supabase.** 🎉
