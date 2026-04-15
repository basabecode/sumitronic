import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Button,
  Img,
  Hr,
  Tailwind,
  Link,
} from '@react-email/components'
import { brand } from '@/lib/brand'
import { emailTailwindConfig } from './config'

export interface ContactNotificationEmailProps {
  nombre: string
  apellido: string
  email: string
  telefono?: string
  asunto?: string
  mensaje: string
}

const C = {
  dark: '#003D52',
  mid: '#005068',
  brand: '#00A3BF',
  brandSoft: '#E0F6FA',
  brandLine: '#7DD3E8',
  orange: '#F97316',
  orangeL: '#FFF0E8',
  ok: '#28A745',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray400: '#94a3b8',
  gray600: '#64748b',
  gray900: '#111827',
  white: '#ffffff',
}

export default function ContactNotificationEmail({
  nombre,
  apellido,
  email,
  telefono,
  asunto,
  mensaje,
}: ContactNotificationEmailProps) {
  const fullName = `${nombre} ${apellido}`
  const subject = asunto || 'Consulta general'
  const replySubject = encodeURIComponent(`Re: ${subject} — ${brand.name}`)
  const replyBody = encodeURIComponent(`Hola ${nombre},\n\n`)

  const senderRows: [string, string, 'text' | 'email' | 'phone'][] = [
    ['Nombre', fullName, 'text'],
    ['Correo', email, 'email'],
    ...(telefono ? [['Teléfono', telefono, 'phone'] as [string, string, 'phone']] : []),
    ['Asunto', subject, 'text'],
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
            Mensaje de {fullName} — {subject}
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
                              Formulario de contacto
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
                        backgroundColor: C.brand,
                        color: C.white,
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        padding: '5px 12px',
                        borderRadius: '20px',
                      }}
                    >
                      Nuevo mensaje
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

            {/* ── Banner info ── */}
            <Section
              style={{
                backgroundColor: C.brandSoft,
                borderLeft: `4px solid ${C.brand}`,
                padding: '12px 28px',
              }}
            >
              <Text style={{ margin: '0', fontSize: '13px', fontWeight: '600', color: '#00728B' }}>
                Responde directamente a{' '}
                <Link
                  href={`mailto:${email}`}
                  style={{ color: C.brand, textDecoration: 'none', fontWeight: '700' }}
                >
                  {email}
                </Link>
              </Text>
            </Section>

            {/* ── Datos del remitente ── */}
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
                Remitente
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
                {senderRows.map(([label, value, type], i) => (
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
                        fontWeight: label === 'Nombre' ? '700' : '400',
                        color: label === 'Nombre' ? C.dark : C.gray900,
                        borderTop: i > 0 ? `1px solid ${C.gray200}` : 'none',
                      }}
                    >
                      {type === 'email' ? (
                        <Link
                          href={`mailto:${value}`}
                          style={{ color: C.brand, fontWeight: '600', textDecoration: 'none' }}
                        >
                          {value}
                        </Link>
                      ) : type === 'phone' ? (
                        <Link
                          href={`https://wa.me/57${value.replace(/\D/g, '')}`}
                          style={{ color: '#16a34a', fontWeight: '600', textDecoration: 'none' }}
                        >
                          {value}
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

            {/* ── Mensaje ── */}
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
                Mensaje
              </Text>
              <table
                cellPadding="0"
                cellSpacing="0"
                width="100%"
                style={{ borderCollapse: 'collapse' }}
              >
                <tr>
                  <td
                    style={{
                      backgroundColor: C.gray50,
                      border: `1px solid ${C.gray200}`,
                      borderRadius: '8px',
                      padding: '18px',
                      fontSize: '14px',
                      color: C.gray900,
                      lineHeight: '1.7',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {mensaje}
                  </td>
                </tr>
              </table>
            </Section>

            <Hr style={{ border: 'none', borderTop: `1px solid ${C.gray200}`, margin: '0 28px' }} />

            {/* ── CTA responder ── */}
            <Section
              style={{ backgroundColor: C.white, padding: '20px 28px 28px', textAlign: 'center' }}
            >
              <Button
                href={`mailto:${email}?subject=${replySubject}&body=${replyBody}`}
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
                Responder a {fullName} →
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

ContactNotificationEmail.PreviewProps = {
  nombre: 'Mario',
  apellido: 'Basabe',
  email: 'mariobas20@gmail.com',
  telefono: '3001234567',
  asunto: 'Cotización cámaras para local comercial',
  mensaje:
    'Buenas tardes,\n\nEstoy buscando un sistema de videovigilancia para un local de 200 m². Necesito cobertura interior y exterior, con acceso remoto desde el celular.\n\n¿Podrían enviarme una cotización con cámaras Hikvision de 4MP?\n\nGracias.',
} satisfies ContactNotificationEmailProps
