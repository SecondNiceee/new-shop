import HeaderMobile from "./ui/header-mobile/header-mobile"
import CartDrawer from "../cart-drawer/cart-drawer"
import AuthDialog from "../auth/auth-modal"
import HeaderDesktop from "./ui/header-desktop/header-desktop"

export function Header() {
  return (
    <header className="sticky top-0 z-[200]">
      <div className="bg-gray-100 z-30 relative shadow-md px-4 py-4 lg:py-5">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout (< 768px) */}
          <HeaderMobile />
          {/* Tablet & Desktop Layout (>= 768px) */}
          <HeaderDesktop />
        </div>
      </div>
      <CartDrawer />
      <AuthDialog />
    </header>
  )
}
