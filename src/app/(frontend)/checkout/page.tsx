"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/entities/cart/cartStore"
import { useAddressStore } from "@/entities/address/addressStore"
import { useOrdersStore } from "@/entities/orders/ordersStore"
import AddressPopup from "@/components/address-popup/address-popup"
import Image from "next/image"
import type { Media } from "@/payload-types"
import { ArrowLeft, MapPin, Phone, CreditCard, Edit3, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import useAuth from "@/hooks/useAuth"
import { useAuthStore } from "@/entities/auth/authStore"
import { toast } from "sonner"
import { formatPhoneNumber, normalizePhone, validatePhone } from "@/utils/phone"
import { DELIVERY_FEE } from "@/constants/dynamic-constants"
import { routerConfig } from "@/config/router.config"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, totalCount, clear } = useCartStore()
  const { currentAddress, getFullAddress, loadAddress, openDialog } = useAddressStore()
  const { addOrder } = useOrdersStore()
  const { user } = useAuth()
  const { updateProfile } = useAuthStore()
  const [phone, setPhone] = useState("")
  const [originalPhone, setOriginalPhone] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)

  useEffect(() => {
    loadAddress()
  }, [loadAddress])

  useEffect(() => {
    if (user?.phone) {
      setPhone(formatPhoneNumber(user.phone))
      setOriginalPhone(user.phone)
    }
  }, [user])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handleSavePhone = async () => {
    const validation = validatePhone(phone)
    if (!validation.isValid) {
      toast.error(validation.error || "Неверный номер телефона")
      return
    }
    setIsSaving(true)
    try {
      await updateProfile({ phone: normalizePhone(phone) })
      setOriginalPhone(phone)
      toast.success("Телефон успешно сохранен")
    } catch (error) {
      toast.error("Ошибка при сохранении телефона")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePayment = async () => {
    if (!isPhoneValid() || !currentAddress || items.length === 0) {
      toast.error("Заполните все обязательные поля")
      return
    }

    setIsProcessingOrder(true)

    try {
      // Создаем заказ
      const orderData = {
        items: items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price || 0,
        })),
        deliveryAddress: {
          address: currentAddress.street,
          apartment: currentAddress.apartment || "",
          entrance: currentAddress.entrance || "",
          floor: currentAddress.floor || "",
          comment: currentAddress.comment || "",
        },
        customerPhone: normalizePhone(phone),
        totalAmount: totalPrice + DELIVERY_FEE,
        deliveryFee: DELIVERY_FEE, // По умолчанию наличными
        status: "pending",
      }
      await addOrder(orderData);
      await clear()

      toast.success("Заказ успешно оформлен!")

      router.push(routerConfig.orders);
      
    }
      catch(e){
        console.error("Ошибка при создании заказа:", e)
        toast.error("Ошибка при оформлении заказа. Попробуйте еще раз.")
      }
      finally{
        setIsProcessingOrder(false);
      }
  }

  const handleEditAddress = () => {
    openDialog()
  }

  const isPhoneValid = () => {
    const validation = validatePhone(phone)
    return validation.isValid
  }

  const hasPhoneChanged = normalizePhone(phone) !== originalPhone && phone.trim() !== ""

  const isOrderValid = isPhoneValid() && currentAddress && items.length > 0

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
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Оформление заказа
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:grid-rows-[auto_1fr] lg:items-start">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 grid gap-6 lg:grid-rows-subgrid lg:row-span-2">
            {/* Cart Items */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse"></div>
                  Ваш заказ
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm rounded-full font-medium">
                    {totalCount} товаров
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-3 flex-1">
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
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MapPin className="h-6 w-6 text-blue-500" />
                  Адрес доставки
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 flex-1">
                <div
                  onClick={handleEditAddress}
                  className="group bg-gradient-to-r from-blue-50/80 to-purple-50/50 p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-200 border border-blue-100/50 hover:border-blue-200 h-full flex flex-col justify-between min-h-[120px]"
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
          <div className="grid gap-6 lg:grid-rows-subgrid lg:row-span-2">
            {/* Phone Input */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Phone className="h-6 w-6 text-emerald-500" />
                  Контакты
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 flex-1">
                <div className="space-y-3 h-full flex flex-col justify-between min-h-[120px]">
                  <div className="space-y-3">
                    <label className="text-sm text-gray-600 font-medium">
                      По телефону мы сможем связаться с вами при доставке
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="bg-white/70 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-lg py-3 rounded-xl flex-1"
                        maxLength={18}
                      />
                      {hasPhoneChanged && (
                        <Button
                          onClick={handleSavePhone}
                          disabled={isSaving || !isPhoneValid()}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                        >
                          {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  {!isPhoneValid() && (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Укажите номер телефона для оформления заказа
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <CreditCard className="h-6 w-6" />
                  Итого к оплате
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-3 flex-1 flex flex-col justify-between">
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
                  disabled={!isOrderValid || isProcessingOrder}
                  className="w-full bg-white text-emerald-600 hover:bg-gray-50 font-bold py-6 text-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 hover:scale-[1.02] mt-4"
                >
                  {isProcessingOrder ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      Оформляем заказ...
                    </div>
                  ) : (
                    `Оформить заказ ${totalPrice + 199} ₽`
                  )}
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
