/**
 * Payment Validation Tests
 * Tests for payment validation and sanitization functions
 */

import { describe, test, expect } from 'vitest';

import {
  sanitizeString,
  sanitizePhone,
  validateEmail,
  validatePhone,
  validatePaymentReference,
  validateAmount,
  validateCheckoutForm,
  sanitizeCheckoutForm,
  formatCurrency,
  formatPhoneNumber,
  generateWhatsAppMessage,
  generateWhatsAppURL,
} from '../validation';
import { CheckoutFormData } from '../types';

describe('Payment Validation Tests', () => {
  describe('sanitizeString', () => {
    test('should remove dangerous characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
      expect(sanitizeString('Normal text')).toBe('Normal text');
      expect(sanitizeString('  Trimmed  ')).toBe('Trimmed');
    });

    test('should limit string length', () => {
      const longString = 'a'.repeat(1000);
      expect(sanitizeString(longString).length).toBe(500);
    });
  });

  describe('sanitizePhone', () => {
    test('should remove non-numeric characters', () => {
      expect(sanitizePhone('300-123-4567')).toBe('3001234567');
      expect(sanitizePhone('(300) 123 4567')).toBe('3001234567');
      expect(sanitizePhone('+57 300 123 4567')).toBe('5730012345');
    });

    test('should limit to 10 digits', () => {
      expect(sanitizePhone('12345678901234')).toBe('1234567890');
    });
  });

  describe('validateEmail', () => {
    test('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    test('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    test('should validate Colombian phone numbers', () => {
      expect(validatePhone('3001234567')).toBe(true);
      expect(validatePhone('3101234567')).toBe(true);
      expect(validatePhone('3201234567')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(validatePhone('2001234567')).toBe(false); // Doesn't start with 3
      expect(validatePhone('300123456')).toBe(false); // Too short
      expect(validatePhone('30012345678')).toBe(false); // Too long
      expect(validatePhone('abc1234567')).toBe(false); // Contains letters
    });
  });

  describe('validatePaymentReference', () => {
    test('should validate correct references', () => {
      expect(validatePaymentReference('12345')).toBe(true);
      expect(validatePaymentReference('ABC123XYZ')).toBe(true);
    });

    test('should reject invalid references', () => {
      expect(validatePaymentReference('')).toBe(false);
      expect(validatePaymentReference('   ')).toBe(false);
      expect(validatePaymentReference('123')).toBe(false); // Too short
      expect(validatePaymentReference('a'.repeat(100))).toBe(false); // Too long
    });
  });

  describe('validateAmount', () => {
    test('should validate correct amounts', () => {
      expect(validateAmount(1000)).toBe(true);
      expect(validateAmount(50000)).toBe(true);
      expect(validateAmount(1000000)).toBe(true);
    });

    test('should reject invalid amounts', () => {
      expect(validateAmount(0)).toBe(false);
      expect(validateAmount(500)).toBe(false); // Below minimum
      expect(validateAmount(-1000)).toBe(false);
      expect(validateAmount(NaN)).toBe(false);
    });
  });

  describe('validateCheckoutForm', () => {
    const validForm: CheckoutFormData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: '3001234567',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      zipCode: '110111',
      country: 'Colombia',
      paymentMethod: 'DIGITAL_WALLET',
      acceptTerms: true,
    };

    test('should validate a correct form', () => {
      const errors = validateCheckoutForm(validForm);
      expect(errors).toHaveLength(0);
    });

    test('should detect missing required fields', () => {
      const invalidForm = { ...validForm, firstName: '' };
      const errors = validateCheckoutForm(invalidForm);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.field === 'firstName')).toBe(true);
    });

    test('should detect invalid email', () => {
      const invalidForm = { ...validForm, email: 'invalid-email' };
      const errors = validateCheckoutForm(invalidForm);
      expect(errors.some(e => e.field === 'email')).toBe(true);
    });

    test('should detect invalid phone', () => {
      const invalidForm = { ...validForm, phone: '123456' };
      const errors = validateCheckoutForm(invalidForm);
      expect(errors.some(e => e.field === 'phone')).toBe(true);
    });

    test('should require terms acceptance', () => {
      const invalidForm = { ...validForm, acceptTerms: false };
      const errors = validateCheckoutForm(invalidForm);
      expect(errors.some(e => e.field === 'acceptTerms')).toBe(true);
    });
  });

  describe('sanitizeCheckoutForm', () => {
    test('should sanitize all form fields', () => {
      const dirtyForm: CheckoutFormData = {
        firstName: '  Juan  ',
        lastName: '  Pérez  ',
        email: '  JUAN@EXAMPLE.COM  ',
        phone: '(300) 123-4567',
        address: '  Calle 123  ',
        city: '  Bogotá  ',
        state: '  Cundinamarca  ',
        zipCode: '  110111  ',
        country: '  Colombia  ',
        paymentMethod: 'DIGITAL_WALLET',
        acceptTerms: true,
      };

      const cleaned = sanitizeCheckoutForm(dirtyForm);

      expect(cleaned.firstName).toBe('Juan');
      expect(cleaned.lastName).toBe('Pérez');
      expect(cleaned.email).toBe('juan@example.com');
      expect(cleaned.phone).toBe('3001234567');
      expect(cleaned.address).toBe('Calle 123');
    });
  });

  describe('formatCurrency', () => {
    test('should format currency correctly', () => {
      expect(formatCurrency(1000)).toContain('1.000');
      expect(formatCurrency(50000)).toContain('50.000');
      expect(formatCurrency(1000000)).toContain('1.000.000');
    });
  });

  describe('formatPhoneNumber', () => {
    test('should format phone numbers', () => {
      expect(formatPhoneNumber('3001234567')).toBe('300 123 4567');
    });

    test('should handle invalid phone numbers', () => {
      expect(formatPhoneNumber('123')).toBe('123');
    });
  });

  describe('generateWhatsAppMessage', () => {
    test('should generate correct WhatsApp message', () => {
      const message = generateWhatsAppMessage('ORD123', 50000);
      expect(message).toContain('ORD123');
      expect(message).toContain('50');
    });
  });

  describe('generateWhatsAppURL', () => {
    test('should generate correct WhatsApp URL', () => {
      const url = generateWhatsAppURL('ORD123', 50000, '573001234567');
      expect(url).toContain('wa.me/573001234567');
      expect(url).toContain('text=');
      expect(url).toContain('ORD123');
    });
  });
});

