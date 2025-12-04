# 🚀 Quick Start - Optimización Mobile CapiShop

## ⚡ Guía Rápida de 5 Minutos

Esta guía te ayudará a empezar a usar todas las optimizaciones mobile-first implementadas en CapiShop.

---

## 📋 Checklist de Verificación

Antes de empezar, verifica que todo esté en su lugar:

- [x] ✅ `manifest.json` en `/public`
- [x] ✅ Meta tags PWA en `layout.tsx`
- [x] ✅ Utilidades mobile en `globals.css`
- [x] ✅ `BottomNav.tsx` creado
- [x] ✅ `WhatsAppFAB.tsx` creado
- [x] ✅ `MobileToast.tsx` creado
- [x] ✅ Componentes integrados en `page.tsx`

---

## 🎯 Paso 1: Probar la PWA (2 min)

### En tu iPhone:
1. Abre Safari
2. Navega a `http://localhost:3003` (o tu URL de desarrollo)
3. Toca el botón "Compartir" (cuadrado con flecha hacia arriba)
4. Selecciona "Agregar a pantalla de inicio"
5. Toca "Agregar"
6. Abre la app desde tu home screen

### En tu Android:
1. Abre Chrome
2. Navega a tu sitio
3. Espera el banner "Agregar a pantalla de inicio"
4. O toca menú (⋮) → "Instalar app"
5. Confirma la instalación

**✅ Resultado esperado**: La app se abre en modo standalone (sin barra de navegador).

---

## 🎯 Paso 2: Verificar Bottom Navigation (1 min)

1. Abre la app en móvil
2. Scroll hacia abajo
3. Verifica que la barra inferior permanece fija
4. Toca cada icono:
   - 🏠 **Inicio**: Vuelve al top
   - 🛍️ **Productos**: Scroll a sección productos
   - ❤️ **Favoritos**: Abre sidebar de favoritos
   - 👤 **Perfil**: Va a perfil (o login si no autenticado)

**✅ Resultado esperado**: Navegación fluida con animaciones suaves.

---

## 🎯 Paso 3: Probar WhatsApp FAB (30 seg)

1. Busca el botón verde flotante en la esquina inferior derecha
2. Tócalo
3. Verifica que se abre WhatsApp con mensaje predefinido

**En desktop**:
1. Pasa el mouse sobre el botón
2. Verifica que aparece el tooltip "¿Necesitas ayuda?"

**✅ Resultado esperado**: Deep link a WhatsApp funciona correctamente.

---

## 🎯 Paso 4: Usar el Sistema de Toasts (1 min)

### Ejemplo Rápido:

Crea un componente de prueba:

```tsx
// app/test-toast/page.tsx
'use client'

import { useToast, ToastContainer } from '@/app/components/MobileToast'

export default function TestToast() {
  const toast = useToast()

  return (
    <div className="p-8 space-y-4">
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismissToast} />

      <h1 className="text-2xl font-bold">Test de Toasts</h1>

      <div className="space-y-2">
        <button
          onClick={() => toast.success('¡Éxito!', 'Operación completada')}
          className="w-full p-3 bg-green-600 text-white rounded-lg"
        >
          Toast de Éxito
        </button>

        <button
          onClick={() => toast.error('Error', 'Algo salió mal')}
          className="w-full p-3 bg-red-600 text-white rounded-lg"
        >
          Toast de Error
        </button>

        <button
          onClick={() => toast.warning('Atención', 'Verifica esto')}
          className="w-full p-3 bg-orange-600 text-white rounded-lg"
        >
          Toast de Advertencia
        </button>

        <button
          onClick={() => toast.info('Info', 'Dato interesante')}
          className="w-full p-3 bg-blue-600 text-white rounded-lg"
        >
          Toast Informativo
        </button>
      </div>
    </div>
  )
}
```

Navega a `/test-toast` y prueba cada botón.

**✅ Resultado esperado**: Toasts aparecen en la parte superior con animación suave.

---

## 🎯 Paso 5: Verificar Touch Targets (30 seg)

1. Abre el header en móvil
2. Intenta tocar cada botón:
   - Menú hamburguesa
   - Búsqueda
   - Login/Register
   - Carrito
   - Favoritos

**✅ Resultado esperado**: Todos los botones son fáciles de presionar (44x44px mínimo).

---

## 🎨 Clases CSS Más Útiles

### Touch Targets
```tsx
// Botón con área táctil óptima
<button className="touch-target">
  <Icon />
</button>

// Botón grande (48x48px)
<button className="touch-target-lg">
  <Icon />
</button>
```

### Safe Areas (iOS)
```tsx
// Header con safe area superior
<header className="sticky top-0 safe-top">

// Bottom nav con safe area inferior
<nav className="fixed bottom-0 safe-bottom">
```

### Animaciones
```tsx
// Entrada desde abajo
<div className="animate-slide-in-up">

// Escala suave (badges)
<Badge className="animate-scale-in">

// Pulso sutil
<div className="animate-pulse-soft">
```

### GPU Acceleration
```tsx
// Elemento con animaciones frecuentes
<div className="gpu-accelerated transition-all">
```

