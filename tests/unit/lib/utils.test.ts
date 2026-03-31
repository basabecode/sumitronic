
import { describe, it, expect } from 'vitest'
import { cn, formatPrice } from '../../../lib/utils'

describe('lib/utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
    })

    it('should handle conditional classes', () => {
      const isTrue = true
      const isFalse = false
      expect(cn('base', isTrue && 'active', isFalse && 'inactive')).toBe(
        'base active'
      )
    })

    it('should merge tailwind classes properly', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2')
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })
  })

  describe('formatPrice', () => {
    it('should format price in COP by default', () => {
      const formatted = formatPrice(10000)
      expect(formatted).toContain('10.000')
    })

    it('should handle zero', () => {
      const formatted = formatPrice(0)
      expect(formatted).toContain('0')
    })

    it('should handle custom options', () => {
        const formatted = formatPrice(1000, { currency: 'USD', locale: 'en-US' })
        expect(formatted).toContain('1,000')
    })
  })
})
