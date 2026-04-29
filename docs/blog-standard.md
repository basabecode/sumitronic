# Estándar de Creación de Contenido - Blog Sumitronic

Este documento establece las normas técnicas y visuales para la creación de artículos en la sección de "Guías de compra" y "Consejos técnicos" de Sumitronic.

## 1. Imágenes de Portada (Hero Images)

Todas las imágenes de los artículos deben seguir estrictamente estas especificaciones para garantizar una visualización óptima en todos los dispositivos:

- **Relación de Aspecto**: **16:9** (Ancho x Alto).
- **Resolución Recomendada**: 1920 x 1080 px (mínimo 1280 x 720 px).
- **Formato**: `.png` (preferido para gráficos/texto) o `.jpg` optimizado.
- **Estilo Visual**: Fotografía arquitectónica, tecnológica, con iluminación cinematográfica y tonos coherentes con la marca (azules, blancos, grises).
- **Ubicación**: Las imágenes deben guardarse en `/public/blogs/`.

### Prompt Estándar (IA)

Si se utiliza una herramienta de IA (ej. Nanobanana Pro, DALL-E) para generar la imagen, se debe incluir siempre:

> "... in 16:9 aspect ratio, wide angle view, high resolution, 4k, cinematic lighting."

## 2. Estructura del Artículo (lib/content.ts)

Cada post debe definirse en `lib/content.ts` con la siguiente estructura:

- **slug**: En minúsculas, separado por guiones (ej: `ia-seguridad-2026`).
- **title**: Título atractivo (máx 70 caracteres).
- **excerpt**: Resumen para SEO (máx 160 caracteres).
- **image**: Ruta absoluta (ej: `/blogs/mi-imagen.png`).
- **category**: Una de: `Seguridad`, `Conectividad`, `Smart Home`, `Energía`, `Comparativas`.
- **content**: Array de strings. Usar `##` para subtítulos.
- **faq**: Incluir al menos 2 preguntas frecuentes por artículo para mejorar el SEO (Rich Snippets).

## 3. Optimización SEO

- **Keywords**: Definir al menos 5 palabras clave relevantes.
- **Pillars**: Clasificar el contenido según su propósito (ej: `Conocimiento experto`).
- **ReadTime**: Calcular el tiempo estimado (aprox. 200 palabras por minuto).

---

_Última actualización: 28 de Abril, 2026_
