// src/app/account/layout.tsx
import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import AccountLayoutClient from "./account-layout-client"
import type { Metadata } from "next"

// 🔒 Запрещаем индексацию этой страницы
export const metadata: Metadata = {
  title: "Личный кабинет — ГрандБАЗАР",
  description: "Ваш личный кабинет в интернет-магазине ГрандБАЗАР",
  robots: {
    index: false, // ← не индексировать
    follow: false, // ← не переходить по ссылкам
  },
  // Убираем OG и Twitter — не нужно для приватной страницы
  openGraph: undefined,
  twitter: undefined,
}

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const payloadToken = cookieStore.get("payload-token")

  try {
    const response = await fetch(`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/me`, {
      method: "GET",
      headers: {
        Cookie: payloadToken ? `payload-token=${payloadToken.value}` : "",
      },
      // ⚠️ Важно: не кэшировать этот запрос
      cache: "no-store",
    })

    if (!response.ok) {
      console.log("[v0] Auth check failed: response not ok", response.status)
      redirect(routerConfig.home)
    }

    const data = await response.json()

    if (!data.user) {
      console.log("[v0] Auth check failed: no user in response")
      redirect(routerConfig.home)
    }
  } catch (e) {
    console.log("[v0] Auth check error:", e)
    redirect(routerConfig.home)
  }

  return <AccountLayoutClient>{children}</AccountLayoutClient>
}
