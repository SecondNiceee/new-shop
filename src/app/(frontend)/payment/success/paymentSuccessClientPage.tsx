"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { useCartStore } from "@/entities/cart/cartStore"
import { routerConfig } from "@/config/router.config"

export default function PaymentSuccessPageClient() {
  const router = useRouter()
  const { clear } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    // Clear cart after successful payment
    const processPayment = async () => {
      try {
        await clear()
        setIsProcessing(false)
      } catch (error) {
        console.error("Error clearing cart:", error)
        setIsProcessing(false)
      }
    }
    processPayment()
  }, [clear])

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <Card className="max-w-md w-full mx-4 border-0 shadow-2xl bg-white/90 backdrop-blur-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-16 h-16 mx-auto text-emerald-500 animate-spin" />
            <p className="mt-4 text-lg text-gray-600">Обработка платежа...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <Card className="max-w-md w-full border-0 p-8 shadow-2xl bg-white/90 backdrop-blur-md">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-emerald-100 rounded-full">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Оплата прошла успешно!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-600">Ваш заказ успешно оформлен и оплачен.</p>
            <p className="text-gray-500">Отслеживайте статус заказа у себя в профиле. Мы вам позвоним, когда курьер будет рядом.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push(routerConfig.orders)}
              className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl"
            >
              Посмотреть мои заказы
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full py-6 text-lg border-gray-200 hover:bg-gray-50 rounded-xl"
            >
              Вернуться на главную
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
