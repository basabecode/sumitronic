'use client'

import { useState } from 'react'

export default function SetupFavoritesPage() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  const setupFavorites = async () => {
    setStatus('loading')
    setMessage('Ejecutando esquema de favoritos...')

    try {
      const response = await fetch('/api/setup-favorites', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('¡Esquema de favoritos configurado exitosamente!')
      } else {
        setStatus('error')
        setMessage(`Error: ${data.error}`)
      }
    } catch (err) {
      setStatus('error')
      setMessage('Error de conexión. Verifica tu configuración.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Configurar Favoritos
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Instrucciones:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Ve al dashboard de Supabase</li>
            <li>Settings → API</li>
            <li>Copia la "service_role" key</li>
            <li>
              Agrega al archivo .env.local:
              SUPABASE_SERVICE_ROLE_KEY=tu_clave_aqui
            </li>
            <li>Haz clic en "Configurar Favoritos"</li>
          </ol>
        </div>

        <button
          onClick={setupFavorites}
          disabled={status === 'loading'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Configurando...' : 'Configurar Favoritos'}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md ${
              status === 'success'
                ? 'bg-green-100 text-green-800'
                : status === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
