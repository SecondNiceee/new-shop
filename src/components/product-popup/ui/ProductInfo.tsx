"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/entities/cart/cartStore"
import { useFavoritesStore } from "@/entities/favorites/favoritesStore"
import { useAuthStore } from "@/entities/auth/authStore"
import type { Product } from "@/payload-types"
import { Minus, Plus, Heart } from "lucide-react"
import { useGuestBenefitsStore } from "@/components/auth/guest-benefits-modal"
import { getDiscountInfo, formatPrice } from "@/utils/discountUtils"

const ProductInfo = ({ product }: { product: Product }) => {
  const { increment, dicrement, items } = useCartStore()
  const { addToFavorites, removeFromFavorites, favoriteProductIds } = useFavoritesStore()
  const { user } = useAuthStore()
  const isFavorite = [...favoriteProductIds].find((id) => id === product.id)
  const qty = items.find((it) => it.product.id === product?.id)?.quantity ?? 0
  const { openDialog } = useGuestBenefitsStore()

  const discountInfo = getDiscountInfo(product)

  const handleFavoriteClick = async () => {
    if (!user) {
      openDialog("favorites")
      return
    }
    if (isFavorite) {
      await removeFromFavorites(product.id)
    } else {
      await addToFavorites(product.id)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title.toUpperCase()}</h1>
        <p className="text-gray-500 text-lg">
          {product.weight.value} {product.weight.unit}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(discountInfo.discountedPrice)}</span>
            {discountInfo.hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(discountInfo.originalPrice)}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-lg">
                  -{discountInfo.discountPercentage}%
                </span>
              </>
            )}
          </div>
          <span className="text-gray-500">
            за {product.weight.value} {product.weight.unit}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="w-12 h-12 p-0 hover:bg-gray-100 rounded-full border border-gray-200"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button>

          {qty > 0 ? (
            <div className="flex items-center gap-3 justify-between bg-white rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                className="shadow-xl w-7 h-7 md::w-12 md:h-12  p-4 hover:bg-gray-200"
                onClick={(e) => {
                  dicrement(product.id)
                  e.stopPropagation()
                }}
              >
                <Minus className="!w-[25px] !h-[25px]" />
              </Button>
              <span className="text-lg font-medium px-2">{qty} шт</span>
              <Button
                variant="ghost"
                className="shadow-xl w-7 h-7 md::w-12 md:h-12 p-4 hover:bg-gray-200"
                onClick={(e) => {
                  increment(product)
                  e.stopPropagation()
                }}
              >
                <Plus className="!w-[25px] !h-[25px]" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => increment(product)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded-xl"
            >
              Добавить в корзину
            </Button>
          )}
        </div>
      </div>

      {/* Product Description */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Описание товара</h3>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* Storage Conditions */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">Условия хранения</h3>
        <p className="text-gray-700">{product.storageConditions}</p>
      </div>

      {/* Ingredients */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">Состав</h3>
        <p className="text-gray-700">{product.ingredients}</p>
      </div>
    </div>
  )
}

export default ProductInfo