### Glassmorphism
```tsx
// Fondo con blur
<div className="glass rounded-2xl p-6">

// Fondo oscuro con blur
<div className="glass-dark rounded-2xl p-6">
```

### Scroll Optimizations
```tsx
// Carrusel horizontal con snap
<div className="flex overflow-x-auto snap-x scrollbar-hide">
  <div className="snap-center min-w-full">
    <Image />
  </div>
</div>
```

---

## 🛠️ Snippets Útiles

### 1. Botón Mobile-Optimized
```tsx
<button
  className="touch-target-lg bg-orange-600 text-white rounded-xl active:scale-95 transition-all gpu-accelerated ripple"
  onClick={handleClick}
>
  <span className="text-sm font-semibold">Comprar Ahora</span>
</button>
```

### 2. Card con Glassmorphism
```tsx
<div className="glass rounded-2xl p-6 shadow-lg animate-slide-in-up">
  <h3 className="text-lg font-bold">Título</h3>
  <p className="text-sm text-gray-600">Descripción</p>
</div>
```

### 3. Modal Fullscreen Mobile
```tsx
<div className="fixed inset-0 z-50 md:flex md:items-center md:justify-center">
  {/* Overlay */}
  <div className="glass-dark fixed inset-0" onClick={onClose} />

  {/* Modal */}
  <div className="relative bg-white h-full md:h-auto md:max-w-md md:rounded-2xl safe-area-inset animate-slide-in-up">
    {/* Contenido */}
  </div>
</div>
```

### 4. Lista con Skeleton Loading
```tsx
{isLoading ? (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="skeleton-shimmer h-24 rounded-lg" />
    ))}
  </div>
) : (
  <div className="space-y-4">
    {items.map((item) => (
      <ItemCard key={item.id} item={item} />
    ))}
  </div>
)}
```

### 5. FAB Personalizado
```tsx
<button
  className="fixed bottom-24 right-4 md:bottom-6 md:right-6 w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl active:scale-95 gpu-accelerated ripple"
  onClick={handleAction}
>
  <Icon className="w-6 h-6 mx-auto" />
</button>
```

---

## 📱 Testing en Dispositivos Reales

### Checklist de Testing:

#### iPhone (iOS):
- [ ] PWA se instala correctamente
- [ ] Safe areas respetan el notch
- [ ] Bottom nav no queda detrás del home indicator
- [ ] Inputs no causan auto-zoom (≥16px)
- [ ] Scroll es suave y con bounce effect
- [ ] Touch targets son fáciles de presionar

#### Android:
- [ ] PWA se instala con banner
- [ ] Theme color aparece en status bar
- [ ] Ripple effects funcionan
- [ ] Bottom nav es accesible
- [ ] Animaciones son fluidas (60fps)

#### Ambos:
- [ ] WhatsApp FAB abre la app correctamente
- [ ] Toasts aparecen y desaparecen suavemente
- [ ] Navegación es intuitiva
- [ ] No hay elementos cortados o fuera de pantalla

---

## 🎓 Próximos Pasos

### Nivel 1 - Básico (Ya implementado):
- [x] PWA instalable
- [x] Bottom navigation
- [x] WhatsApp FAB
- [x] Toast notifications
- [x] Touch targets optimizados
- [x] Safe areas para iOS

### Nivel 2 - Intermedio (Recomendado):
- [ ] Implementar Service Worker para offline
- [ ] Agregar Pull-to-Refresh
- [ ] Swipe-to-Delete en carrito
- [ ] Haptic feedback en acciones

### Nivel 3 - Avanzado (Opcional):
- [ ] Push notifications
- [ ] Share API
- [ ] Gestos avanzados (pinch-to-zoom)
- [ ] Modo oscuro automático
- [ ] Realtime updates con Supabase

---

## 📚 Documentación Completa

Para más detalles, consulta:

1. **Guía Completa**: `/docs/MOBILE_OPTIMIZATION_GUIDE.md`
2. **Resumen Ejecutivo**: `/docs/MOBILE_OPTIMIZATION_SUMMARY.md`
3. **Sistema de Toasts**: `/docs/MOBILE_TOAST_GUIDE.md`

---

## 🆘 Ayuda Rápida

### Problema: Bottom Nav no aparece
```tsx
// Verifica que esté en page.tsx
<BottomNav />
```

### Problema: Safe areas no funcionan
```css
/* Verifica en globals.css */
.safe-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

### Problema: Toasts no se ven
```tsx
// Asegúrate de renderizar el contenedor
<ToastContainer toasts={toast.toasts} onDismiss={toast.dismissToast} />
```

### Problema: Animaciones lentas
```tsx
// Agrega GPU acceleration
className="gpu-accelerated"
```

---

## 🎉 ¡Listo!

Tu aplicación CapiShop ahora tiene:
- ✅ Experiencia mobile premium
- ✅ PWA instalable
- ✅ Navegación nativa
- ✅ Notificaciones elegantes
- ✅ Performance optimizado
- ✅ UX de nivel profesional

**¡Disfruta de tu app mobile-first!** 📱✨

---

**Desarrollado con ❤️ para CapiShop Colombia**
*Stack: Next.js 14 + Tailwind CSS + Shadcn/UI*
