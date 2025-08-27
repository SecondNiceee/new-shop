"use client"

import { Home, Search, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/entities/cart/cartStore"

const navigationItems = [
  {
    name: "Главная",
    href: "/",
    icon: Home,
  },
  {
    name: "Каталог",
    href: "/catalog",
    icon: Search,
  },
  {
    name: "Корзина",
    href: "/mobile-cart",
    icon: ShoppingCart,
  },
  {
    name: "Войти",
    href: "/login",
    icon: User,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const { totalCount } = useCartStore()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <nav className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isCartItem = item.name === "Корзина"

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-colors relative",
                isActive ? "text-green-600" : "text-gray-500 hover:text-gray-700",
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5 mb-1", isActive && "text-green-600")} />
                {isCartItem && totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium">
                    {totalCount > 99 ? "99+" : totalCount}
                  </span>
                )}
              </div>
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
