import React from 'react'
import '../globals.css'
import AppInit from '@/components/app-init/app-init'
import { Header } from '@/components/header/header'
import { PopupProvider } from '@/components/popup/PopupProvider'
import Script from 'next/script';
import "leaflet/dist/leaflet.css";

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
      </head>
      <body className="min-h-screen bg-background">
        <PopupProvider>
        <AppInit />
        <Header />
        <main className="mx-auto">{children}</main>
        </PopupProvider>
      </body>
    </html>
  )
}
