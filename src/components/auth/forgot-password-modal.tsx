"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { X, Mail, CheckCircle } from "lucide-react"
import { emailRegex } from "@/constants/email-schema"
import { request, type RequestError } from "@/utils/request"

type ForgotPasswordInputs = {
  email: string
}

type ForgotPasswordModalProps = {
  open: boolean
  onClose: () => void
}

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<RequestError | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const form = useForm<ForgotPasswordInputs>({
    mode: "onBlur",
    defaultValues: { email: "" },
  })

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (values) => {
    setLoading(true)
    setError(null)

    try {
      await request({
        url: "/api/users/forgot-password",
        method: "POST",
        credentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: { email: values.email },
      })

      setSuccess(true)
    } catch (err) {
      const requestError = err as RequestError
      setError(requestError)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    setError(null)
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? handleClose() : undefined)}>
      <DialogContent className="p-0 w-full bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md">
        <DialogTitle className="sr-only">Восстановление пароля</DialogTitle>

        <div className="relative">
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 h-9 w-9 p-0 rounded-full hover:bg-gray-100 z-10"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </Button>

          {!success ? (
            <>
              <div className="px-8 py-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Восстановление пароля</h2>
                    <p className="text-sm text-gray-600 mt-1">Введите Email, чтобы сбросить пароль</p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6">
                <Form {...form}>
                  <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                    {error && (
                      <Alert variant="destructive">
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                      </Alert>
                    )}

                    <FormField
                      control={form.control}
                      name="email"
                      rules={{
                        required: "Укажите e-mail",
                        pattern: { value: emailRegex, message: "Введите корректный e-mail" },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-900">Email адрес</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              placeholder="you@example.com"
                              className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <Button
                      className="w-full h-12 text-base rounded-xl text-white bg-green-500 hover:bg-green-600 transition-colors"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Отправляем..." : "Отправить ссылку"}
                    </Button>
                  </form>
                </Form>
              </div>
            </>
          ) : (
            <div className="px-8 py-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Письмо отправлено!</h2>
              <p className="text-gray-600 mb-6">На вашу почту выслано сообщение для сброса пароля!</p>
              <Button
                onClick={handleClose}
                className="w-full h-12 text-base rounded-xl text-white bg-green-500 hover:bg-green-600 transition-colors"
              >
                Понятно
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
