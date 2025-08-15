import { getPayload } from "payload"
import config from "@payload-config";
import Link from "next/link"
import { CheckCircle2, XCircle, Home, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { routerConfig } from "@/config/router.config";
import { Button } from "@/components/ui/button";


const VerifyEmailPage = async ({ searchParams } : {searchParams : Promise<any> | undefined} ) => {
  const payload = await getPayload({ config })
  const token = (await searchParams)?.token;

  // Нет токена
  if (!token) {
    return (
      <main className="h-[90bh] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Неверная ссылка</CardTitle>
            <CardDescription className="text-gray-600">
              Отсутствует токен подтверждения. Проверьте ссылку из письма.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl">
              <Link href={routerConfig.home} className="inline-flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                На главную
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  try {
    await payload.verifyEmail({ collection: "users", token });
    return (
      <main className="h-[90vh] bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Email подтверждён!</CardTitle>
            <CardDescription className="text-gray-600">
              Добро пожаловать в <span className="font-semibold text-green-600">ГРАНДБАЗАР</span>! Теперь вы можете
              войти в свой аккаунт и начать покупки.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl">
              <Link href={routerConfig.home} className="inline-flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Перейти к покупкам
              </Link>
            </Button>
            <div className="text-center">
              <p className="text-xs text-gray-500">Теперь вы можете войти в аккаунт используя свой email и пароль</p>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  } catch (error: unknown) {
    return (
      <main className="h-[90vh] bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Ошибка подтверждения</CardTitle>
            <CardDescription className="text-gray-600">
              Ссылка недействительна или устарела. Попробуйте зарегистрироваться заново.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl">
              <Link href={routerConfig.home} className="inline-flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                На главную
              </Link>
            </Button>
            <div className="text-center">
              <p className="text-xs text-gray-500">Если проблема повторяется, обратитесь в службу поддержки</p>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }
}

export default VerifyEmailPage
