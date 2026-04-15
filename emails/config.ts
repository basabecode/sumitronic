import { pixelBasedPreset } from '@react-email/components'

/**
 * Configuración Tailwind compartida para todos los templates de correo.
 * Paleta oficial SUMITRONIC — escudo naranja + cian sobre teal oscuro.
 */
export const emailTailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        // Cian — color primario de UI
        'sumi-brand': '#00A3BF',
        'sumi-strong': '#00728B',
        'sumi-soft': '#E0F6FA',
        'sumi-line': '#7DD3E8',
        // Teal — fondos oscuros (header / footer)
        'sumi-dark': '#003D52',
        'sumi-mid': '#005068',
        // Naranja — color del logo, CTAs principales
        'sumi-orange': '#F97316',
        'sumi-orange-l': '#FFF0E8',
        'sumi-orange-b': '#FDBA74',
        // Estado éxito — solo totales y confirmaciones
        'sumi-ok': '#28A745',
        'sumi-ok-bg': '#D1FAE5',
        'sumi-ok-br': '#6EE7B7',
      },
    },
  },
}
