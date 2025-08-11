"use client"

import { useAuthStore } from "@/entities/auth/authStore"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Alert, AlertTitle, AlertDescription } from "../ui/alert"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { emailRegex } from "@/constants/email-schema";
import cl from "./auth.module.css";
import { useState } from "react"
import { RequestError } from "@/utils/request"

type LoginInputs = {
  email: string
  password: string
}

export default function LoginSection() {

  const { login } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<RequestError|null>(null);

  const form = useForm<LoginInputs>({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  })

  const onSubmit: SubmitHandler<LoginInputs> = async (values) => {
    setLoading(true)
    try{
        await login(values.email, values.password);
    }
    catch(e){
        const requestError = e as RequestError;
        setError(requestError);
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
                  autoComplete="current-password"
                  placeholder="Введите пароль"
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
          {loading ? "Входим..." : "Войти"}
        </Button>
      </form>
    </Form>
  )
}
