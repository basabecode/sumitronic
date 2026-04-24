'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  Search,
  Phone,
  Mail,
  MapPin,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  RefreshCw,
  Printer,
  Trash2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/formatting'

interface OrderItem {
  id?: string
  name: string
  quantity: number
  price?: number
  unit_price?: number
  image_url?: string | null
}

interface Order {
  id: string
  created_at: string
  total: number
  subtotal: number
  shipping: number
  status: string
  payment_status: string
  payment_method: string | null
  payment_proof_url: string | null
  tracking_number: string | null
  notes: string | null
  items: OrderItem[]
  customer_info: {
    fullName?: string
    first_name?: string
    last_name?: string
    email: string
    phone: string
  }
  shipping_address: {
    address?: string
    street?: string
    city: string
    department?: string
    state?: string
    zipCode?: string
    postal_code?: string
    country?: string
  }
  user: {
    full_name: string
    email: string
  } | null
}

const PAYMENT_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  paid: { label: 'Pagado', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  failed: { label: 'Rechazado', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  refunded: {
    label: 'Reembolsado',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  partially_refunded: {
    label: 'Reemb. parcial',
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  },
}

const ORDER_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'En proceso', className: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Enviado', className: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Entregado', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
}

const formatCurrency = formatPrice

function getCustomerName(order: Order): string {
  return (
    order.customer_info?.fullName ||
    [order.customer_info?.first_name, order.customer_info?.last_name].filter(Boolean).join(' ') ||
    order.user?.full_name ||
    '—'
  )
}

// ── Función: imprimir etiqueta de envío ────────────────────────────────────────
function printShippingLabel(order: Order) {
  const name = getCustomerName(order)

  const addr = order.shipping_address
  const addressLines = [
    addr?.address || addr?.street || '',
    [addr?.city, addr?.department || addr?.state].filter(Boolean).join(', '),
    addr?.zipCode || addr?.postal_code ? `CP: ${addr?.zipCode || addr?.postal_code}` : '',
    addr?.country || 'Colombia',
  ].filter(Boolean)

  const itemsHtml =
    Array.isArray(order.items) && order.items.length > 0
      ? order.items
          .map(item => {
            const price = item.price ?? (item as unknown as { unit_price?: number }).unit_price ?? 0
            return `<tr>
          <td style="padding:4px 8px;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:4px 8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:4px 8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(price * item.quantity)}</td>
        </tr>`
          })
          .join('')
      : `<tr><td colspan="3" style="padding:4px 8px;color:#999;">Sin detalle</td></tr>`

  const orderRef = order.id.slice(0, 8).toUpperCase()
  const fecha = format(new Date(order.created_at), "d 'de' MMMM yyyy", { locale: es })

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Etiqueta de envío — ${orderRef}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #111; background: #fff; padding: 24px; }
    .label { max-width: 600px; margin: 0 auto; border: 2px solid #111; border-radius: 8px; overflow: hidden; }
    .header { background: #111; color: #fff; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 20px; letter-spacing: 1px; }
    .header span { font-size: 12px; opacity: 0.7; }
    .section { padding: 16px 20px; border-bottom: 1px dashed #ccc; }
    .section:last-child { border-bottom: none; }
    .label-title { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 6px; }
    .big { font-size: 18px; font-weight: bold; margin-bottom: 4px; }
    .address { font-size: 15px; line-height: 1.6; }
    .phone { font-size: 15px; font-weight: bold; margin-top: 6px; }
    .order-ref { font-size: 22px; font-weight: bold; letter-spacing: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f5f5f5; padding: 6px 8px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .total-row { font-weight: bold; font-size: 14px; }
    .footer { text-align: center; font-size: 11px; color: #888; padding-top: 12px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
      @page { margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="label">
    <div class="header">
      <h1>SUMITRONIC</h1>
      <span>Etiqueta de envío</span>
    </div>

    <div class="section">
      <div class="label-title">N° de pedido</div>
      <div class="order-ref">${orderRef}</div>
      <div style="font-size:11px;color:#666;margin-top:4px;">${fecha}</div>
    </div>

    <div class="section">
      <div class="label-title">Destinatario</div>
      <div class="big">${name}</div>
      <div class="phone">📞 ${order.customer_info?.phone || '—'}</div>
    </div>

    <div class="section">
      <div class="label-title">Dirección de entrega</div>
      <div class="address">${addressLines.join('<br/>')}</div>
    </div>

    <div class="section">
      <div class="label-title">Productos</div>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th style="text-align:center;">Cant.</th>
            <th style="text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="2" style="padding:8px 8px 4px;text-align:right;">Total del pedido:</td>
            <td style="padding:8px 8px 4px;text-align:right;">${formatCurrency(order.total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="section" style="background:#f9f9f9;">
      <div class="footer">
        Método de pago: ${order.payment_method || '—'} &nbsp;|&nbsp;
        ${order.tracking_number ? `Guía: <strong>${order.tracking_number}</strong> &nbsp;|&nbsp;` : ''}
        sumitronic.com
      </div>
    </div>
  </div>

  <div class="no-print" style="text-align:center;margin-top:24px;">
    <button onclick="window.print()" style="padding:10px 24px;background:#111;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer;">
      Imprimir / Guardar PDF
    </button>
  </div>
</body>
</html>`

  const win = window.open('', '_blank', 'width=680,height=800')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}

// ── Modal de detalle de orden ──────────────────────────────────────────────────
function OrderDetailModal({
  order,
  open,
  onClose,
  onUpdated,
  onDeleted,
}: {
  order: Order
  open: boolean
  onClose: () => void
  onUpdated: (updated: Order) => void
  onDeleted: (id: string) => void
}) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const canDelete =
    ['pending', 'failed', 'refunded'].includes(order.payment_status) || order.status === 'cancelled'

  const deleteOrder = async () => {
    setLoadingAction('delete')
    try {
      const res = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error al eliminar')
      toast.success('Pedido eliminado correctamente')
      onDeleted(order.id)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar el pedido')
    } finally {
      setLoadingAction(null)
      setConfirmDelete(false)
    }
  }

  const updateOrder = async (field: 'payment_status' | 'status', value: string, label: string) => {
    setLoadingAction(value)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error al actualizar')
      toast.success(`Pedido actualizado: ${label}`)
      onUpdated({ ...order, [field]: value })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar el pedido')
    } finally {
      setLoadingAction(null)
    }
  }

  const paymentStatus = PAYMENT_STATUS_LABELS[order.payment_status] ?? {
    label: order.payment_status,
    className: 'bg-[hsl(var(--surface-muted))] text-[hsl(var(--text-muted))]',
  }
  const orderStatus = ORDER_STATUS_LABELS[order.status] ?? {
    label: order.status,
    className: 'bg-[hsl(var(--surface-muted))] text-[hsl(var(--text-muted))]',
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg">
            <Package className="h-5 w-5 text-[hsl(var(--brand))]" />
            Pedido #{order.id.slice(0, 8).toUpperCase()}
            <span className="text-sm font-normal text-[hsl(var(--text-muted))]">
              {format(new Date(order.created_at), 'd MMM yyyy, hh:mm a', { locale: es })}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* ── Acciones rápidas ── */}
        <div className="flex flex-wrap gap-2 pt-1 pb-2 border-b border-[hsl(var(--border-subtle))]">
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => printShippingLabel(order)}
          >
            <Printer className="h-4 w-4" />
            Imprimir etiqueta
          </Button>

          {canDelete && !confirmDelete && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 ml-auto"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar pedido
            </Button>
          )}

          {confirmDelete && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-red-600 font-medium">¿Eliminar definitivamente?</span>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white gap-1"
                disabled={loadingAction === 'delete'}
                onClick={deleteOrder}
              >
                {loadingAction === 'delete' ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
                Sí, eliminar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-5 pt-1">
          {/* ── Datos del cliente ── */}
          <section className="rounded-xl border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--text-muted))]">
              Datos del cliente
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 font-semibold text-[hsl(var(--foreground))] text-base">
                {getCustomerName(order)}
              </div>
              <div className="flex items-center gap-2 text-[hsl(var(--text-muted))]">
                <Mail className="h-4 w-4 shrink-0 text-[hsl(var(--brand))]" />
                <a
                  href={`mailto:${order.customer_info?.email || order.user?.email}`}
                  className="hover:underline"
                >
                  {order.customer_info?.email || order.user?.email || '—'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[hsl(var(--text-muted))]">
                <Phone className="h-4 w-4 shrink-0 text-[hsl(var(--brand))]" />
                <a
                  href={`https://wa.me/57${(order.customer_info?.phone || '').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {order.customer_info?.phone || '—'}
                </a>
              </div>
            </div>
          </section>

          {/* ── Dirección de envío ── */}
          <section className="rounded-xl border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--text-muted))]">
              Dirección de envío
            </h3>
            <div className="flex items-start gap-2 text-sm text-[hsl(var(--text-muted))]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--brand))]" />
              <div>
                <p>{order.shipping_address?.address || order.shipping_address?.street || '—'}</p>
                <p className="text-[hsl(var(--text-muted))]">
                  {order.shipping_address?.city}
                  {order.shipping_address?.department || order.shipping_address?.state
                    ? `, ${order.shipping_address.department || order.shipping_address.state}`
                    : ''}
                  {order.shipping_address?.zipCode || order.shipping_address?.postal_code
                    ? ` — CP ${order.shipping_address.zipCode || order.shipping_address.postal_code}`
                    : ''}
                </p>
                {order.shipping_address?.country && (
                  <p className="text-[hsl(var(--border-strong))] text-xs">
                    {order.shipping_address.country}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ── Productos ── */}
          <section className="rounded-xl border border-[hsl(var(--border-subtle))] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--text-muted))]">
              Productos del pedido
            </h3>
            <div className="space-y-2">
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, i) => {
                  const itemPrice = item.price ?? item.unit_price ?? 0
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 rounded-lg bg-[hsl(var(--surface-muted))] px-3 py-2 text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[hsl(var(--foreground))] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-[hsl(var(--text-muted))]">
                          {formatCurrency(itemPrice)} × {item.quantity}
                        </p>
                      </div>
                      <span className="shrink-0 font-semibold text-[hsl(var(--foreground))]">
                        {formatCurrency(itemPrice * item.quantity)}
                      </span>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-[hsl(var(--border-strong))] italic">
                  Sin detalle de productos
                </p>
              )}
            </div>

            <Separator className="my-3" />
            <div className="flex justify-between text-sm text-[hsl(var(--text-muted))]">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal || 0)}</span>
            </div>
            {(order.shipping ?? 0) > 0 && (
              <div className="flex justify-between text-sm text-[hsl(var(--text-muted))] mt-1">
                <span>Envío</span>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base mt-2">
              <span>Total</span>
              <span className="text-green-700">{formatCurrency(order.total)}</span>
            </div>
          </section>

          {/* ── Información de pago ── */}
          <section className="rounded-xl border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--text-muted))]">
              Información de pago
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--text-muted))]">Método</span>
                <span className="font-medium">{order.payment_method || '—'}</span>
              </div>
              {order.notes && (
                <div className="rounded-lg bg-white border border-[hsl(var(--border-subtle))] p-3 text-xs text-[hsl(var(--text-muted))] space-y-1">
                  <p className="font-semibold text-[hsl(var(--foreground))] text-sm mb-1">
                    Referencia del cliente:
                  </p>
                  {order.notes.split('|').map((part, i) => (
                    <p key={i}>{part.trim()}</p>
                  ))}
                </div>
              )}
              {order.payment_proof_url && (
                <a
                  href={order.payment_proof_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[hsl(var(--brand-strong))] hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  Ver comprobante adjunto
                </a>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[hsl(var(--text-muted))]">Estado pago</span>
                <Badge className={paymentStatus.className}>{paymentStatus.label}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--text-muted))]">Estado pedido</span>
                <Badge className={orderStatus.className}>{orderStatus.label}</Badge>
              </div>
            </div>
          </section>

          {/* ── Acciones de pago ── */}
          <section className="rounded-xl border-2 border-[hsl(var(--border-strong))] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--text-muted))]">
              Confirmar estado de pago
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                disabled={order.payment_status === 'paid' || !!loadingAction}
                onClick={() => updateOrder('payment_status', 'paid', 'Pagado')}
              >
                {loadingAction === 'paid' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Confirmar pago
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 gap-2"
                disabled={order.payment_status === 'failed' || !!loadingAction}
                onClick={() => updateOrder('payment_status', 'failed', 'Rechazado')}
              >
                {loadingAction === 'failed' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Rechazar pago
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                disabled={order.payment_status === 'pending' || !!loadingAction}
                onClick={() => updateOrder('payment_status', 'pending', 'Pendiente')}
              >
                {loadingAction === 'pending_pay' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                Volver a pendiente
              </Button>
            </div>
          </section>

          {/* ── Acciones de estado del pedido ── */}
          <section className="rounded-xl border border-[hsl(var(--border-subtle))] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--text-muted))]">
              Estado del pedido
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  value: 'processing',
                  label: 'En proceso',
                  icon: <RefreshCw className="h-4 w-4" />,
                },
                { value: 'shipped', label: 'Enviado', icon: <Truck className="h-4 w-4" /> },
                {
                  value: 'delivered',
                  label: 'Entregado',
                  icon: <CheckCircle2 className="h-4 w-4" />,
                },
                { value: 'cancelled', label: 'Cancelado', icon: <XCircle className="h-4 w-4" /> },
              ].map(action => (
                <Button
                  key={action.value}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  disabled={order.status === action.value || !!loadingAction}
                  onClick={() => updateOrder('status', action.value, action.label)}
                >
                  {loadingAction === action.value ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    action.icon
                  )}
                  {action.label}
                </Button>
              ))}
            </div>

            {order.tracking_number && (
              <p className="mt-3 text-sm text-[hsl(var(--text-muted))]">
                <span className="font-medium">Número de seguimiento:</span> {order.tracking_number}
              </p>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function SalesTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`*, user:users (full_name, email)`)
          .order('created_at', { ascending: false })

        if (cancelled) return
        if (error) throw error
        if (data) setOrders(data as unknown as Order[])
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(`No se pudieron cargar los pedidos: ${message}`)
        toast.error('Error al cargar los pedidos')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, user:users (full_name, email)`)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setOrders(data as unknown as Order[])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(`No se pudieron cargar los pedidos: ${message}`)
      toast.error('Error al cargar los pedidos')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderUpdated = (updated: Order) => {
    setOrders(prev => prev.map(o => (o.id === updated.id ? { ...o, ...updated } : o)))
    setSelectedOrder(prev => (prev?.id === updated.id ? { ...prev, ...updated } : prev))
  }

  const handleOrderDeleted = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id))
    setSelectedOrder(null)
  }

  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1)
    const todayStr = now.toISOString().split('T')[0]

    let totalSales = 0,
      monthlySales = 0,
      lastMonthSales = 0,
      dailySales = 0,
      pendingCount = 0

    for (const o of orders) {
      const total = Number(o.total) || 0
      if (o.payment_status === 'pending') {
        pendingCount++
        continue
      }
      if (o.payment_status !== 'paid') continue
      totalSales += total
      const d = new Date(o.created_at)
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) monthlySales += total
      if (
        d.getMonth() === lastMonthDate.getMonth() &&
        d.getFullYear() === lastMonthDate.getFullYear()
      )
        lastMonthSales += total
      if (o.created_at.startsWith(todayStr)) dailySales += total
    }

    const growth =
      lastMonthSales > 0
        ? ((monthlySales - lastMonthSales) / lastMonthSales) * 100
        : monthlySales > 0
          ? 100
          : 0

    return { totalSales, monthlySales, dailySales, growth: growth.toFixed(1), pendingCount }
  }, [orders])

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders
    const q = searchQuery.toLowerCase()
    return orders.filter(
      o =>
        o.id.toLowerCase().includes(q) ||
        o.customer_info?.fullName?.toLowerCase().includes(q) ||
        o.customer_info?.email?.toLowerCase().includes(q) ||
        o.customer_info?.phone?.includes(q) ||
        o.payment_method?.toLowerCase().includes(q) ||
        o.shipping_address?.city?.toLowerCase().includes(q)
    )
  }, [orders, searchQuery])

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
        <p className="text-[hsl(var(--text-muted))] font-medium">{error}</p>
        <Button variant="outline" onClick={fetchOrders}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--text-muted))]">
              Ventas Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
            <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Ingresos acumulados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--text-muted))]">
              Ventas del Mes
            </CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${Number(stats.growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlySales)}</div>
            <p
              className={`text-xs mt-1 ${Number(stats.growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {stats.growth}% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--text-muted))]">
              Ventas Hoy
            </CardTitle>
            <Calendar className="h-4 w-4 text-[hsl(var(--brand))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.dailySales)}</div>
            <p className="text-xs text-[hsl(var(--text-muted))] mt-1">
              {new Date().toLocaleDateString('es-CO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--text-muted))]">
              Por Confirmar
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-[hsl(var(--text-muted))] mt-1">
              Pagos pendientes de revisión
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de pedidos */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Historial de Pedidos</CardTitle>
              <p className="text-sm text-[hsl(var(--text-muted))] mt-1">
                Haz clic en un pedido para ver detalles y gestionar el estado
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-[hsl(var(--text-muted))]" />
              <Input
                placeholder="Buscar por cliente, ID, ciudad..."
                className="pl-8 h-11 md:h-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile */}
          <div className="space-y-3 md:hidden">
            {filteredOrders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[hsl(var(--border-subtle))] p-6 text-center text-sm text-[hsl(var(--text-muted))]">
                {searchQuery ? 'No se encontraron pedidos' : 'Aún no hay pedidos registrados'}
              </div>
            ) : (
              filteredOrders.map(order => {
                const ps = PAYMENT_STATUS_LABELS[order.payment_status] ?? {
                  label: order.payment_status,
                  className: 'bg-[hsl(var(--surface-muted))] text-[hsl(var(--text-muted))]',
                }
                return (
                  <button
                    key={`mobile-${order.id}`}
                    onClick={() => setSelectedOrder(order)}
                    className="w-full text-left rounded-xl border border-[hsl(var(--border-subtle))] bg-white p-4 shadow-sm hover:border-[hsl(var(--brand))] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-[hsl(var(--foreground))] truncate">
                          {getCustomerName(order)}
                        </p>
                        <p className="text-sm text-[hsl(var(--text-muted))] truncate">
                          {order.customer_info?.email || order.user?.email}
                        </p>
                        <p className="text-xs text-[hsl(var(--border-strong))] mt-0.5">
                          {order.customer_info?.phone}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-[hsl(var(--foreground))]">
                          {formatCurrency(Number(order.total))}
                        </p>
                        <Badge className={`mt-1 text-xs ${ps.className}`}>{ps.label}</Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-[hsl(var(--border-strong))]">
                      {format(new Date(order.created_at), 'd MMM yyyy, hh:mm a', { locale: es })}
                      {' — '}
                      {order.shipping_address?.city}
                    </p>
                  </button>
                )
              })
            )}
          </div>

          {/* Desktop */}
          <div className="hidden rounded-md border overflow-x-auto md:block">
            <Table className="min-w-[750px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Método Pago</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-[hsl(var(--text-muted))]"
                    >
                      {searchQuery ? 'No se encontraron pedidos' : 'Aún no hay pedidos registrados'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map(order => {
                    const ps = PAYMENT_STATUS_LABELS[order.payment_status] ?? {
                      label: order.payment_status,
                      className: 'bg-[hsl(var(--surface-muted))] text-[hsl(var(--text-muted))]',
                    }
                    const os = ORDER_STATUS_LABELS[order.status] ?? {
                      label: order.status,
                      className: 'bg-[hsl(var(--surface-muted))] text-[hsl(var(--text-muted))]',
                    }
                    return (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-[hsl(var(--surface-highlight))] transition-colors"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {format(new Date(order.created_at), 'dd MMM yyyy', { locale: es })}
                            </span>
                            <span className="text-xs text-[hsl(var(--text-muted))]">
                              {format(new Date(order.created_at), 'hh:mm a')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{getCustomerName(order)}</span>
                            <span className="text-xs text-[hsl(var(--text-muted))] truncate max-w-[160px]">
                              {order.shipping_address?.city},{' '}
                              {order.shipping_address?.department || order.shipping_address?.state}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5 text-xs text-[hsl(var(--text-muted))]">
                            <span className="truncate max-w-[150px]">
                              {order.customer_info?.email || order.user?.email || '—'}
                            </span>
                            <span className="text-[hsl(var(--border-strong))]">
                              {order.customer_info?.phone || '—'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize text-xs">
                            {order.payment_method || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${ps.className}`}>{ps.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${os.className}`}>{os.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(Number(order.total))}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalle */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleOrderUpdated}
          onDeleted={handleOrderDeleted}
        />
      )}
    </div>
  )
}
