'use client'

import { useAuthStore } from '@/entities/auth/authStore'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Alert, AlertTitle, AlertDescription } from '../ui/alert'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useCallback, useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { emailRegex } from '@/constants/email-schema'
import cl from './auth.module.css'
import { request, RequestError } from '@/utils/request'
import { useRouter } from 'next/navigation'
import { routerConfig } from '@/config/router.config'
import { Mail } from 'lucide-react'

type RegisterInputs = {
  email: string
  password: string
}

export default function RegisterSection() {
  const { register: registerUser, login } = useAuthStore()
  const router = useRouter();

  // Состояния для информаирования пользователя
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<RequestError | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState<string|null>(null);

  const form = useForm<RegisterInputs>({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  })

  // Хэндлер для входа
  const onSubmit: SubmitHandler<RegisterInputs> = async (values) => {
    setSuccess(null)
    setLoading(true)
    try {
      await registerUser(values.email, values.password)
      setSuccess('Регистрация прошла успешно. Проверьте почту и подтвердите аккаунт перед входом.')
      setEmail(values.email);
      setPassword(values.password);

    } catch (e) {
      const err = e as RequestError
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const tryLogin = useCallback(async () => {
    if (password && email){
        try {
          await request({
            url: '/api/auth/isVerified',
            method: 'POST',
            body: {
              email,
            },
            credentials: true,
          })
          await login(email,password);
          router.push(routerConfig.profile);
        } catch (e) {
         console.log(e);
          // ingnoring
        }
    }
  }, [email])

  // Проверка верификации каждые 12 секунд
  useEffect(() => {
    if (!email || !password) return
    const interval = setInterval(async () => {
        tryLogin();
    }, 12_000) // Каждые 12 секунд
    return () => clearInterval(interval) // Очистка при размонтировании
  }, [email, tryLogin, password])

  if (email){
    return (
              <div className="space-y-6 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Подтвердите почту</h3>
          <p className="text-gray-600">
            Вы успешно зарегистрировались! Проверьте почту и перейдите по ссылке для подтверждения аккаунта.
          </p>
          {email && (
            <p className="text-sm text-gray-500">
              Письмо отправлено на: <span className="font-medium">{email}</span>
            </p>
          )}
        </div>

        {error && (
          <Alert variant={error.message.includes("отправлено") ? "default" : "destructive"}>
            <AlertTitle>{error.message.includes("отправлено") ? "Готово" : "Ошибка"}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => tryLogin()}
            disabled={loading}
            className="w-full h-12 text-base rounded-xl text-white bg-green-500 hover:bg-green-600"
          >
            {"Я подтвердил вход"}
          </Button>
        </div>
      </div>
    )
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error?.message}</AlertDescription>
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
            required: 'Укажите e-mail',
            pattern: { value: emailRegex, message: 'Введите корректный e-mail' },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base font-medium text-gray-900">
                Почта
              </FormLabel>
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
            required: 'Укажите пароль',
            minLength: { value: 8, message: 'Пароль должен быть не менее 8 символов' },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base font-medium text-gray-900">
                Пароль
              </FormLabel>
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
          {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </Form>
  )
}
