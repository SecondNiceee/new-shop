"use client"
import { useEffect } from "react"
import { Loader2, ArrowLeft } from "lucide-react"
import { useProductsStore } from "@/entities/products/productsStore"
import { useRouter, useSearchParams } from "next/navigation"
import ErrorAlert from "@/components/error-alert/ErrorAlert"
import BreadCrumb from "@/components/product-page/ui/BreadCrumb"
import NutrientInformation from "@/components/product-page/ui/NutrientInformation"
import ProductImage from "@/components/product-page/ui/ProductImage"
import ProductInfo from "@/components/product-page/ui/ProductInfo"
import RelatedProducts from "@/components/product-page/ui/RelatedProducts"
import ReviewSection from "@/components/product-page/ui/ReviewSection"
import { routerConfig } from "@/config/router.config"

export default function ProductPage() {
  const searchParams = useSearchParams()
  const id = searchParams?.get("id")
  const router = useRouter()

  const { currentProduct, error, getProduct, loading } = useProductsStore()

  const handleGoBack = () => {
    router.back()
  }

  // Redirect to home if no product ID
  useEffect(() => {
    if (!id) {
      router.push(routerConfig.home)
    }
  }, [id, router])

  // Load product data
  useEffect(() => {
    if (id) {
      getProduct(id)
    }
  }, [id, getProduct])

  if (error) {
    return (
      <ErrorAlert
        buttonAction={() => getProduct(String(id))}
        errorMessage={"Не удалось загрузить товар, или товар был удален."}
      />
    )
  }

  if (loading || !currentProduct) {
    return (
      <div className="flex h-[80vh] items-center justify-center py-8">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    )
  }

  return (
    <section className="min-h-screen mx-auto bg-white max-w-7xl">
      <div className="px-3 pt-4 sm:px-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors duration-200 rounded-lg hover:text-gray-800 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться назад</span>
        </button>
      </div>

      {/* Breadcrumb */}
      <BreadCrumb product={currentProduct} />

      {/* Main Product Section */}
      <div className="px-3 py-2 sm:px-6 sm:py-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-8">
          {/* Product Image */}
          <ProductImage product={currentProduct} />

          {/* Product Info */}
          <ProductInfo product={currentProduct} />
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection id={id} product={currentProduct} />

      {/* Related Products Section */}
      <RelatedProducts product={currentProduct} />

      {/* Nutrition Information */}
      <NutrientInformation product={currentProduct} />

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 12px 0;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
      `}</style>
    </section>
  )
}
