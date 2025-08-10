import { useAuthStore } from "@/entities/auth/authStore";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function LoginSection({ loading, error }: { loading: boolean; error: string | null }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuthStore()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
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
          placeholder="Введите пароль"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button className="w-full bg-green-500 hover:bg-green-600" type="submit" disabled={loading}>
        {loading ? "Входим..." : "Войти"}
      </Button>
    </form>
  )
}