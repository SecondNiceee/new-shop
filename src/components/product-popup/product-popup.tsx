"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Loader2} from "lucide-react"
import { useProductsStore } from "@/entities/products/productsStore"
import { useRouter, useSearchParams } from "next/navigation"
import ErrorAlert from "../error-alert/ErrorAlert"
import { DialogTitle } from "@radix-ui/react-dialog"
import NutrientInformation from "./ui/NutrientInformation"
import RelatedProducts from "./ui/RelatedProducts"
import BreadCrumb from "./ui/BreadCrumb"
import ProductImage from "./ui/ProductImage"
import ProductInfo from "./ui/ProductInfo"
import ReviewSection from "./ui/ReviewSection"

const ProductPopup = () => {
  const searchParams = useSearchParams()
  const id = searchParams?.get("product")
  const router = useRouter()

  const { currentProduct, error, getProduct, isProductsPopupOpened, loading, setProductsPopup } = useProductsStore()
  // Эффект закрытия
  useEffect(() => {
    if (!id) {
      setProductsPopup(false)
    }
  }, [id, setProductsPopup])

  const onClose = () => {
    const newParams = new URLSearchParams(searchParams?.toString())
    newParams.delete("product")
    router.replace(`${window.location.pathname}?${newParams.toString()}`, { scroll: false })
  }

  // Загрузка товара и отзывов
  useEffect(() => {
    if (isProductsPopupOpened && id) {
      getProduct(id)
    }
  }, [id, isProductsPopupOpened])

  if (error) {
    return (
      <ErrorAlert
        buttonAction={() => getProduct(String(id))}
        errorMessage={"Не удалось загрузить товар, или товар был удален."}
      />
    )
  }
  return (
    <Dialog open={isProductsPopupOpened} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl border-none max-h-[90vh] p-0 overflow-hidden rounded-2xl z-[110] bg-white shadow-xl">
        <DialogTitle className="sr-only">{currentProduct?.title || "Просмотр товара"}</DialogTitle>
        {loading || !currentProduct ? (
          <div className="flex h-[80vh] items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <>
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 z-50 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: "90vh" }}>
              {/* Breadcrumb */}
              <BreadCrumb product={currentProduct} />

              {/* Main Product Section */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <NutrientInformation />
            </div>

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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProductPopup