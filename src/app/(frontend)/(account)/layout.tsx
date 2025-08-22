import type React from "react"
import { headers as getHeader } from "next/headers"
import { redirect } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import AccountLayoutClient from "./account-layout-client"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headers = await getHeader();
  try{
    const response = await fetch(`${process.env.BACKEND_URL}/api/users/me?select[id]=true`, {
      method : "GET",
      credentials : "include",
      headers : headers,
    });
    const user = await response.json();
    if (!user.user) {
      redirect(routerConfig.home)
    }
  }
  catch(e){
    redirect(routerConfig.home)
  }

  return <AccountLayoutClient>{children}</AccountLayoutClient>
}
