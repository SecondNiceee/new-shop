"use client"

import { useAuthStore } from "@/entities/auth/authStore"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Alert, AlertTitle, AlertDescription } from "../ui/alert"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { emailRegex } from "@/constants/email-schema";
import cl from "./auth.module.css";
import { RequestError } from "@/utils/request"

type RegisterInputs = {
  email: string
  password: string
}

export default function RegisterSection() {
  const { register: registerUser } = useAuthStore()
  
  // Состояния для информаирования пользователя
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<RequestError|null>(null);

  const form = useForm<RegisterInputs>({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  })
  
  // Хэндлер для входа
  const onSubmit: SubmitHandler<RegisterInputs> = async (values) => {
    setSuccess(null)
    setLoading(true);
    try{
        await registerUser(values.email, values.password)
        setSuccess("Регистрация прошла успешно. Проверьте почту и подтвердите аккаунт перед входом.")
        form.reset()
    }
    catch(e){
        const err = e as RequestError;
        setError(err);
    }
    finally{
        setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertTitle>Готово</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
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
              <FormMessage className={cl.formError} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
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
                  autoComplete="new-password"
                  placeholder="Минимум 8 символов"
                  className={cl.input}
                  {...field}
                />
              </FormControl>
              <FormMessage className={cl.formError} />
            </FormItem>
          )}
        />

        <Button
          className="w-full h-12 text-base rounded-xl text-white bg-green-500 hover:bg-green-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "Регистрируем..." : "Зарегистрироваться"}
        </Button>
      </form>
    </Form>
  )
}
