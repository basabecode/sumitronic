# 📱 Guía de Optimización Mobile-First - CapiShop

## 🎯 Resumen de Implementación

Esta guía documenta todas las optimizaciones mobile-first implementadas en CapiShop para transformar la experiencia web en una app que rivaliza con aplicaciones nativas de iOS y Android.

---

## ✅ Optimizaciones Implementadas

### 1. **PWA (Progressive Web App)** 🚀

#### Archivos Creados:
- **`/public/manifest.json`**: Configuración completa de PWA con:
  - Iconos adaptativos para iOS/Android
  - Shortcuts a secciones clave (Productos, Ofertas, Carrito)
  - Screenshots para app stores
  - Theme color: `#ea580c` (Orange-600)

#### Meta Tags Agregados en `layout.tsx`:
```tsx
// PWA Meta Tags
<link rel="manifest" href="/manifest.json" />

// iOS Meta Tags
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="CapiShop" />
<link rel="apple-touch-icon" href="/favicon.png" />

// Android Meta Tags
<meta name="mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#ea580c" />
```

#### Cómo Instalar la PWA:
**iOS (Safari):**
1. Abre la web en Safari
2. Toca el botón "Compartir" (icono de cuadrado con flecha)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma el nombre "CapiShop"

**Android (Chrome):**
1. Abre la web en Chrome
2. Toca el menú (⋮)
3. Selecciona "Agregar a pantalla de inicio"
4. O espera el banner automático de instalación

---

### 2. **Bottom Navigation** 📲

#### Componente Creado:
- **`/app/components/BottomNav.tsx`**: Navegación inferior premium con:
  - 4 items principales: Inicio, Productos, Favoritos, Perfil
  - Touch targets de 48x48px (WCAG AAA)
  - Badges dinámicos para Carrito y Favoritos
  - Animaciones suaves con `animate-scale-in`
  - Safe areas para home indicator de iOS
  - Se oculta automáticamente en desktop (≥768px)

#### Características:
```tsx
// Touch Target Optimizado
className="touch-target-lg" // 48x48px mínimo

// Safe Area para iOS
className="safe-bottom" // Respeta notch inferior

// Animaciones
className="animate-scale-in" // Entrada suave de badges
className="active:scale-95" // Feedback táctil
```

#### Integración:
Ya está integrado en `page.tsx` al final del componente.

---

### 3. **Safe Areas (iOS Notch Support)** 🍎

#### Clases CSS Disponibles:
```css
.safe-top      /* Padding superior para notch */
.safe-bottom   /* Padding inferior para home indicator */
.safe-left     /* Padding izquierdo */
.safe-right    /* Padding derecho */
.safe-area-inset /* Padding en todos los lados */
```

#### Uso Recomendado:
```tsx
// Header sticky
<header className="sticky top-0 safe-top">

// Bottom Navigation
<nav className="fixed bottom-0 safe-bottom">

// Modales fullscreen
<div className="safe-area-inset">
```

---

### 4. **Touch Optimizations** 👆

#### Clases de Touch Targets:
```css
.touch-target    /* 44x44px mínimo (WCAG AA) */
.touch-target-lg /* 48x48px (WCAG AAA) */
```

#### Touch Actions:
```css
.touch-pan-y  /* Solo scroll vertical */
.touch-pan-x  /* Solo scroll horizontal */
.touch-none   /* Sin gestos táctiles */
```

#### Ejemplo de Uso:
```tsx
// Botón con área táctil óptima
<button className="touch-target hover:bg-orange-50">
  <Icon className="w-5 h-5" />
</button>

// Contenedor con scroll vertical
<div className="overflow-y-auto touch-pan-y">
  {/* Contenido */}
</div>
```

---

### 5. **GPU Acceleration** ⚡

#### Clase Disponible:
```css
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
```

#### Uso:
```tsx
// Elementos con animaciones frecuentes
<div className="gpu-accelerated transition-all duration-300">
  {/* Contenido animado */}
</div>

// Botones del header
<button className="touch-target gpu-accelerated">
  <Menu />
</button>
```

---

### 6. **Micro-Animaciones Premium** ✨

#### Animaciones Disponibles:
```css
.animate-slide-in-up    /* Entrada desde abajo */
.animate-slide-in-right /* Entrada desde izquierda */
.animate-scale-in       /* Escala suave (badges) */
.animate-pulse-soft     /* Pulso sutil */
.animate-fadeInUp       /* Fade + slide (existente) */
```

