'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function DynamicBreadcrumbs() {
  const pathname = usePathname()
  
  // Ocultar migas de pan en home, admin, login, y detalle de producto (tiene breadcrumb propio con nombre real)
  if (
    pathname === '/' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth') ||
    /^\/products\/[0-9a-f-]{36}$/i.test(pathname)
  ) {
    return null
  }

  const paths = pathname.split('/').filter(Boolean)

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto w-full max-w-[1720px] px-4 py-2 md:px-6 xl:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Inicio</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {paths.map((path, index) => {
              const href = `/${paths.slice(0, index + 1).join('/')}`
              const isLast = index === paths.length - 1
              
              // Decodificar posibles URIs como %20
              let cleanPath = decodeURIComponent(path)
              // Reemplazar guiones 
              cleanPath = cleanPath.replace(/-/g, ' ')
              const title = cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1)

              return (
                <React.Fragment key={`${path}-${index}`}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-medium text-[hsl(var(--brand-strong))]">{title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}
