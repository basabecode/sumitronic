'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type SyncState = 'idle' | 'loading' | 'success' | 'error'

export default function SyncProductsButton() {
  const [status, setStatus] = useState<SyncState>('idle')
  const [message, setMessage] = useState('Sincronizar catálogo desde Sheets')

  useEffect(() => {
    if (status !== 'success' && status !== 'error') {
      return
    }

    const timeout = window.setTimeout(() => {
      setStatus('idle')
      setMessage('Sincronizar catálogo desde Sheets')
    }, 4000)

    return () => window.clearTimeout(timeout)
  }, [status])

  const handleSync = async () => {
    try {
      setStatus('loading')
      setMessage('Sincronizando...')

      const response = await fetch('/api/sync-products', {
        method: 'POST',
        headers: {
          'x-sync-secret': process.env.NEXT_PUBLIC_SYNC_SECRET ?? '',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Error al sincronizar')
      }

      setStatus('success')
      setMessage(`Sincronizados ${data.synced} productos`)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al sincronizar'

      setStatus('error')
      setMessage(message)
    }
  }

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
      {message}
    </Button>
  )
}
