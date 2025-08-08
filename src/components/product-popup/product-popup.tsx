'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ChevronRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Category, Media, Product } from '@/payload-types'
import { useProductsStore } from '@/entities/products/productsStore'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import ErrorAlert from '../error-alert/ErrorAlert'
import { ProductCard } from '../product-card/ProductCard'
import Link from 'next/link'
import { useCategoriesStore } from '@/entities/categories/categoriesStore'

const ProductPopup = () => {
  const searchParams = useSearchParams()
  const id = searchParams?.get('product')
  const params = useParams()
  const { slug } = params as Record<string, string>
  const subCategoryValue = searchParams?.get('sub');
  const categories = useCategoriesStore().categories;
  const router = useRouter()

  const {
    currentProduct,
    error,
    getProduct,
    isProductsPopupOpened,
    loading,
    products,
    setProductsPopup,
  } = useProductsStore()

    useEffect( () => {
        if (!id){
            setProductsPopup(false);
        }
    }, [id, setProductsPopup] );

  const handleAddToCart = () => {
    ;() => {}
  }

  const onClose = () => {
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.delete('product');

    router.replace(`${window.location.pathname}?${newParams.toString()}`);
  };

  useEffect(() => {
    if (isProductsPopupOpened && id) getProduct(String(id))
  }, [getProduct, id, isProductsPopupOpened])

  if (error) {
    return (
      <ErrorAlert
        buttonAction={() => getProduct(String(id))}
        errorMessage={'Не удалось загрузить товар, или товар был удален.'}
      />
    )
  }
  if (loading || !currentProduct) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }
  return (
    <Dialog open={isProductsPopupOpened} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden rounded-2xl z-[110] bg-white">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '90vh' }}>
          {/* Breadcrumb */}
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-end text-sm text-orange-500 space-x-1">
              <Link href={'/'}>Главная</Link>
              <ChevronRight className="h-4 w-4" />
              {currentProduct.category && (
                <>
                  <Link href={`/${(currentProduct.category as Category[])[0].value}`}>{(currentProduct.category as Category[])[0].title}</Link>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
              {currentProduct.subCategory && (
                <>
                  <Link href={`/${(currentProduct.category as Category[])[0].value}?sub=${(currentProduct.subCategory as Category).value}`}>
                    {(currentProduct.subCategory as Category).title}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
              <span className="text-gray-600">{currentProduct.title}</span>
            </div>
          </div>

          {/* Main Product Section */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square shadow-lg relative overflow-hidden rounded-2xl bg-gray-50">
                <Image
                  src={(currentProduct.image as Media)?.url || '/placeholder.svg'}
                  alt={(currentProduct.image as Media)?.alt || currentProduct.title}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentProduct.title.toUpperCase()}
                  </h1>
                  <p className="text-gray-500 text-lg">
                    {currentProduct.weight.value} {currentProduct.weight.unit}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      {currentProduct.price} ₽
                    </span>
                    <span className="text-gray-500 ml-2">
                      за {currentProduct.weight.value} {currentProduct.weight.unit}
                    </span>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded-xl"
                  >
                    Добавить в корзину
                  </Button>
                </div>

                {/* Product Description */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Описание товара</h3>
                  <p className="text-gray-700 leading-relaxed">{currentProduct.description}</p>
                </div>

                {/* Storage Conditions */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Условия хранения</h3>
                  <p className="text-gray-700">{currentProduct.storageConditions}</p>
                </div>

                {/* Ingredients */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Состав</h3>
                  <p className="text-gray-700">{currentProduct.ingredients}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {currentProduct.recommendedProducts?.length && (
            <div className="px-6 py-8 bg-gray-50">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">С этим товаром берут</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {currentProduct.recommendedProducts.map((relatedProduct) => (
                  <ProductCard product={relatedProduct as Product} />
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Information */}
          <div className="px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Энергетическая и пищевая ценность
            </h2>
            <p className="text-gray-500 mb-6">на 100 г продукта</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Calories */}
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">239</div>
                <div className="text-sm font-medium text-gray-700 mb-1">Калорийность</div>
                <div className="text-xs text-gray-500">кКал</div>
              </div>

              {/* Proteins */}
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">2,8</div>
                <div className="text-sm font-medium text-gray-700 mb-1">Белки</div>
                <div className="text-xs text-gray-500">г</div>
              </div>

              {/* Carbohydrates */}
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">57,4</div>
                <div className="text-sm font-medium text-gray-700 mb-1">Углеводы</div>
                <div className="text-xs text-gray-500">г</div>
              </div>

              {/* Fats */}
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1">0,6</div>
                <div className="text-sm font-medium text-gray-700 mb-1">Жиры</div>
                <div className="text-xs text-gray-500">г</div>
              </div>

              {/* Fiber */}
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">5,1</div>
                <div className="text-sm font-medium text-gray-700 mb-1">Клетчатка</div>
                <div className="text-xs text-gray-500">г</div>
              </div>
            </div>

            {/* Optional: Simple bar chart visualization */}
            <div className="mt-8 space-y-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Соотношение питательных веществ
              </h3>

              {/* Carbohydrates bar */}
              <div className="flex items-center space-x-3">
                <div className="w-20 text-sm font-medium text-gray-700">Углеводы</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="w-12 text-sm font-semibold text-gray-900">57,4 г</div>
              </div>

              {/* Proteins bar */}
              <div className="flex items-center space-x-3">
                <div className="w-20 text-sm font-medium text-gray-700">Белки</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <div className="w-12 text-sm font-semibold text-gray-900">2,8 г</div>
              </div>

              {/* Fiber bar */}
              <div className="flex items-center space-x-3">
                <div className="w-20 text-sm font-medium text-gray-700">Клетчатка</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <div className="w-12 text-sm font-semibold text-gray-900">5,1 г</div>
              </div>

              {/* Fats bar */}
              <div className="flex items-center space-x-3">
                <div className="w-20 text-sm font-medium text-gray-700">Жиры</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <div className="w-12 text-sm font-semibold text-gray-900">0,6 г</div>
              </div>
            </div>
          </div>
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
      </DialogContent>
    </Dialog>
  )
}

export default ProductPopup
