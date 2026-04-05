import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/profile', '/checkout', '/favorites', '/orders']
const ADMIN_ROUTES = ['/admin']

export const updateSession = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // Rutas que requieren autenticación básica
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  // Rutas que requieren rol admin
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))

  // Optimización: solo llamar a Supabase Auth cuando la ruta lo requiere.
  // Evita una llamada HTTP extra en cada request de la home, API routes, etc.
  if (!isProtected && !isAdminRoute) {
    return NextResponse.next({ request })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key must be defined in environment variables')
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && (isProtected || isAdminRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Verificar rol admin para rutas /admin
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || profile.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
