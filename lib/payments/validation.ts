/**
 * Payment Validation Utilities
 * Security: All validations should be performed both client-side and server-side
 */

import {
  CheckoutFormData,
  PaymentReference,
  ValidationError,
} from './types';
import {
  VALIDATION_RULES,
  SANITIZATION_PATTERNS,
  ERROR_MESSAGES,
} from './constants';

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/on\w+\s*=\s*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .substring(0, 500); // Limit length
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, '').substring(0, 10);
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  return SANITIZATION_PATTERNS.EMAIL.test(email);
}

/**
 * Validate Colombian phone number
 */
export function validatePhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length !== 10) {
    return false;
  }

  const cleaned = sanitizePhone(phone);
  return VALIDATION_RULES.PHONE.PATTERN.test(cleaned);
}

/**
 * Validate payment reference
 */
export function validatePaymentReference(reference: string): boolean {
  if (!reference || reference.trim().length === 0) {
    return false;
  }

  const length = reference.trim().length;
  return (
    length >= VALIDATION_RULES.REFERENCE_NUMBER.MIN_LENGTH &&
    length <= VALIDATION_RULES.REFERENCE_NUMBER.MAX_LENGTH
  );
}

/**
 * Validate amount
 */
export function validateAmount(amount: number): boolean {
  return amount >= VALIDATION_RULES.AMOUNT.MIN && !isNaN(amount);
}

/**
 * Validate checkout form
 */
export function validateCheckoutForm(
  form: CheckoutFormData
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Personal Information
  if (!form.firstName || form.firstName.trim().length === 0) {
    errors.push({ field: 'firstName', message: ERROR_MESSAGES.REQUIRED_FIELD });
  }

  if (!form.lastName || form.lastName.trim().length === 0) {
    errors.push({ field: 'lastName', message: ERROR_MESSAGES.REQUIRED_FIELD });
  }

  if (!form.email || !validateEmail(form.email)) {
    errors.push({ field: 'email', message: ERROR_MESSAGES.INVALID_EMAIL });
  }

  if (!form.phone || !validatePhone(form.phone)) {
    errors.push({ field: 'phone', message: ERROR_MESSAGES.INVALID_PHONE });
  }

  // Shipping Address
  if (!form.address || form.address.trim().length === 0) {
    errors.push({ field: 'address', message: ERROR_MESSAGES.REQUIRED_FIELD });
  }

  if (!form.city || form.city.trim().length === 0) {
    errors.push({ field: 'city', message: ERROR_MESSAGES.REQUIRED_FIELD });
  }

  if (!form.state || form.state.trim().length === 0) {
    errors.push({ field: 'state', message: ERROR_MESSAGES.REQUIRED_FIELD });
  }

  // Terms acceptance
  if (!form.acceptTerms) {
    errors.push({
      field: 'acceptTerms',
      message: ERROR_MESSAGES.TERMS_NOT_ACCEPTED,
    });
  }

  // Payment Reference (optional but recommended)
  if (
    form.paymentMethod === 'DIGITAL_WALLET' &&
    form.paymentReference?.referenceNumber
  ) {
    if (!validatePaymentReference(form.paymentReference.referenceNumber)) {
      errors.push({
        field: 'paymentReference',
        message: VALIDATION_RULES.REFERENCE_NUMBER.MESSAGE,
      });
    }
  }

  return errors;
}

/**
 * Sanitize checkout form data
 * Security: Always sanitize user input before processing
 */
export function sanitizeCheckoutForm(
  form: CheckoutFormData
): CheckoutFormData {
  return {
    firstName: sanitizeString(form.firstName),
    lastName: sanitizeString(form.lastName),
    email: sanitizeString(form.email.toLowerCase()),
    phone: sanitizePhone(form.phone),
    address: sanitizeString(form.address),
    city: sanitizeString(form.city),
    state: sanitizeString(form.state),
    zipCode: form.zipCode ? sanitizeString(form.zipCode) : undefined,
    country: sanitizeString(form.country),
    paymentMethod: form.paymentMethod,
    paymentReference: form.paymentReference
      ? sanitizePaymentReference(form.paymentReference)
      : undefined,
    saveInfo: form.saveInfo,
    acceptTerms: form.acceptTerms,
    newsletter: form.newsletter,
  };
}

/**
 * Sanitize payment reference
 */
export function sanitizePaymentReference(
  reference: PaymentReference
): PaymentReference {
  return {
    referenceNumber: reference.referenceNumber
      ? sanitizeString(reference.referenceNumber)
      : undefined,
    senderPhone: reference.senderPhone
      ? sanitizePhone(reference.senderPhone)
      : undefined,
    paymentDate: reference.paymentDate,
    paymentTime: reference.paymentTime
      ? sanitizeString(reference.paymentTime)
      : undefined,
    amount: reference.amount,
    selectedProvider: reference.selectedProvider,
    // Note: File upload is handled separately with proper validation
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = sanitizePhone(phone);
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Generate WhatsApp message for payment verification
 */
export function generateWhatsAppMessage(
  orderId: string,
  totalAmount: number
): string {
  const message = `Hola! Acabo de realizar un pedido #${orderId} por ${formatCurrency(totalAmount)}. Adjunto el comprobante de pago.`;
  return encodeURIComponent(message);
}

/**
 * Generate WhatsApp URL
 */
export function generateWhatsAppURL(
  orderId: string,
  totalAmount: number,
  whatsappNumber: string
): string {
  const message = generateWhatsAppMessage(orderId, totalAmount);
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}

/**
 * Validate file upload (for future screenshot feature)
 * Security: Validate file type and size
 */
export function validateFileUpload(file: File): ValidationError | null {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      field: 'screenshot',
      message: 'Solo se permiten imágenes (JPG, PNG, WEBP)',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      field: 'screenshot',
      message: 'El archivo no debe superar 5MB',
    };
  }

  return null;
}

/**
 * Check if form has errors
 */
export function hasValidationErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}

/**
 * Get error message for field
 */
export function getFieldError(
  errors: ValidationError[],
  field: string
): string | undefined {
  return errors.find(error => error.field === field)?.message;
}
