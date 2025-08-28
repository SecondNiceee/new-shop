"use client"
import Link from "next/link"
import { Phone } from "lucide-react"

const TopBar = () => {

  return (
    <div
      className={`bg-gray-50 border-b border-gray-200 transition-transform duration-300 `}
    >
      <div className="px-4 py-2 mx-auto max-w-7xl">
        <div className="flex items-center justify-between text-sm">
          {/* Левая часть - ссылки */}
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-gray-600 transition-colors hover:text-gray-900">
              О нас
            </Link>
            <Link href="/blog" className="text-gray-600 transition-colors hover:text-gray-900">
              Блог
            </Link>
            <Link href="/delivery" className="text-gray-600 transition-colors hover:text-gray-900">
              Доставка
            </Link>
            <Link href="/payment" className="text-gray-600 transition-colors hover:text-gray-900">
              Оплата
            </Link>
          </div>

          {/* Правая часть - номер телефона */}
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-4 h-4" />
            <a href="tel:+74951599009" className="font-medium transition-colors hover:text-gray-900">
              8 (495) 159-90-09
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
