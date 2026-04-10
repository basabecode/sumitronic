/**
 * Payment Module Index
 * Central export point for all payment-related functionality
 */

// Types
export type {
  PaymentMethod,
  PaymentStatus,
  DigitalWalletProvider,
  DigitalWalletAccount,
  PaymentReference,
  OrderPaymentInfo,
  PaymentVerificationRequest,
  CheckoutFormData,
  ValidationError,
  PaymentConfig,
} from './types'

// Constants
export {
  DIGITAL_WALLET_ACCOUNTS,
  WHATSAPP_NUMBER,
  WHATSAPP_NUMBER_DISPLAY,
  PAYMENT_CONFIG,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from './constants'

// Validation Utilities
export {
  sanitizeString,
  sanitizePhone,
  validateEmail,
  validatePhone,
  validatePaymentReference,
  validateAmount,
  validateCheckoutForm,
  sanitizeCheckoutForm,
  sanitizePaymentReference,
  formatCurrency,
  formatPhoneNumber,
  generateWhatsAppMessage,
  generateWhatsAppURL,
  validateFileUpload,
  hasValidationErrors,
  getFieldError,
} from './validation'
