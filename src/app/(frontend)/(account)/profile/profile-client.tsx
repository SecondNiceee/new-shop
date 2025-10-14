"use client"

import { ChevronRight, MapPin, UserIcon, Phone, Save } from "lucide-react"
import type React from "react"
import { useAddressStore } from "@/entities/address/addressStore"
import { useEffect, useState } from "react"
import AddressPopup from "@/components/address-popup/address-popup"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/entities/auth/authStore"
import { toast } from "sonner"
import { formatPhoneNumber, normalizePhone, validatePhone } from "@/utils/phone"
import useAuth from "@/hooks/useAuth"

export default function ProfileClientPage() {
  const { user } = useAuth()
  const { updateProfile } = useAuthStore()
  const { currentAddress, openDialog, loadAddress, getFullAddress } = useAddressStore()

  const [phone, setPhone] = useState("")
  const [originalPhone, setOriginalPhone] = useState("")
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false)

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

    setIsUpdatingPhone(true)
    try {
      await updateProfile({ phone: normalizePhone(phone) })
      setOriginalPhone(phone)
      toast.success("Номер телефона обновлен")
    } catch (error) {
      toast.error("Не удалось обновить номер телефона")
    } finally {
      setIsUpdatingPhone(false)
    }
  }

  const isPhoneChanged = normalizePhone(phone) !== originalPhone

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl">
      <h2 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-10">
        Мои данные
      </h2>

      <div className="flex flex-col items-center mb-10">
        <div className="relative group">
          <div className="w-20 h-20 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-105">
            <UserIcon className="w-10 h-10 md:w-18 md:h-18 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 opacity-20 blur-xl animate-pulse"></div>
        </div>
      </div>

      <div className="mb-10">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Email
          </h3>
          <p className="text-gray-700 text-base font-medium">{user?.email || "Не указан"}</p>
        </div>
      </div>

      <div className="mb-10">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            Телефон
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="bg-white/70 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-base"
                  maxLength={18}
                />
              </div>
              {isPhoneChanged && (
                <Button
                  onClick={handleSavePhone}
                  disabled={isUpdatingPhone}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                >
                  {isUpdatingPhone ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Сохранить
                    </>
                  )}
                </Button>
              )}
            </div>
            <p className="text-sm text-blue-600 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Будьте внимательны, телефон нужен чтобы мы могли связаться с вами при доставке
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          Адрес доставки
        </h3>

        <button
          type="button"
          onClick={openDialog}
          className="w-full flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 rounded-2xl px-6 py-5 border border-orange-100 shadow-sm hover:shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="min-w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm md:text-base text-gray-900 font-medium">
              {currentAddress ? getFullAddress() : "Добавить адрес доставки"}
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-orange-500 transition-colors duration-200" />
        </button>

        {currentAddress && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={openDialog}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 text-center border border-purple-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer group"
            >
              <div className="text-xs text-purple-600 mb-2 font-semibold uppercase tracking-wide group-hover:text-purple-700">
                Кв/офис
              </div>
              <div className="text-gray-900 font-bold text-lg group-hover:text-purple-800">
                {currentAddress.apartment || "—"}
              </div>
            </button>
            <button
              type="button"
              onClick={openDialog}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 text-center border border-teal-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer group"
            >
              <div className="text-xs text-teal-600 mb-2 font-semibold uppercase tracking-wide group-hover:text-teal-700">
                Подъезд
              </div>
              <div className="text-gray-900 font-bold text-lg group-hover:text-teal-800">
                {currentAddress.entrance || "—"}
              </div>
            </button>
            <button onClick={openDialog} className="bg-gradient-to-br cursor-pointer from-rose-50 to-pink-50 rounded-2xl p-5 text-center border border-rose-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="text-xs text-rose-600 mb-2 font-semibold uppercase tracking-wide">Этаж</div>
              <div className="text-gray-900 font-bold text-lg">{currentAddress.floor || "—"}</div>
            </button>
          </div>
        )}
      </div>

      <AddressPopup />
    </div>
  )
}
