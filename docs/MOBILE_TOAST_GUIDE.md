# 🔔 Sistema de Notificaciones Mobile - CapiShop

## 📱 MobileToast Component

Sistema de notificaciones (toasts) optimizado para dispositivos móviles con diseño premium y UX nativa.

---

## ✨ Características

- ✅ **4 tipos de notificaciones**: Success, Error, Warning, Info
- ✅ **Auto-dismiss** con progress bar animado
- ✅ **Touch-friendly**: Botón de cierre de 44x44px
- ✅ **Safe areas**: Compatible con notch de iOS
- ✅ **Animaciones suaves**: Slide-in y slide-out con GPU acceleration
- ✅ **No intrusivo**: Posicionado en la parte superior
- ✅ **Stacking**: Múltiples toasts se apilan correctamente
- ✅ **Accesibilidad**: ARIA labels y roles

---

## 🚀 Uso Básico

### 1. Importar el Hook

```tsx
import { useToast, ToastContainer } from '@/app/components/MobileToast'
```

### 2. Usar en tu Componente

```tsx
'use client'

import { useToast, ToastContainer } from '@/app/components/MobileToast'

export default function MyComponent() {
  const toast = useToast()

  const handleSuccess = () => {
    toast.success(
      'Producto agregado',
      'El producto se agregó al carrito correctamente'
    )
  }

  const handleError = () => {
    toast.error(
      'Error al procesar',
      'No se pudo completar la operación. Intenta de nuevo.'
    )
  }

  return (
    <>
      {/* Renderizar el contenedor de toasts */}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismissToast} />

      {/* Tus botones */}
      <button onClick={handleSuccess}>
        Agregar al Carrito
      </button>
      <button onClick={handleError}>
        Simular Error
      </button>
    </>
  )
}
```

---

## 📚 API del Hook `useToast()`

### Métodos Disponibles

#### `success(title, message?, duration?)`
Muestra una notificación de éxito (verde).

```tsx
toast.success('¡Éxito!', 'La operación se completó correctamente')
toast.success('Guardado', undefined, 3000) // 3 segundos
```

#### `error(title, message?, duration?)`
Muestra una notificación de error (rojo).

```tsx
toast.error('Error', 'No se pudo conectar al servidor')
```

#### `warning(title, message?, duration?)`
Muestra una notificación de advertencia (naranja).

```tsx
toast.warning('Atención', 'Tu sesión expirará en 5 minutos')
```

#### `info(title, message?, duration?)`
Muestra una notificación informativa (azul).

```tsx
toast.info('Nuevo mensaje', 'Tienes 3 mensajes sin leer')
```

#### `dismissToast(id)`
Cierra manualmente un toast específico.

```tsx
toast.dismissToast('toast-id-123')
```

### Propiedades

- `toasts`: Array de toasts activos
- `dismissToast`: Función para cerrar un toast

---

## 🎨 Tipos de Notificaciones

### Success (Verde)
```tsx
toast.success('Producto agregado', 'iPhone 15 Pro agregado al carrito')
```
**Uso**: Confirmaciones, acciones completadas

### Error (Rojo)
```tsx
toast.error('Error de pago', 'La tarjeta fue rechazada')
```
**Uso**: Errores, fallos, validaciones

### Warning (Naranja)
```tsx
toast.warning('Stock limitado', 'Solo quedan 3 unidades')
```
**Uso**: Advertencias, avisos importantes

### Info (Azul)
```tsx
toast.info('Envío gratis', 'Compras mayores a $100.000')
```
**Uso**: Información general, tips

---

## ⚙️ Configuración Avanzada

### Duración Personalizada

```tsx
// Toast que dura 6 segundos
toast.success('Guardado', 'Cambios guardados correctamente', 6000)

// Toast que dura 2 segundos
toast.info('Cargando...', undefined, 2000)
```

**Duración por defecto**: 4000ms (4 segundos)

### Toast sin Mensaje (Solo Título)

```tsx
toast.success('¡Listo!')
toast.error('Error')
```

---

## 🎯 Ejemplos de Uso Real

### 1. Agregar al Carrito

```tsx
const handleAddToCart = async (product: Product) => {
  try {
    await addToCart(product)
    toast.success(
      'Producto agregado',
      `${product.name} se agregó al carrito`
    )
  } catch (error) {
    toast.error(
      'Error al agregar',
      'No se pudo agregar el producto. Intenta de nuevo.'
    )
  }
}
```

### 2. Login/Registro

```tsx
const handleLogin = async (email: string, password: string) => {
  try {
    await signIn(email, password)
    toast.success('Bienvenido', `Sesión iniciada como ${email}`)
    router.push('/profile')
  } catch (error) {
    toast.error('Error de autenticación', 'Email o contraseña incorrectos')
  }
}
```

### 3. Actualizar Perfil

