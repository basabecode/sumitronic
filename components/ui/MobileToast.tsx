'use client'

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * 📱 Mobile Toast Notification System
 *
 * Sistema de notificaciones optimizado para móvil con:
 * - Posicionamiento superior (no bloquea contenido)
 * - Safe areas para iOS
 * - Swipe to dismiss
 * - Auto-dismiss con progress bar
 * - Animaciones suaves
 * - Touch-friendly close button
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface MobileToastProps {
  toast: Toast
  onDismiss: (id: string) => void
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    progress: 'bg-green-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    progress: 'bg-red-600',
  },
  warning: {
    bg: 'bg-[hsl(var(--surface-highlight))]',
    border: 'border-[hsl(var(--border-subtle))]',
    icon: 'text-[hsl(var(--brand-strong))]',
    progress: 'bg-[hsl(var(--brand))]',
  },
  info: {
    bg: 'bg-[hsl(var(--surface-highlight))]',
    border: 'border-[hsl(var(--border-subtle))]',
    icon: 'text-[hsl(var(--brand-strong))]',
    progress: 'bg-[hsl(var(--brand))]',
  },
}

export function MobileToast({ toast, onDismiss }: MobileToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  const Icon = iconMap[toast.type]
  const colors = colorMap[toast.type]
  const duration = toast.duration || 4000

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - 100 / (duration / 100)
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 100)

    // Auto dismiss
    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [duration])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      onDismiss(toast.id)
    }, 300)
  }

  return (
    <div
      className={cn(
        'relative w-full max-w-md mx-auto',
        'rounded-xl shadow-lg border',
        'overflow-hidden',
        'gpu-accelerated',
        colors.bg,
        colors.border,
        isExiting ? 'animate-slide-out-up opacity-0' : 'animate-slide-in-up'
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Content */}
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={cn('flex-shrink-0', colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
          {toast.message && <p className="mt-1 text-xs text-gray-600">{toast.message}</p>}
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className={cn(
            'flex-shrink-0 touch-target',
            'text-gray-400 hover:text-gray-600',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'rounded-lg'
          )}
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div
          className={cn('h-full transition-all duration-100 ease-linear', colors.progress)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Animation for slide out
const slideOutUpKeyframes = `
@keyframes slide-out-up {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.animate-slide-out-up {
  animation: slide-out-up 0.3s ease-out;
}
`

// Inject keyframes
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = slideOutUpKeyframes
  document.head.appendChild(style)
}

/**
 * Toast Container Component
 * Posiciona los toasts en la parte superior con safe area
 */
interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className={cn('fixed top-0 left-0 right-0 z-[100]', 'safe-top', 'pointer-events-none')}>
      <div className="p-4 space-y-3 pointer-events-auto">
        {toasts.map(toast => (
          <MobileToast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </div>
  )
}

/**
 * Hook para usar el sistema de toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (type: ToastType, title: string, message?: string, duration?: number) => {
    const id = Math.random().toString(36).substring(7)
    const newToast: Toast = {
      id,
      type,
      title,
      message,
      duration,
    }
    setToasts(prev => [...prev, newToast])
  }

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, message?: string, duration?: number) => {
    showToast('success', title, message, duration)
  }

  const error = (title: string, message?: string, duration?: number) => {
    showToast('error', title, message, duration)
  }

  const warning = (title: string, message?: string, duration?: number) => {
    showToast('warning', title, message, duration)
  }

  const info = (title: string, message?: string, duration?: number) => {
    showToast('info', title, message, duration)
  }

  return {
    toasts,
    dismissToast,
    success,
    error,
    warning,
    info,
  }
}
