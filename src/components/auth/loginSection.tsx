"use client"

import { useEffect, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { emailRegex } from "@/constants/email-schema"
import { request } from "@/utils/request"
import type { RequestError } from "@/utils/request"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import cl from "./auth.module.css";
import { useAuthStore } from "@/entities/auth/authStore"

type LoginInputs = {
  email: string
  password: string
}

type ForgotPasswordInputs = {
  email: string
}

export default function LoginSection() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<RequestError | null>(null)
  const [mode, setMode] = useState<"login" | "forgot-password" | "success">("login")
  const {login} = useAuthStore();

  const loginForm = useForm<LoginInputs>({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  })

  const forgotForm = useForm<ForgotPasswordInputs>({
    mode: "onBlur",
    defaultValues: { email: "" },
  })

  const onLoginSubmit: SubmitHandler<LoginInputs> = async (values) => {
    setLoading(true)
    setError(null)
    try {
      await login(values.email, values.password);
    } catch (e) {
      const requestError = e as RequestError
      setError(requestError)
    } finally {
      setLoading(false)
    }
  }

  const onForgotSubmit: SubmitHandler<ForgotPasswordInputs> = async (values) => {
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
      setMode("success")
    } catch (e) {
      const requestError = e as RequestError
      setError(requestError)
    } finally {
      setLoading(false)
    }
  }

  useEffect( () => {
    setError(null);
  }, [mode] )

  const resetToLogin = () => {
    setMode("login")
    setError(null)
    forgotForm.reset()
  }

  if (mode === "forgot-password") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Восстановление пароля</h3>
          <p className="text-gray-600 placeholder">Введите Email, чтобы сбросить пароль</p>
        </div>

        <Form {...forgotForm}>
          <form className="space-y-6" onSubmit={forgotForm.handleSubmit(onForgotSubmit)} noValidate>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={forgotForm.control}
              name="email"
              rules={{
                required: "Укажите e-mail",
                pattern: { value: emailRegex, message: "Введите корректный e-mail" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-medium text-gray-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={cl.input}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Button
                className="w-full h-12 text-base rounded-xl text-white bg-green-500 hover:bg-green-600"
                type="submit"
                disabled={loading}
              >
                {loading ? "Отправляем..." : "Отправить письмо"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={resetToLogin}
                className="w-full h-12 text-base flex items-center rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к входу
              </Button>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  if (mode === "success") {
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Письмо отправлено!</h3>
          <p className="text-gray-600">На вашу почту выслано сообщение для сброса пароля!</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={resetToLogin}
          className="w-full h-12 flex items-center text-base rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться к входу
        </Button>
      </div>
    )
  }

  return (
    <Form {...loginForm}>
      <form className="space-y-6" onSubmit={loginForm.handleSubmit(onLoginSubmit)} noValidate>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={loginForm.control}
          name="email"
          rules={{
            required: "Укажите e-mail",
            pattern: { value: emailRegex, message: "Введите корректный e-mail" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base font-medium text-gray-900">Почта</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={cl.input}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="password"
          rules={{
            required: "Укажите пароль",
            minLength: { value: 8, message: "Пароль должен быть не менее 8 символов" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base font-medium text-gray-900">Пароль</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Введите пароль"
                  className={cl.input}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end -mt-1">
          <button
            type="button"
            onClick={() => setMode("forgot-password")}
            className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium transition-colors"
          >
            Забыли пароль?
          </button>
        </div>

        <Button
          className="w-full h-12 text-base rounded-xl text-white bg-green-500 hover:bg-green-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "Входим..." : "Войти"}
        </Button>
      </form>
    </Form>
  )
}
