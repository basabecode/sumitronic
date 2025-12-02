# 🚀 Guía Rápida - Sistema de Pagos

## ⚡ Inicio Rápido (5 minutos)

### 1. Verificar la Instalación

```bash
# Navegar al proyecto
cd CapiShop_Web

# Instalar dependencias (si es necesario)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 2. Probar el Sistema

1. Abrir navegador en `http://localhost:3000`
2. Agregar productos al carrito
3. Ir a checkout (`/checkout`)
4. Verificar que aparece "Billeteras Digitales"
5. Seleccionar método de pago
6. Ver las 5 billeteras disponibles
7. Probar botón "Copiar"
8. Verificar link de WhatsApp

---

## 🎯 Para Desarrolladores

### Importar el Módulo

```typescript
// Importar todo
import * from '@/lib/payments'

// O importar específico
import {
  validateEmail,
  sanitizePhone,
  formatCurrency,
  DIGITAL_WALLET_ACCOUNTS,
} from '@/lib/payments'
```

### Usar Componentes

```tsx
import { PaymentMethodSelector, DigitalWalletPayment } from '@/components/payments'

function MyCheckout() {
  const [method, setMethod] = useState<PaymentMethod>('DIGITAL_WALLET')
  const [reference, setReference] = useState<PaymentReference>()

  return (
    <>
      <PaymentMethodSelector
        selectedMethod={method}
        onMethodChange={setMethod}
      />

      {method === 'DIGITAL_WALLET' && (
        <DigitalWalletPayment
          totalAmount={50000}
          orderId="ORD123"
          onPaymentReferenceChange={setReference}
        />
      )}
    </>
  )
}
```

### Validar Datos

```typescript
import { validateCheckoutForm, sanitizeCheckoutForm } from '@/lib/payments'

// Validar
const errors = validateCheckoutForm(formData)
if (errors.length > 0) {
  console.error('Errores:', errors)
  return
}

// Sanitizar
const cleanData = sanitizeCheckoutForm(formData)
```

---

## 👨‍💼 Para Administradores

### Verificar un Pago

1. **Recibir Notificación**
   - Email o dashboard con nuevo pedido
   - Estado: "Pendiente de Verificación"

2. **Revisar App Bancaria**
   - Abrir Nequi/Daviplata/Bancolombia
   - Buscar transacción por monto y fecha
   - Verificar que coincida con el pedido

3. **Confirmar en Sistema**
   - Cambiar estado a "Pagado"
   - Agregar nota si es necesario
   - Proceder con despacho

### Cambiar Cuentas

Editar `lib/payments/constants.ts`:

```typescript
export const DIGITAL_WALLET_ACCOUNTS: DigitalWalletAccount[] = [
  {
    provider: 'NEQUI',
    accountNumber: '300 123 4567', // ← Cambiar aquí
    accountType: 'WALLET',
    accountHolder: 'Tu Nombre',
    displayName: 'Nequi',
    icon: '💜',
    instructions: 'Envía a este número desde tu app Nequi',
  },
  // ... más cuentas
]
```

### Cambiar WhatsApp

```typescript
export const WHATSAPP_NUMBER = '573001234567' // ← Cambiar aquí
export const WHATSAPP_NUMBER_DISPLAY = '300 123 4567'
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Solo tests de pagos
npm test lib/payments/__tests__/validation.test.ts

# Con cobertura
npm test -- --coverage
```

### Test Manual

```bash
# Ejecutar script de prueba
npx ts-node scripts/test-payments.ts
```

### Verificar Tipos

```bash
# Verificar TypeScript
npx tsc --noEmit
```

---

## 🔧 Configuración

### Habilitar/Deshabilitar Métodos

En `lib/payments/constants.ts`:

```typescript
export const PAYMENT_CONFIG: PaymentConfig = {
  enabledMethods: [
    'DIGITAL_WALLET',  // ← Habilitado
    // 'CREDIT_CARD',  // ← Deshabilitado
    // 'PSE',          // ← Deshabilitado
  ],
  // ...
}
```

### Cambiar Validaciones

