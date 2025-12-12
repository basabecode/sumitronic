import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  formatDate,
  formatPhoneNumber,
  truncateText,
  calculateDiscount,
  isValidEmail,
  isValidColombianPhone,
} from '@/lib/formatting'

describe('Formatting Utilities', () => {
  describe('formatPrice', () => {
    it('should format price in Colombian pesos', () => {
      const result = formatPrice(100000)
      expect(result).toContain('100')
      expect(result).toContain('000')
    })

    it('should handle zero', () => {
      const result = formatPrice(0)
      expect(result).toContain('0')
    })

    it('should handle large numbers', () => {
      const result = formatPrice(1000000)
      expect(result).toContain('1')
      expect(result).toContain('000')
    })
  })

  describe('formatDate', () => {
    it('should format date in Colombian format', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
    })

    it('should handle string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toContain('2024')
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format 10-digit phone number', () => {
      expect(formatPhoneNumber('3001234567')).toBe('(300) 123-4567')
    })

    it('should handle already formatted numbers', () => {
      const result = formatPhoneNumber('(300) 123-4567')
      expect(result).toBe('(300) 123-4567')
    })

    it('should return original if not 10 digits', () => {
      expect(formatPhoneNumber('123')).toBe('123')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated'
      expect(truncateText(text, 20)).toBe('This is a very long ...')
    })

    it('should not truncate short text', () => {
      const text = 'Short text'
      expect(truncateText(text, 20)).toBe('Short text')
    })

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars'
      expect(truncateText(text, 20)).toBe('Exactly twenty chars')
    })
  })

  describe('calculateDiscount', () => {
    it('should calculate discount percentage', () => {
      expect(calculateDiscount(100000, 80000)).toBe(20)
    })

    it('should handle no discount', () => {
      expect(calculateDiscount(100000, 100000)).toBe(0)
    })

    it('should handle zero original price', () => {
      expect(calculateDiscount(0, 50000)).toBe(0)
    })

    it('should round to nearest integer', () => {
      expect(calculateDiscount(100000, 66666)).toBe(33)
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isValidColombianPhone', () => {
    it('should validate Colombian mobile number', () => {
      expect(isValidColombianPhone('3001234567')).toBe(true)
    })

    it('should reject non-mobile numbers', () => {
      expect(isValidColombianPhone('6001234567')).toBe(false)
    })

    it('should reject wrong length', () => {
      expect(isValidColombianPhone('300123456')).toBe(false)
      expect(isValidColombianPhone('30012345678')).toBe(false)
    })

    it('should handle formatted numbers', () => {
      expect(isValidColombianPhone('(300) 123-4567')).toBe(true)
    })
  })
})
