import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: categories, error } = await supabase
      .from('categories')
      .select(
        `
        id,
        name,
        slug,
        description,
        image_url,
        sort_order
      `
      )
      .eq('active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      // Usar categorías de los productos JSON como fallback
      const jsonProducts = await import('@/lib/products.json')
      const allProducts = jsonProducts.default

      const uniqueCategories = Array.from(
        new Set(allProducts.map((p: any) => p.category))
      ).map((category: any, index: number) => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        slug: category,
        description: `Categoría de ${category}`,
        image_url: null,
        sort_order: index + 1,
      }))

      return NextResponse.json(uniqueCategories)
    }

    // Si no hay categorías en Supabase, usar fallback
    if (!categories || categories.length === 0) {
      const jsonProducts = await import('@/lib/products.json')
      const allProducts = jsonProducts.default

      const uniqueCategories = Array.from(
        new Set(allProducts.map((p: any) => p.category))
      ).map((category: any, index: number) => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        slug: category,
        description: `Categoría de ${category}`,
        image_url: null,
        sort_order: index + 1,
      }))

      return NextResponse.json(uniqueCategories)
    }

    // Retornar categorías como array plano (sin jerarquía por ahora)
    return NextResponse.json(categories || [])
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verificar autenticación y rol de admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si es admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, image_url, sort_order } = body

    // Generar slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description,
        image_url,
        sort_order: sort_order || 0,
        active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return NextResponse.json(
        { error: 'Error al crear categoría' },
        { status: 500 }
      )
    }

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
