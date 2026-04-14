import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Cloudflare Access: bloquear acceso si el Zero Trust gateway no autenticó al usuario.
  // Activar con SITE_PROTECTED=true en Vercel durante pre-producción; desactivar al lanzar.
  if (process.env.SITE_PROTECTED === 'true' && process.env.NODE_ENV !== 'development') {
    if (!request.headers.get('cf-access-authenticated-user-email')) {
      return new NextResponse('Acceso restringido', { status: 403 })
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    // Excluir: archivos estáticos, rutas de API, imágenes y assets
    '/((?!_next|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
