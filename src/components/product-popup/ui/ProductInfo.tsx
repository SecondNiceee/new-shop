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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
          {product.title.toUpperCase()}
        </h1>
        <p className="text-gray-500 text-base sm:text-lg">
          {product.weight.value} {product.weight.unit}
        </p>
      </div>

      <div className="space-y-4">
        {/* Price Section */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {formatPrice(discountInfo.discountedPrice)}
            </span>
            {discountInfo.hasDiscount && (
              <>
                <span className="text-lg sm:text-xl text-gray-400 line-through">
                  {formatPrice(discountInfo.originalPrice)}
                </span>
                <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-lg">
                  -{discountInfo.discountPercentage}%
                </span>
              </>
            )}
          </div>
          <span className="text-gray-500 text-sm sm:text-base">
            за {product.weight.value} {product.weight.unit}
          </span>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Favorites Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="w-12 h-12 sm:w-14 sm:h-14 p-0 hover:bg-gray-100 rounded-full border border-gray-200 flex-shrink-0"
          >
            <Heart
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button>

          {/* Counter or Add to Cart */}
          {qty > 0 ? (
            <div className="flex items-center gap-2 sm:gap-3 justify-between bg-white rounded-lg p-2 border border-gray-200 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                className="shadow-sm w-10 h-10 sm:w-12 sm:h-12 p-0 hover:bg-gray-200 rounded-lg flex-shrink-0"
                onClick={(e) => {
                  dicrement(product.id)
                  e.stopPropagation()
                }}
              >
                <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <span className="text-base sm:text-lg font-medium px-2 text-center min-w-[60px]">{qty} шт</span>
              <Button
                variant="ghost"
                size="sm"
                className="shadow-sm w-10 h-10 sm:w-12 sm:h-12 p-0 hover:bg-gray-200 rounded-lg flex-shrink-0"
                onClick={(e) => {
                  increment(product)
                  e.stopPropagation()
                }}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => increment(product)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-8 py-3 text-base sm:text-lg rounded-xl flex-1 min-w-0"
            >
              <span className="truncate">Добавить в корзину</span>
            </Button>
          )}
        </div>
      </div>

      {/* Product Description */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Описание товара</h3>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{product.description}</p>
      </div>

      {/* Storage Conditions */}
      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Условия хранения</h3>
        <p className="text-gray-700 text-sm sm:text-base">{product.storageConditions}</p>
      </div>

      {/* Ingredients */}
      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Состав</h3>
        <p className="text-gray-700 text-sm sm:text-base">{product.ingredients}</p>
      </div>
    </div>
  )
}

export default ProductInfo
