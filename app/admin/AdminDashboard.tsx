'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Users } from 'lucide-react'

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading, profile } = useAuth()
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>({})
  const supabase = createClient()

  useEffect(() => {
    setDebugInfo({
      user: user?.email || 'No autenticado',
      profile: profile || 'Sin perfil',
      isAdmin,
      loading,
      userRole: profile?.role || 'Sin rol',
    })
    if (!loading) {
      setTimeout(() => {
        setIsLoadingData(false)
      }, 1000)
    }
  }, [loading, user, profile, isAdmin])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">
              Verificando autenticación...
            </h2>
            <p className="text-sm text-gray-500">
              Esto puede tomar unos segundos
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Validar acceso: usuario debe estar autenticado y tener rol 'admin'
  if (!user || !profile || profile.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 mb-4">
              Necesitas permisos de administrador para acceder a esta página.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-left">
              <h3 className="font-bold text-sm mb-2">Información de Debug:</h3>
              <div className="text-xs space-y-1">
                <p>
                  <strong>Email:</strong> {user?.email || 'No autenticado'}
                </p>
                <p>
                  <strong>Role en BD:</strong> {profile?.role || 'Sin rol'}
                </p>
                <p>
                  <strong>Perfil completo:</strong>{' '}
                  {JSON.stringify(profile, null, 2)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Volver al Inicio</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/login">Iniciar Sesión Nuevamente</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mostrar dashboard administrativo completo
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="text-gray-600">Bienvenido, {user.email}</p>
        </div>
        <Button asChild>
          <Link href="/" target="_blank">
            Ver Tienda
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gestión de Productos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                📦
              </div>
              Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Gestiona tu inventario de productos
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/products">Ver Inventario</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/products/add">Agregar Producto</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gestión de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Administra usuarios del sistema
            </p>
            <Button variant="outline" className="w-full" disabled>
              Próximamente
            </Button>
          </CardContent>
        </Card>

        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                ⚙️
              </div>
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Configuración general del sistema
            </p>
            <Button variant="outline" className="w-full" disabled>
              Próximamente
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
