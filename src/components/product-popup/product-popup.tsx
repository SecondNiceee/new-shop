'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Loader2, Star, MessageCircle, Send, User } from 'lucide-react'
import { Review } from '@/payload-types'
import { useProductsStore } from '@/entities/products/productsStore'
import { useRouter, useSearchParams } from 'next/navigation'
import ErrorAlert from '../error-alert/ErrorAlert'
import { DialogTitle } from '@radix-ui/react-dialog'
import NutrientInformation from './ui/NutrientInformation'
import RelatedProducts from './ui/RelatedProducts'
import BreadCrumb from './ui/BreadCrumb'
import ProductImage from './ui/ProductImage'
import ProductInfo from './ui/ProductInfo'
import { request } from '@/utils/request'

const ProductPopup = () => {
  const searchParams = useSearchParams()
  const id = searchParams?.get('product')
  const router = useRouter()

  const { currentProduct, error, getProduct, isProductsPopupOpened, loading, setProductsPopup } =
    useProductsStore()
  // State for reviews
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  // Эффект закрытия
  useEffect(() => {
    if (!id) {
      setProductsPopup(false)
    }
  }, [id, setProductsPopup])

  // Функция закрытия попапа
  const onClose = () => {
    const newParams = new URLSearchParams(searchParams?.toString())
    newParams.delete('product')
    router.replace(`${window.location.pathname}?${newParams.toString()}`, { scroll: false })
  }

  // Загрузка товара и отзывов
  useEffect(() => {
    if (isProductsPopupOpened && id) {
      getProduct(String(id))
      loadReviews(String(id))
    }
  }, [getProduct, id, isProductsPopupOpened])

  // Функция загрузки отзывов
  const loadReviews = async (productId: string) => {
    setReviewsLoading(true)
    try {
      const response = await request<{docs : Review[]}>({
        url: `/reviews`,
        method: 'GET',
        query: {
          "where[product][equals]" : productId,
          sort: '-createdAt'
        }
      })
      
      if (response?.docs) {
        setReviews(response.docs)
      } else {
        setReviews([])
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
      setReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  // Функция отправки отзыва
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await request<{doc : Review}>({
        url: '/reviews',
        method: 'POST',
        body: {
          product: currentProduct?.id,
          rating: newReview.rating,
          comment: newReview.comment,
          name: newReview.name || 'Аноним',
        }
      })

      if (response?.doc) {
        setReviews([response.doc, ...reviews])
        setNewReview({ rating: 5, comment: '', name: '' })
        setShowReviewForm(false)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      // Можно добавить уведомление об ошибке
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0

  if (error) {
    return (
      <ErrorAlert
        buttonAction={() => getProduct(String(id))}
        errorMessage={'Не удалось загрузить товар, или товар был удален.'}
      />
    )
  }
  return (
    <Dialog open={isProductsPopupOpened} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden rounded-2xl z-[110] bg-white">
        <DialogTitle className="sr-only">
        {currentProduct?.title || 'Просмотр товара'}
        </DialogTitle>
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
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '90vh' }}>
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
              <div className="px-6 py-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-semibold text-gray-900">Отзывы покупателей</h2>
                    <div className="flex items-center space-x-1">
                      <div className="text-2xl font-bold text-orange-500">{averageRating.toFixed(1)}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(averageRating) 
                                ? 'text-orange-400 fill-current' 
                                : i < averageRating 
                                  ? 'text-orange-400 fill-current opacity-50' 
                                  : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm">({reviews.length} отзывов)</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Написать отзыв</span>
                  </Button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6 animate-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Оставить отзыв</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ваша оценка
                        </label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingClick(star)}
                              className={`w-8 h-8 rounded-full transition-all ${
                                star <= newReview.rating 
                                  ? 'bg-orange-400 text-white' 
                                  : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                              }`}
                            >
                              <Star className="w-5 h-5" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ваше имя
                        </label>
                        <input
                          type="text"
                          value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Введите ваше имя"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ваш отзыв
                        </label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                          placeholder="Поделитесь своим опытом использования товара..."
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowReviewForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Отмена
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || !newReview.comment.trim()}
                          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Отправка...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Отправить отзыв</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviewsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
                      <span className="text-gray-500">Загрузка отзывов...</span>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Пока нет отзывов об этом товаре.</p>
                      <p className="text-gray-400 text-sm mt-2">Будьте первым, кто оставит отзыв!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.name}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating 
                                    ? 'text-orange-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

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