En `lib/payments/constants.ts`:

```typescript
export const VALIDATION_RULES = {
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10,
    PATTERN: /^3\d{9}$/,  // ← Cambiar regex aquí
  },
  AMOUNT: {
    MIN: 1000,  // ← Cambiar monto mínimo
  },
}
```

---

## 🐛 Troubleshooting

### Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Type error"

```bash
# Limpiar cache de TypeScript
rm -rf .next
npm run dev
```

### Componente no se muestra

1. Verificar imports correctos
2. Revisar console del navegador
3. Verificar que el método esté habilitado

### WhatsApp no funciona

1. Verificar formato del número (573001234567)
2. Probar link manualmente
3. Revisar función `generateWhatsAppURL()`

---

## 📝 Checklist de Producción

Antes de desplegar:

- [ ] Actualizar números de cuenta reales
- [ ] Actualizar WhatsApp real
- [ ] Probar en mobile
- [ ] Probar en diferentes navegadores
- [ ] Verificar que emails de notificación funcionan
- [ ] Documentar proceso para el equipo
- [ ] Capacitar al equipo de soporte
- [ ] Preparar respuestas FAQ para clientes

---

## 🆘 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build de producción
npm run start           # Servidor de producción

# Testing
npm test                # Ejecutar tests
npm run test:watch      # Tests en modo watch
npm run test:coverage   # Tests con cobertura

# Linting
npm run lint            # Verificar código
npm run lint:fix        # Arreglar automáticamente

# TypeScript
npx tsc --noEmit        # Verificar tipos
```

---

## 📚 Recursos

### Documentación
- **README principal**: `lib/payments/README.md`
- **Implementación técnica**: `docs/PAYMENT_IMPLEMENTATION.md`
- **Estructura**: `docs/PAYMENT_STRUCTURE.md`
- **Resumen**: `docs/PAYMENT_SUMMARY.md`

### Código
- **Tipos**: `lib/payments/types.ts`
- **Constantes**: `lib/payments/constants.ts`
- **Validación**: `lib/payments/validation.ts`
- **Componentes**: `components/payments/`

### Tests
- **Suite completa**: `lib/payments/__tests__/validation.test.ts`
- **Test manual**: `scripts/test-payments.ts`

---

## 💡 Tips y Trucos

### Desarrollo

1. **Hot Reload**: Los cambios se reflejan automáticamente
2. **Console Logs**: Usa para debug durante desarrollo
3. **React DevTools**: Instalar para inspeccionar componentes
4. **TypeScript**: Confía en los errores de tipo

### Producción

1. **Monitorear**: Revisar pagos pendientes regularmente
2. **Comunicar**: Mantener al cliente informado
3. **Documentar**: Casos especiales o problemas
4. **Optimizar**: Buscar patrones para mejorar

### Seguridad

1. **Nunca** commitear datos sensibles
2. **Siempre** sanitizar inputs del usuario
3. **Validar** en cliente Y servidor
4. **Revisar** logs de errores regularmente

---

## 🎓 Mejores Prácticas

### Al Modificar el Código

1. ✅ Actualizar tests si cambias lógica
2. ✅ Actualizar documentación si cambias API
3. ✅ Probar en mobile si cambias UI
4. ✅ Verificar TypeScript antes de commit
5. ✅ Hacer commits descriptivos

### Al Agregar Funcionalidad

1. ✅ Seguir estructura existente
2. ✅ Agregar tipos TypeScript
3. ✅ Escribir tests
4. ✅ Documentar en README
5. ✅ Considerar seguridad

### Al Reportar Bugs

1. ✅ Describir pasos para reproducir
2. ✅ Incluir screenshots si es UI
3. ✅ Mencionar navegador/dispositivo
4. ✅ Incluir mensajes de error
5. ✅ Sugerir solución si es posible

---

## 📞 Contacto

**Preguntas Frecuentes**: Ver documentación
**Bugs**: Crear issue con detalles
**Mejoras**: Sugerir en roadmap

---

**¡Listo para empezar! 🚀**

*Última actualización: 2025-12-01*
