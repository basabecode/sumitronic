/**
 * Payment Constants and Configuration
 * Security: These are public-facing constants. Never store sensitive data here.
 */

import { DigitalWalletAccount, PaymentConfig } from './types';

/**
 * Digital Wallet Accounts Configuration
 * Note: These are the accounts where customers will send payments
 */
export const DIGITAL_WALLET_ACCOUNTS: DigitalWalletAccount[] = [
  {
    provider: 'NEQUI',
    accountNumber: '300 309 4854',
    accountType: 'WALLET',
    accountHolder: 'CapiShop',
    displayName: 'Nequi',
    icon: '/bancos/nequi_1.png',
    instructions: 'Envía a este número desde tu app Nequi',
  },
  {
    provider: 'DAVIPLATA',
    accountNumber: '300 309 4854',
    accountType: 'WALLET',
    accountHolder: 'CapiShop',
    displayName: 'Daviplata',
    icon: '/bancos/daviplata_1.png',
    instructions: 'Envía a este número desde tu app Daviplata',
  },
  {
    provider: 'BANCOLOMBIA',
    accountNumber: '81300000183',
    accountType: 'SAVINGS',
    accountHolder: 'CapiShop',
    displayName: 'Bancolombia Ahorros',
    icon: '/bancos/bancolombia_3.png',
    instructions: 'Transferencia a cuenta de ahorros',
  },
  {
    provider: 'DAVIVIENDA',
    accountNumber: '017900109046',
    accountType: 'SAVINGS',
    accountHolder: 'CapiShop',
    displayName: 'Davivienda',
    icon: '/bancos/davivienda_1.png',
    instructions: 'Transferencia a cuenta de ahorros',
  },
  {
    provider: 'NUBANK',
    accountNumber: '94054911',
    accountType: 'SAVINGS',
    accountHolder: 'CapiShop',
    displayName: 'Nubank',
    icon: '/bancos/nubank_1.png',
    instructions: 'Transferencia a cuenta Nubank',
  },
];

/**
 * WhatsApp Contact for Payment Verification
 */
export const WHATSAPP_NUMBER = '573003094854';
export const WHATSAPP_NUMBER_DISPLAY = '300 309 4854';

/**
 * Payment Configuration
 */
export const PAYMENT_CONFIG: PaymentConfig = {
  enabledMethods: ['DIGITAL_WALLET'],
  digitalWalletAccounts: DIGITAL_WALLET_ACCOUNTS,
  whatsappNumber: WHATSAPP_NUMBER,
  requirePaymentReference: false, // Made optional for better UX
  allowScreenshotUpload: false, // Disabled for MVP, use WhatsApp instead
};

/**
 * Payment Status Display Names
 */
export const PAYMENT_STATUS_LABELS = {
  PENDING_VERIFICATION: 'Pendiente de Verificación',
  VERIFIED: 'Verificado',
  PAID: 'Pagado',
  PROCESSING: 'En Proceso',
  CANCELLED: 'Cancelado',
  FAILED: 'Fallido',
} as const;

/**
 * Payment Method Display Names
 */
export const PAYMENT_METHOD_LABELS = {
  DIGITAL_WALLET: 'Billeteras Digitales / Transferencia',
  CREDIT_CARD: 'Tarjeta de Crédito',
  PSE: 'PSE',
} as const;

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10,
    PATTERN: /^3\d{9}$/,
    MESSAGE: 'Ingresa un número de celular válido (10 dígitos, comenzando con 3)',
  },
  REFERENCE_NUMBER: {
    MIN_LENGTH: 4,
    MAX_LENGTH: 50,
    MESSAGE: 'Ingresa un número de referencia válido',
  },
  AMOUNT: {
    MIN: 1000, // Minimum 1,000 COP
    MESSAGE: 'El monto mínimo es $1,000 COP',
  },
} as const;

/**
 * Security: Input Sanitization Patterns
 * Use these to prevent XSS and injection attacks
 */
export const SANITIZATION_PATTERNS = {
  ALPHANUMERIC: /^[a-zA-Z0-9\s\-\_]+$/,
  NUMERIC: /^[0-9]+$/,
  PHONE: /^[0-9\s\+\-\(\)]+$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Ingresa un email válido',
  INVALID_PHONE: 'Ingresa un número de teléfono válido',
  INVALID_AMOUNT: 'El monto ingresado no es válido',
  TERMS_NOT_ACCEPTED: 'Debes aceptar los términos y condiciones',
  PAYMENT_REFERENCE_REQUIRED: 'Ingresa la referencia de pago o envíala por WhatsApp',
  GENERIC_ERROR: 'Ocurrió un error. Por favor intenta nuevamente.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: '¡Pedido creado exitosamente!',
  PAYMENT_VERIFIED: 'Pago verificado correctamente',
  PAYMENT_SUBMITTED: 'Información de pago recibida',
} as const;
