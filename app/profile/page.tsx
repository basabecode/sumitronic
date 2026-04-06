'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, MapPin, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'

const profileSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
})

const addressSchema = z.object({
  street: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad es requerida'),
  department: z.string().min(2, 'El departamento es requerido'),
  postal_code: z
    .string()
    .min(5, 'El código postal debe tener al menos 5 dígitos'),
  neighborhood: z.string().optional(),
  additional_info: z.string().optional(),
  is_default: z.boolean().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>
type AddressForm = z.infer<typeof addressSchema>

// Departamentos de Colombia
const colombianDepartments = [
  'Amazonas',
  'Antioquia',
  'Arauca',
  'Atlántico',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Caquetá',
  'Casanare',
  'Cauca',
  'Cesar',
  'Chocó',
  'Córdoba',
  'Cundinamarca',
  'Guainía',
  'Guaviare',
  'Huila',
  'La Guajira',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Putumayo',
  'Quindío',
  'Risaralda',
  'San Andrés y Providencia',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
  'Vaupés',
  'Vichada',
]

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [addresses, setAddresses] = useState<AddressForm[]>([])
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [editingAddress, setEditingAddress] = useState<number | null>(null)

  const { user, profile, updateProfile } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    },
  })

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: addressErrors },
    reset: resetAddress,
    setValue: setAddressValue,
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  })

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await updateProfile(data)

      if (error) {
        setError('Error al actualizar el perfil')
      } else {
        setSuccess('Perfil actualizado exitosamente')
      }
    } catch (err) {
      setError('Error inesperado. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar direcciones del perfil
  useEffect(() => {
    if (profile?.address) {
      try {
        // Asegurarse de que sea un array
        const savedAddresses = Array.isArray(profile.address)
          ? profile.address
          : [profile.address]
        setAddresses(savedAddresses as AddressForm[])
      } catch (err) {
        console.error('Error al cargar direcciones:', err)
      }
    }
  }, [profile])

  const onSubmitAddress = async (data: AddressForm) => {
    let updatedAddresses: AddressForm[]

    if (editingAddress !== null) {
      // Editar dirección existente
      updatedAddresses = [...addresses]
      updatedAddresses[editingAddress] = data
    } else {
      // Agregar nueva dirección
      updatedAddresses = [...addresses, data]
    }

    setAddresses(updatedAddresses)

    // Guardar en base de datos
    try {
      await updateProfile({
        address: updatedAddresses as unknown as any // Casting para satisfacer tipo Json
      })
    } catch (err) {
      console.error('Error al guardar direcciones:', err)
      // Revertir cambios locales en caso de error si es crítico
      // Por ahora solo logueamos
    }

    setShowAddressDialog(false)
    setEditingAddress(null)
    resetAddress()
  }

  const handleEditAddress = (index: number) => {
    const address = addresses[index]
    setEditingAddress(index)
    Object.keys(address).forEach(key => {
      setAddressValue(
        key as keyof AddressForm,
        address[key as keyof AddressForm]
      )
    })
    setShowAddressDialog(true)
  }

  const handleDeleteAddress = async (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index)
    setAddresses(updatedAddresses)

    // Guardar en base de datos
    try {
      await updateProfile({
        address: updatedAddresses as unknown as any
      })
    } catch (err) {
      console.error('Error al eliminar dirección:', err)
    }
  }

  const handleAddNewAddress = () => {
    setEditingAddress(null)
    resetAddress()
    setShowAddressDialog(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="mt-2 text-gray-600">
          Gestiona tu información personal y direcciones de envío
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Información de Perfil</CardTitle>
              <CardDescription>Tu información básica</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-lg">
                    {profile?.full_name?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase() ||
                      'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {profile?.full_name || 'Usuario'}
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="mt-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      profile?.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {profile?.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>
                Actualiza tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nombre completo</Label>
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="Ej: Carlos García"
                      {...register('full_name')}
                      disabled={isLoading}
                    />
                    {errors.full_name && (
                      <p className="text-sm text-red-600">
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+57 300 123 4567"
                      {...register('phone')}
                      disabled={isLoading}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500">
                    El email no se puede cambiar
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Addresses Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Direcciones de Envío
              </CardTitle>
              <CardDescription>
                Gestiona tus direcciones para el envío de productos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No tienes direcciones de envío registradas</p>
                    <p className="text-sm">
                      Agrega una dirección para realizar pedidos
                    </p>
                  </div>
                ) : (
                  addresses.map((address, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{address.street}</h4>
                          <p className="text-sm text-gray-600">
                            {address.neighborhood &&
                              `${address.neighborhood}, `}
                            {address.city}, {address.department}
                          </p>
                          <p className="text-sm text-gray-600">
                            Código postal: {address.postal_code}
                          </p>
                          {address.additional_info && (
                            <p className="text-sm text-gray-500">
                              {address.additional_info}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAddress(index)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAddress(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <Button onClick={handleAddNewAddress} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Nueva Dirección
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress !== null ? 'Editar Dirección' : 'Nueva Dirección'}
            </DialogTitle>
            <DialogDescription>
              Completa los datos de tu dirección de envío en Colombia
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmitAddress(onSubmitAddress)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="street">Dirección *</Label>
              <Input
                id="street"
                placeholder="Calle 123 # 45-67"
                {...registerAddress('street')}
              />
              {addressErrors.street && (
                <p className="text-sm text-red-600">
                  {addressErrors.street.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  placeholder="Bogotá"
                  {...registerAddress('city')}
                />
                {addressErrors.city && (
                  <p className="text-sm text-red-600">
                    {addressErrors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento *</Label>
                <Select
                  onValueChange={value => setAddressValue('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {colombianDepartments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {addressErrors.department && (
                  <p className="text-sm text-red-600">
                    {addressErrors.department.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">Código Postal *</Label>
                <Input
                  id="postal_code"
                  placeholder="110111"
                  {...registerAddress('postal_code')}
                />
                {addressErrors.postal_code && (
                  <p className="text-sm text-red-600">
                    {addressErrors.postal_code.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Barrio</Label>
                <Input
                  id="neighborhood"
                  placeholder="Chapinero"
                  {...registerAddress('neighborhood')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_info">Información Adicional</Label>
              <Textarea
                id="additional_info"
                placeholder="Torre 2, Apto 301, Junto al parque..."
                rows={3}
                {...registerAddress('additional_info')}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddressDialog(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingAddress !== null ? 'Actualizar' : 'Agregar'} Dirección
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
