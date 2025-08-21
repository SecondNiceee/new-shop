"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Heart, ShoppingBag, MapPin, History, Bell } from "lucide-react"
import { useAuthDialogStore } from "@/entities/auth/authDialogStore"
import { create } from "zustand"

type GuestBenefitsStore = {
  open: boolean
  type: "favorites" | "order" | null
  openDialog: (type: "favorites" | "order") => void
  closeDialog: () => void
}

export const useGuestBenefitsStore = create<GuestBenefitsStore>((set) => ({
  open: false,
  type: null,
  openDialog: (type) => set({ open: true, type }),
  closeDialog: () => set({ open: false, type: null }),
}))

export default function GuestBenefitsModal() {
  const { open, type, closeDialog } = useGuestBenefitsStore()
  const { openDialog: openAuthDialog } = useAuthDialogStore()

  const handleLogin = () => {
    closeDialog()
    openAuthDialog("login")
  }

  const handleRegister = () => {
    closeDialog()
    openAuthDialog("register")
  }

  const favoritesBenefits = [
    { icon: Heart, text: "Добавлять товары в избранное" },
    { icon: History, text: "Следить за историей покупок" },
    { icon: MapPin, text: "Сохранить место доставки" },
    { icon: ShoppingBag, text: "Сохранять корзину на разных устройствах" },
    { icon: Bell, text: "Следить за статусом товара" },
  ]

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? closeDialog() : undefined)}>
      <DialogContent className="p-0 w-full bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md">
        <DialogTitle className="sr-only">
          {type === "favorites" ? "Преимущества регистрации" : "Отслеживание заказа"}
        </DialogTitle>

        <div className="relative">
          <Button
            onClick={closeDialog}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 h-9 w-9 p-0 rounded-full hover:bg-gray-100 z-10"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </Button>

          {type === "favorites" ? (
            <div className="px-8 py-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Зарегистрируйтесь</h3>
                <p className="text-gray-600">и вы получите возможность:</p>
              </div>

              <div className="space-y-4 mb-8">
                {favoritesBenefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{benefit.text}</span>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleRegister}
                  className="w-full h-12 text-base rounded-xl text-white bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 font-semibold"
                >
                  Зарегистрироваться
                </Button>
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  className="w-full h-12 text-base rounded-xl border-2 border-gray-200 hover:bg-gray-50 font-semibold bg-transparent"
                >
                  Войти
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-8 py-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Зарегистрируйтесь</h3>
              <p className="text-gray-600 mb-8">чтобы отслеживать статус товара</p>

              <div className="space-y-3">
                <Button
                  onClick={handleRegister}
                  className="w-full h-12 text-base rounded-xl text-white bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 font-semibold"
                >
                  Зарегистрироваться
                </Button>
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  className="w-full h-12 text-base rounded-xl border-2 border-gray-200 hover:bg-gray-50 font-semibold bg-transparent"
                >
                  Войти
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
