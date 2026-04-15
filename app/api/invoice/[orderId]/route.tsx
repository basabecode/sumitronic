import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { brand } from '@/lib/brand'
import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer'

/**
 * GET /api/invoice/[orderId]
 * Genera y devuelve el PDF de factura/resumen de compra para una orden.
 * Requiere autenticación (sesión activa o ser el dueño de la orden).
 */

// ─── Estilos del PDF ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  // Header
  header: {
    backgroundColor: '#003D52',
    padding: '28 36',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerBrand: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
  },
  headerTagline: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerBadge: {
    backgroundColor: '#16a34a',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  headerBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  headerOrderId: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  // Acento de color
  accentBar: {
    height: 4,
    backgroundColor: '#16a34a',
  },
  // Body
  body: {
    padding: '24 36',
  },
  // Sección title
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 20,
  },
  // Grid de datos 2 columnas
  dataGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  dataCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    padding: '12 14',
    border: '1 solid #e2e8f0',
  },
  dataCardLabel: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  dataCardValue: {
    fontSize: 11,
    color: '#003D52',
    fontFamily: 'Helvetica-Bold',
  },
  dataCardValueNormal: {
    fontSize: 10,
    color: '#005068',
  },
  // Tabla de productos
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#003D52',
    borderRadius: '4 4 0 0',
    padding: '8 12',
  },
  tableHeaderCell: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
    padding: '9 12',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
  },
  tableCellBold: {
    fontSize: 10,
    color: '#111827',
    fontFamily: 'Helvetica-Bold',
  },
  colProduct: { flex: 3 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 1.2, textAlign: 'right' },
  colSubtotal: { flex: 1.5, textAlign: 'right' },
  // Total
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#003D52',
    borderRadius: '0 0 4 4',
    padding: '12 12',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontSize: 18,
    color: '#7DD3E8',
    fontFamily: 'Helvetica-Bold',
  },
  totalCurrency: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
    textAlign: 'right',
  },
  // Aviso de pago
  paymentNotice: {
    backgroundColor: '#eff6ff',
    border: '1 solid #bfdbfe',
    borderRadius: 6,
    padding: '12 14',
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  paymentNoticeDot: {
    width: 6,
    height: 6,
    backgroundColor: '#2563eb',
    borderRadius: 3,
    marginTop: 3,
    marginRight: 8,
  },
  paymentNoticeText: {
    fontSize: 9,
    color: '#1e40af',
    lineHeight: 1.5,
    flex: 1,
  },
  paymentNoticeTitle: {
    fontSize: 9,
    color: '#1e40af',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  // Footer
  footer: {
    backgroundColor: '#005068',
    padding: '16 36',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerLeft: {
    flexDirection: 'column',
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    lineHeight: 1.5,
  },
  footerContact: {
    color: '#7DD3E8',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginTop: 2,
  },
  footerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  footerPageNote: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 7,
  },
  watermark: {
    color: '#f8fafc',
    fontSize: 60,
    fontFamily: 'Helvetica-Bold',
    position: 'absolute',
    top: 280,
    left: 80,
    opacity: 0.03,
    transform: 'rotate(-35deg)',
    letterSpacing: 8,
  },
})

// ─── Componente PDF ───────────────────────────────────────────────────────────
interface InvoiceProps {
  order: {
    id: string
    total: number
    payment_method?: string
    notes?: string
    created_at?: string
    customer_info?: { fullName?: string; email?: string; phone?: string }
    shipping_address?: { address?: string; city?: string; department?: string }
    items?: Array<{ name: string; quantity: number; price: number }>
  }
}

