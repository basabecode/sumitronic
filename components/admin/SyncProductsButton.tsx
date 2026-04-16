'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type SyncState = 'idle' | 'loading' | 'success' | 'error'

const STATIC_LABELS: Record<'idle' | 'loading', string> = {
  idle: 'Sincronizar catálogo desde Sheets',
  loading: 'Sincronizando...',
}

export default function SyncProductsButton() {
  const [status, setStatus] = useState<SyncState>('idle')
  const [detail, setDetail] = useState('')

  useEffect(() => {
    if (status !== 'success' && status !== 'error') return

    const timeout = window.setTimeout(() => {
      setStatus('idle')
      setDetail('')
    }, 4000)

    return () => window.clearTimeout(timeout)
  }, [status])

  const handleSync = async () => {
    try {
      setStatus('loading')

      const response = await fetch('/api/sync-products', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error ?? 'Error al sincronizar')

      setStatus('success')
      setDetail(`Sincronizados ${data.synced} productos`)
    } catch (error) {
      setStatus('error')
      setDetail(error instanceof Error ? error.message : 'Error al sincronizar')
    }
  }

  const label = status === 'idle' || status === 'loading' ? STATIC_LABELS[status] : detail

  return (
    <Button
      type="button"
      onClick={handleSync}
      disabled={status === 'loading'}
      className={
        status === 'success'
          ? 'bg-green-600 hover:bg-green-700'
          : status === 'error'
            ? 'bg-red-600 hover:bg-red-700'
            : ''
      }
    >
      {label}
    </Button>
  )
}
