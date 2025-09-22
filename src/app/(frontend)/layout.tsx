import type React from "react"
import "../globals.css"
import AppInit from "@/components/app-init/app-init"
import { Header } from "@/components/header/header"
import { PopupProvider } from "@/components/popup/PopupProvider"
import "leaflet/dist/leaflet.css"
import { Toaster } from "sonner"
import { BottomNavigation } from "@/components/bottom-navigation/BottomNavigation"
import { Footer } from "@/components/footer/footer"
import { ContactWidget } from "@/components/contact-widget/contact-widget"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head></head>
      <body className="min-h-screen bg-background">
        <PopupProvider>
          <AppInit />
            <Header />
            <main className="mx-auto min-h-[60vh]">
              {children}
              <BottomNavigation />
            </main>
            <Footer />
            <Toaster />
            <ContactWidget />
        </PopupProvider>
      </body>
    </html>
  )
}
