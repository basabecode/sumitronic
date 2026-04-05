'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BRAND_PROFILES } from '@/lib/brands'

const DAY_MS = 24 * 60 * 60 * 1000
const ROTATION_REFERENCE = new Date('2026-01-06T00:00:00-05:00')

function formatNextChange(date: Date) {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
  }).format(date)
}

function getRotation(intervalDays: number, offset = 0) {
  const now = new Date()
  const elapsedDays = Math.max(
    0,
    Math.floor((now.getTime() - ROTATION_REFERENCE.getTime()) / DAY_MS)
  )
  const period = Math.floor(elapsedDays / intervalDays)
  const rawIndex = (period + offset) % BRAND_PROFILES.length
  const index = rawIndex < 0 ? rawIndex + BRAND_PROFILES.length : rawIndex
  const nextChange = new Date(
    ROTATION_REFERENCE.getTime() + (period + 1) * intervalDays * DAY_MS
  )

  return {
    index,
    brand: BRAND_PROFILES[index],
    nextChangeLabel: formatNextChange(nextChange),
  }
}

export default function BrandsSection() {
  const featuredRotation = getRotation(14, 0)
  let noveltyRotation = getRotation(7, 2)

  if (noveltyRotation.index === featuredRotation.index) {
    const adjustedIndex = (noveltyRotation.index + 1) % BRAND_PROFILES.length
    noveltyRotation = {
      ...noveltyRotation,
      index: adjustedIndex,
      brand: BRAND_PROFILES[adjustedIndex],
    }
  }

  const featuredBrand = featuredRotation.brand
  const noveltyBrand = noveltyRotation.brand

  return (
    <section className="overflow-hidden bg-gradient-to-b from-white via-[hsl(var(--surface-highlight))]/35 to-white py-14 md:py-16">
      <div className="container">
        <div className="mb-8 text-center md:mb-10">
          <p className="eyebrow-label">Marcas destacadas</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[hsl(var(--foreground))] md:text-4xl">
            Referencias que el cliente reconoce y vuelve a buscar
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[hsl(var(--text-muted))] md:text-lg">
            Seguridad, redes, energia y accesorios con marcas que suelen tener buena salida por respaldo, disponibilidad y facilidad para recomendar segun la necesidad.
          </p>
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full bg-[hsl(var(--surface-highlight))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--brand-strong))]">
            Explora por marca
          </span>
          <span className="hidden text-sm text-[hsl(var(--text-muted))] sm:inline">
            Pasa el cursor o toca un logo para ver su linea
          </span>
        </div>

        {/* Grid de logos — todos con el mismo bounding box para proporciones uniformes */}
        <div className="mb-12 mt-6 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 px-4 sm:grid-cols-3 md:grid-cols-6 md:gap-x-8 lg:gap-x-12">
          {BRAND_PROFILES.map(brand => (
            <Link
              key={brand.slug}
              href={`/marcas/${brand.slug}`}
              className="group flex w-full flex-col items-center justify-center transition-transform hover:-translate-y-1 hover:scale-105"
              title={brand.name}
              aria-label={`Ver productos de ${brand.name}`}
            >
              {/* Contenedor con dimensiones fijas: 160×56 px — igual para todos los logos */}
              <div className="relative mx-auto h-14 w-full max-w-[160px]">
                <Image
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  fill
                  className={`object-contain px-2 py-1 opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-hover:drop-shadow-[0_6px_14px_rgba(0,119,168,0.22)] ${brand.carouselLogoClass}`}
                  sizes="160px"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.9fr]">
          {/* Tarjeta: Marca destacada */}
          <article className="section-shell p-5 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-[hsl(var(--surface-highlight))] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--brand-strong))]">
                    Marca destacada
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))] md:text-[2rem]">
                    {featuredBrand.name}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[hsl(var(--text-muted))]">
                    {featuredBrand.category}
                  </p>
                </div>

                <div className="relative h-14 w-24 shrink-0 rounded-2xl border border-[hsl(var(--border-subtle))] bg-white">
                  <Image
                    src={featuredBrand.logo}
                    alt={`Logo ${featuredBrand.name}`}
                    fill
                    className={`object-contain p-3 ${featuredBrand.panelLogoClass}`}
                    sizes="96px"
                  />
                </div>
              </div>

              <p className="text-sm leading-6 text-[hsl(var(--text-muted))] md:text-[0.96rem]">
                {featuredBrand.summary}
              </p>

              <div className="flex flex-wrap gap-2">
                {featuredBrand.useCases.map(useCase => (
                  <span
                    key={useCase}
                    className="rounded-full border border-[hsl(var(--border-subtle))] bg-white px-3 py-1.5 text-sm text-[hsl(var(--text-muted))]"
                  >
                    {useCase}
                  </span>
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[1.35rem] bg-[hsl(var(--surface-highlight))] px-4 py-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[hsl(var(--brand-strong))]">
                    Donde mejor encaja
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">
                    {featuredBrand.salesAngle}
                  </p>
                </div>

                <div className="rounded-[1.35rem] bg-[hsl(var(--surface-muted))] px-4 py-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[hsl(var(--foreground))]">
                    {featuredBrand.lineupTitle}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[hsl(var(--text-muted))]">
                    {featuredBrand.lineupCopy}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-[hsl(var(--border-subtle))] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[hsl(var(--text-muted))]">
                  <span className="font-semibold text-[hsl(var(--foreground))]">Proxima publicacion:</span>{' '}
                  {featuredRotation.nextChangeLabel}
                </p>
                <Link
                  href={`/marcas/${featuredBrand.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--brand-strong))] transition-opacity hover:opacity-80"
                >
                  Ver linea {featuredBrand.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>

          {/* Tarjeta: Novedad de marca */}
          <article className="section-shell p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-[hsl(var(--surface-highlight))] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--brand-strong))]">
                  Novedad de marca
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
                  {noveltyBrand.focusTitle}
                </h3>
              </div>

              <div className="relative h-14 w-24 shrink-0 rounded-2xl border border-[hsl(var(--border-subtle))] bg-white">
                <Image
                  src={noveltyBrand.logo}
                  alt={`Logo ${noveltyBrand.name}`}
                  fill
                  className={`object-contain p-3 ${noveltyBrand.panelLogoClass}`}
                  sizes="96px"
                />
              </div>
            </div>

            <div className="mt-5 rounded-[1.35rem] bg-[hsl(var(--surface-muted))] px-4 py-4">
              <p className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${noveltyBrand.accentClass}`}>
                {noveltyBrand.name}
              </p>
              <p className="mt-3 text-sm leading-6 text-[hsl(var(--text-muted))]">
                {noveltyBrand.lineupCopy}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <p className="text-sm leading-6 text-[hsl(var(--text-muted))]">
                {noveltyBrand.salesAngle}
              </p>

              <div className="flex flex-wrap gap-2">
                {noveltyBrand.useCases.map(useCase => (
                  <span
                    key={useCase}
                    className="rounded-full border border-[hsl(var(--border-subtle))] bg-white px-3 py-1.5 text-sm text-[hsl(var(--text-muted))]"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-[hsl(var(--border-subtle))] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[hsl(var(--text-muted))]">
                <span className="font-semibold text-[hsl(var(--foreground))]">Proxima publicacion:</span>{' '}
                {noveltyRotation.nextChangeLabel}
              </p>
              <Link
                href={`/marcas/${noveltyBrand.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--brand-strong))] transition-opacity hover:opacity-80"
              >
                Ver linea {noveltyBrand.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
