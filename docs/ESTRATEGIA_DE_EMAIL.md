# 📧 Plan de Implementación de Correos y Marketing
## CapiShop - Estrategia Low-Cost & High-Efficiency

Este documento detalla la estrategia técnica y operativa para implementar un sistema de correos electrónicos eficiente, escalable y de bajo costo para CapiShop.

---

## 1. Recomendación de Tecnología (Stack)

Para una tienda que inicia, el objetivo es **costo cero fijo** y **alta entregabilidad**.

### ✅ Proveedor Recomendado: [Resend](https://resend.com)
*   **Por qué:** Es la opción moderna estándar para Next.js. Creado por desarrolladores para desarrolladores.
*   **Costo:** **Gratis** hasta 3,000 correos/mes y 100 correos/día. Perfecto para iniciar.
*   **Integración:** SDK nativo para React/Next.js.
*   **Templates:** Permite escribir correos usando **React** (JSX), lo que facilita mantener la identidad de marca (mismos componentes que la web).

### ❌ Alternativas (y por qué no ahora):
*   **SendGrid:** El plan gratuito es bueno, pero la integración de templates es más arcaica (HTML puro o editor visual).
*   **AWS SES:** El más barato a escala masiva, pero configuración compleja (DNS, IP reputation) y sin capa gratuita "simple" para empezar.
*   **Mailchimp:** Muy costoso rápidamente. Mejor evitarlo hasta tener una base de datos de miles de usuarios rentables.

---

## 2. Tipos de Correos a Implementar

### A. Correos Transaccionales (Prioridad Alta)
Estos son automáticos y críticos para la operación.
1.  **Confirmación de Pedido:** "Gracias por tu compra #123".
2.  **Actualización de Estado:** "Tu pedido ha sido enviado".
3.  **Bienvenida:** "Bienvenido a CapiShop" (al registrarse).
4.  **Recuperación de Contraseña:** (Ya manejado por Supabase, pero personalizable).

### B. Correos de Marketing (Prioridad Media)
Estos son los que el administrador enviará manualmente.
1.  **Ofertas Flash:** "Descuento del 20% en Cámaras por 24h".
2.  **Novedades:** "Llegaron los nuevos teclados mecánicos".
3.  **Carrito Abandonado:** "Olvidaste esto en tu carrito" (Automático, alta conversión).

---

## 3. Hoja de Ruta de Implementación

### Fase 1: Configuración Base (Día 1)
1.  Crear cuenta en **Resend**.
2.  Verificar dominio (`capishop.com` o similar) configurando registros DNS (DKIM, SPF, DMARC) para evitar caer en SPAM.
3.  Instalar dependencias: `npm install resend @react-email/components`.
4.  Configurar API Key en `.env.local`.

### Fase 2: Templates con React Email (Día 2-3)
Crear una carpeta `emails/` con componentes reutilizables:
*   `<EmailLayout>`: Header con logo y Footer con redes sociales y link de "darse de baja".
*   `<OrderConfirmation>`: Tabla con productos comprados.
*   `<MarketingBlast>`: Template flexible para promociones con imagen grande y botón de acción (CTA).

### Fase 3: Panel de Administración (Día 4-5)
Crear una ruta protegida `/admin/marketing`:
*   **Formulario de Redacción:** Asunto, Título, Mensaje, Imagen Promocional, Link del Botón.
*   **Selector de Audiencia:** "Todos los usuarios", "Compradores recientes", "Suscritos a ofertas".
*   **Botón de Envío:** Llama a una API Route que usa Resend para despachar los correos en lote (batch).

---

## 4. Gestión de Preferencias (Anti-SPAM)

Es **CRÍTICO** respetar la ley y al usuario.
1.  **Base de Datos:** Crear tabla `user_preferences` en Supabase vinculada al `user_id`.
    ```sql
    create table user_preferences (
      user_id uuid references auth.users,
      marketing_emails boolean default false,
      transactional_emails boolean default true
    );
    ```
2.  **Link de Unsubscribe:** Todos los correos de marketing DEBEN tener un link al final que lleve a `/profile/settings` o un link directo de desuscripción.
3.  **Filtrado:** Antes de enviar, la API debe filtrar: `WHERE marketing_emails = true`.

---

## 5. Presupuesto Estimado Mensual

| Concepto | Costo Inicial | Costo al Escalar (>3k usuarios) |
|----------|---------------|---------------------------------|
| **Resend** | $0 USD | $20 USD/mes |
| **Supabase** | $0 USD | $25 USD/mes (si la DB crece mucho) |
| **Vercel** | $0 USD | $20 USD/mes (Pro) |
| **TOTAL** | **$0 USD** | **~$40-60 USD/mes** |

---

## Recomendación Final

Para CapiShop, **no contrates servicios de email marketing externos** (como Mailchimp o Klaviyo) todavía. Construye un sistema simple "in-house" usando **Resend**. Te dará control total, costará $0 al inicio y se integrará perfectamente con tu base de datos de usuarios en Supabase.
