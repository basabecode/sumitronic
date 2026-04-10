import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: { id: string }
}

async function requireAdmin(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { user: null, profile: null, error: 'No autorizado', status: 401 }
  }

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()

  if (profile?.role !== 'admin') {
    return { user, profile, error: 'Acceso denegado', status: 403 }
  }

  return { user, profile, error: null, status: 200 }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient()

    const { error, status } = await requireAdmin(supabase)
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    // Verificar que la categoría existe
    const { data: existing, error: fetchError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    const body = await request.json()
    const { name, slug, description, image_url, active, sort_order } = body

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (image_url !== undefined) updates.image_url = image_url
    if (active !== undefined) updates.active = active
    if (sort_order !== undefined) updates.sort_order = sort_order

    // Regenerar slug si se provee nombre pero no slug explícito
    if (slug !== undefined) {
      updates.slug = slug
    } else if (name !== undefined) {
      updates.slug = (name as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }

    const { data: category, error: updateError } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating category:', updateError)
      // Conflict: slug o name duplicados
      if (updateError.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe una categoría con ese nombre o slug' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: 'Error al actualizar la categoría' }, { status: 500 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Category PUT [id] error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient()

    const { error, status } = await requireAdmin(supabase)
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    // Verificar que no hay productos asociados a esta categoría
    const { count, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', params.id)

    if (countError) {
      console.error('Error checking products for category:', countError)
      return NextResponse.json({ error: 'Error al verificar productos asociados' }, { status: 500 })
    }

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar la categoría porque tiene ${count} producto(s) asociado(s). Reasigna o elimina los productos primero.`,
        },
        { status: 409 }
      )
    }

    const { error: deleteError } = await supabase.from('categories').delete().eq('id', params.id)

    if (deleteError) {
      console.error('Error deleting category:', deleteError)
      return NextResponse.json({ error: 'Error al eliminar la categoría' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Categoría eliminada correctamente' })
  } catch (error) {
    console.error('Category DELETE [id] error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
