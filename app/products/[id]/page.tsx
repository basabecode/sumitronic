import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import ProductClient from './ProductClient'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { brand } from '@/lib/brand'

// ISR Configuration: Revalidate every hour (3600 seconds)
export const revalidate = 3600

function createStaticSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Generate static params for popular products
export async function generateStaticParams() {
  try {
    const supabase = createStaticSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !data) return []

    return data.map((product: { id: string }) => ({
      id: product.id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

async function getProduct(id: string) {
  try {
    const supabase = createStaticSupabaseClient()
    if (!supabase) return null

    const { data: product, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories!category_id (
          id,
          name,
          slug
        ),
        product_images (
          id,
          image_url,
          alt_text,
          is_primary,
          sort_order
        ),
        inventory (
          id,
          quantity_available,
          reserved_quantity,
          last_updated
        )
      `
      )
      .eq('id', id)
      .eq('active', true)
      .single()

    if (error || !product) {
      return null
    }

    const { data: relatedProducts } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories!category_id (
          id,
          name,
          slug
        ),
        product_images (
          id,
          image_url,
          alt_text,
          is_primary,
          sort_order
        )
      `
      )
      .eq('category_id', product.category_id)
      .eq('active', true)
      .neq('id', id)
      .limit(4)

    return {
      product,
      relatedProducts: relatedProducts || [],
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getProduct(params.id)

  if (!data || !data.product) {
    return {
      title: `Producto no encontrado | ${brand.organizationName}`,
    }
  }

  const product = data.product
  const price = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price)

  return {
    title: `${product.name} - Precio Colombia`,
    description: `Compra ${product.name} en Colombia por ${price}. ${product.description.substring(0, 150)}... Envíos a todo el país y garantía local.`,
    openGraph: {
      title: `${product.name} - ${price} | ${brand.organizationName}`,
      description: product.description.substring(0, 200),
      images: product.product_images?.map((img: any) => ({
        url: img.image_url,
        alt: img.alt_text || product.name,
        width: 800,
        height: 800,
      })) || [{ url: '/og-image.png', width: 1200, height: 630 }],
      locale: 'es_CO',
      type: 'website',
    },
    alternates: {
      canonical: `/products/${product.id}`,
    },
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const data = await getProduct(params.id)

  if (!data || !data.product) {
    notFound()
  }

  const { product, relatedProducts } = data

  // JSON-LD Structured Data for Product
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.product_images?.map((img: any) => img.image_url) || [],
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Genérico',
    },
    offers: {
      '@type': 'Offer',
      url: `${brand.siteUrl}/products/${product.id}`,
      priceCurrency: 'COP',
      price: product.price,
      availability:
        product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: brand.organizationName,
        url: brand.siteUrl,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          currency: 'COP',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'CO',
        },
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: brand.siteUrl },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Productos',
          item: `${brand.siteUrl}/products`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name,
          item: `${brand.siteUrl}/products/${product.id}`,
        },
      ],
    },
  }

  return (
    <div className="min-h-screen bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="py-8 md:py-10">
        <ProductClient product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  )
}
