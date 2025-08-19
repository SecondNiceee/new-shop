import type React from "react"
import { getPayload } from "payload"
import config from "@payload-config"
import { headers as getHeader } from "next/headers"
import { redirect } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import AccountLayoutClient from "./account-layout-client"

export const dynamic = "force-dynamic"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config })
  const headers = await getHeader()
  const user = await payload.auth({ headers })
  if (!user.user) {
    redirect(routerConfig.home)
  }

  return <AccountLayoutClient>{children}</AccountLayoutClient>
}
