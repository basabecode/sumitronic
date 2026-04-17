import type { Metadata } from 'next'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import KitBuilder from '@/components/kits/KitBuilder'
import { brand } from '@/lib/brand'
import { Shield, Truck, Headphones, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Combos de Seguridad | Sumitronic',
  description:
    'Arma tu combo de seguridad ideal con nuestro constructor inteligente. Selecciona cámara, almacenamiento, y complementos para el hogar o la oficina.',
  keywords: [
    'kit seguridad colombia',
    'combo camaras y ups',
    'kit imou hogar',
    'kit seguridad oficina colombia',
    'combo vigilancia negocio',
    'armador kit camaras seguridad',
  ],
  alternates: { canonical: '/kits' },
  openGraph: {
    title: `Kits de Seguridad — ${brand.name}`,
    description:
      'Configura tu solución de seguridad: cámaras, UPS y routers IMOU con precio en tiempo real.',
    url: `${brand.siteUrl}/kits`,
    siteName: brand.organizationName,
    locale: 'es_CO',
    type: 'website',
  },
}

const TRUST_ITEMS = [
  { icon: Shield, title: 'Garantía local', description: 'Soporte técnico en Colombia' },
  { icon: Package, title: 'Stock verificado', description: 'Solo productos disponibles' },
  { icon: Headphones, title: 'Asesoría sin costo', description: 'Te acompañamos en la elección' },
  { icon: Truck, title: 'Envío nacional', description: 'A toda Colombia' },
]

export default function KitsPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header />
      <main>
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-slate-950">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/kits-hero.png"
              alt="Hogar con sistema de seguridad instalado — cámaras IMOU, router WiFi y UPS Forza"
              fill
              className="object-cover opacity-80"
              priority
              sizes="100vw"
            />
            {/* Dark vignette strictly behind text, let the right side clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-[hsl(var(--background))/10] to-transparent h-24 mt-auto" />
          </div>

          <div className="relative container py-16 md:py-28">
            <div className="max-w-xl space-y-6">
              {/* Tag */}
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 backdrop-blur-md">
                <Shield className="h-4 w-4 text-sky-400" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-300">
                  Constructor de Kits
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl drop-shadow-sm">
                Arma tu kit de
                <br />
                <span className="text-sky-400">seguridad inteligente</span>
              </h1>

              {/* Description */}
              <p className="text-base leading-relaxed text-slate-300 max-w-md font-medium">
                Selecciona el espacio que quieres proteger, elige la escala y te configuramos el kit
                ideal con equipos IMOU en stock. Personaliza cada item y agrega todo al carrito en
                un clic.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2">
                {['Cámaras WiFi', 'UPS Forza', 'Routers IMOU', 'NVR grabadores'].map(tag => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative gradient bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[hsl(var(--background))] to-transparent" />
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
        <section className="bg-slate-50 border-b border-slate-100 py-12">
          <div className="container max-w-5xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-800">¿Cómo armar tu combo?</h2>
              <p className="text-sm font-medium text-slate-500 mt-2">
                Diseñamos una herramienta inteligente para que no tengas que adivinar qué productos
                comprar.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Selecciona tu espacio',
                  desc: 'Dinos qué lugar quieres proteger (hogar, negocio, bodega) y calcularemos la cobertura base ideal.',
                },
                {
                  step: '2',
                  title: 'Define el tamaño',
                  desc: 'Elige la escala de tu espacio. Esto ajustará automáticamente la cantidad de cámaras, tipo de router y UPS necesario.',
                },
                {
                  step: '3',
                  title: 'Personaliza a tu gusto',
                  desc: 'Agrega o quita productos, busca alternativas más económicas o premium, y luego lleva todo el combo con un solo clic.',
                },
              ].map(item => (
                <div
                  key={item.step}
                  className="flex flex-col items-center text-center rounded-2xl bg-white p-6 shadow-sm border border-slate-100"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── KIT BUILDER ──────────────────────────────────────────────── */}
        <section className="py-10">
          <div className="container">
            <KitBuilder />
          </div>
        </section>

        {/* ── TRUST STRIP ──────────────────────────────────────────────── */}
        <section className="border-t border-slate-100 bg-white py-10">
          <div className="container">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
