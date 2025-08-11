"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/entities/auth/authStore"
import { useAuthDialogStore } from "@/entities/auth/authDialogStore"
import { routerConfig } from "@/config/router.config"
import LoginSection from "./loginSection"
import RegisterSection from "./registerSection"

export default function AuthDialog() {
  const router = useRouter()
  const { open, closeDialog, mode, setMode } = useAuthDialogStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user && open) {
      closeDialog()
      router.push(routerConfig.profile)
    }
  }, [user, open, closeDialog, router])

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? closeDialog() : undefined)}>
      <DialogContent className="p-0 w-full bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg md:max-w-xl">
        <DialogTitle className="sr-only">Аккаунт</DialogTitle>

        <div className="relative">
          <Button
            onClick={closeDialog}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 h-9 w-9 p-0 rounded-full hover:bg-gray-100"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="px-8 py-6 md:px-10 md:py-8 border-b bg-gray-50">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Вход в аккаунт</h2>
            <div className="mt-4 inline-flex items-center rounded-full bg-white border p-1">
              <button
                className={`px-5 py-2 rounded-full text-sm md:text-base transition-colors ${mode === "login" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setMode("login")}
              >
                Вход
              </button>
              <button
                className={`px-5 py-2 rounded-full text-sm md:text-base transition-colors ${mode === "register" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setMode("register")}
              >
                Регистрация
              </button>
            </div>
          </div>

          <div className="px-8 py-6 md:px-10 md:py-8">
            {mode === "login" ? (
              <LoginSection  />
            ) : (
              <RegisterSection />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
