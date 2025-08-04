import React from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import '../globals.css'

import { Navbar } from '@/components/Navbar'
import config from '@/payload.config'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const headersList = await headers()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: headersList })

  // Преобразуем тип user для соответствия ожидаемому типу в Navbar
  const navbarUser = user ? {
    email: user.email,
    id: String(user.id) // Преобразуем id в строку
  } : null

  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <main className="mx-auto">{children}</main>
      </body>
    </html>
  )
}
