"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Loader2, Star, MessageCircle, Send, User, Edit2 } from "lucide-react"
import type { Review } from "@/payload-types"
import { useProductsStore } from "@/entities/products/productsStore"
import { useRouter, useSearchParams } from "next/navigation"
import ErrorAlert from "../error-alert/ErrorAlert"
import { DialogTitle } from "@radix-ui/react-dialog"
import NutrientInformation from "./ui/NutrientInformation"
import RelatedProducts from "./ui/RelatedProducts"
import BreadCrumb from "./ui/BreadCrumb"
import ProductImage from "./ui/ProductImage"
import ProductInfo from "./ui/ProductInfo"
import { useAuthStore } from "@/entities/auth/authStore"
import { reviewService } from "@/services/review/reviewsService"
import { toast } from "sonner"

const ProductPopup = () => {
  const searchParams = useSearchParams()
  const id = searchParams?.get("product")
  const router = useRouter()
  const { user } = useAuthStore()

  const { currentProduct, error, getProduct, isProductsPopupOpened, loading, setProductsPopup } = useProductsStore()

  // State for reviews
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [editingReview, setEditingReview] = useState<number | null>(null)
  const [editReviewData, setEditReviewData] = useState({ rating: 5, comment: "" })

  console.log(reviews);

  // Эффект закрытия
  useEffect(() => {
    if (!id) {
      setProductsPopup(false)
    }
  }, [id, setProductsPopup])

  const onClose = () => {
    const newParams = new URLSearchParams(searchParams?.toString())
    newParams.delete("product")
    router.replace(`${window.location.pathname}?${newParams.toString()}`, { scroll: false })
  }

  // Функция загрузки отзывов
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

  // Загрузка товара и отзывов
  useEffect(() => {
    if (isProductsPopupOpened && id) {
      getProduct(id)
      loadReviews(Number(id))
    }
  }, [id, isProductsPopupOpened])

  // Создание отзыва
  const handleReviewSubmit = async () => {
    if (!currentProduct) {
      toast("Товар не загружен, перезагрузите страницу.")
      return
    }
    if (!user) {
      toast("Для оставления отзыва необходимо войти в систему")
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
        productId: currentProduct.id,
        rating: newReview.rating,
      })
      alert("Сделал запрос")
      if (review) {
        const newReviewWithUser = {
          ...review,
          user: user,
          createdAt: new Date().toISOString(),
        }
        setReviews((prev) => [newReviewWithUser, ...prev])

        // Update product rating optimistically
        const newReviewsCount = (currentProduct.reviewsCount || 0) + 1
        const newAverageRating =
          ((currentProduct.averageRating || 0) * (currentProduct.reviewsCount || 0) + newReview.rating) /
          newReviewsCount

        // Update the current product in store
        useProductsStore.setState((state) => ({
          ...state,
          currentProduct: {
            ...currentProduct,
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

      if (error?.message?.includes("уже оставили отзыв")) {
        toast("Вы уже оставили отзыв на этот товар. Обновляем список отзывов...")
        // Reload reviews to sync UI state
        await loadReviews(currentProduct.id)
        setShowReviewForm(false)
      } else {
        toast(error?.message || "Ошибка при отправке отзыва")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const handleEditRatingClick = (rating: number) => {
    setEditReviewData({ ...editReviewData, rating })
  }

  // изменение отзыва
  const handleEditReview = async (reviewId: number) => {
    if (!currentProduct) {
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

        // Recalculate average rating
        const updatedReviews = reviews.map((r) => (r.id === reviewId ? { ...r, rating: editReviewData.rating } : r))
        const newAverageRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length

        // Update the current product in store
        useProductsStore.setState((state) => ({
          ...state,
          currentProduct: {
            ...currentProduct,
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

  // Отзыв именно этого юзера если он есть
  const userReview = user
    ? reviews.find((review) => (typeof review.user === "object" ? review.user.id === user.id : review.user === user.id))
    : null

  if (error) {
    return (
      <ErrorAlert
        buttonAction={() => getProduct(String(id))}
        errorMessage={"Не удалось загрузить товар, или товар был удален."}
      />
    )
  }
  return (
    <Dialog open={isProductsPopupOpened} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden rounded-2xl z-[110] bg-white">
        <DialogTitle className="sr-only">{currentProduct?.title || "Просмотр товара"}</DialogTitle>
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
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: "90vh" }}>
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
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Отзывы покупателей</h2>
                    {currentProduct.averageRating &&
                      currentProduct.averageRating > 0 &&
                      currentProduct.reviewsCount &&
                      currentProduct.reviewsCount > 0 && (
                        <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg">
                          <span className="text-xl font-bold text-orange-600">
                            {currentProduct.averageRating.toFixed(1)}
                          </span>
                          <Star className="w-5 h-5 text-orange-400 fill-current" />
                          <span className="text-gray-600 font-medium">
                            {currentProduct.reviewsCount}{" "}
                            {currentProduct.reviewsCount === 1
                              ? "отзыв"
                              : currentProduct.reviewsCount < 5
                                ? "отзыва"
                                : "отзывов"}
                          </span>
                        </div>
                      )}
                  </div>

                  {user && !userReview && !reviewsLoading && (
                    <Button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Написать отзыв</span>
                    </Button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && user && !userReview && !reviewsLoading && (
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
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={(e) => handleRatingClick(star)}
                              className={`w-8 h-8 rounded-full transition-all ${
                                star <= newReview.rating
                                  ? "bg-orange-400 text-white"
                                  : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                              }`}
                            >
                              <Star className="w-5 h-5" />
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
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
                    reviews.map((review) => {
                      const reviewUser = typeof review.user === "object" ? review.user : null
                      const isOwnReview =
                        user && (typeof review.user === "object" ? review.user.id === user.id : review.user === user.id)

                      return (
                        <div
                          key={review.id}
                          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                          {editingReview === review.id ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ваша оценка</label>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={(e) => handleEditRatingClick(star)}
                                      className={`w-8 h-8 rounded-full transition-all ${
                                        star <= editReviewData.rating
                                          ? "bg-orange-400 text-white"
                                          : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                      }`}
                                    >
                                      <Star className="w-5 h-5" />
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
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
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
                                  disabled={
                                    isSubmitting || !editReviewData.comment.trim() || editReviewData.comment.length < 10
                                  }
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
                                    <h4 className="font-semibold text-gray-900">
                                      {reviewUser?.email || "Пользователь"}
                                    </h4>
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
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                          i < review.rating ? "text-orange-400 fill-current" : "text-gray-300"
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
