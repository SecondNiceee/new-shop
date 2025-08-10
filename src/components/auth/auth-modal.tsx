"use client"

import type React from "react"
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
  const { user, loading, error, fetchMe } = useAuthStore();
  useEffect(() => {
    if (user && open) {
      closeDialog()
      router.push(routerConfig.profile);
    }
  }, [user, open, closeDialog, router])

  return (
    <Dialog  open={open} onOpenChange={(val) => (!val ? closeDialog() : undefined)}>
      <DialogContent className="p-0 max-w-md w-full bg-white rounded-2xl overflow-hidden">
        <DialogTitle className="sr-only">Авторизация</DialogTitle>
        <div className="relative">
          <Button
            onClick={closeDialog}
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-semibold">Аккаунт</h2>
            <div className="mt-3 inline-flex rounded-lg border overflow-hidden">
              <button
                className={`px-4 py-2 text-sm ${mode === "login" ? "bg-white font-medium" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setMode("login")}
              >
                Вход
              </button>
              <button
                className={`px-4 py-2 text-sm ${mode === "register" ? "bg-white font-medium" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setMode("register")}
              >
                Регистрация
              </button>
            </div>
          </div>

          <div className="p-6">
            {mode === "login" ? (
              <LoginSection loading={loading} error={error} />
            ) : (
              <RegisterSection loading={loading} error={error} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