#### Ejemplos:
```tsx
// Badge de notificación
<Badge className="animate-scale-in">
  {count}
</Badge>

// Card de producto
<div className="animate-slide-in-up">
  <ProductCard />
</div>

// Indicador de carga
<div className="animate-pulse-soft">
  Cargando...
</div>
```

---

### 7. **Glassmorphism Effects** 🌫️

#### Clases Disponibles:
```css
.glass       /* Fondo claro con blur */
.glass-dark  /* Fondo oscuro con blur */
```

#### Uso:
```tsx
// Modal con efecto glass
<div className="glass rounded-2xl p-6">
  <h2>Título</h2>
  <p>Contenido</p>
</div>

// Overlay oscuro
<div className="glass-dark fixed inset-0">
  {/* Contenido */}
</div>
```

---

### 8. **Scroll Optimizations** 📜

#### Scroll Snap (Carruseles):
```css
.snap-x        /* Snap horizontal */
.snap-y        /* Snap vertical */
.snap-center   /* Centrar items */
.snap-start    /* Alinear al inicio */
```

#### Ejemplo de Carrusel:
```tsx
<div className="flex overflow-x-auto snap-x scrollbar-hide">
  <div className="snap-center min-w-full">
    <Image src="/product1.jpg" />
  </div>
  <div className="snap-center min-w-full">
    <Image src="/product2.jpg" />
  </div>
</div>
```

#### Ocultar Scrollbar:
```tsx
<div className="overflow-auto scrollbar-hide">
  {/* Contenido scrolleable sin scrollbar visible */}
</div>
```

---

### 9. **Skeleton Loading** 💀

#### Clases Disponibles:
```css
.skeleton         /* Loading básico */
.skeleton-shimmer /* Loading con efecto shimmer */
```

#### Uso:
```tsx
// Mientras carga un producto
{isLoading ? (
  <div className="skeleton-shimmer h-64 rounded-lg" />
) : (
  <ProductCard product={product} />
)}

// Skeleton de texto
<div className="space-y-2">
  <div className="skeleton h-4 w-3/4 rounded" />
  <div className="skeleton h-4 w-1/2 rounded" />
</div>
```

---

### 10. **Ripple Effect (Material Design)** 🌊

#### Clase Disponible:
```css
.ripple /* Efecto de onda al tocar */
```

#### Uso:
```tsx
<button className="ripple px-6 py-3 bg-orange-600 text-white rounded-lg">
  Comprar Ahora
</button>
```

---

### 11. **Sticky Header Dinámico** 📌

#### Clases Disponibles:
```css
.sticky-header          /* Header sticky básico */
.sticky-header.scrolled /* Con sombra al hacer scroll */
```

#### Implementación:
```tsx
'use client'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky-header ${scrolled ? 'scrolled' : ''}`}>
      {/* Contenido del header */}
    </header>
  )
}
```

---

### 12. **Inputs sin Auto-Zoom (iOS)** 🔍

#### Optimización Automática:
Todos los inputs tienen `font-size: 16px` mínimo para prevenir auto-zoom en iOS.

```css
/* Ya aplicado globalmente */
input[type="text"],
input[type="email"],
input[type="password"],
textarea,
select {
  font-size: 16px !important;
}
```

---

### 13. **Tap Highlight Personalizado** 🎨

#### Configuración Global:
```css
* {
  -webkit-tap-highlight-color: rgba(234, 88, 12, 0.1);
  tap-highlight-color: rgba(234, 88, 12, 0.1);
}
```

Color naranja suave al tocar elementos (brand color de CapiShop).

---

## 🎨 Paleta de Diseño Mobile

### iOS Style (Recomendado para CapiShop):
```tsx
// Backgrounds
className="bg-gray-50"
className="bg-white"

// Cards
className="bg-white shadow-sm rounded-2xl"

// Accents
className="text-orange-600"
className="bg-orange-600"

// Separadores
className="border-gray-200"
```

### Material Design (Alternativa):
```tsx
// Elevaciones
className="shadow-md"
className="shadow-lg"

// Gradientes
className="bg-gradient-to-r from-orange-500 to-red-600"

