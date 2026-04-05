import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactoClient from './ContactoClient'
import { brand } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Contacto — Escribanos o pida una cotización',
  description:
    `Contáctenos por WhatsApp, correo o formulario. Atendemos consultas sobre cámaras, routers, UPS y repuestos en Cali con envíos a todo Colombia.`,
  keywords: [
    'contacto sumitronic',
    'cotizacion camaras seguridad cali',
    'soporte tecnico equipos colombia',
    'whatsapp sumitronic',
  ],
  alternates: { canonical: '/contacto' },
  openGraph: {
    title: `Contacto — ${brand.name}`,
    description:
      `Escríbanos por WhatsApp o formulario. Atendemos consultas sobre seguridad electrónica, redes y energía desde Cali.`,
    url: `${brand.siteUrl}/contacto`,
    siteName: brand.organizationName,
    locale: 'es_CO',
    type: 'website',
  },
}

const contactoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: brand.organizationName,
  url: brand.siteUrl,
  telephone: `+57${brand.whatsappClean}`,
  email: brand.supportEmail,
  address: {
    '@type': 'PostalAddress',
    streetAddress: brand.address.street,
    addressLocality: brand.address.city,
    addressRegion: brand.address.region,
    postalCode: brand.address.postalCode,
    addressCountry: brand.address.country,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: brand.hours.schema.weekdayOpen,
      closes: brand.hours.schema.weekdayClose,
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: brand.hours.schema.saturdayOpen,
      closes: brand.hours.schema.saturdayClose,
    },
  ],
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactoJsonLd) }}
      />
      <Header />
      <ContactoClient />
      <Footer />
    </div>
  )
}
