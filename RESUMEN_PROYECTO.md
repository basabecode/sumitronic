# Resumen de la arquitectura y funcionalidad de archivos

Este documento describe la funcionalidad y arquitectura de los principales archivos y carpetas del proyecto `electronics-store`.

## Estructura general

- **app/**: Contiene la aplicación principal y sus componentes de página y secciones.

  - `layout.tsx`: Define el layout global, metadatos y estilos generales. Configura SEO, OpenGraph y Twitter Card. Incluye CartProvider para el contexto global del carrito.
  - `page.tsx`: Página principal, punto de entrada de la app. Renderiza todas las secciones principales y el CartSidebar.
  - `globals.css`: Estilos globales para la app.
  - `components/`: Secciones reutilizables como Hero, Blog, FAQ, Productos, Footer, Header, etc. Cada uno representa una sección visual y funcional de la página principal.
    - Ejemplo: `HeroSection.tsx` (banner principal y promociones), `BlogSection.tsx` (artículos y novedades), `FAQSection.tsx` (preguntas frecuentes), `ProductsSection.tsx` (listado y filtros de productos con carrito funcional), `Footer.tsx` (información de contacto y redes), `Header.tsx` (barra de navegación, búsqueda y carrito), `ChatWidget.tsx` (asistente virtual), `CartSidebar.tsx` (carrito lateral profesional), etc.

- **components/**: Componentes UI reutilizables y proveedores de contexto.

  - `theme-provider.tsx`: Proveedor de tema para la app (dark/light mode, etc).
  - `ui/`: Componentes de interfaz como botones, formularios, menús, tablas, etc. Son genéricos y reutilizables en toda la app.
    - Ejemplo: `button.tsx`, `card.tsx`, `accordion.tsx`, `drawer.tsx`, `sheet.tsx` (usado para el carrito lateral), etc.

- **contexts/**: Contextos de React para estado global.

  - `CartContext.tsx`: Contexto global del carrito de compras con persistencia en localStorage, gestión de items, cantidades y totales.

- **hooks/**: Custom hooks para lógica reutilizable.

  - `use-mobile.tsx`: Detecta si el usuario está en móvil.
  - `use-toast.ts`: Manejo de notificaciones tipo toast.

- **lib/**: Funciones utilitarias y datos.

  - `utils.ts`: Funciones de utilidad para la app.
  - `products.json`: Base de datos de productos con información completa (precio, stock, imágenes, categorías, etc).

- **public/**: Archivos estáticos (imágenes, logos, etc).

- **styles/**: Archivos de estilos globales.

  - `globals.css`: Estilos globales, importado en el layout.

- **Configuración y dependencias**:
  - `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.mjs`, `next.config.mjs`: Configuración de dependencias, compilador, Tailwind, Next.js, etc.

## Detalles extras para comprender el funcionamiento

### Propósito y funcionamiento de la página

- **CapiShoping** es una tienda online de productos electrónicos (smartphones, laptops, gaming, smart home, audio, accesorios, etc).
- El usuario puede navegar por categorías, ver productos destacados, leer artículos del blog, consultar preguntas frecuentes, contactar por chat y solicitar cotizaciones.
- El diseño es moderno, responsivo y enfocado en la experiencia de usuario.
- Secciones principales:
  - **HeroSection**: Promociones y productos destacados.
  - **FeaturesSection**: Beneficios de comprar en la tienda (envío rápido, garantía, soporte, pago seguro, instalación, productos originales).
  - **ProductsSection**: Listado de productos con filtros funcionales, vista de cuadrícula/lista, precios, stock y marcas. Botones "Agregar al Carrito" completamente funcionales.
  - **BrandsSection**: Marcas oficiales y estadísticas de la tienda.
  - **TestimonialsSection**: Opiniones de clientes reales.
  - **FAQSection**: Preguntas frecuentes sobre productos, envíos, pagos, devoluciones y soporte. Incluye sección "¿No encontraste lo que buscabas?" para WhatsApp.
  - **BlogSection**: Artículos y guías sobre tecnología y productos con modal funcional.
  - **CTASection**: Formulario de contacto y solicitud de cotización.
  - **Footer**: Información de contacto, redes sociales, métodos de pago y envíos.
  - **Header**: Navegación con filtros de categorías funcionales, búsqueda y carrito con contador dinámico.
  - **ChatWidget**: Asistente virtual para soporte y consultas rápidas.
  - **CartSidebar**: Carrito lateral profesional con gestión completa de productos, totales en pesos colombianos, métodos de pago y checkout.

### Principales dependencias

- **Next.js**: Framework para React, SSR y generación de sitios estáticos.
- **React**: Librería principal para la UI.
- **TailwindCSS**: Framework de estilos utilitario.
- **Radix UI**: Componentes accesibles y personalizables (menús, diálogos, formularios, etc).
- **Lucide-react**: Iconos SVG modernos.
- **react-hook-form**: Manejo de formularios.
- **zod**: Validación de datos.
- **sonner**: Notificaciones tipo toast.
- **embla-carousel-react**: Carruseles y sliders.
- **date-fns**: Utilidades para fechas.
- **next-themes**: Soporte para temas (oscuro/claro).

### Arquitectura y buenas prácticas

- Modularización clara entre componentes de página y UI.
- Hooks personalizados para lógica reutilizable.
- Uso de proveedores de contexto para temas y notificaciones.
- Estilos globales y utilitarios con Tailwind.
- Metadatos y SEO configurados en el layout.
- Componentes desacoplados y reutilizables.

### Sugerencias y posibles mejoras

- **✅ IMPLEMENTADO**: Sistema de carrito de compras completo con persistencia, gestión de stock y checkout.
- **✅ IMPLEMENTADO**: Filtros de categorías funcionales entre Header y ProductsSection.
- **✅ IMPLEMENTADO**: Modal de blog accesible con navegación por teclado.
- **✅ IMPLEMENTADO**: Navegación responsive y optimizada para móviles.
- **✅ IMPLEMENTADO**: Integración de WhatsApp con sección "¿No encontraste lo que buscabas?".
- Agregar carpeta `tests/` para pruebas unitarias y de integración.
- Documentar el uso de cada hook y componente UI.
- Configurar internacionalización si se requiere soporte multilenguaje.
- Integrar sistema de autenticación y gestión de usuarios si se desea escalar la tienda.
- Añadir integración con pasarelas de pago reales (PSE, Wompi, PayU) y sistemas de inventario.
- Implementar sistema de wishlist/favoritos.
- Agregar comparador de productos.
- Sistema de reviews y calificaciones de usuarios.

---

¿Te gustaría que agregue ejemplos de rutas, flujo de usuario, o detalles sobre la lógica de negocio? ¿Quieres que profundice en alguna sección específica?
