"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/entities/auth/authStore"
import { useAuthDialogStore } from "@/entities/auth/authDialogStore"
import { routerConfig } from "@/config/router.config"
import LoginSection from "./login/loginSection"
import RegisterSection from "./registration/registerSection"


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

            {mode === "login" ? (
              <LoginSection mode={mode} setMode={setMode}  />
            ) : (
              <RegisterSection mode={mode} setMode={setMode}/>
            )}

        </div>
      </DialogContent>
    </Dialog>
  )
}
