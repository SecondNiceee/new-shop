"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useCartStore } from "@/entities/cart/cartStore"
import { useAddressStore } from "@/entities/address/addressStore"
import { useOrdersStore } from "@/entities/orders/ordersStore"
import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore"
import AddressPopup from "@/components/address-popup/address-popup"
import { ArrowLeft, MapPin, Phone, CreditCard, Edit3, Save, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/entities/auth/authStore"
import { toast } from "sonner"
import { formatPhoneNumber, normalizePhone, validatePhone } from "@/utils/phone"
import { useGuestBenefitsStore } from "@/components/auth/guest-benefits-modal"
import OrderItem from "@/components/order-item/OrderItem"
import { Checkbox } from "@/components/ui/checkbox"
import type { Media } from "@/payload-types"

export default function CheckoutClientPage() {
  const router = useRouter()
  const { items, totalPrice, totalCount, clear } = useCartStore()
  const { currentAddress, getFullAddress, loadAddress, openDialog } = useAddressStore()
  const { addOrder } = useOrdersStore()
  const { user } = useAuthStore()
  const { updateProfile } = useAuthStore()
  const { openDialog: openGuestDialog } = useGuestBenefitsStore()
  const { siteSettings } = useSiteSettings()
  const [phone, setPhone] = useState("")
  const [originalPhone, setOriginalPhone] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [showMinOrderDialog, setShowMinOrderDialog] = useState(false)
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)

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
    if (!user) {
      toast("Войдите в аккаунт или зарегестрируйтесь для сохранения телефона.")
      return
    }
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
    if (!user) {
      openGuestDialog("order")
      return
    }

    if (!isPhoneValid() || !currentAddress || items.length === 0) {
      toast.error("Заполните все обязательные поля")
      return
    }

    if (!privacyPolicyAccepted) {
      toast.error("Дайте согласие на обработку персональных данных")
      return
    }

    const minOrderAmount = siteSettings?.orderSettings?.minOrderAmount || 500
    if (totalPrice < minOrderAmount) {
      setShowMinOrderDialog(true)
      return
    }

    setIsProcessingOrder(true)

    try {
      const deliveryFee = siteSettings?.orderSettings?.deliveryFee || 199
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
        totalAmount: totalPrice + deliveryFee,
        deliveryFee: deliveryFee,
      }

      const paymentResponse = await fetch("/api/yookassa/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      })

      if (!paymentResponse.ok) {
        throw new Error("Ошибка создания платежа")
      }

      const paymentData = await paymentResponse.json()

      if (paymentData.confirmation?.confirmation_url) {
        window.location.href = paymentData.confirmation.confirmation_url
      } else {
        throw new Error("Не получена ссылка на оплату")
      }
    } catch (e) {
      console.error("Ошибка при создании платежа:", e)
      toast.error("Ошибка при оформлении заказа. Попробуйте еще раз.")
    } finally {
      setIsProcessingOrder(false)
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

  const isOrderValid = isPhoneValid() && currentAddress && items.length > 0 && privacyPolicyAccepted

  const deliveryFee = siteSettings?.orderSettings?.deliveryFee || 199
  const minOrderAmount = siteSettings?.orderSettings?.minOrderAmount || 500
  const privacyPolicyUrl = (siteSettings?.companyInfo?.privacyPolicyDocument as Media)?.url

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-3 transition-all duration-200 rounded-full shadow-sm hover:bg-white/60 hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 animate-pulse"></div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text">
              Оформление заказа
            </h1>
          </div>
        </div>

        <div class="mb-8 rounded-2xl shadow-[0_0_20px_5px_rgba(34,197,94,0.25)]">
          <Card className="flex flex-col overflow-hidden text-gray-900 border-none bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-xl">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                Итого к оплате
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between flex-1 pt-3 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-lg text-gray-700">
                  <span>Товары ({totalCount})</span>
                  <span className="font-semibold text-gray-900">{totalPrice} ₽</span>
                </div>
                <div className="flex justify-between text-lg text-gray-700">
                  <span>Доставка</span>
                  <span className="font-semibold text-gray-900">{deliveryFee} ₽</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-2xl font-bold text-gray-900">
                    <span>Итого</span>
                    <span>{totalPrice + deliveryFee} ₽</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50">
                <Checkbox
                  id="privacy-policy"
                  checked={privacyPolicyAccepted}
                  onCheckedChange={(checked) => setPrivacyPolicyAccepted(checked === true)}
                  className="mt-0.5 border-emerald-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
                />
                <label htmlFor="privacy-policy" className="text-sm leading-relaxed text-gray-700 cursor-pointer">
                  Я даю согласие на обработку моих персональных данных в соответствии с{" "}
                  {privacyPolicyUrl ? (
                    <a
                      href={privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-emerald-600 hover:text-emerald-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Политикой конфиденциальности
                    </a>
                  ) : (
                    <span className="underline text-emerald-600">Политикой конфиденциальности</span>
                  )}
                </label>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!isOrderValid || isProcessingOrder}
                className="w-full bg-green-500 text-white hover:bg-green-600 font-bold py-6 text-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 hover:scale-[1.02] mt-4"
              >
                {isProcessingOrder ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 rounded-full border-white border-t-transparent animate-spin" />
                    Переход к оплате...
                  </div>
                ) : (
                  `Оплатить ${totalPrice + deliveryFee} ₽`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="flex flex-col overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MapPin className="w-6 h-6 text-blue-500" />
                  Адрес доставки
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pt-3">
                <div
                  onClick={handleEditAddress}
                  className="group bg-gradient-to-r from-blue-50/80 to-purple-50/50 p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-200 border border-blue-100/50 group-hover:border-blue-200 h-full flex flex-col justify-between min-h-[120px]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-semibold leading-relaxed text-gray-900">
                        {currentAddress ? getFullAddress() : "Адрес не указан"}
                      </p>
                      {currentAddress?.comment && (
                        <p className="px-3 py-2 mt-2 text-sm text-gray-600 rounded-lg bg-white/60">
                          💬 {currentAddress.comment}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 ml-3 transition-colors duration-200 rounded-full hover:bg-blue-100 group-hover:bg-blue-100"
                    >
                      <Edit3 className="w-4 h-4 text-blue-600" />
                    </Button>
                  </div>
                  <p className="mt-3 text-xs text-blue-600 transition-opacity duration-200 opacity-70 group-hover:opacity-100">
                    Нажмите для изменения адреса
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Phone className="w-6 h-6 text-emerald-500" />
                  Контакты
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pt-3">
                <div className="space-y-3 h-full flex flex-col justify-between min-h-[120px]">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600">
                      По телефону мы сможем связаться с вами при доставке
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="flex-1 py-3 text-lg border-gray-200 bg-white/70 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                        maxLength={18}
                      />
                      {hasPhoneChanged && (
                        <Button
                          onClick={handleSavePhone}
                          disabled={isSaving || !isPhoneValid()}
                          className="px-4 py-3 text-white transition-all duration-200 bg-emerald-500 hover:bg-emerald-600 rounded-xl disabled:opacity-50"
                        >
                          {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  {!isPhoneValid() && (
                    <p className="flex items-center gap-2 text-sm text-red-600">
                      <Phone className="w-4 h-4" />
                      Укажите номер телефона для оформления заказа
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="flex flex-col gap-2 overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 animate-pulse"></div>
                Ваш заказ
                <span className="px-3 py-1 text-sm font-medium text-white rounded-full bg-gradient-to-r from-emerald-500 to-blue-500">
                  {totalCount} товаров
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-3 space-y-4">
              {items.map((item) => (
                <OrderItem key={item.product.id} item={item} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddressPopup />

      <Dialog open={showMinOrderDialog} onOpenChange={setShowMinOrderDialog}>
        <DialogContent className="max-w-md mx-auto bg-white border-0 shadow-2xl rounded-2xl p-6">
          <DialogHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-orange-100 rounded-full">
                <AlertTriangle className="w-10 h-10 text-orange-500" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
              Минимальная сумма заказа
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base leading-relaxed space-y-2">
              <p>
                Минимальная сумма заказа составляет{" "}
                <span className="font-semibold text-orange-600">{minOrderAmount} ₽</span>.
              </p>
              <p>
                Текущая сумма вашего заказа: <span className="font-semibold">{totalPrice} ₽</span>.
              </p>
              <p>
                Добавьте товаров еще на{" "}
                <span className="font-semibold text-emerald-600">{minOrderAmount - totalPrice} ₽</span>.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowMinOrderDialog(false)}
              className="flex-1 py-3 text-base border-gray-200 hover:bg-gray-50"
            >
              Понятно
            </Button>
            <Button
              onClick={() => {
                setShowMinOrderDialog(false)
                router.push("/")
              }}
              className="flex-1 py-3 text-base bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              Добавить товары
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
