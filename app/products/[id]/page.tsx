import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// ISR Configuration: Revalidate every hour (3600 seconds)
export const revalidate = 3600

// Generate static params for popular products
export async function generateStaticParams() {
  try {
    const isLocal = process.env.NODE_ENV === 'development'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (isLocal ? 'http://localhost:3003' : 'http://localhost:3000')

    // Fetch top 50 products to pre-render
    const res = await fetch(`${baseUrl}/api/products?limit=50&sortBy=created_at&sortOrder=desc`, {
      next: { revalidate: 3600 }
    })

    if (!res.ok) return []

    const data = await res.json()

    return data.products?.map((product: any) => ({
      id: product.id,
    })) || []
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

async function getProduct(id: string) {
  // Handle local development port 3003
  const isLocal = process.env.NODE_ENV === 'development'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (isLocal ? 'http://localhost:3003' : 'http://localhost:3000')

  try {
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      next: { revalidate: 3600 }, // ISR: Cache for 1 hour
    })

    if (!res.ok) return null

    return res.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getProduct(params.id)

  if (!data || !data.product) {
    return {
      title: 'Producto no encontrado | CapiShop Colombia',
    }
  }

  const product = data.product
  const price = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price)

  return {
    title: `${product.name} - Precio Colombia | CapiShop`,
    description: `Compra ${product.name} en Colombia por ${price}. ${product.description.substring(0, 150)}... Envíos a todo el país y garantía local.`,
    openGraph: {
      title: `${product.name} - ${price} | CapiShop Colombia`,
      description: product.description.substring(0, 200),
      images: product.product_images?.map((img: any) => ({
        url: img.image_url,
        alt: img.alt_text || product.name,
      })) || [],
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
      url: `https://capishop-web.vercel.app/products/${product.id}`,
      priceCurrency: 'COP',
      price: product.price,
      availability: product.stock_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="py-8">
        <ProductClient product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  )
}
