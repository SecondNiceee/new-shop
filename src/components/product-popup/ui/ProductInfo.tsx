import { Button } from '@/components/ui/button'
import { useCartStore } from '@/entities/cart/cartStore'
import { Product } from '@/payload-types'
import { Minus, Plus } from 'lucide-react'
import React from 'react'

const ProductInfo = ({ product }: { product: Product }) => {
  const { increment, dicrement, items } = useCartStore()
  const qty = items.find((it) => it.product.id === product?.id)?.quantity ?? 0
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
          <span className="text-3xl font-bold text-gray-900">{product.price} ₽</span>
          <span className="text-gray-500 ml-2">
            за {product.weight.value} {product.weight.unit}
          </span>
        </div>

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
