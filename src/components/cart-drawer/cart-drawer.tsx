"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCartStore } from "@/entities/cart/cartStore"
import type { Media, Product } from "@/payload-types"
import { useRouter } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import { getDiscountInfo, formatPrice } from "@/utils/discountUtils"

export default function CartDrawer() {
  const router = useRouter()
  const { isOpen, toggle, items, totalCount, totalPrice, remove, clear, loadServer, increment, dicrement } =
    useCartStore()

  useEffect(() => {
    loadServer().catch(() => {})
  }, [loadServer])

  const handleCheckout = () => {
    toggle() // Close cart
    router.push(routerConfig.checkout)
  }

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Корзина</span>
            {totalCount > 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">{totalCount}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[70vh]">
          {/* Items */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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
                  <div
                    key={it.product.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-3">
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
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded">
                            -{discountInfo.discountPercentage}%
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{it.product.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {it.product.weight?.value} {it.product.weight?.unit}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-semibold text-green-600">
                              {formatPrice(discountInfo.discountedPrice)}
                            </span>
                            {discountInfo.hasDiscount && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(discountInfo.originalPrice)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Quantity controls */}
                            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
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

                            {/* Delete button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => remove(it.product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
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
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
              {/* Total */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Товары ({totalCount})</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
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
                  className="flex-1 border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  Очистить
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-lg"
                >
                  Оформить заказ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
