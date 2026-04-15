import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Img,
  Hr,
  Tailwind,
  Link,
} from '@react-email/components'
import { brand } from '@/lib/brand'
import { emailTailwindConfig } from './config'

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface OrderConfirmationEmailProps {
  orderId: string
  customerName: string
  customerPhone?: string
  paymentMethod?: string
  notes?: string
  shippingAddress?: {
    address?: string
    city?: string
    department?: string
  }
  items?: OrderItem[]
  total: number
  orderDate?: string
}

// ─── Constantes de color ─────────────────────────────────────────────────────
const C = {
  dark: '#003D52',
  mid: '#005068',
  brand: '#00A3BF',
  brandSoft: '#E0F6FA',
  brandLine: '#7DD3E8',
  orange: '#F97316',
  orangeL: '#FFF0E8',
  orangeB: '#FDBA74',
  ok: '#28A745',
  okBg: '#D1FAE5',
  okBr: '#6EE7B7',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray400: '#94a3b8',
  gray600: '#64748b',
  gray900: '#111827',
  white: '#ffffff',
}

export default function OrderConfirmationEmail({
  orderId,
  customerName,
  customerPhone,
  paymentMethod,
  notes,
  shippingAddress,
  items = [],
  total,
  orderDate,
}: OrderConfirmationEmailProps) {
  const orderRef = `#${orderId.slice(0, 8).toUpperCase()}`
  const formattedTotal = Number(total).toLocaleString('es-CO')
  const date = orderDate
    ? new Date(orderDate).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
  const addressLine = shippingAddress
    ? [shippingAddress.address, shippingAddress.city, shippingAddress.department]
        .filter(Boolean)
        .join(', ')
    : '—'
  const whatsappUrl = `https://wa.me/${brand.whatsappNumber}?text=Hola%2C+tengo+una+consulta+sobre+mi+orden+${encodeURIComponent(orderRef)}`

  const detailRows: [string, string][] = [
    ['N.° de orden', orderRef],
    ['Fecha', date],
    ['Método de pago', paymentMethod || 'Por confirmar'],
    ...(notes ? [['Referencia pago', notes] as [string, string]] : []),
    ['Dirección', addressLine],
    ...(customerPhone ? [['Teléfono', customerPhone] as [string, string]] : []),
  ]

  return (
    <Html lang="es">
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Body
          style={{
            margin: '0',
            padding: '0',
            backgroundColor: C.gray100,
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
          <Preview>
            Pedido {orderRef} recibido — {brand.name}
          </Preview>

          <Container style={{ maxWidth: '600px', margin: '24px auto' }}>
            {/* ── Header blanco ── */}
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{ borderCollapse: 'collapse', backgroundColor: C.white }}
            >
              <tbody>
                <tr style={{ backgroundColor: C.white }}>
                  {/* Franja naranja izquierda */}
                  <td style={{ width: '5px', backgroundColor: C.orange, padding: '0' }} />
                  <td
                    style={{
                      padding: '14px 20px',
                      verticalAlign: 'middle',
                      backgroundColor: C.white,
                    }}
                  >
                    <table
                      role="presentation"
                      cellPadding="0"
                      cellSpacing="0"
                      border={0}
                      style={{ borderCollapse: 'collapse', backgroundColor: C.white }}
                    >
                      <tbody>
                        <tr style={{ backgroundColor: C.white }}>
                          <td
                            style={{
                              paddingRight: '10px',
                              verticalAlign: 'middle',
                              backgroundColor: C.white,
                              fontSize: '0',
                              lineHeight: '0',
                            }}
                          >
                            <Img
                              src={`${brand.siteUrl}/android-chrome-512x512.png`}
                              alt={brand.name}
                              width="36"
                              height="36"
                              style={{ display: 'block', border: '0' }}
                            />
                          </td>
                          <td style={{ verticalAlign: 'middle', backgroundColor: C.white }}>
                            <p
                              style={{
                                margin: '0',
                                padding: '0',
                                fontSize: '18px',
                                fontWeight: '800',
                                color: C.dark,
                                letterSpacing: '1px',
                                lineHeight: '1.1',
                                backgroundColor: C.white,
                              }}
                            >
                              SUMITRONIC
                            </p>
                            <p
                              style={{
                                margin: '3px 0 0',
                                padding: '0',
                                fontSize: '10px',
                                color: C.gray400,
                                letterSpacing: '0.5px',
                                lineHeight: '1',
                                backgroundColor: C.white,
                              }}
                            >
                              Suministros electrónicos
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td
                    style={{
                      padding: '14px 20px 14px 0',
                      textAlign: 'right',
                      verticalAlign: 'middle',
                      backgroundColor: C.white,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: C.ok,
                        color: C.white,
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        padding: '5px 12px',
                        borderRadius: '20px',
                      }}
                    >
                      ✓ Pedido confirmado
                    </span>
                  </td>
                </tr>
                {/* Franja naranja inferior */}
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      height: '4px',
                      backgroundColor: C.orange,
                      padding: '0',
                      lineHeight: '4px',
                      fontSize: '1px',
                    }}
                  >
                    &nbsp;
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── Hero saludo ── */}
            <Section style={{ backgroundColor: C.white, padding: '28px 28px 20px' }}>
              {/* Badge éxito */}
              <table
                cellPadding="0"
                cellSpacing="0"
                style={{ borderCollapse: 'collapse', marginBottom: '18px' }}
              >
                <tr>
                  <td
                    style={{
                      backgroundColor: C.okBg,
                      border: `1px solid ${C.okBr}`,
                      borderRadius: '6px',
                      padding: '8px 14px',
                    }}
                  >
                    <Text style={{ margin: '0', fontSize: '13px', fontWeight: '700', color: C.ok }}>
                      ✓ &nbsp;Orden {orderRef} recibida correctamente
                    </Text>
                  </td>
                </tr>
              </table>

              <Heading
                as="h1"
                style={{
                  margin: '0 0 4px',
                  fontSize: '20px',
                  fontWeight: '800',
                  color: C.dark,
                  lineHeight: '1.3',
                }}
              >
                Hola {customerName},
              </Heading>
              <Text
                style={{
                  margin: '0 0 10px',
                  fontSize: '16px',
                  color: C.gray600,
                  fontWeight: '400',
                }}
              >
                tu pedido está en camino.
              </Text>
              <Text style={{ margin: '0', fontSize: '14px', color: C.gray600, lineHeight: '1.6' }}>
                Recibimos tu pedido y lo estamos procesando. Te contactaremos para coordinar el pago
                y la entrega.
              </Text>
            </Section>

            <Hr style={{ border: 'none', borderTop: `1px solid ${C.gray200}`, margin: '0 28px' }} />

            {/* ── Detalles del pedido ── */}
            <Section style={{ backgroundColor: C.white, padding: '20px 28px' }}>
              <Text
                style={{
                  margin: '0 0 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: C.brand,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                }}
              >
                Detalles del pedido
              </Text>
              <table
                cellPadding="0"
                cellSpacing="0"
                width="100%"
                style={{
                  borderCollapse: 'collapse',
                  border: `1px solid ${C.gray200}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                {detailRows.map(([label, value], i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? C.white : C.gray50 }}>
                    <td
                      style={{
                        padding: '9px 14px',
                        fontSize: '12px',
                        color: C.gray400,
                        width: '38%',
                        borderTop: i > 0 ? `1px solid ${C.gray200}` : 'none',
                      }}
                    >
                      {label}
                    </td>
                    <td
                      style={{
                        padding: '9px 14px',
                        fontSize: '13px',
                        fontWeight: label === 'N.° de orden' ? '700' : '400',
                        color: label === 'N.° de orden' ? C.dark : C.gray900,
                        borderTop: i > 0 ? `1px solid ${C.gray200}` : 'none',
                      }}
                    >
                      {value}
                    </td>
                  </tr>
                ))}
              </table>
            </Section>

            <Hr style={{ border: 'none', borderTop: `1px solid ${C.gray200}`, margin: '0 28px' }} />

            {/* ── Productos ── */}
            <Section style={{ backgroundColor: C.white, padding: '20px 28px' }}>
              <Text
                style={{
                  margin: '0 0 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: C.brand,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                }}
              >
                Productos
              </Text>
              <table
                cellPadding="0"
                cellSpacing="0"
                width="100%"
                style={{
                  borderCollapse: 'collapse',
                  border: `1px solid ${C.gray200}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                {/* Cabecera tabla */}
                <tr style={{ backgroundColor: C.dark }}>
                  <td
                    style={{
                      padding: '9px 14px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'rgba(255,255,255,0.8)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Producto
                  </td>
                  <td
                    style={{
                      padding: '9px 14px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'rgba(255,255,255,0.8)',
                      textAlign: 'center',
                      width: '50px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Cant.
                  </td>
                  <td
                    style={{
                      padding: '9px 14px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'rgba(255,255,255,0.8)',
                      textAlign: 'right',
                      width: '110px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Subtotal
                  </td>
                </tr>

                {/* Filas */}
                {items.length > 0 ? (
                  items.map((item, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? C.white : C.gray50 }}>
                      <td
                        style={{
                          padding: '10px 14px',
                          fontSize: '13px',
                          color: C.gray900,
                          borderTop: `1px solid ${C.gray200}`,
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          fontSize: '13px',
                          color: C.gray600,
                          textAlign: 'center',
                          borderTop: `1px solid ${C.gray200}`,
                        }}
                      >
                        × {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: C.gray900,
                          textAlign: 'right',
                          borderTop: `1px solid ${C.gray200}`,
                        }}
                      >
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: '14px',
                        textAlign: 'center',
                        fontSize: '13px',
                        color: C.gray400,
                        borderTop: `1px solid ${C.gray200}`,
                      }}
                    >
                      Sin detalle de productos
                    </td>
                  </tr>
                )}

                {/* Fila total */}
                <tr style={{ backgroundColor: C.dark }}>
                  <td
                    colSpan={2}
                    style={{
                      padding: '12px 14px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'rgba(255,255,255,0.85)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderTop: `1px solid ${C.mid}`,
                    }}
                  >
                    Total a pagar
                  </td>
                  <td
                    style={{
                      padding: '12px 14px',
                      textAlign: 'right',
                      borderTop: `1px solid ${C.mid}`,
                    }}
                  >
                    <Text style={{ margin: '0', fontSize: '18px', fontWeight: '800', color: C.ok }}>
                      ${formattedTotal}
                    </Text>
                    <Text
                      style={{
                        margin: '0',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.45)',
                        letterSpacing: '0.5px',
                      }}
                    >
                      COP
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>

            <Hr style={{ border: 'none', borderTop: `1px solid ${C.gray200}`, margin: '0 28px' }} />

            {/* ── CTA WhatsApp ── */}
            <Section style={{ backgroundColor: C.white, padding: '20px 28px 28px' }}>
              <table
                cellPadding="0"
                cellSpacing="0"
                width="100%"
                style={{
                  borderCollapse: 'collapse',
                  backgroundColor: C.brandSoft,
                  borderLeft: `4px solid ${C.brand}`,
                  borderRadius: '8px',
                  padding: '18px 20px',
                }}
              >
                <tr>
                  <td style={{ padding: '0 0 6px' }}>
                    <Text
                      style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: C.dark }}
                    >
                      ¿Tienes preguntas sobre tu pedido?
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0 0 14px' }}>
                    <Text
                      style={{ margin: '0', fontSize: '13px', color: C.gray600, lineHeight: '1.5' }}
                    >
                      Escríbenos y te respondemos en menos de 2 horas en horario de atención.
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      <tr>
                        <td style={{ paddingRight: '10px' }}>
                          <Button
                            href={whatsappUrl}
                            style={{
                              display: 'inline-block',
                              backgroundColor: '#16a34a',
                              color: C.white,
                              fontSize: '13px',
                              fontWeight: '700',
                              padding: '10px 18px',
                              borderRadius: '7px',
                              textDecoration: 'none',
                            }}
                          >
                            WhatsApp
                          </Button>
                        </td>
                        <td>
                          <Button
                            href={`mailto:${brand.supportEmail}`}
                            style={{
                              display: 'inline-block',
                              backgroundColor: C.white,
                              color: C.brand,
                              fontSize: '13px',
                              fontWeight: '600',
                              padding: '9px 18px',
                              borderRadius: '7px',
                              textDecoration: 'none',
                              border: `1px solid ${C.brand}`,
                            }}
                          >
                            Enviar correo
                          </Button>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </Section>

            {/* ── Footer ── */}
            <Section style={{ backgroundColor: C.dark, padding: '20px 28px' }}>
              <Row>
                <Column
                  style={{
                    textAlign: 'center',
                    paddingBottom: '14px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Link
                    href={`https://wa.me/${brand.whatsappNumber}`}
                    style={{
                      color: C.orange,
                      fontSize: '13px',
                      fontWeight: '600',
                      textDecoration: 'none',
                    }}
                  >
                    {brand.whatsappDisplay}
                  </Link>
                  <Text
                    style={{ display: 'inline', color: 'rgba(255,255,255,0.2)', margin: '0 8px' }}
                  >
                    ·
                  </Text>
                  <Link
                    href={`mailto:${brand.supportEmail}`}
                    style={{ color: C.brandLine, fontSize: '13px', textDecoration: 'none' }}
                  >
                    {brand.supportEmail}
                  </Link>
                </Column>
              </Row>
              <Text
                style={{
                  margin: '14px 0 2px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: '1.5',
                }}
              >
                {brand.name} · {brand.address.full}
              </Text>
              <Text
                style={{
                  margin: '0',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                {brand.hours.weekday} · {brand.hours.saturday}
              </Text>
              <Text
                style={{
                  margin: '12px 0 0',
                  textAlign: 'center',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.2)',
                }}
              >
                © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

OrderConfirmationEmail.PreviewProps = {
  orderId: 'abc12345-def0-0000-0000-000000000001',
  customerName: 'Mario Basabe',
  customerPhone: '3001234567',
  paymentMethod: 'Transferencia bancaria',
  notes: 'REF-2026001',
  shippingAddress: { address: 'Calle 72 # 14-25', city: 'Bogotá', department: 'Cundinamarca' },
  items: [
    { name: 'Cámara IP Hikvision DS-2CD2143G2-I 4MP AcuSense', quantity: 2, price: 380000 },
    { name: 'DVR Hikvision 8 canales 4K iDS-7208HUHI-M2', quantity: 1, price: 1250000 },
    { name: 'Cable UTP Cat6 Exterior 305m', quantity: 1, price: 195000 },
  ],
  total: 2205000,
  orderDate: new Date().toISOString(),
} satisfies OrderConfirmationEmailProps
