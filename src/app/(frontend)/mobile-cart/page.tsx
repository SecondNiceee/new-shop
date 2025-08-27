"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react"
import { useCartStore } from "@/entities/cart/cartStore"
import type { Media } from "@/payload-types"
import { useRouter } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import { getDiscountInfo, formatPrice } from "@/utils/discountUtils"

export default function MobileCartPage() {
  const router = useRouter()
  const { items, totalCount, totalPrice, remove, clear, loadServer, increment, dicrement } = useCartStore()

  useEffect(() => {
    loadServer().catch(() => {})
  }, [loadServer])

  const handleCheckout = () => {
    router.push(routerConfig.checkout)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className=" bg-gray-50 pb-4">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-3 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-green-600" />
            <h1 className="text-base font-semibold">Корзина</h1>
            {totalCount > 0 && (
              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">{totalCount}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">Ваша корзина пуста</p>
              <p className="text-gray-400 text-sm mt-1">Добавьте товары для оформления заказа</p>
            </div>
          ) : (
            items.map((it) => {
              const media = it.product.image as Media
              const discountInfo = getDiscountInfo(it.product)

              return (
                <div key={it.product.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <div className="flex gap-2">
                    {/* Image */}
                    <div className="relative w-16 h-16 overflow-hidden rounded-lg bg-gray-50 flex-shrink-0">
                      <Image
                        width={64}
                        height={64}
                        src={media?.url || "/placeholder.svg?height=64&width=64&query=product-thumbnail"}
                        alt={media?.alt || it.product.title}
                        className="object-cover w-full h-full"
                      />
                      {discountInfo.hasDiscount && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded text-[10px]">
                          -{discountInfo.discountPercentage}%
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2 leading-tight">
                        {it.product.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {it.product.weight?.value} {it.product.weight?.unit}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-semibold text-base text-green-600">
                              {formatPrice(discountInfo.discountedPrice)}
                            </span>
                            {discountInfo.hasDiscount && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(discountInfo.originalPrice)}
                              </span>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => remove(it.product.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="flex items-center bg-gray-50 rounded-lg p-0.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-gray-200"
                              onClick={() => dicrement(it.product.id as number)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{it.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-gray-200"
                              onClick={() => increment(it.product)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-3 space-y-3">
            {/* Total */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-600 text-sm">Товары ({totalCount})</span>
                <span className="font-semibold text-base">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Доставка</span>
                <span>199 ₽</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Итого</span>
                  <span className="text-green-600">{formatPrice(totalPrice + 199)}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clear}
                className="flex-1 h-10 border-gray-200 hover:bg-gray-50 bg-transparent text-sm"
              >
                Очистить
              </Button>
              <Button
                onClick={handleCheckout}
                className="flex-1 h-10 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-lg text-sm"
              >
                Оформить заказ
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
