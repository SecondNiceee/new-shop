"use client"

import { Clock, UserIcon } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import useAuth from "@/hooks/useAuth"

export default function AccountSidebar() {
  const {logout} = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      icon: Clock,
      label: "История заказов",
      path: "/orders",
      isActive: pathname === "/orders",
    },
    {
      icon: UserIcon,
      label: "Мои данные",
      path: "/profile",
      isActive: pathname === "/profile",
    },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl">
      <ul className="space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.path}>
              <button
                onClick={() => router.push(item.path)}
                className={`w-full text-left text-sm md:text-base font-medium flex items-center gap-3 p-2 rounded-xl transition-colors duration-200 ${
                  item.isActive
                    ? "font-bold text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>

      <hr className="my-6 border-gray-200" />

      <button
        onClick={logout}
        className="text-left text-sm md:text-base text-red-500 hover:text-red-600 font-medium transition-colors duration-200 hover:bg-red-50 p-2 rounded-xl w-full"
        type="button"
      >
        Выход из аккаунта
      </button>
    </nav>
  )
}
