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
          <Script
            src={`https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU`}
            strategy="beforeInteractive"
          />
        <AppInit />
        <Header />
        <main className="mx-auto">{children}</main>
        </PopupProvider>
      </body>
    </html>
  )
}
