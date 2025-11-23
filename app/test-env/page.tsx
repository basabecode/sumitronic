'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TestEnvPage() {
  const [status, setStatus] = useState('Checking...')
  const [envStatus, setEnvStatus] = useState<any>({})

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvStatus({
      url: url ? `Present (${url.substring(0, 10)}...)` : 'Missing',
      key: key ? `Present (${key.substring(0, 10)}...)` : 'Missing'
    })

    async function testConnection() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true })
        if (error) throw error
        setStatus('Connection Successful')
      } catch (err: any) {
        setStatus(`Connection Failed: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment & Connection Test</h1>
      <div className="space-y-2">
        <p><strong>URL:</strong> {envStatus.url}</p>
        <p><strong>Key:</strong> {envStatus.key}</p>
        <p><strong>Connection Status:</strong> {status}</p>
      </div>
    </div>
  )
}
