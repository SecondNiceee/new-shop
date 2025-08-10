"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronRight, Headphones, MapPin, UserIcon } from "lucide-react"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const {loading, logout, user} = useAuth();
  const router = useRouter();
  if (loading || user === null) {
    return (
      <main className="min-h-[60vh] bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="h-8 w-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin mx-auto" />
        </div>
      </main>
    )
  }
  // Example placeholders
  const phone = "+7-966-182-73-44"
  return (
    <main className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <nav className="bg-white rounded-2xl p-4 md:p-6 border">
              <ul className="space-y-3">
                <li>
                  <button className="w-full text-left text-gray-900 hover:text-black text-sm md:text-base">
                    История заказов
                  </button>
                </li>
                <li className="flex items-center justify-between">
                  <button className="text-left text-gray-900 hover:text-black text-sm md:text-base">Бонусы</button>
                  <Badge className="bg-green-500 hover:bg-green-500 text-white">300</Badge>
                </li>
                <li>
                  <button className="w-full text-left font-semibold text-black text-sm md:text-base">Мои данные</button>
                </li>
                <li>
                  <button className="w-full text-left text-gray-900 hover:text-black text-sm md:text-base">
                    Бережём природу
                  </button>
                </li>
              </ul>

              <hr className="my-5" />

              <Button
                variant="secondary"
                className="w-full justify-center gap-2 bg-black text-white hover:bg-black/90"
                type="button"
              >
                <Headphones className="h-4 w-4" />
                <span className="font-semibold">Служба поддержки</span>
              </Button>

              <hr className="my-5" />

              <div className="text-sm text-gray-500 mb-2">Оферта</div>
              <button
                onClick={async () => {
                  await logout()
                  router.push("/")
                  router.refresh()
                }}
                className="text-left text-sm md:text-base text-red-500 hover:text-red-600"
                type="button"
              >
                Выход из аккаунта
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <section className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="bg-white rounded-2xl p-4 md:p-8 border">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Мои данные</h1>

              {/* Avatar + edit */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-gray-500" />
                  </div>
                  <button className="text-sm text-gray-500 underline underline-offset-2">Редактировать фото</button>
                </div>
              </div>

              {/* Form-like fields (not functional yet) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Input placeholder="Ваше имя" disabled className="bg-gray-100" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                  <Input value={phone} disabled className="bg-gray-100" />
                  <Input value={user?.email || ""} disabled className="bg-gray-100" />
                </div>
              </div>

              {/* Address block */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Адрес</h2>

                <button
                  type="button"
                  className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl px-4 py-3 border"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <span className="text-sm md:text-base text-gray-900">
                      Бачуринская улица, 22к3, подъезд 5, кв. 123
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 border">Кв/офис</div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 border">Подъезд</div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 border">Этаж</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
