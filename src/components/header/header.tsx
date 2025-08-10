import HeaderMobile from "./header-mobile"
import HeaderDesktop from "./header-desktop"
import CartDrawer from "../cart-drawer/cart-drawer"
import AuthDialog from "../auth/auth-modal"

export function Header() {
  return (
    <header className="relative z-[100]">
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
