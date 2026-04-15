/**
 * Templates HTML para correos transaccionales de SUMITRONIC.
 * Solo inline CSS + tablas — compatible con Gmail, Outlook, Apple Mail.
 */

import { brand } from '@/lib/brand'

// ─── Colores de la marca (paleta oficial — globals.css) ──────────────────────
// Primario: cian hsl(195,100%,44.7%) ≈ #00A3BF
// Oscuro:   teal hsl(198.9,100%,18%) ≈ #003D52
// Éxito:    verde hsl(142,71%,34%)   ≈ #28A745 (solo totales/confirmaciones)
const C = {
  brand: '#00A3BF', // --brand: cian primario
  brandStrong: '#00728B', // --brand-strong: cian oscuro hover
  dark: '#003D52', // --foreground: teal muy oscuro (headers)
  darkMid: '#005068', // variante intermedia
  darkLight: '#006B8A', // variante más clara
  success: '#28A745', // --success: verde solo para confirmaciones/totales
  successLight: '#D1FAE5',
  successBorder: '#6EE7B7',
  orange: '#F97316', // --warning: alertas internas
  orangeLight: '#FFF7ED',
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray500: '#64748b',
  gray700: '#374151',
  gray900: '#111827',
  brandLight: '#E0F6FA', // fondo suave del brand
  brandBorder: '#7DD3E8', // borde suave del brand
} as const

// ─── Layout wrapper común ─────────────────────────────────────────────────────
function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="color-scheme" content="light"/>
  <title>${brand.name}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${C.gray100};font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.gray100};padding:24px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Header con logo ──────────────────────────────────────────────────────────
