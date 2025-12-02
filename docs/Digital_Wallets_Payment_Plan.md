# Plan de Implementación: Pagos Manuales con Billeteras Digitales (Nequi, Daviplata, Bancolombia, Davivienda, Nubank)

Este documento describe la estrategia para implementar un sistema de pagos manuales mediante billeteras digitales en CapiShop. Este método es muy común en e-commerce locales en Colombia y permite aceptar pagos sin una pasarela intermedia (como Wompi) en esta etapa inicial.

## 1. Referencia y Concepto
**Referencia**: Este modelo se basa en el método de **"Transferencia Bancaria Directa" (BACS)** utilizado popularmente en plataformas como **WooCommerce** o **PrestaShop**, pero adaptado a la inmediatez de las billeteras digitales.

**Concepto**: "Pago Contra-Verificación". El cliente realiza la transacción por su cuenta y notifica al comercio. El comercio verifica manualmente y aprueba el pedido.

## 2. Flujo de Usuario (User Journey)

1.  **Checkout**: El usuario llena sus datos de envío.
2.  **Selección de Pago**: En la sección de métodos de pago, selecciona **"Billeteras Digitales / Transferencia"**.
3.  **Instrucciones Visuales**: Al seleccionar esta opción, se despliega una sección con:
    *   Logos de Nequi, Daviplata,Davivienda, Bancolombia, Nubank.
    *   Números de cuenta / celular.
    *   Códigos QR escaneables (opcional, mejora la UX).
    *   Instrucción clara: *"Realiza el pago por el valor total ($XXX) a una de estas cuentas y envía el comprobante."*
4.  **Reporte de Pago**:
    *   El usuario realiza la transferencia desde su celular.
    *   En el formulario de checkout, aparece un campo obligatorio: **"Número de Comprobante / Referencia"** o un botón para **"Subir Captura de Pantalla"** (esto último requiere manejo de archivos).
    *   *Opción Simplificada (MVP)*: Solo pedir el número de referencia o celular desde el que pagó y fecha/hora.
    *   *Opción Recomendada*: Integrar un botón de WhatsApp que diga "Enviar Comprobante por WhatsApp" con un mensaje pre-llenado con el ID del pedido.
5.  **Confirmación**: El usuario hace clic en "Finalizar Pedido".
6.  **Estado del Pedido**: El sistema crea la orden con estado **`PENDIENTE_VERIFICACION`** (o `ON_HOLD`).
7.  **Página de Gracias**: Muestra un mensaje: *"¡Gracias por tu compra! Hemos recibido tu pedido #12345. Por favor envía tu comprobante a nuestro WhatsApp 3003094854 si no lo has hecho, para proceder con el despacho."*

## 3. Flujo Administrativo (Admin)

1.  El administrador recibe una notificación de nuevo pedido (Email/Dashboard).
2.  El estado del pedido es "Pendiente de Verificación".
3.  El administrador revisa su App (Nequi/Daviplata) para confirmar la recepción del dinero.
4.  Si el dinero está, cambia el estado del pedido a **`PAGADO`** / **`EN_PROCESO`**.
5.  Si no está, contacta al cliente o cancela el pedido.

## 4. Cambios Técnicos Necesarios

### A. Frontend (`CheckoutPageContent.tsx`)
*   **Modificar Formulario**:
    *   Reemplazar los campos de Tarjeta de Crédito (falsos actualmente) por un selector de método de pago.
    *   Si selecciona "Tarjeta", mostrar mensaje de "Próximamente" o eliminarlo si Wompi no va.
    *   Si selecciona "Billeteras Digitales", mostrar la información de las cuentas (Acordeón o Tarjetas).
    *   Agregar campo de texto `paymentReference` (opcional o requerido según diseño).
    *   Agregar botón/enlace "Enviar Comprobante a WhatsApp".

### B. Backend / Base de Datos
*   **Modelo de Orden**: Asegurar que la tabla de órdenes tenga campos para:
    *   `payment_method`: 'DIGITAL_WALLET'
    *   `payment_status`: 'PENDING_VERIFICATION'
    *   `payment_reference`: (String, lo que el usuario escriba)
*   **Lógica de Creación**: El endpoint de crear orden no debe esperar confirmación de pasarela, simplemente guarda la orden y retorna éxito.

## 5. Ejemplo de UI (Mockup Mental)

```tsx
// Componente de Selección de Pago
<RadioGroup defaultValue="wallet">
  <div className="flex items-center space-x-2 border p-4 rounded">
    <RadioGroupItem value="wallet" id="wallet" />
    <Label htmlFor="wallet">Billeteras Digitales (Nequi, Daviplata, Bancolombia, Davivienda, Nubank)</Label>
  </div>
</RadioGroup>

{selectedMethod === 'wallet' && (
  <div className="mt-4 p-4 bg-gray-50 rounded border">
    <h3 className="font-bold mb-2">Instrucciones de Pago:</h3>
    <p>Transfiere el total de <strong>{formatCurrency(total)}</strong> a:</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
      <li><strong>Nequi / Daviplata:</strong> 300 309 4854</li>
      <li><strong>Bancolombia Ahorros:</strong> 81300000183</li>
      <li><strong>Davivienda:</strong> 017900109046</li>
      <li><strong>Nubank:</strong>94054911 </li>

    </ul>

    <div className="mt-4">
      <Label>Referencia de pago / Comprobante</Label>
      <Input placeholder="Escribe el código de aprobación o tu número" />
      <p className="text-xs text-gray-500 mt-1">
        O envíanos la captura al <a href="https://wa.me/573003094854" className="text-green-600 underline">WhatsApp</a>
      </p>
    </div>
  </div>
)}
```

## 6. Ventajas y Desventajas

*   **Ventajas**:
    *   Cero costo de comisión por transacción (vs 2.5% + $900 de pasarelas).
    *   Implementación inmediata (no requiere aprobación de Wompi).
    *   Muy familiar para usuarios colombianos.
*   **Desventajas**:
    *   Proceso manual (no escala bien si tienes 100 pedidos diarios).
    *   Fricción para el usuario (tiene que salir de la web, ir a su app, volver).
    *   Riesgo de error humano en la verificación.

## 7. Conclusión
Esta es la estrategia más viable a corto plazo ("Low Code / No Code" en cuanto a integraciones bancarias) para empezar a vender ya mismo sin depender de aprobaciones de terceros.
