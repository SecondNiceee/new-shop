"use client"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/entities/auth/authStore"
import { useProductsStore } from "@/entities/products/productsStore"
import type { Product, Review } from "@/payload-types"
import { purchaseService } from "@/services/purchaseService/purchaseService"
import { reviewService } from "@/services/review/reviewsService"
import { Star, MessageCircle, Loader2, Send, User, Edit2 } from "lucide-react"
import { type FC, useEffect, useState } from "react"
import { toast } from "sonner"
import StarJSX from "./Star"

interface IReviewSection {
  product: Product
  id: string | null
}
const ReviewSection: FC<IReviewSection> = ({ product, id }) => {
  const [newReview, setNewReview] = useState({ rating: 4, comment: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [editingReview, setEditingReview] = useState<number | null>(null)
  const [editReviewData, setEditReviewData] = useState({ rating: 4, comment: "" })
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null)
  const [checkingPurchase, setCheckingPurchase] = useState(false)

  const { isProductsPopupOpened } = useProductsStore()
  const { user } = useAuthStore()

  const loadReviews = async (productId: number) => {
    setReviewsLoading(true)
    try {
      const reviews = await reviewService.loadReviews(productId)
      setReviews(reviews)
    } catch (e) {
      console.error("Error loading reviews:", e)
      toast("Не удалось загрузить отзывы, проверьте подключение.")
      setReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  const checkPurchaseStatus = async (productId: number) => {
    if (!user) {
      setHasPurchased(false)
      return
    }

    setCheckingPurchase(true)
    try {
      const result = await purchaseService.checkPurchase(productId)
      setHasPurchased(result.hasPurchased)
    } catch (error) {
      console.error("Ошибка проверки покупки:", error)
      setHasPurchased(false)
    } finally {
      setCheckingPurchase(false)
    }
  }

  useEffect(() => {
    if (isProductsPopupOpened && id) {
      loadReviews(Number(id))
      checkPurchaseStatus(Number(id))
    }
  }, [id, isProductsPopupOpened, user])

  const handleReviewSubmit = async () => {
    if (!product) {
      toast("Товар не загружен, перезагрузите страницу.")
      return
    }
    if (!user) {
      toast("Для оставления отзыва необходимо войти в систему")
      return
    }

    if (hasPurchased === false) {
      toast("Чтобы оставлять отзывы, нужно приобрести этот товар")
      return
    }

    if (reviewsLoading) {
      toast("Подождите, загружаются отзывы...")
      return
    }
    setIsSubmitting(true)
    try {
      const review = await reviewService.createReview({
        comment: newReview.comment,
        productId: product.id,
        rating: newReview.rating,
      })
      if (review) {
        const newReviewWithUser = {
          ...review,
          user: user,
          createdAt: new Date().toISOString(),
        }
        setReviews((prev) => [newReviewWithUser, ...prev])

        const newReviewsCount = (product.reviewsCount || 0) + 1
        const newAverageRating =
          ((product.averageRating || 0) * (product.reviewsCount || 0) + newReview.rating) / newReviewsCount

        useProductsStore.setState((state) => ({
          ...state,
          product: {
            ...product,
            averageRating: Math.round(newAverageRating * 10) / 10,
            reviewsCount: newReviewsCount,
          },
        }))
        setNewReview({ rating: 5, comment: "" })
        setShowReviewForm(false)
        toast("Отзыв успешно добавлен!")
      }
    } catch (error: any) {
      console.error("Error submitting review:", error)
      toast(error?.message || "Ошибка при отправке отзыва")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShowReviewForm = () => {
    if (!user) {
      toast("Для оставления отзыва необходимо войти в систему")
      return
    }

    if (hasPurchased === false) {
      toast("Чтобы оставлять отзывы, нужно приобрести этот товар")
      return
    }

    setShowReviewForm(!showReviewForm)
  }

  const handleEditReview = async (reviewId: number) => {
    if (!product) {
      toast("Продукт не загрузился, пожалуйста перезагрузите страничку")
      return
    }
    if (!user) return
    setIsSubmitting(true)
    try {
      const review = await reviewService.changeReview({
        comment: editReviewData.comment,
        rating: editReviewData.rating,
        reviewId,
      })
      if (review) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, rating: editReviewData.rating, comment: editReviewData.comment } : r,
          ),
        )

        const updatedReviews = reviews.map((r) => (r.id === reviewId ? { ...r, rating: editReviewData.rating } : r))
        const newAverageRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length

        useProductsStore.setState((state) => ({
          ...state,
          product: {
            ...product,
            averageRating: Math.round(newAverageRating * 10) / 10,
          },
        }))

        setEditingReview(null)
        setEditReviewData({ rating: 5, comment: "" })
        toast("Отзыв успешно обновлен!")
      }
    } catch (error: any) {
      console.error("Error updating review:", error)
      toast(error?.message || "Ошибка при обновлении отзыва")
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditReview = (review: Review) => {
    setEditingReview(review.id)
    setEditReviewData({
      rating: review.rating,
      comment: review.comment || "",
    })
  }

  const userReview = user
    ? reviews.find((review) => (typeof review.user === "object" ? review.user.id === user.id : review.user === user.id))
    : null

  return (
    <div className="px-6 py-8 border-t border-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900">Отзывы покупателей</h2>
          {product.averageRating && product.averageRating > 0 && product.reviewsCount && product.reviewsCount > 0 && (
            <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg">
              <span className="text-xl font-bold text-orange-600">{product.averageRating.toFixed(1)}</span>
              <Star className="w-5 h-5 text-orange-400 fill-current" />
              <span className="text-gray-600 font-medium">
                {product.reviewsCount} {product.reviewsCount === 1 ? "отзыв" : product.reviewsCount < 5 ? "отзыва" : "отзывов"}
              </span>
            </div>
          )}
        </div>

        {user && !userReview && !reviewsLoading && !checkingPurchase && (
          <Button
            onClick={handleShowReviewForm}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
            disabled={hasPurchased === false}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{hasPurchased === false ? "Нужна покупка для отзыва" : "Написать отзыв"}</span>
          </Button>
        )}

        {checkingPurchase && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Проверяем покупку...</span>
          </div>
        )}
      </div>

      {showReviewForm && user && !userReview && !reviewsLoading && hasPurchased && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 animate-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Оставить отзыв</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleReviewSubmit()
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ваша оценка</label>
              <div className="flex gap-1 items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`w-7 h-7 rounded-full relative transition-all flex items-center justify-center ${
                      star <= newReview.rating
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                    }`}
                  >
                    <StarJSX />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ваш отзыв</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white"
                placeholder="Поделитесь своим опытом использования товара..."
                required
                minLength={10}
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
                disabled={isSubmitting || !newReview.comment.trim() || newReview.comment.length < 10}
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
          reviews.map((review) => {
            const reviewUser = typeof review.user === "object" ? review.user : null
            const isOwnReview =
              user && (typeof review.user === "object" ? review.user.id === user.id : review.user === user.id)

            return (
              <div
                key={review.id}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                {editingReview === review.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ваша оценка</label>
                      <div className="flex space-x-1 items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditReviewData({ ...editReviewData, rating: star })}
                            className={`w-7 h-7 rounded-full relative transition-all flex items-center justify-center ${
                              star <= editReviewData.rating
                                ? "bg-yellow-400 text-white"
                                : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                            }`}
                          >
                            <StarJSX />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ваш отзыв</label>
                      <textarea
                        value={editReviewData.comment}
                        onChange={(e) => setEditReviewData({ ...editReviewData, comment: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white"
                        required
                        minLength={10}
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setEditingReview(null)
                          setEditReviewData({ rating: 5, comment: "" })
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Отмена
                      </Button>
                      <Button
                        onClick={() => handleEditReview(review.id)}
                        disabled={isSubmitting || !editReviewData.comment.trim() || editReviewData.comment.length < 10}
                        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Сохранение...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Сохранить</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{reviewUser?.email || "Пользователь"}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5  ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        {isOwnReview && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditReview(review)}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Edit2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ReviewSection
