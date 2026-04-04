import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ProductsSection } from '@/components/products/ProductsSection'

function ProductsPageSkeleton() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-3 text-center">
        <div className="skeleton mx-auto h-3 w-20 rounded-full" />
        <div className="skeleton mx-auto h-8 w-52 rounded-full" />
        <div className="skeleton mx-auto h-4 w-80 rounded-full" />
      </div>
      <div className="skeleton h-16 w-full rounded-2xl" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4">
            <div className="skeleton aspect-square w-full rounded-xl" />
            <div className="skeleton mt-3 h-3 w-20 rounded-full" />
            <div className="skeleton mt-2 h-4 w-full rounded-full" />
            <div className="skeleton mt-1 h-4 w-3/4 rounded-full" />
            <div className="mt-auto space-y-2 pt-4">
              <div className="skeleton h-5 w-28 rounded-full" />
              <div className="skeleton h-9 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header />
      <main>
        <Suspense fallback={<ProductsPageSkeleton />}>
          <ProductsSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
