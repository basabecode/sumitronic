# 💳 Guía Maestra del Sistema de Pagos - SUMITRONIC

## 🎯 Resumen Ejecutivo

SUMITRONIC utiliza actualmente un sistema de **Pagos Manuales con Billeteras Digitales** (Nequi, Daviplata, etc.). Este sistema permite operar inmediatamente sin comisiones de pasarelas, funcionando bajo un modelo de "Pago Contra-Verificación".

---

## 📦 Sistema Actual: Billeteras Digitales

### 1. Flujo de Usuario

1.  **Checkout:** El usuario selecciona "Billeteras Digitales".
2.  **Instrucciones:** Se muestran los números de cuenta (Nequi, Daviplata, Bancolombia, etc.).
3.  **Acción:** El usuario transfiere desde su app bancaria.
4.  **Verificación:** El usuario ingresa la referencia de pago o envía el comprobante por WhatsApp.
5.  **Confirmación:** El pedido se crea con estado `PENDING`.

### 2. Arquitectura Técnica (`lib/payments/`)

El sistema está modularizado para facilitar el mantenimiento y futuras migraciones.

- **`types.ts`**: Definiciones TypeScript (`PaymentMethod`, `PaymentStatus`).
- **`constants.ts`**: Configuración de cuentas bancarias y reglas.
- **`validation.ts`**: Lógica de seguridad (Sanitización, Regex de teléfonos).
- **`components/payments/`**:
  - `PaymentMethodSelector`: UI para elegir método.
  - `DigitalWalletPayment`: UI con acordeones de cuentas y botón de WhatsApp.

### 3. Seguridad Implementada

- **Sanitización:** Todos los inputs pasan por `sanitizeString` para prevenir XSS.
- **Validación:** Se verifican formatos de teléfonos y emails antes de procesar.
- **Datos Sensibles:** No se almacenan datos financieros, solo referencias públicas.

---

## 🔮 Roadmap: Integración Wompi (Fase 2)

Esta sección detalla los pasos para migrar a una pasarela automática en el futuro.

### Requisitos Previos

- Cuenta en [comercios.wompi.co](https://comercios.wompi.co/).
- Llaves de API (Pública, Privada, Integridad).

### Arquitectura Propuesta

1.  **Frontend:** Widget de Wompi (WebCheckout).
2.  **Backend:**
    - `POST /api/orders/create`: Genera firma de integridad SHA-256.
    - `POST /api/webhooks/wompi`: Recibe confirmación de pago segura.

### Pasos de Migración

1.  Configurar variables de entorno (`WOMPI_PUBLIC_KEY`, etc.).
2.  Reemplazar `DigitalWalletPayment` por el script del Widget.
3.  Implementar webhook para actualizar estado de orden automáticamente.

---

## 🛠️ Guía de Mantenimiento

### Cómo Agregar una Nueva Cuenta Bancaria

Editar `lib/payments/constants.ts`:

```typescript
export const WALLET_ACCOUNTS = [
  // ... existentes
  {
    name: 'Nueva Billetera',
    accountNumber: '300XXXXXXX',
    type: 'Celular',
    icon: '/icons/nueva-wallet.png', // Asegurar que el icono exista
  },
]
```

### Cómo Verificar Pagos (Admin)

1.  Recibir notificación de nuevo pedido.
2.  Revisar el campo `payment_reference` en la orden.
3.  Abrir la app bancaria correspondiente.
4.  Confirmar recepción del dinero.
5.  Actualizar estado del pedido a `PAID` en Supabase.

---

## 📚 Referencia de Archivos Eliminados

Esta guía consolida y reemplaza a:

- `PAYMENT_IMPLEMENTATION.md`
- `PAYMENT_STRUCTURE.md`
- `PAYMENT_SUMMARY.md`
- `Digital_Wallets_Payment_Plan.md`
- `Wompi_Integration_Guide.md`
