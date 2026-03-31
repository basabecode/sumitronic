'use client'

import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
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
  const whatsappNumber = '573003094854'
  const defaultMessage = '¡Hola! Estoy interesado en los productos de CapiShop'

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
          'bottom-24 left-4 md:bottom-6 md:left-6',
          // Animación de entrada
          'animate-slide-in-up'
        )}
      >
        {/* Tooltip expandible */}
        {isExpanded && (
          <div
            className={cn(
              'absolute bottom-full left-0 mb-3',
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
          <MessageCircle className="w-6 h-6 mx-auto" />
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
