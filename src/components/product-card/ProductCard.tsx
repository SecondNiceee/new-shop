"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"
import Image from "next/image"
import { Media, Product } from "@/payload-types"
import { useProductsStore } from "@/entities/products/productsStore"
import { useRouter, useSearchParams } from "next/navigation"

interface IProductCard{
    product : Product
}

export function ProductCard({ product}: IProductCard) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const searchParams = useSearchParams()

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  const handleIncrease = () => {
    setQuantity(quantity + 1)
  }
  const onProductClick = () => {
    const newParams = new URLSearchParams(searchParams?.toString());
    if (newParams.get("product")){
      newParams.set("product", String(product.id))
      router.replace(`${window.location.pathname}?${newParams}`);
    }
    else{
      router.push(`?product=${product.id}`, { scroll: false })
    }
  }
  return (
    <Card onClick={onProductClick} className="p-4 cursor-pointer bg-gray-100 rounded-lg gap-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-50">
        <Image loading="lazy" width={300} height={300} src={ (product?.image as Media).url || "/placeholder.svg"} alt={(product?.image as Media).alt}  className="object-cover w-full" />
      </div>

      {/* Product Info */}
      <div className="mb-4 gap-2 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">{product.title}</h3>
        <p className="text-xs text-gray-500">{`${product.weight.value} ${product.weight.unit}`}</p>
      </div>

      {/* Actions */}
      <div className="mt-auto">
        {product.price ? (
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <span className="text-lg font-semibold text-gray-900">{product.price} ₽</span>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200" onClick={handleDecrease}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">{quantity} шт</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200" onClick={handleIncrease}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
