"use client"

import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore"
import { useCartStore } from "@/entities/cart/cartStore"
import { Loader2, ShoppingCart } from "lucide-react"
import type { FC } from "react"

const Cart: FC = () => {
  const { open, totalPrice, isCartLoaded, isHydrated } = useCartStore()
  const { siteSettings, isLoading } = useSiteSettings()

  if (!isCartLoaded || !isHydrated || isLoading) {
    return (
      <div className="flex justify-center p-4 bg-white rounded-2xl min-w-[150px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  const isProducts = totalPrice > 0
  const isLess = totalPrice < (siteSettings?.orderSettings?.minOrderAmount || 500)

  return (
    <div
      onClick={open}
      className={`${isProducts ? (isLess ? "bg-orange-400" : "bg-green-500") : "bg-white"}  cursor-pointer md:flex  lg:items-center gap-2 px-4  border-black border-solid md:border-2 md:border-none rounded-lg p-2 flex-shrink-0`}
    >
      <div className="text-right">
        {totalPrice > 0 ? (
          <div className="flex justify-between items-center gap-4">
            <ShoppingCart color="white" size={20} />
            <p className="text-base text-white font-semibold whitespace-nowrap">{totalPrice} ₽</p>
          </div>
        ) : (
          <>
            <p className="text-sm whitespace-nowrap">
              Мин. сумма заказа {siteSettings?.orderSettings?.minOrderAmount || "-"} ₽
            </p>
            <p className="text-xs text-gray-500 text-left whitespace-nowrap">
              Доставим за {siteSettings?.orderSettings?.deliveryFee || "-"} ₽
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart
