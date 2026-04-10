import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .eq('active', true)
      .not('brand', 'is', null)
      .order('brand')

    if (error) {
      console.error('Error fetching brands:', error)
      return NextResponse.json([], { status: 200 })
    }

    const uniqueBrands = Array.from(
      new Set((data || []).map(p => p.brand).filter(Boolean))
    ) as string[]
    const brands = uniqueBrands.map(brand => ({ id: brand, name: brand }))

    return NextResponse.json(brands, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Brands API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