function InvoiceDocument({ order }: InvoiceProps) {
  const orderId = `#${String(order.id).slice(0, 8).toUpperCase()}`
  const total = Number(order.total).toLocaleString('es-CO')
  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })

  const items = Array.isArray(order.items) ? order.items : []

  return (
    <Document
      title={`Resumen de compra ${orderId} — ${brand.name}`}
      author={brand.name}
      subject={`Comprobante de compra ${orderId}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Marca de agua */}
        <Text style={styles.watermark}>SUMITRONIC</Text>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerBrand}>{brand.name}</Text>
            <Text style={styles.headerTagline}>{brand.tagline}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>COMPROBANTE DE COMPRA</Text>
            </View>
            <Text style={styles.headerOrderId}>
              Orden {orderId} · {date}
            </Text>
          </View>
        </View>

        {/* Barra de acento */}
        <View style={styles.accentBar} />

        {/* Body */}
        <View style={styles.body}>
          {/* Datos cliente y envío */}
          <Text style={styles.sectionTitle}>Información del pedido</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataCard}>
              <Text style={styles.dataCardLabel}>CLIENTE</Text>
              <Text style={styles.dataCardValue}>{order.customer_info?.fullName || '—'}</Text>
              <Text
                style={{
                  ...styles.dataCardValueNormal,
                  marginTop: 3,
                  color: '#64748b',
                  fontSize: 9,
                }}
              >
                {order.customer_info?.email || ''}
              </Text>
              {order.customer_info?.phone && (
                <Text style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>
                  Tel: {order.customer_info.phone}
                </Text>
              )}
            </View>
            <View style={styles.dataCard}>
              <Text style={styles.dataCardLabel}>DIRECCIÓN DE ENTREGA</Text>
              <Text style={styles.dataCardValueNormal}>
                {[
                  order.shipping_address?.address,
                  order.shipping_address?.city,
                  order.shipping_address?.department,
                ]
                  .filter(Boolean)
                  .join('\n') || '—'}
              </Text>
            </View>
          </View>

          <View style={styles.dataGrid}>
            <View style={styles.dataCard}>
              <Text style={styles.dataCardLabel}>MÉTODO DE PAGO</Text>
              <Text style={styles.dataCardValue}>{order.payment_method || 'Por confirmar'}</Text>
            </View>
            {order.notes && (
              <View style={styles.dataCard}>
                <Text style={styles.dataCardLabel}>REFERENCIA DE PAGO</Text>
                <Text style={styles.dataCardValue}>{order.notes}</Text>
              </View>
            )}
          </View>

          {/* Tabla de productos */}
          <Text style={{ ...styles.sectionTitle, marginTop: 24 }}>Detalle de productos</Text>

          {/* Encabezado tabla */}
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderCell, ...styles.colProduct }}>Producto</Text>
            <Text style={{ ...styles.tableHeaderCell, ...styles.colQty }}>Cant.</Text>
            <Text style={{ ...styles.tableHeaderCell, ...styles.colPrice }}>Precio unit.</Text>
            <Text style={{ ...styles.tableHeaderCell, ...styles.colSubtotal }}>Subtotal</Text>
          </View>

          {/* Filas */}
          <View style={{ border: '1 solid #e2e8f0', borderTop: 0, borderRadius: '0 0 4 4' }}>
            {items.map((item, i) => (
              <View key={i} style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlt : {}]}>
                <Text style={{ ...styles.tableCellBold, ...styles.colProduct }}>{item.name}</Text>
                <Text style={{ ...styles.tableCell, ...styles.colQty, textAlign: 'center' }}>
                  {item.quantity}
                </Text>
                <Text style={{ ...styles.tableCell, ...styles.colPrice, textAlign: 'right' }}>
                  ${item.price.toLocaleString('es-CO')}
                </Text>
                <Text
                  style={{ ...styles.tableCellBold, ...styles.colSubtotal, textAlign: 'right' }}
                >
                  ${(item.price * item.quantity).toLocaleString('es-CO')}
                </Text>
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.totalAmount}>${total}</Text>
              <Text style={styles.totalCurrency}>Pesos colombianos (COP)</Text>
            </View>
          </View>

          {/* Aviso */}
          <View style={styles.paymentNotice}>
            <View style={styles.paymentNoticeDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentNoticeTitle}>
                Este documento es un comprobante de compra
              </Text>
              <Text style={styles.paymentNoticeText}>
                No constituye factura de venta. Para solicitar tu factura electrónica escríbenos a{' '}
                {brand.supportEmail} o por WhatsApp al {brand.whatsappDisplay}.{'\n'}
                Horario de atención: {brand.hours.weekday.toLowerCase()} ·{' '}
                {brand.hours.saturday.toLowerCase()}.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer fijo */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerText}>
              {brand.address.full} · {brand.address.country}
            </Text>
            <Text style={styles.footerContact}>
              WhatsApp: {brand.whatsappDisplay} · {brand.supportEmail}
            </Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerText}>{brand.siteUrl}</Text>
            <Text style={styles.footerPageNote}>
              Generado el {new Date().toLocaleDateString('es-CO')}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params
    if (!orderId) {
      return NextResponse.json({ error: 'ID de orden requerido' }, { status: 400 })
    }

    // Verificar sesión activa
    const serverClient = createClient()
    const {
      data: { user },
    } = await serverClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
    }

    // Obtener rol del usuario
    const { data: profile } = await serverClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    const isAdmin = profile?.role === 'admin'

    const supabase = createAdminClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select(
        'id, total, payment_method, notes, created_at, customer_info, shipping_address, items, user_id'
      )
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    if (!isAdmin && order.user_id !== user.id) {
      return NextResponse.json({ error: 'Sin permiso para esta orden' }, { status: 403 })
    }

    const pdfBuffer = await renderToBuffer(<InvoiceDocument order={order} />)

    const filename = `sumitronic-orden-${String(orderId).slice(0, 8).toUpperCase()}.pdf`

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('[invoice] Error generando PDF:', error)
    return NextResponse.json({ error: 'Error generando el comprobante' }, { status: 500 })
  }
}
