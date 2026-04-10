import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const formatterCache = new Map<string, Intl.NumberFormat>()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type FormatPriceOptions = {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export function formatPrice(value: number, options: FormatPriceOptions = {}): string {
  const {
    locale = 'es-CO',
    currency = 'COP',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options

  const cacheKey = [locale, currency, minimumFractionDigits, maximumFractionDigits].join('-')

  let formatter = formatterCache.get(cacheKey)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    })
    formatterCache.set(cacheKey, formatter)
  }

  return formatter.format(value)
}
