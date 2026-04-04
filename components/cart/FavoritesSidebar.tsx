'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  X,
  Heart,
  ShoppingCart,
  Trash2,
  Package,
  SortAsc,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useCart } from '@/contexts/CartContext'

type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'

export default function FavoritesSidebar() {
  const { state, removeItem, closeFavorites, clearFavorites } = useFavorites()
  const { addItem, openCart, formatCurrency } = useCart()
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')

  // Ordenar favoritos
  const sortedItems = useMemo(() => {
    const items = [...state.items]
    items.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'date-asc':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
        case 'date-desc':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        default:
          return 0
      }
    })
    return items
  }, [state.items, sortBy])

  const handleAddToCart = (favorite: any) => {
    const image = favorite.image_url || favorite.image || '/placeholder.svg'
    addItem({
      id: favorite.id,
      name: favorite.name,
      price: favorite.price,
      image,
      image_url: image,
      brand: favorite.brand,
      stock: favorite.stock || 999,
      stockCount: favorite.stock || 999,
    })
    // Cerrar favoritos y abrir carrito
    closeFavorites()
    openCart()
  }

  const handleRemoveFavorite = (id: string) => {
    removeItem(id)
  }

  const handleClearAll = () => {
    if (
      window.confirm(
        '¿Estás seguro de que quieres eliminar todos los favoritos?'
      )
    ) {
      clearFavorites()
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={closeFavorites}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="space-y-2.5 pr-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-600 fill-red-600" />
                <span>Mis Favoritos</span>
              </div>
            </SheetTitle>
            <Badge variant="secondary" className="ml-auto">
              {state.items.length}{' '}
              {state.items.length === 1 ? 'producto' : 'productos'}
            </Badge>
          </div>

          {/* Ordenamiento */}
          {state.items.length > 0 && (
            <div className="flex items-center space-x-2">
              <SortAsc className="w-4 h-4 text-gray-500" />
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Más recientes</SelectItem>
                  <SelectItem value="date-asc">Más antiguos</SelectItem>
                  <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                  <SelectItem value="name-desc">Nombre Z-A</SelectItem>
                  <SelectItem value="price-asc">Precio menor</SelectItem>
                  <SelectItem value="price-desc">Precio mayor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </SheetHeader>

        <Separator className="my-4" />

        <div className="flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  No tienes favoritos
                </h3>
                <p className="text-gray-500 max-w-sm text-sm">
                  Explora nuestros productos y guarda los que más te gusten
                  para una futura compra
                </p>
              </div>
              <Button
                onClick={closeFavorites}
                className="bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand-strong))]"
              >
                Explorar Productos
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedItems.map(favorite => {
                const image =
                  favorite.image_url || favorite.image || '/placeholder.svg'
                return (
                  <div
                    key={favorite.id}
                    className="flex space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Imagen del producto */}
                    <Link
                      href={`/products/${favorite.id}`}
                      onClick={closeFavorites}
                      className="flex-shrink-0"
                    >
                      <div className="relative w-20 h-20 bg-white rounded-md border overflow-hidden">
                        <Image
                          src={image}
                          alt={favorite.name}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      </div>
                    </Link>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1 min-w-0 pr-2">
                          <Link
                            href={`/products/${favorite.id}`}
                            onClick={closeFavorites}
                          >
                            <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors hover:text-[hsl(var(--brand-strong))]">
                              {favorite.name}
                            </h4>
                          </Link>
                          {favorite.brand && (
                            <p className="mt-0.5 text-xs font-medium text-[hsl(var(--brand-strong))]">
                              {favorite.brand}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFavorite(favorite.id)}
                          className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 flex-shrink-0"
                          aria-label="Quitar de favoritos"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {/* Precio y acciones */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col">
                          <span className="text-base font-bold text-gray-900">
                            {formatCurrency(favorite.price)}
                          </span>
                          {favorite.discount_percentage &&
                            favorite.discount_percentage > 0 && (
                              <span className="text-xs text-red-600 font-medium">
                                -{favorite.discount_percentage}% OFF
                              </span>
                            )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(favorite)}
                          className="h-7 bg-[hsl(var(--brand))] px-2 text-xs hover:bg-[hsl(var(--brand-strong))]"
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Agregar
                        </Button>
                      </div>

                      {/* Fecha agregado */}
                      <p className="text-xs text-gray-500 mt-1">
                        Agregado el {formatDate(favorite.addedAt)}
                      </p>

                      {/* Stock bajo */}
                      {favorite.stock !== undefined &&
                        favorite.stock > 0 &&
                        favorite.stock <= 5 && (
                          <div className="flex items-center space-x-1 mt-1">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span className="text-xs text-amber-600 font-medium">
                              ¡Solo quedan {favorite.stock}!
                            </span>
                          </div>
                        )}

                      {/* Sin stock */}
                      {favorite.stock !== undefined && favorite.stock === 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Package className="w-3 h-3 text-red-600" />
                          <span className="text-xs text-red-600 font-medium">
                            Sin stock
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        {state.items.length > 0 && (
          <div className="border-t pt-4 space-y-3 mt-4">
            <div className="rounded-lg bg-[hsl(var(--surface-highlight))] p-3">
              <p className="text-xs font-medium text-[hsl(var(--brand-strong))]">
                💡 Tip: Agrega tus favoritos al carrito para no perderlos
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={closeFavorites}
                variant="outline"
                className="w-full"
              >
                Continuar Explorando
              </Button>

              <Button
                variant="ghost"
                onClick={handleClearAll}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar Todos los Favoritos
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Tus favoritos se guardan automáticamente
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