```tsx
const handleUpdateProfile = async (data: ProfileData) => {
  try {
    await updateProfile(data)
    toast.success('Perfil actualizado', 'Tus cambios se guardaron correctamente')
  } catch (error) {
    toast.error('Error al guardar', 'No se pudieron guardar los cambios')
  }
}
```

### 4. Favoritos

```tsx
const handleToggleFavorite = async (productId: string) => {
  try {
    const isFavorite = await toggleFavorite(productId)

    if (isFavorite) {
      toast.success('Agregado a favoritos', undefined, 2000)
    } else {
      toast.info('Eliminado de favoritos', undefined, 2000)
    }
  } catch (error) {
    toast.error('Error', 'No se pudo actualizar favoritos')
  }
}
```

### 5. Checkout

```tsx
const handleCheckout = async () => {
  if (cartItems.length === 0) {
    toast.warning('Carrito vacío', 'Agrega productos antes de continuar')
    return
  }

  if (!user) {
    toast.info('Inicia sesión', 'Debes iniciar sesión para continuar')
    router.push('/auth/login')
    return
  }

  try {
    await processCheckout()
    toast.success('¡Pedido confirmado!', 'Recibirás un email de confirmación')
    router.push('/orders')
  } catch (error) {
    toast.error('Error en el pago', 'No se pudo procesar tu pedido')
  }
}
```

---

## 🎨 Personalización

### Colores por Tipo

Los colores están definidos en el componente y siguen el sistema de diseño de CapiShop:

```tsx
const colorMap = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    progress: 'bg-green-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    progress: 'bg-red-600',
  },
  // ... más colores
}
```

### Modificar Duración Global

Para cambiar la duración por defecto, edita el componente:

```tsx
const duration = toast.duration || 5000 // Cambiar de 4000 a 5000
```

---

## 📱 Optimizaciones Mobile

### Safe Areas
El contenedor usa `.safe-top` para respetar el notch de iOS:

```tsx
<div className="fixed top-0 left-0 right-0 safe-top">
```

### Touch Targets
El botón de cierre tiene un área táctil de 44x44px:

```tsx
<button className="touch-target">
  <X className="w-4 h-4" />
</button>
```

### GPU Acceleration
Todas las animaciones usan GPU acceleration:

```tsx
<div className="gpu-accelerated animate-slide-in-up">
```

---

## 🔧 Integración en Layout Global

Para tener toasts disponibles en toda la app, crea un Context Provider:

### 1. Crear ToastProvider

```tsx
// contexts/ToastContext.tsx
'use client'

import { createContext, useContext } from 'react'
import { useToast as useToastHook, ToastContainer } from '@/app/components/MobileToast'

const ToastContext = createContext<ReturnType<typeof useToastHook> | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToastHook()

  return (
    <ToastContext.Provider value={toast}>
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismissToast} />
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
```

### 2. Agregar al Layout

```tsx
// app/layout.tsx
import { ToastProvider } from '@/contexts/ToastContext'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
```

### 3. Usar en Cualquier Componente

```tsx
'use client'

import { useToast } from '@/contexts/ToastContext'

export default function AnyComponent() {
  const toast = useToast()

  return (
    <button onClick={() => toast.success('¡Hecho!')}>
      Click me
    </button>
  )
}
```

---

## 🐛 Troubleshooting

### Toast no aparece
**Solución**: Asegúrate de renderizar `<ToastContainer />` en tu componente.

### Toast se corta en iOS
**Solución**: Verifica que `.safe-top` esté aplicado correctamente en `globals.css`.

### Animaciones lentas
**Solución**: Asegúrate de que `.gpu-accelerated` esté en el toast.

### Múltiples toasts se superponen
**Solución**: El contenedor usa `space-y-3` para separarlos. Verifica que no haya CSS conflictivo.

---

## 📊 Mejores Prácticas

1. **Títulos cortos**: Máximo 3-4 palabras
2. **Mensajes concisos**: 1-2 líneas máximo
3. **Duración apropiada**:
   - Éxito: 2-3 segundos
   - Error: 4-5 segundos (para leer el mensaje)
   - Info: 3-4 segundos
4. **No abusar**: Máximo 3 toasts simultáneos
5. **Feedback inmediato**: Mostrar toast inmediatamente después de la acción

---

## 🎯 Casos de Uso Recomendados

### ✅ Usar Toasts Para:
- Confirmaciones de acciones (agregar al carrito, guardar, etc.)
- Errores no críticos
- Notificaciones temporales
- Feedback de operaciones asíncronas

### ❌ NO Usar Toasts Para:
- Errores críticos (usar modal)
- Información permanente (usar banner)
- Formularios de validación (usar mensajes inline)
- Confirmaciones de acciones destructivas (usar dialog)

---

**Desarrollado para CapiShop Colombia**
*Sistema de notificaciones mobile-first premium*
