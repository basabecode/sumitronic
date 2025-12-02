# Guía de Integración Wompi - CapiShop Web

Este documento detalla los pasos técnicos y operativos necesarios para integrar la pasarela de pagos Wompi en CapiShop.

## 1. Requisitos Previos (Cuenta Wompi)
Antes de tocar el código, es necesario tener una cuenta en Wompi.
- **Registro**: Crear cuenta en [comercios.wompi.co](https://comercios.wompi.co/).
- **Llaves de API**: Obtener las llaves del entorno de **Pruebas (Sandbox)** y **Producción**.
  - `Public Key` (Llave Pública): Se usa en el Frontend.
  - `Private Key` (Llave Privada): Se usa en el Backend (nunca exponer).
  - `Integrity Secret` (Secreto de Integridad): Para firmar las transacciones.

## 2. Arquitectura de Integración Propuesta
Recomendamos usar el **Widget de Wompi** para la experiencia más fluida y segura (PCI Compliance manejado por Wompi).

### Flujo de Datos
1.  **Usuario**: Llena datos de envío en `CheckoutPageContent.tsx`.
2.  **Frontend**: Envía datos del pedido a nuestro Backend (`/api/orders/create`).
3.  **Backend**:
    - Guarda la orden en Supabase con estado `PENDING`.
    - Genera una "Referencia de Pago" única.
    - Calcula la firma de integridad (Hash SHA-256).
    - Retorna la referencia y la firma al Frontend.
4.  **Frontend**: Abre el Widget de Wompi con los datos recibidos.
5.  **Wompi**: Procesa el pago (Tarjeta, PSE, Nequi, Bancolombia).
6.  **Wompi -> Backend (Webhook)**: Wompi notifica a nuestro endpoint `/api/webhooks/wompi` el resultado.
7.  **Backend**: Actualiza el estado de la orden en Supabase (`APPROVED`, `DECLINED`).

## 3. Cambios Necesarios en el Código

### A. Frontend (`app/checkout/CheckoutPageContent.tsx`)
- **Eliminar**: Campos sensibles de tarjeta de crédito (`cardNumber`, `cvv`, etc.).
- **Agregar**: Script del Widget de Wompi.
- **Modificar**: La función `handleSubmit` para que no simule, sino que inicie el flujo real.

```typescript
// Ejemplo de configuración del Widget
const checkout = new WidgetCheckout({
  currency: 'COP',
  amountInCents: total * 100,
  reference: reference, // Generada por backend
  publicKey: 'PUB_TEST_...',
  signature: integritySignature, // Generada por backend
  redirectUrl: 'https://capishop.com/checkout/result', // Página de resultado
})
```

### B. Backend (Nuevos Endpoints)
1.  **Crear Orden**: `app/api/orders/create/route.ts`
    - Valida stock.
    - Crea registro en tabla `orders`.
    - Retorna datos para Wompi.

2.  **Webhook**: `app/api/webhooks/wompi/route.ts`
    - Endpoint público que recibe notificaciones de Wompi.
    - Valida la firma de Wompi (seguridad).
    - Actualiza el stock y estado de la orden.

### C. Base de Datos (Supabase)
Necesitamos asegurar que la tabla `orders` tenga los campos necesarios:
- `transaction_id` (ID de Wompi)
- `payment_status` (Pendiente, Aprobado, Rechazado)
- `payment_method` (Tarjeta, PSE, etc.)

## 4. Plan de Acción Inmediato
1.  **Limpieza**: Remover los campos de tarjeta de crédito del formulario actual para evitar riesgos de seguridad y confusión.
2.  **Variables de Entorno**: Configurar `.env.local` con las llaves de Wompi.
    ```env
    NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_...
    WOMPI_PRIVATE_KEY=prv_test_...
    WOMPI_INTEGRITY_SECRET=...
    ```
3.  **Desarrollo**: Implementar el endpoint de creación de orden y la integración del Widget.

## 5. Tareas a Realizar (Checklist)

### Fase 1: Preparación y Limpieza
- [ ] **Obtener Credenciales Wompi**: Registrarse y obtener Public Key, Private Key e Integrity Secret (Sandbox).
- [ ] **Configurar Variables de Entorno**: Crear/Actualizar `.env.local` con las credenciales.
- [ ] **Limpiar Checkout UI**: Eliminar campos de tarjeta de crédito (`cardNumber`, `cvv`, `expiryDate`) de `CheckoutPageContent.tsx`.
- [ ] **Actualizar Interfaces**: Modificar la interfaz `CheckoutForm` para reflejar solo los datos necesarios (contacto y envío).

### Fase 2: Backend (API Routes)
- [ ] **Crear Endpoint de Orden**: Implementar `POST /api/orders` que:
    - Reciba los items del carrito y datos del usuario.
    - Calcule el total en el servidor (seguridad).
    - Genere una referencia única de pago.
    - Genere la firma de integridad SHA-256 (Referencia + Monto + Moneda + Secreto).
    - Guarde la orden en Supabase con estado `PENDING`.
    - Retorne la referencia y la firma al frontend.
- [ ] **Crear Webhook**: Implementar `POST /api/webhooks/wompi` que:
    - Reciba la notificación de Wompi.
    - Verifique la firma de la notificación (seguridad).
    - Actualice el estado de la orden en Supabase (`APPROVED`, `VOIDED`, `DECLINED`).

### Fase 3: Frontend (Integración Widget)
- [ ] **Instalar Script Wompi**: Agregar el script del widget de Wompi en el `head` o cargarlo dinámicamente.
- [ ] **Conectar Botón de Pago**: Modificar `handleSubmit` en `CheckoutPageContent.tsx` para:
    - Llamar a `POST /api/orders`.
    - Con la respuesta, inicializar y abrir el Widget de Wompi.
- [ ] **Página de Respuesta**: Crear o ajustar `/checkout/success` (o `/result`) para manejar el retorno del usuario desde Wompi y mostrar el estado final (consultando al backend).

### Fase 4: Pruebas y Despliegue
- [ ] **Pruebas Sandbox**: Realizar compras de prueba con tarjetas de prueba de Wompi (Aprobada, Rechazada).
- [ ] **Verificar Webhook**: Confirmar que Supabase se actualiza correctamente tras el pago.
- [ ] **Cambio a Producción**: Reemplazar llaves de Sandbox por llaves de Producción en Vercel.

---
**Nota**: Mientras se realiza la integración, el sitio puede seguir operando en modo "Demo" o "Contra entrega" si se desea, pero para pagos en línea es obligatorio realizar estos cambios.