function emailHeader(subtitle?: string): string {
  return `
  <tr>
    <td style="background:linear-gradient(135deg,${C.dark} 0%,${C.darkMid} 100%);border-radius:12px 12px 0 0;padding:28px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <img src="${brand.logoUrl}" alt="${brand.name}" width="160" height="auto"
              style="display:block;max-width:160px;height:auto;"/>
          </td>
          ${
            subtitle
              ? `
          <td align="right" style="vertical-align:middle;">
            <span style="display:inline-block;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.85);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:6px 12px;border-radius:20px;border:1px solid rgba(255,255,255,0.2);">${subtitle}</span>
          </td>`
              : ''
          }
        </tr>
      </table>
    </td>
  </tr>`
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function emailFooter(): string {
  return `
  <tr>
    <td style="background-color:${C.darkMid};border-radius:0 0 12px 12px;padding:24px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.1);">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 12px;">
                  <a href="https://wa.me/${brand.whatsappNumber}" style="color:#4ade80;text-decoration:none;font-size:13px;font-weight:600;">
                    WhatsApp: ${brand.whatsappDisplay}
                  </a>
                </td>
                <td style="color:rgba(255,255,255,0.3);font-size:13px;">|</td>
                <td style="padding:0 12px;">
                  <a href="mailto:${brand.supportEmail}" style="color:#93c5fd;text-decoration:none;font-size:13px;">${brand.supportEmail}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:16px;">
            <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;line-height:20px;">
              ${brand.name} · ${brand.address.full}<br/>
              ${brand.hours.weekday} · ${brand.hours.saturday}
            </p>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.3);font-size:11px;">
              © ${new Date().getFullYear()} ${brand.name}. Todos los derechos reservados.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function divider(): string {
  return `<tr><td style="padding:0 32px;"><div style="height:1px;background-color:${C.gray200};"></div></td></tr>`
}

// =============================================================================
// Tipos compartidos
// =============================================================================

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface OrderData {
  id: string
  total: number
  payment_method?: string
  notes?: string
  customer_info?: {
    fullName?: string
    email?: string
    phone?: string
  }
  shipping_address?: {
    address?: string
    city?: string
    department?: string
  }
  items?: OrderItem[]
}

// ─── Helper tabla de productos ────────────────────────────────────────────────
function buildItemsRows(items: OrderItem[], compact = false): string {
  if (!Array.isArray(items) || items.length === 0) {
    return `<tr><td colspan="3" style="padding:16px;text-align:center;color:${C.gray500};">Sin detalle de productos</td></tr>`
  }
  return items
    .map(
      (item, i) => `
    <tr style="background-color:${i % 2 === 0 ? C.white : C.gray50};">
      <td style="padding:${compact ? '10' : '12'}px 16px;font-size:${compact ? 13 : 14}px;color:${C.gray900};border-bottom:1px solid ${C.gray200};">
        ${compact ? item.name : `<strong style="display:block;margin-bottom:2px;">${item.name}</strong>`}
      </td>
      <td style="padding:${compact ? '10' : '12'}px 16px;font-size:${compact ? 13 : 14}px;color:${C.gray500};text-align:center;border-bottom:1px solid ${C.gray200};white-space:nowrap;">
        ${compact ? item.quantity : `× ${item.quantity}`}
      </td>
      <td style="padding:${compact ? '10' : '12'}px 16px;font-size:${compact ? 13 : 14}px;font-weight:600;color:${C.gray900};text-align:right;border-bottom:1px solid ${C.gray200};white-space:nowrap;">
        $${(item.price * item.quantity).toLocaleString('es-CO')}
      </td>
    </tr>`
    )
    .join('')
}

// =============================================================================
// TEMPLATE 1: Confirmación de orden al cliente
// =============================================================================

export function buildOrderConfirmationEmail(order: OrderData): string {
  const orderId = `#${String(order.id).slice(0, 8).toUpperCase()}`
  const customerName = order.customer_info?.fullName || 'Cliente'
  const total = Number(order.total).toLocaleString('es-CO')

  const itemsRows = buildItemsRows(order.items ?? [])

  const addressLine = order.shipping_address
    ? [
        order.shipping_address.address,
        order.shipping_address.city,
        order.shipping_address.department,
      ]
        .filter(Boolean)
        .join(', ')
    : '—'

  const content = `
  ${emailHeader('Pedido confirmado')}

  <!-- Saludo hero -->
  <tr>
    <td style="background-color:${C.white};padding:32px 32px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <!-- Badge número de orden -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td style="background-color:${C.successLight};border:1px solid ${C.successBorder};border-radius:8px;padding:10px 16px;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:8px;">
                        <div style="width:20px;height:20px;background-color:${C.success};border-radius:50%;text-align:center;line-height:20px;">
                          <span style="color:${C.white};font-size:12px;font-weight:700;">✓</span>
                        </div>
                      </td>
                      <td>
                        <span style="font-size:13px;font-weight:700;color:${C.success};letter-spacing:0.5px;">Orden ${orderId} recibida</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:${C.dark};line-height:1.3;">
              Hola ${customerName},<br/>
              <span style="font-weight:400;color:${C.gray700};">tu pedido está en camino</span>
            </h1>
            <p style="margin:0;font-size:15px;color:${C.gray500};line-height:1.6;">
              Recibimos tu pedido y lo estamos procesando. Te contactaremos pronto para coordinar el pago y la entrega. Aquí tienes el resumen:
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${divider()}

  <!-- Detalles del pedido -->
  <tr>
    <td style="background-color:${C.white};padding:24px 32px;">
      <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:${C.darkLight};text-transform:uppercase;letter-spacing:1px;">Detalles del pedido</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.gray200};border-radius:8px;overflow:hidden;">
        <tr style="background-color:${C.gray50};">
          <td style="padding:8px 16px;font-size:12px;font-weight:700;color:${C.gray500};text-transform:uppercase;letter-spacing:0.5px;width:40%;">Campo</td>
          <td style="padding:8px 16px;font-size:12px;font-weight:700;color:${C.gray500};text-transform:uppercase;letter-spacing:0.5px;">Dato</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:13px;color:${C.gray500};border-top:1px solid ${C.gray200};">N.° de orden</td>
          <td style="padding:10px 16px;font-size:13px;font-weight:700;color:${C.dark};border-top:1px solid ${C.gray200};">${orderId}</td>
        </tr>
        <tr style="background-color:${C.gray50};">
          <td style="padding:10px 16px;font-size:13px;color:${C.gray500};">Método de pago</td>
          <td style="padding:10px 16px;font-size:13px;color:${C.gray900};">${order.payment_method || 'Por confirmar'}</td>
        </tr>
        ${
          order.notes
            ? `
        <tr>
          <td style="padding:10px 16px;font-size:13px;color:${C.gray500};border-top:1px solid ${C.gray200};">Referencia pago</td>
          <td style="padding:10px 16px;font-size:13px;color:${C.gray900};border-top:1px solid ${C.gray200};">${order.notes}</td>
        </tr>`
            : ''
        }
        <tr ${order.notes ? '' : `style="background-color:${C.gray50};"`}>
          <td style="padding:10px 16px;font-size:13px;color:${C.gray500};border-top:1px solid ${C.gray200};">Dirección de entrega</td>
          <td style="padding:10px 16px;font-size:13px;color:${C.gray900};border-top:1px solid ${C.gray200};">${addressLine}</td>
        </tr>
        ${
          order.customer_info?.phone
            ? `
        <tr style="background-color:${C.gray50};">
          <td style="padding:10px 16px;font-size:13px;color:${C.gray500};border-top:1px solid ${C.gray200};">Teléfono</td>
          <td style="padding:10px 16px;font-size:13px;color:${C.gray900};border-top:1px solid ${C.gray200};">${order.customer_info.phone}</td>
        </tr>`
            : ''
        }
      </table>
    </td>
  </tr>

  ${divider()}

  <!-- Productos -->
  <tr>
    <td style="background-color:${C.white};padding:24px 32px;">
      <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:${C.darkLight};text-transform:uppercase;letter-spacing:1px;">Productos</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.gray200};border-radius:8px;overflow:hidden;">
        <tr style="background-color:${C.dark};">
          <th style="padding:10px 16px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.8);text-align:left;letter-spacing:0.5px;">Producto</th>
          <th style="padding:10px 16px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.8);text-align:center;letter-spacing:0.5px;white-space:nowrap;">Cant.</th>
          <th style="padding:10px 16px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.8);text-align:right;letter-spacing:0.5px;white-space:nowrap;">Subtotal</th>
        </tr>
        ${itemsRows}
        <!-- Fila total -->
        <tr style="background:linear-gradient(135deg,${C.dark} 0%,${C.darkMid} 100%);">
          <td colspan="2" style="padding:14px 16px;font-size:14px;font-weight:700;color:rgba(255,255,255,0.9);">TOTAL A PAGAR</td>
          <td style="padding:14px 16px;font-size:20px;font-weight:700;color:${C.success};text-align:right;white-space:nowrap;">
            $${total} COP
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${divider()}

  <!-- CTA WhatsApp -->
  <tr>
    <td style="background-color:${C.white};padding:24px 32px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.brandLight};border-radius:10px;border-left:4px solid ${C.brand};padding:20px;">
        <tr>
          <td style="padding:0 0 8px;">
            <p style="margin:0;font-size:14px;font-weight:700;color:${C.dark};">¿Tienes preguntas sobre tu pedido?</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;">
            <p style="margin:0;font-size:13px;color:${C.gray500};line-height:1.5;">Escríbenos directamente y te respondemos en menos de 2 horas en horario de atención.</p>
          </td>
        </tr>
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;">
                  <a href="https://wa.me/${brand.whatsappNumber}?text=Hola%2C+tengo+una+consulta+sobre+mi+orden+${encodeURIComponent(orderId)}"
                    style="display:inline-block;background-color:#16a34a;color:${C.white};text-decoration:none;font-size:13px;font-weight:700;padding:10px 20px;border-radius:8px;">
                    Escribir por WhatsApp
                  </a>
                </td>
                <td>
                  <a href="mailto:${brand.supportEmail}"
                    style="display:inline-block;background-color:${C.white};color:${C.brand};text-decoration:none;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;border:1px solid ${C.brand};">
                    Enviar correo
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${emailFooter()}`

  return emailWrapper(content)
}

// =============================================================================
// TEMPLATE 2: Alerta interna de nueva orden (para admin)
// =============================================================================

export function buildAdminOrderAlertEmail(order: OrderData): string {
  const orderId = `#${String(order.id).slice(0, 8).toUpperCase()}`
  const total = Number(order.total).toLocaleString('es-CO')

  const itemsRows = buildItemsRows(order.items ?? [], true)

  const content = `
  ${emailHeader('Nueva orden')}

  <!-- Alerta -->
  <tr>
    <td style="background:linear-gradient(135deg,${C.orangeLight} 0%,#fef9c3 100%);padding:16px 32px;border-left:4px solid ${C.orange};">
      <p style="margin:0;font-size:14px;font-weight:700;color:${C.orange};">
        ⚡ Nueva orden recibida — acción requerida
      </p>
    </td>
  </tr>

  <!-- Resumen cliente -->
  <tr>
    <td style="background-color:${C.white};padding:28px 32px 20px;">
      <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:${C.darkLight};text-transform:uppercase;letter-spacing:1px;">Datos del cliente</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.gray200};border-radius:8px;overflow:hidden;">
        ${[
          ['Orden', orderId],
          ['Cliente', order.customer_info?.fullName || '—'],
          ['Email', order.customer_info?.email || '—'],
          ['Teléfono', order.customer_info?.phone || '—'],
          ['Método de pago', order.payment_method || '—'],
          [
            'Dirección',
            [
              order.shipping_address?.address,
              order.shipping_address?.city,
              order.shipping_address?.department,
            ]
              .filter(Boolean)
              .join(', ') || '—',
          ],
          ...(order.notes ? [['Referencia pago', order.notes]] : []),
        ]
          .map(
            ([label, value], i) => `
        <tr style="${i % 2 !== 0 ? `background-color:${C.gray50};` : ''}">
          <td style="padding:10px 16px;font-size:13px;color:${C.gray500};width:160px;${i > 0 ? `border-top:1px solid ${C.gray200};` : ''}">${label}</td>
          <td style="padding:10px 16px;font-size:13px;font-weight:${label === 'Orden' ? '700' : '400'};color:${label === 'Orden' ? C.dark : C.gray900};${i > 0 ? `border-top:1px solid ${C.gray200};` : ''}">${value}</td>
        </tr>`
          )
          .join('')}
      </table>
    </td>
  </tr>

  ${divider()}

  <!-- Productos -->
  <tr>
    <td style="background-color:${C.white};padding:20px 32px;">
      <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:${C.darkLight};text-transform:uppercase;letter-spacing:1px;">Productos</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.gray200};border-radius:8px;overflow:hidden;">
        <tr style="background-color:${C.dark};">
          <th style="padding:10px 16px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.8);text-align:left;">Producto</th>
          <th style="padding:10px 16px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.8);text-align:center;">Cant.</th>
          <th style="padding:10px 16px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.8);text-align:right;">Subtotal</th>
        </tr>
        ${itemsRows}
        <tr style="background:linear-gradient(135deg,${C.dark} 0%,${C.darkMid} 100%);">
          <td colspan="2" style="padding:14px 16px;font-size:14px;font-weight:700;color:rgba(255,255,255,0.9);">TOTAL</td>
          <td style="padding:14px 16px;font-size:20px;font-weight:700;color:${C.success};text-align:right;">$${total} COP</td>
        </tr>
      </table>
    </td>
  </tr>

  ${divider()}

  <!-- CTA admin -->
  <tr>
    <td style="background-color:${C.white};padding:20px 32px 32px;text-align:center;">
      <a href="${brand.siteUrl}/admin"
        style="display:inline-block;background:linear-gradient(135deg,${C.dark} 0%,${C.darkMid} 100%);color:${C.white};text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;letter-spacing:0.3px;">
        Ver en el panel de administración →
      </a>
    </td>
  </tr>

  ${emailFooter()}`

  return emailWrapper(content)
}

// =============================================================================
// TEMPLATE 3: Notificación de formulario de contacto (para soporte)
// =============================================================================

export interface ContactData {
  nombre: string
  apellido: string
  email: string
  telefono?: string
  asunto?: string
  mensaje: string
}

export function buildContactNotificationEmail(data: ContactData): string {
  const fullName = `${data.nombre} ${data.apellido}`
  const subject = data.asunto || 'Consulta general'

  const content = `
  ${emailHeader('Nuevo mensaje')}

  <!-- Alerta -->
  <tr>
    <td style="background-color:${C.brandLight};padding:14px 32px;border-left:4px solid ${C.brand};">
      <p style="margin:0;font-size:14px;font-weight:600;color:${C.brand};">
        Mensaje de contacto — responde directamente a <a href="mailto:${data.email}" style="color:${C.brand};">${data.email}</a>
      </p>
    </td>
  </tr>

  <!-- Datos del contacto -->
  <tr>
    <td style="background-color:${C.white};padding:28px 32px 20px;">
      <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:${C.darkLight};text-transform:uppercase;letter-spacing:1px;">Remitente</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.gray200};border-radius:8px;overflow:hidden;">
        <tr>
          <td style="padding:10px 16px;font-size:13px;color:${C.gray500};width:120px;">Nombre</td>
          <td style="padding:10px 16px;font-size:13px;font-weight:700;color:${C.dark};">${fullName}</td>
        </tr>
        <tr style="background-color:${C.gray50};">
          <td style="padding:10px 16px;font-size:13px;color:${C.gray500};border-top:1px solid ${C.gray200};">Correo</td>
          <td style="padding:10px 16px;font-size:13px;border-top:1px solid ${C.gray200};">
            <a href="mailto:${data.email}" style="color:${C.brand};font-weight:600;text-decoration:none;">${data.email}</a>
          </td>
        </tr>
        ${
          data.telefono
            ? `
        <tr>
          <td style="padding:10px 16px;font-size:13px;color:${C.gray500};border-top:1px solid ${C.gray200};">Teléfono</td>
          <td style="padding:10px 16px;font-size:13px;color:${C.gray900};border-top:1px solid ${C.gray200};">
            <a href="https://wa.me/57${data.telefono.replace(/\D/g, '')}" style="color:${C.success};font-weight:600;text-decoration:none;">${data.telefono}</a>
          </td>
        </tr>`
            : ''
        }
        <tr style="${data.telefono ? '' : `background-color:${C.gray50};`}">
          <td style="padding:10px 16px;font-size:13px;color:${C.gray500};border-top:1px solid ${C.gray200};">Asunto</td>
          <td style="padding:10px 16px;font-size:13px;font-weight:600;color:${C.gray900};border-top:1px solid ${C.gray200};">${subject}</td>
        </tr>
      </table>
    </td>
  </tr>

  ${divider()}

  <!-- Mensaje -->
  <tr>
    <td style="background-color:${C.white};padding:20px 32px;">
      <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:${C.darkLight};text-transform:uppercase;letter-spacing:1px;">Mensaje</h2>
      <div style="background-color:${C.gray50};border-radius:8px;border:1px solid ${C.gray200};padding:20px;">
        <p style="margin:0;font-size:14px;color:${C.gray900};line-height:1.7;white-space:pre-wrap;">${data.mensaje}</p>
      </div>
    </td>
  </tr>

  ${divider()}

  <!-- CTA responder -->
  <tr>
    <td style="background-color:${C.white};padding:20px 32px 32px;text-align:center;">
      <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(subject)} — ${brand.name}&body=Hola ${encodeURIComponent(data.nombre)},%0A%0A"
        style="display:inline-block;background:linear-gradient(135deg,${C.brand} 0%,#1d4ed8 100%);color:${C.white};text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;letter-spacing:0.3px;">
        Responder a ${fullName} →
      </a>
    </td>
  </tr>

  ${emailFooter()}`

  return emailWrapper(content)
}
