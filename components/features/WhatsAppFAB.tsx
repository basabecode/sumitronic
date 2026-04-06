'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { brand } from '@/lib/brand'
import { cn } from '@/lib/utils'

/**
 * 📱 WhatsApp FAB - Mobile-First
 *
 * Floating Action Button optimizado para móvil con:
 * - Touch target de 56x56px (Material Design)
 * - Safe area para iOS
 * - Animaciones suaves
 * - Ripple effect
 * - Tooltip expandible
 */

export default function WhatsAppFAB() {
  const [isExpanded, setIsExpanded] = useState(false)
  const whatsappNumber = brand.whatsappNumber
  const defaultMessage = `Hola, estoy interesado en los productos de ${brand.name}`

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Floating Action Button */}
      <div
        className={cn(
          'fixed z-40 transition-all duration-300',
          // Posición con safe area
          'bottom-24 right-4 md:bottom-6 md:right-6',
          // Animación de entrada
          'animate-slide-in-up'
        )}
      >
        {/* Tooltip expandible */}
        {isExpanded && (
          <div
            className={cn(
              'absolute bottom-full right-0 mb-3',
              'bg-white rounded-2xl shadow-lg border border-gray-200',
              'px-4 py-3 max-w-[200px]',
              'animate-scale-in'
            )}
          >
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute -top-2 -right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Cerrar mensaje"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
            <p className="text-sm text-gray-700 font-medium mb-2">
              ¿Necesitas ayuda?
            </p>
            <p className="text-xs text-gray-500">
              Chatea con nosotros por WhatsApp
            </p>
          </div>
        )}

        {/* FAB Principal */}
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className={cn(
            // Tamaño y forma
            'w-14 h-14 rounded-full',
            // Colores WhatsApp
            'bg-green-500 hover:bg-green-600 active:bg-green-700',
            'text-white',
            // Sombra y elevación
            'shadow-lg hover:shadow-xl',
            // Transiciones
            'transition-all duration-200',
            // Touch optimization
            'touch-target-lg',
            // GPU acceleration
            'gpu-accelerated',
            // Efectos
            'ripple',
            // Interacciones
            'active:scale-95',
            // Accesibilidad
            'focus:outline-none focus:ring-4 focus:ring-green-300'
          )}
          aria-label="Contactar por WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-auto">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </button>

        {/* Pulse Animation Ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-green-500 opacity-75',
            'animate-ping',
            'pointer-events-none'
          )}
          style={{ animationDuration: '2s' }}
        />
      </div>
    </>
  )
}
