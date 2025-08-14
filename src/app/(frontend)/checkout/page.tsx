"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/entities/cart/cartStore"
import { useAddressStore } from "@/entities/address/addressStore"
import AddressPopup from "@/components/address-popup/address-popup"
import Image from "next/image"
import type { Media } from "@/payload-types"
import { ArrowLeft, MapPin, Phone, CreditCard, Edit3, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, totalCount } = useCartStore()
  const { currentAddress, getFullAddress, loadAddress, openDialog } = useAddressStore()
  const [phone, setPhone] = useState("")

  useEffect(() => {
    loadAddress()
  }, [loadAddress])

  const formatPhoneNumber = (value: string) => {
    // Удаляем все нецифровые символы
    const phoneNumber = value.replace(/\D/g, "")

    // Ограничиваем до 11 цифр (с учетом 7 или 8 в начале)
    const match = phoneNumber.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)

    if (!match) return value

    const [, country, area, first, second, third] = match

    let formatted = ""

    if (country) {
      if (country === "8") {
        formatted = "+7"
      } else if (country === "7") {
        formatted = "+7"
      } else {
        formatted = `+7${country}`
      }
    } else {
      formatted = "+7"
    }

    if (area) {
      formatted += ` (${area}`
      if (area.length === 3) formatted += ")"
    }

    if (first) {
      if (!formatted.includes("(")) formatted += " ("
      if (!formatted.includes(")")) formatted += ")"
      formatted += ` ${first}`
    }

    if (second) {
      formatted += `-${second}`
    }

    if (third) {
      formatted += `-${third}`
    }

    return formatted
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handlePayment = () => {
    // Здесь будет логика оплаты
    console.log("Processing payment...")
  }

  const handleEditAddress = () => {
    openDialog()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-3 hover:bg-white/60 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Оформление заказа
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <Card className="shadow-xl border-0 gap-3 bg-white/90 backdrop-blur-md overflow-hidden">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse"></div>
                  Ваш заказ
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm rounded-full font-medium">
                    {totalCount} товаров
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-3">
                {items.map((item) => {
                  const media = item.product.image as Media
                  const price = item.product.price || 0
                  const sum = price * item.quantity

                  return (
                    <div
                      key={item.product.id}
                      className="group flex gap-4 p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/50 rounded-2xl hover:shadow-md transition-all duration-200 border border-gray-100/50"
                    >
                      <div className="relative w-20 h-20 overflow-hidden rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow duration-200">
                        <Image
                          width={80}
                          height={80}
                          src={media?.url || "/placeholder.svg?height=80&width=80&query=product-thumbnail"}
                          alt={media?.alt || item.product.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-lg">{item.product.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.product.weight?.value} {item.product.weight?.unit}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-gray-600 font-medium">
                            {item.quantity} × {price} ₽
                          </span>
                          <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                            {sum} ₽
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
              <CardHeader className="flex items-center gap-3 text-xl">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MapPin className="h-6 w-6 text-blue-500" />
                  Адрес доставки
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div
                  onClick={handleEditAddress}
                  className="group bg-gradient-to-r from-blue-50/80 to-purple-50/50 p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-200 border border-blue-100/50 hover:border-blue-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg leading-relaxed">
                        {currentAddress ? getFullAddress() : "Адрес не указан"}
                      </p>
                      {currentAddress?.comment && (
                        <p className="text-gray-600 mt-2 text-sm bg-white/60 px-3 py-2 rounded-lg">
                          💬 {currentAddress.comment}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-3 p-2 hover:bg-blue-100 rounded-full group-hover:bg-blue-100 transition-colors duration-200"
                    >
                      <Edit3 className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                  <p className="text-xs text-blue-600 mt-3 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                    Нажмите для изменения адреса
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment */}
          <div className="space-y-6">
            {/* Phone Input */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
              <CardHeader className="flex items-center gap-3 text-xl">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Phone className="h-6 w-6 text-emerald-500" />
                  Контакты
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="space-y-3">
                  <label className="text-sm text-gray-600 font-medium">
                    Введите телефон по которому мы можем с вами связаться
                  </label>
                  <Input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="bg-white/70 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-lg py-3 rounded-xl"
                    maxLength={18}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <CreditCard className="h-6 w-6" />
                  Итого к оплате
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-3">
                <div className="space-y-3">
                  <div className="flex justify-between text-white/90 text-lg">
                    <span>Товары ({totalCount})</span>
                    <span className="font-semibold">{totalPrice} ₽</span>
                  </div>
                  <div className="flex justify-between text-white/90 text-lg">
                    <span>Доставка</span>
                    <span className="font-semibold">199 ₽</span>
                  </div>
                  <div className="border-t border-white/30 pt-3">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Итого</span>
                      <span>{totalPrice + 199} ₽</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={!phone.trim() || items.length === 0}
                  className="w-full bg-white text-emerald-600 hover:bg-gray-50 font-bold py-6 text-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200  hover:scale-[1.02]"
                >
                    Оплатить {totalPrice + 199} ₽
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddressPopup />
    </div>
  )
}
