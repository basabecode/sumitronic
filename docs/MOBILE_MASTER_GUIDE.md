# 📱 Guía Maestra de Optimización Mobile - CapiShop

## 🎯 Resumen Ejecutivo

Esta guía unifica toda la documentación relacionada con la transformación de CapiShop en una experiencia **Mobile-First Premium**. El objetivo es ofrecer una UX que rivalice con aplicaciones nativas de iOS y Android sin necesidad de descargas.

---

## 🚀 Quick Start (Inicio Rápido)

### 1. Verificación de Instalación
Asegúrate de que los siguientes componentes estén activos:
- [x] `manifest.json` en `/public` (Configuración PWA)
- [x] Meta tags en `layout.tsx` (Soporte iOS/Android)
- [x] `BottomNav.tsx` (Navegación inferior tipo app)
- [x] `MobileToast.tsx` (Notificaciones nativas)

### 2. Cómo Probar la PWA
1.  **iOS (Safari):** Botón Compartir -> "Agregar a inicio".
2.  **Android (Chrome):** Menú -> "Instalar aplicación".
3.  **Resultado:** La app debe abrirse sin barra de navegador (standalone).

---

## 🛠️ Arquitectura y Componentes

### 1. PWA (Progressive Web App)
Transforma la web en una app instalable.
*   **Manifest:** Configurado con iconos, colores (`#ea580c`) y shortcuts.
*   **Meta Tags:** `apple-mobile-web-app-capable` para pantalla completa en iOS.

### 2. Bottom Navigation (`BottomNav.tsx`)
Barra de navegación inferior que aparece solo en móviles (<768px).
*   **Items:** Inicio, Productos, Favoritos, Perfil.
*   **Badges:** Indicadores dinámicos para carrito y favoritos.
*   **Safe Areas:** Respeta el "home indicator" de los iPhone nuevos.

### 3. Sistema de Notificaciones (`MobileToast.tsx`)
Reemplazo de alertas nativas por "Toasts" elegantes.
*   **Tipos:** Success (Verde), Error (Rojo), Warning (Naranja), Info (Azul).
*   **Uso:** `const toast = useToast(); toast.success('Producto agregado');`
*   **Posición:** Superior, no intrusiva, con animaciones GPU-accelerated.

### 4. WhatsApp FAB (`WhatsAppFAB.tsx`)
Botón flotante de acción rápida.
*   **Móvil:** Abre directamente la app de WhatsApp.
*   **Desktop:** Muestra un tooltip al pasar el mouse.

---

## 🎨 Guía de Estilos Mobile-First

### Clases CSS Utilitarias (en `globals.css`)

| Clase | Descripción | Uso |
|-------|-------------|-----|
| `.safe-top` | Padding superior para Notch | Headers fijos |
| `.safe-bottom` | Padding inferior para Home Indicator | Bottom Navs |
| `.touch-target` | Área táctil de 44x44px | Botones pequeños |
| `.touch-target-lg` | Área táctil de 48x48px | Botones principales |
| `.glass` | Efecto vidrio desenfocado | Modales, Cards |
| `.gpu-accelerated` | `transform: translateZ(0)` | Animaciones suaves |
| `.snap-x` | Scroll horizontal magnético | Carruseles de productos |

### Mejores Prácticas de UX
1.  **Touch Targets:** Mínimo 44px para todo elemento interactivo.
2.  **Inputs:** Fuente mínima de 16px para evitar zoom automático en iOS.
3.  **Feedback:** Usar `active:scale-95` para dar sensación táctil al presionar.
4.  **Carga:** Usar `skeleton-shimmer` en lugar de spinners para contenido.

---

## 🐛 Troubleshooting Común

### Bottom Nav no aparece
*   **Causa:** Probablemente estás en una pantalla >768px.
*   **Solución:** Reduce el ancho del navegador o usa el modo dispositivo de DevTools.

### La app tiene "barras negras" en iOS
*   **Causa:** Falta `viewport-fit=cover`.
*   **Solución:** Verificar `export const viewport` en `layout.tsx`.

### Toasts se cortan arriba
*   **Causa:** Conflicto con el Notch.
*   **Solución:** Asegurar que el contenedor tenga la clase `.safe-top`.

---

## 📚 Referencia de Archivos Eliminados
Esta guía consolida y reemplaza a:
*   `MOBILE_OPTIMIZATION_GUIDE.md`
*   `MOBILE_OPTIMIZATION_SUMMARY.md`
*   `MOBILE_QUICK_START.md`
*   `MOBILE_TOAST_GUIDE.md`
