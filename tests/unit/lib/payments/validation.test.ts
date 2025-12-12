
import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  sanitizeString,
  sanitizePhone,
  validateAmount,
  formatCurrency,
} from '../../../../lib/payments/validation'

describe('Payment Validation Utilities', () => {
  describe('sanitizeString', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe(
        'scriptalert(xss)/script'
      )
    })

    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello')
    })
  })

  describe('sanitizePhone', () => {
    it('should remove non-digits', () => {
      const res = sanitizePhone('+57 300 123 4567')
      console.log('SanitizePhone 1:', res)
      expect(res).toBe('5730012345')
    })

    it('should limit to 10 digits', () => {
        const res = sanitizePhone('300123456789')
        console.log('SanitizePhone 2:', res)
        expect(res).toBe('3001234567')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      const res = validateEmail('test@example.com')
      console.log('ValidateEmail 1:', res)
      expect(res).toBe(true)
    })

    it('should reject incorrect emails', () => {
      const res1 = validateEmail('invalid-email')
      const res2 = validateEmail('@example.com')
      console.log('ValidateEmail 2:', res1, res2)
      expect(res1).toBe(false)
      expect(res2).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate correct Colombian phones', () => {
        const phone = '3001234567'
        const isValid = validatePhone(phone)
        console.log('ValidatePhone:', isValid)
        expect(isValid).toBe(true)
    })
  })

  describe('validateAmount', () => {
    it('should validate positive amounts', () => {
      // Nota: El mínimo es 1000
      expect(validateAmount(2000)).toBe(true)
    })

    it('should reject negative amounts', () => {
      expect(validateAmount(-50)).toBe(false)
    })
  })

  describe('formatCurrency', () => {
      it('should format correctly', () => {
          const formatted = formatCurrency(50000)
          console.log('Validation Format Cur:', formatted)
          expect(formatted).toContain('50.000')
      })
  })
})
