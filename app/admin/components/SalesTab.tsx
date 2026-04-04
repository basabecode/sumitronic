'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  Search
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface Order {
  id: string
  created_at: string
  total: number
  status: string
  payment_status: string
  payment_method: string | null
  payment_proof_url: string | null
  customer_info: {
    fullName: string
    email: string
    phone: string
  }
  shipping_address: {
    address: string
    city: string
    department: string
  }
  user: {
    full_name: string
    email: string
  } | null
}

export default function SalesTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:users (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setOrders(data as unknown as Order[])
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(`No se pudieron cargar los pedidos: ${message}`)
      toast.error('Error al cargar los pedidos')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Last month — use a separate date to avoid mutating `now`
    const lastMonthDate = new Date(now)
    lastMonthDate.setMonth(now.getMonth() - 1)
    const lastMonth = lastMonthDate.getMonth()
    const lastMonthYear = lastMonthDate.getFullYear()

    const totalSales = orders.reduce((acc, order) => {
      if (order.payment_status === 'paid') {
        return acc + (Number(order.total) || 0)
      }
      return acc
    }, 0)

    const thisMonthOrders = orders.filter(order => {
      const date = new Date(order.created_at)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && order.payment_status === 'paid'
    })
    const monthlySales = thisMonthOrders.reduce((acc, order) => acc + (Number(order.total) || 0), 0)

    const lastMonthOrders = orders.filter(order => {
      const date = new Date(order.created_at)
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear && order.payment_status === 'paid'
    })
    const lastMonthSales = lastMonthOrders.reduce((acc, order) => acc + (Number(order.total) || 0), 0)

    let growth = 0
    if (lastMonthSales > 0) {
      growth = ((monthlySales - lastMonthSales) / lastMonthSales) * 100
    } else if (monthlySales > 0) {
      growth = 100
    }

    const todayStr = new Date().toISOString().split('T')[0]
    const dailySales = orders
      .filter(order => order.created_at.startsWith(todayStr) && order.payment_status === 'paid')
      .reduce((acc, order) => acc + (Number(order.total) || 0), 0)

    return {
      totalSales,
      monthlySales,
      dailySales,
      growth: growth.toFixed(1),
    }
  }, [orders])

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders
    const lowerQuery = searchQuery.toLowerCase()
    return orders.filter(order =>
      order.id.toLowerCase().includes(lowerQuery) ||
      order.customer_info?.fullName?.toLowerCase().includes(lowerQuery) ||
      order.customer_info?.email?.toLowerCase().includes(lowerQuery) ||
      order.payment_method?.toLowerCase().includes(lowerQuery)
    )
  }, [orders, searchQuery])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--brand))]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-gray-700 font-medium">{error}</p>
        <Button variant="outline" onClick={fetchOrders}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ventas Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
            <p className="text-xs text-gray-500 mt-1">Ingresos históricos acumulados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ventas del Mes
            </CardTitle>
            <TrendingUp className={`h-4 w-4 ${Number(stats.growth) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlySales)}</div>
            <p className={`text-xs mt-1 ${Number(stats.growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.growth}% respecto al mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ventas Hoy
            </CardTitle>
            <Calendar className="h-4 w-4 text-[hsl(var(--brand))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.dailySales)}</div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle>Historial de Pedidos</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por cliente, ID..."
                className="pl-8 h-11 md:h-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Método Pago</TableHead>
                  <TableHead>Estado Pago</TableHead>
                  <TableHead>Comprobante</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchQuery ? 'No se encontraron pedidos con ese criterio' : 'Aún no hay pedidos registrados'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {format(new Date(order.created_at), 'dd MMM yyyy', { locale: es })}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(order.created_at), 'hh:mm a')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {order.customer_info?.fullName || order.user?.full_name || 'Cliente sin nombre'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {order.customer_info?.email || order.user?.email}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {order.shipping_address?.city}, {order.shipping_address?.department}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {order.payment_method || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          order.payment_status === 'paid' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                          'bg-red-100 text-red-800 hover:bg-red-100'
                        }>
                          {order.payment_status === 'paid' ? 'Pagado' :
                           order.payment_status === 'pending' ? 'Pendiente' :
                           order.payment_status === 'failed' ? 'Fallido' : order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.payment_proof_url ? (
                          <Button size="sm" variant="ghost" asChild className="h-8 gap-2 text-[hsl(var(--brand-strong))]">
                            <a href={order.payment_proof_url} target="_blank" rel="noreferrer">
                              <FileText className="h-4 w-4" />
                              Ver
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No adjuntado</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(Number(order.total))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
