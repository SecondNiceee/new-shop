import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "О нас - ГрандБАЗАР",
  description: "Узнайте больше о нашей компании ГрандБАЗАР",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
