import { useAuthStore } from "@/entities/auth/authStore";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function RegisterSection({ loading, error }: { loading: boolean; error: string | null }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [success, setSuccess] = useState<string | null>(null)
  const { register } = useAuthStore()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    await register(email, password)
    // If no error set by store — assume success
    if (!useAuthStore.getState().error) {
      setSuccess("Регистрация прошла успешно. Проверьте почту и подтвердите аккаунт перед входом.")
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertTitle>Готово</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <label className="text-sm font-medium">Почта</label>
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Пароль</label>
        <Input
          type="password"
          placeholder="Минимум 8 символов"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button className="w-full bg-green-500 hover:bg-green-600" type="submit" disabled={loading}>
        {loading ? "Регистрируем..." : "Зарегистрироваться"}
      </Button>
      <p className="text-xs text-gray-500">
        Подтверждение почты включено. Настройте SMTP, чтобы получать письма с подтверждением.
      </p>
    </form>
  )
}
