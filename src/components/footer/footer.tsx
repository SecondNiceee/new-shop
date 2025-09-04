import { getSiteSettings } from "@/actions/server/globals/getSiteSettings"
import Image from "next/image"
import Link from "next/link"
export async function Footer() {
  const siteSettings = await getSiteSettings()
  return (
    <footer className="px-4 md:pt-8 md:pb-8 pt-5 pb-[90px] bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Social Icons */}
          <div className="md:col-span-1">
            <h2 className="mb-4 text-2xl font-bold text-green-600">ГрандБАЗАР</h2>
            <div className="flex mb-4 space-x-3">
              {/* VK Icon */}
              <Link rel="noopener norreferrer" target="_blank" href={siteSettings.socialLinks?.vk || "#"} className="text-gray-600 hover:text-gray-800">
                <Image className="w-6 h-6" alt="Вк ГрнадБАЗАР" src={"/vk-icon.svg"} width={24} height={24} />
              </Link>

              {/* Telegram Icon */}
              <Link rel="noopener norreferrer" target="_blank"  href={siteSettings.socialLinks?.telegram || "#"} className="text-gray-600 hover:text-gray-800">
                <Image width={24} height={24} className="w-6 h-6" alt="Telegram ГрандБАЗАР Icon" src={"/telegram-icon.svg"} />
              </Link>

              {/* YouTube Icon */}
              <Link rel="noopener norreferrer" target="_blank"  href={siteSettings.socialLinks?.youtube || "#"} className="text-gray-600 hover:text-gray-800">
                <Image className="w-6 h-6" width={24} height={24} alt="YOUTUBE ICON ГрандБАЗАР" src={"/youtube-icon.svg"} />
              </Link>

              {/* Instagram Icon */}
              <Link rel="noopener norreferrer" target="_blank"  href={siteSettings.socialLinks?.instagram || "#"} className="text-gray-600 hover:text-gray-800">
                <Image className="w-6 h-6" width={24} height={24} alt="Instagram ICON ГрандБАЗАР" src={"/instagram-icon.svg"} />
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              © {siteSettings.companyInfo?.year} "{siteSettings.companyInfo?.legalName}"
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            {/* Column 1 */}
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-gray-800">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-800">
                    Блог
                  </Link>
                </li>
                <li>
                  <Link href="/payment" className="text-sm text-gray-600 hover:text-gray-800">
                    Оплата
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href="/delivery" className="text-sm text-gray-600 hover:text-gray-800">
                    Доставка
                  </Link>
                </li>
                <li>
                  <Link href="/offer" className="text-sm text-gray-600 hover:text-gray-800">
                    Оферта
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" className="text-sm text-gray-600 hover:text-gray-800">
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
