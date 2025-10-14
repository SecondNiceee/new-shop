// src/app/account/layout.tsx
import type React from "react";
import { headers as getHeader } from "next/headers";
import { redirect } from "next/navigation";
import { routerConfig } from "@/config/router.config";
import AccountLayoutClient from "./account-layout-client";
import { Metadata } from "next";

// 🔒 Запрещаем индексацию этой страницы
export const metadata: Metadata = {
  title: "Личный кабинет — ГрандБАЗАР",
  description: "Ваш личный кабинет в интернет-магазине ГрандБАЗАР",
  robots: {
    index: false,    // ← не индексировать
    follow: false,   // ← не переходить по ссылкам
  },
  // Убираем OG и Twitter — не нужно для приватной страницы
  openGraph: undefined,
  twitter: undefined,
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headers = await getHeader();
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/users/me?select[id]=true`, {
      method: "GET",
      credentials: "include",
      headers: headers,
      // ⚠️ Важно: не кэшировать этот запрос
      cache: "no-store",
    });
    const user = await response.json();
    if (!user.user) {
      redirect(routerConfig.home);
    }
  } catch (e) {
    redirect(routerConfig.home);
  }

  return <AccountLayoutClient>{children}</AccountLayoutClient>;
}