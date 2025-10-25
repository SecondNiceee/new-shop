import type React from "react"
import "./globals.css"
import AppInit from "@/components/app-init/app-init"
import { Header } from "@/components/header/header"
import { PopupProvider } from "@/components/popup/PopupProvider"
import "leaflet/dist/leaflet.css"
import { Toaster } from "sonner"
import { BottomNavigation } from "@/components/bottom-navigation/BottomNavigation"
import { Footer } from "@/components/footer/footer"
import { ContactWidget } from "@/components/contact-widget/contact-widget"
import { Poppins, Inter } from "next/font/google"
import { Metadata } from "next"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
})
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://grandbazarr.ru'),
  title: {
    default: "ГрандБАЗАР - Интернет-магазин продуктов с доставкой",
    template: "%s | ГрандБАЗАР",
  },
  description:
    "ГрандБАЗАР - ваш надежный интернет-магазин продуктов питания с быстрой доставкой. Широкий ассортимент свежих продуктов, овощей, фруктов, мяса и многого другого.",
  keywords: ["интернет-магазин", "продукты", "доставка еды", "ГрандБАЗАР", "свежие продукты", "овощи", "фрукты"],
  authors: [{ name: "ГрандБАЗАР" }],
  creator: "ГрандБАЗАР",
  publisher: "ГрандБАЗАР",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
    siteName: "ГрандБАЗАР",
    title: "ГрандБАЗАР - Интернет-магазин продуктов с доставкой",
    description: "Широкий ассортимент свежих продуктов с быстрой доставкой",
  },
  twitter: {
    card: "summary_large_image",
    title: "ГрандБАЗАР - Интернет-магазин продуктов",
    description: "Широкий ассортимент свежих продуктов с быстрой доставкой",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}


export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ru" className={`${poppins.variable} ${inter.variable}`}>
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
