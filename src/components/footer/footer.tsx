import Link from "next/link"

export function Footer() {
  return (
    <footer className="px-4 py-8 bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Social Icons */}
          <div className="md:col-span-1">
            <h2 className="mb-4 text-2xl font-bold text-green-600">ГрандБАЗАР</h2>
            <div className="flex mb-4 space-x-3">
              {/* VK Icon */}
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.9-1.49.45v1.57c0 .417-.133.667-1.25.667-1.885 0-3.965-1.135-5.424-3.243-2.2-3.154-2.803-5.52-2.803-6.010 0-.417.17-.6.453-.6h1.744c.337 0 .465.15.595.5.66 1.815 1.744 3.405 2.196 2.155.288-.795.288-2.573-.133-2.895-.6-.45-1.726-.133-1.726-.9 0-.417.6-.9 1.726-.9 1.393 0 2.38.667 2.38 1.817v3.243c.288.9.66.45 1.327-.217 1.135-1.135 1.945-2.905 1.945-2.905.15-.337.337-.5.675-.5h1.744c.675 0 .337 1.018-.337 2.155-.675 1.135-2.196 2.573-2.196 3.243 0 .45.337.9 1.327 1.817.795.75 1.393 1.393 1.393 1.843 0 .45-.337.667-.675.667z" />
                </svg>
              </Link>

              {/* Telegram Icon */}
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.302 1.872-1.123 2.198-2.304 1.371l-3.177-2.344-1.531 1.472c-.17.17-.315.315-.646.315l.23-3.252 5.942-5.37c.258-.23-.056-.357-.402-.127l-7.342 4.622-3.177-.992c-.69-.215-.704-.69.144-1.02l12.427-4.787c.575-.215 1.078.127.894 1.02z" />
                </svg>
              </Link>

              {/* YouTube Icon */}
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>

              {/* Additional Platform Icon */}
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
            </div>
            <p className="text-sm text-gray-500">© 2024 "ИП ГрандБАЗАР"</p>
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