// FAB (Floating Action Button)
className="fixed bottom-6 right-6 rounded-full shadow-lg"
```

---

## 📋 Checklist de Optimización Mobile

Usa este checklist al crear nuevos componentes:

- [ ] **Touch Targets**: ¿Botones tienen mínimo 44x44px?
- [ ] **Scroll Suave**: ¿Listas tienen `overscroll-bounce` y `touch-pan-y`?
- [ ] **Modales**: ¿Ocupan pantalla completa en mobile con `safe-area-inset`?
- [ ] **Feedback Visual**: ¿Hay `active:scale-95` o `ripple` en botones?
- [ ] **Inputs**: ¿Font-size ≥ 16px para evitar zoom en iOS?
- [ ] **Animaciones**: ¿Usan `gpu-accelerated` para 60fps?
- [ ] **Loading States**: ¿Hay `skeleton-shimmer` mientras carga?
- [ ] **Legibilidad**: ¿Texto es legible sin zoom (text-sm mínimo)?
- [ ] **Orientación**: ¿Funciona en portrait y landscape?
- [ ] **Toasts**: ¿No bloquean contenido importante?

---

## 🚀 Próximos Pasos Recomendados

### 1. **Service Worker (Offline Support)**
```bash
# Instalar next-pwa
npm install next-pwa
```

Configurar en `next.config.mjs`:
```js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // Tu configuración actual
})
```

### 2. **Pull-to-Refresh**
Implementar en `ProductsSection.tsx`:
```tsx
import { useState } from 'react'

const [refreshing, setRefreshing] = useState(false)

const handleRefresh = async () => {
  setRefreshing(true)
  await fetchProducts()
  setRefreshing(false)
}

// Detectar gesto pull-to-refresh
```

### 3. **Swipe Actions**
Para eliminar items del carrito:
```tsx
import { useSwipeable } from 'react-swipeable'

const handlers = useSwipeable({
  onSwipedLeft: () => removeItem(item.id),
  trackMouse: true
})

<div {...handlers}>
  <CartItem />
</div>
```

### 4. **Haptic Feedback (iOS)**
```tsx
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10) // 10ms vibración
  }
}

<button onClick={() => {
  addToCart(product)
  triggerHaptic()
}}>
  Agregar al Carrito
</button>
```

---

## 🔧 Troubleshooting

### Problema: Bottom Nav no se ve
**Solución**: Asegúrate de que `page.tsx` incluye `<BottomNav />` al final.

### Problema: Safe areas no funcionan en iOS
**Solución**: Verifica que `viewport-fit=cover` esté en el viewport meta tag:
```tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // Agregar esto
}
```

### Problema: Animaciones lentas
**Solución**: Agrega `gpu-accelerated` a elementos animados.

### Problema: PWA no se instala
**Solución**:
1. Verifica que `manifest.json` esté en `/public`
2. Asegúrate de usar HTTPS (o localhost)
3. Revisa la consola del navegador para errores

---

## 📚 Recursos Adicionales

- **Apple Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/
- **Material Design**: https://m3.material.io/
- **Web.dev PWA**: https://web.dev/progressive-web-apps/
- **WCAG Touch Target Size**: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html

---

## 💡 Tips de Diseño Mobile-First

1. **Diseña primero para 375px** (iPhone SE/12/13 mini)
2. **Usa espaciado generoso**: `p-4` mínimo en contenedores
3. **Tipografía legible**: `text-base` (16px) para cuerpo
4. **Contraste alto**: Mínimo 4.5:1 (WCAG AA)
5. **Botones grandes**: Mínimo 44x44px, ideal 48x48px
6. **Feedback inmediato**: Siempre responde a toques en <100ms
7. **Evita hover states**: Usa `active:` en su lugar
8. **Prueba en dispositivos reales**: Simuladores no son suficientes

---

## 🎯 Métricas de Éxito

### Performance:
- **First Contentful Paint**: < 1.8s
- **Time to Interactive**: < 3.8s
- **Cumulative Layout Shift**: < 0.1

### UX:
- **Touch Target Success Rate**: > 95%
- **Scroll Performance**: 60fps constante
- **PWA Install Rate**: > 10% de usuarios móviles

### Accesibilidad:
- **WCAG Level**: AAA para touch targets
- **Lighthouse Score**: > 90 en todas las categorías

---

**Desarrollado con ❤️ para CapiShop Colombia**
*Última actualización: Diciembre 2025*
