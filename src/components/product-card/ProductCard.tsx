"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus, Heart, Star } from "lucide-react"
import Image from "next/image"
import type { Media, Product } from "@/payload-types"
import { useRouter, useSearchParams } from "next/navigation"
import { useCartStore } from "@/entities/cart/cartStore"

interface IProductCard {
  product: Product
}

export function ProductCard({ product }: IProductCard) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { increment, dicrement, items } = useCartStore()
  const qty = items.find((item) => item.product.id === product.id)?.quantity ?? 0
  const onProductClick = () => {
    const newParams = new URLSearchParams(searchParams?.toString())
    if (newParams.get("product")) {
      newParams.set("product", String(product.id))
      router.replace(`${window.location.pathname}?${newParams}`)
    } else {
      router.push(`?product=${product.id}`, { scroll: false })
    }
  }
  return (
    <Card
      onClick={onProductClick}
      className="p-0 cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Product Image with Heart Icon */}
      <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl bg-gray-50">
        <Image
          loading="lazy"
          width={400}
          height={300}
          src={(product?.image as Media).url || "/placeholder.svg"}
          alt={(product?.image as Media).alt}
          className="object-cover w-full h-full"
        />
        {/* Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Add to favorites logic here
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand/Title */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">{product.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{`${product.weight.value} ${product.weight.unit}`}</p>
          </div>
        </div>

        {product.averageRating && product.averageRating > 0 && product.reviewsCount && product.reviewsCount > 0 ? (
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold text-orange-500">{product.averageRating.toFixed(1)}</span>
            <Star className="w-4 h-4 text-orange-400 fill-current" />
            <span className="text-xs text-gray-500">
              {product.reviewsCount}{" "}
              {product.reviewsCount === 1 ? "отзыв" : product.reviewsCount < 5 ? "отзыва" : "отзывов"}
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-xs text-gray-400">Нет отзывов</span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-red-500">{product.price} ₽</span>
            {/* You can add original price here if available */}
            {/* <span className="text-sm text-gray-400 line-through">2895 ₽</span>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">-78%</span> */}
          </div>

          {qty === 0 ? (
            <Button
              onClick={(e) => {
                increment(product)
                e.stopPropagation()
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 text-sm font-medium"
            >
              В корзину
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-200 rounded-lg"
                onClick={(e) => {
                  dicrement(product.id)
                  e.stopPropagation()
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2">{qty} шт</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-200 rounded-lg"
                onClick={(e) => {
                  increment(product)
                  e.stopPropagation()
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
