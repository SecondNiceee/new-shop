'use client'

// import { useAuthStore } from "../store/auth-store"
// import { useCart } from "../hooks/useCart"
// import { AuthModal } from "../components/auth-modal"
// import { ProductCard } from "../components/product-card"
// import { HeroBanner } from "../components/hero-banner"
// import { products } from "../data/products"
import { Button } from '@/components/ui/button'
import { Categories } from '@/components/categories/categories'
import { Header } from '@/components/header/header'
import { useUserStore } from '@/entities/user/userStore'

export default function EcomarketApp() {
  const { user } = useUserStore()
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Categories />
      {/* Popular Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">ПОПУЛЯРНОЕ</h2>
          <Button variant="link" className="text-green-600">
            +29 ещё →
          </Button>
        </div>

        {/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div> */}
      </div>
    </div>
  )
}
