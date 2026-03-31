# Checklist QA Release - Fase 4

Fecha base: 2026-03-30

## Smoke storefront

1. Login correcto y logout.
2. Carga de perfil sin errores visibles.
3. Catálogo carga productos con y sin filtros.
4. Búsqueda global desde header actualiza el catálogo.
5. Filtros por categoría, marca, stock y precio funcionan juntos.
6. Detalle de producto permite cambiar imagen, agregar al carrito y marcar favorito.
7. Carrito persiste después de refrescar.
8. Checkout abre, calcula totales y completa flujo feliz.
9. Pedidos se visualizan para usuario autenticado.

## Smoke SEO y contenido

1. `/blog` renderiza listado indexable.
2. `/blog/[slug]` devuelve metadata y artículo real.
3. `/help` renderiza hub indexable.
4. `/help/[slug]` devuelve contenido y FAQ schema cuando aplica.
5. `/categorias/[slug]` y `/marcas/[slug]` responden con productos.
6. `sitemap.xml` incluye blog, help, categorías, marcas y productos.
7. `robots.txt` sigue apuntando al sitemap correcto.

## Smoke admin

1. Crear producto.
2. Editar producto.
3. Desactivar producto.
4. Revisar stock bajo o sin stock.
5. Validar visualización mobile del panel.

## Hardening técnico

1. Ejecutar `npm run build`.
2. Ejecutar `npm run test -- --run`.
3. Revisar consola del navegador en home, catálogo, producto, checkout y admin.
4. Verificar errores de red en `/api/products`, `/api/categories`, `/api/cart` y `/api/favorites`.
