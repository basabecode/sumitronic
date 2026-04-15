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

export interface AdminOrderAlertEmailProps {
  orderId: string
  customerName?: string
  customerEmail?: string
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
}

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

export default function AdminOrderAlertEmail({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  paymentMethod,
  notes,
  shippingAddress,
  items = [],
  total,
}: AdminOrderAlertEmailProps) {
  const orderRef = `#${orderId.slice(0, 8).toUpperCase()}`
  const formattedTotal = Number(total).toLocaleString('es-CO')
  const addressLine = shippingAddress
    ? [shippingAddress.address, shippingAddress.city, shippingAddress.department]
        .filter(Boolean)
        .join(', ')
    : '—'

  const clientRows: [string, string, 'text' | 'email' | 'phone'][] = [
    ['Orden', orderRef, 'text'],
    ['Cliente', customerName || '—', 'text'],
    ['Email', customerEmail || '—', 'email'],
    ['Teléfono', customerPhone || '—', 'phone'],
    ['Método de pago', paymentMethod || '—', 'text'],
    ['Dirección', addressLine, 'text'],
    ...(notes ? [['Referencia pago', notes, 'text'] as [string, string, 'text']] : []),
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
            ⚡ Nueva orden {orderRef} — {customerName || 'Invitado'} — ${formattedTotal} COP
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
                              Panel de administración
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
                        backgroundColor: C.orange,
                        color: C.white,
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        padding: '5px 12px',
                        borderRadius: '20px',
                      }}
                    >
                      ⚡ Nueva orden
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

            {/* ── Banner alerta ── */}
            <Section
              style={{
                backgroundColor: C.orangeL,
                borderLeft: `4px solid ${C.orange}`,
                padding: '12px 28px',
              }}
            >
              <Text style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: C.orange }}>
                ⚡ Nueva orden recibida — acción requerida
              </Text>
            </Section>

            {/* ── Datos del cliente ── */}
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
                Datos del cliente
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
                {clientRows.map(([label, value, type], i) => (
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
                        fontWeight: label === 'Orden' ? '700' : '400',
                        color: label === 'Orden' ? C.dark : C.gray900,
                        borderTop: i > 0 ? `1px solid ${C.gray200}` : 'none',
                      }}
                    >
                      {type === 'email' && customerEmail ? (
                        <Link
                          href={`mailto:${customerEmail}`}
                          style={{ color: C.brand, fontWeight: '600', textDecoration: 'none' }}
                        >
                          {customerEmail}
                        </Link>
                      ) : type === 'phone' && customerPhone ? (
                        <Link
                          href={`https://wa.me/57${customerPhone.replace(/\D/g, '')}`}
                          style={{ color: '#16a34a', fontWeight: '600', textDecoration: 'none' }}
                        >
                          {customerPhone}
                        </Link>
                      ) : (
                        value
                      )}
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

                {items.length > 0 ? (
                  items.map((item, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? C.white : C.gray50 }}>
                      <td
                        style={{
                          padding: '9px 14px',
                          fontSize: '13px',
                          color: C.gray900,
                          borderTop: `1px solid ${C.gray200}`,
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          padding: '9px 14px',
                          fontSize: '13px',
                          color: C.gray600,
                          textAlign: 'center',
                          borderTop: `1px solid ${C.gray200}`,
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: '9px 14px',
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
                    Total
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

            {/* ── CTA admin ── */}
            <Section
              style={{ backgroundColor: C.white, padding: '20px 28px 28px', textAlign: 'center' }}
            >
              <Button
                href={`${brand.siteUrl}/admin`}
                style={{
                  display: 'inline-block',
                  backgroundColor: C.orange,
                  color: C.white,
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '13px 28px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  letterSpacing: '0.3px',
                }}
              >
                Ver en el panel de administración →
              </Button>
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

AdminOrderAlertEmail.PreviewProps = {
  orderId: 'abc12345-def0-0000-0000-000000000001',
  customerName: 'Mario Basabe',
  customerEmail: 'mariobas20@gmail.com',
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
} satisfies AdminOrderAlertEmailProps