/**
 * Security Tests
 */
describe('Security Tests', () => {
  describe('XSS Prevention', () => {
    test('should prevent script injection in strings', () => {
      const malicious = '<script>alert("xss")</script>';
      const sanitized = sanitizeString(malicious);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
    });

    test('should prevent HTML injection', () => {
      const malicious = '<img src=x onerror=alert(1)>';
      const sanitized = sanitizeString(malicious);
      expect(sanitized).not.toContain('<img');
      expect(sanitized).not.toContain('onerror');
    });
  });

  describe('Input Length Limits', () => {
    test('should enforce maximum string length', () => {
      const veryLongString = 'a'.repeat(10000);
      const sanitized = sanitizeString(veryLongString);
      expect(sanitized.length).toBeLessThanOrEqual(500);
    });

    test('should enforce phone number length', () => {
      const longPhone = '1'.repeat(20);
      const sanitized = sanitizePhone(longPhone);
      expect(sanitized.length).toBeLessThanOrEqual(10);
    });
  });
});

/**
 * Integration Tests
 */
describe('Integration Tests', () => {
  test('complete checkout flow validation', () => {
    // Simulate user input
    const userInput: CheckoutFormData = {
      firstName: '  <script>Juan</script>  ',
      lastName: '  Pérez  ',
      email: '  JUAN@EXAMPLE.COM  ',
      phone: '(300) 123-4567',
      address: '  Calle 123 #45-67  ',
      city: '  Bogotá  ',
      state: '  Cundinamarca  ',
      country: '  Colombia  ',
      paymentMethod: 'DIGITAL_WALLET',
      paymentReference: {
        referenceNumber: '  REF123456  ',
        senderPhone: '(300) 123-4567',
        amount: 50000,
        selectedProvider: 'NEQUI',
        paymentDate: new Date(),
      },
      acceptTerms: true,
    };

    // Sanitize
    const sanitized = sanitizeCheckoutForm(userInput);

    // Validate
    const errors = validateCheckoutForm(sanitized);

    // Should have no errors after sanitization
    expect(errors).toHaveLength(0);

    // Should have cleaned data
    expect(sanitized.firstName).not.toContain('<script>');
    expect(sanitized.email).toBe('juan@example.com');
    expect(sanitized.phone).toBe('3001234567');
  });
});
