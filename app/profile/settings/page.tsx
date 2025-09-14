'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Trash2, Download, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    orderUpdates: true,
    promotions: false,
    newsletter: false,
  })
  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    shareData: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { user, signOut } = useAuth()

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsLoading(true)
    setMessage('')

    // Simular guardado de configuraciones
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Configuraciones guardadas exitosamente')
    } catch {
      setMessage('Error al guardar las configuraciones')
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async () => {
    // Simular exportación de datos
    const userData = {
      email: user?.email,
      profile: 'Datos del perfil...',
      orders: 'Historial de pedidos...',
      preferences: { notifications, privacy },
    }

    const blob = new Blob([JSON.stringify(userData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deleteAccount = async () => {
    if (
      window.confirm(
        '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
      )
    ) {
      // Aquí iría la lógica para eliminar la cuenta
      alert('Funcionalidad de eliminación de cuenta pendiente de implementar')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-2 text-gray-600">
          Gestiona tus preferencias y configuraciones de cuenta
        </p>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>
            Configura cómo y cuándo quieres recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificaciones por email</Label>
              <p className="text-sm text-gray-500">
                Recibe notificaciones importantes por correo electrónico
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={value =>
                handleNotificationChange('email', value)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Actualizaciones de pedidos</Label>
              <p className="text-sm text-gray-500">
                Notificaciones sobre el estado de tus pedidos
              </p>
            </div>
            <Switch
              checked={notifications.orderUpdates}
              onCheckedChange={value =>
                handleNotificationChange('orderUpdates', value)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Promociones y ofertas</Label>
              <p className="text-sm text-gray-500">
                Recibe notificaciones sobre descuentos y ofertas especiales
              </p>
            </div>
            <Switch
              checked={notifications.promotions}
              onCheckedChange={value =>
                handleNotificationChange('promotions', value)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Newsletter</Label>
              <p className="text-sm text-gray-500">
                Recibe nuestro boletín semanal con novedades
              </p>
            </div>
            <Switch
              checked={notifications.newsletter}
              onCheckedChange={value =>
                handleNotificationChange('newsletter', value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacidad */}
      <Card>
        <CardHeader>
          <CardTitle>Privacidad</CardTitle>
          <CardDescription>
            Controla la visibilidad de tu información
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Perfil público</Label>
              <p className="text-sm text-gray-500">
                Permite que otros usuarios vean tu perfil básico
              </p>
            </div>
            <Switch
              checked={privacy.profilePublic}
              onCheckedChange={value =>
                handlePrivacyChange('profilePublic', value)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compartir datos de uso</Label>
              <p className="text-sm text-gray-500">
                Ayúdanos a mejorar compartiendo datos de uso anónimos
              </p>
            </div>
            <Switch
              checked={privacy.shareData}
              onCheckedChange={value => handlePrivacyChange('shareData', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Datos y Privacidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Datos y Privacidad
          </CardTitle>
          <CardDescription>
            Gestiona tus datos personales y privacidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Exportar mis datos</p>
              <p className="text-sm text-gray-500">
                Descarga una copia de todos tus datos
              </p>
            </div>
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-600">Eliminar cuenta</p>
              <p className="text-sm text-gray-500">
                Elimina permanentemente tu cuenta y todos los datos
              </p>
            </div>
            <Button variant="destructive" onClick={deleteAccount}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guardar cambios */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
