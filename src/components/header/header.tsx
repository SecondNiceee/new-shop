import HeaderMobile from "./ui/header-mobile/header-mobile"
import CartDrawer from "../cart-drawer/cart-drawer"
import AuthDialog from "../auth/auth-modal"
import HeaderDesktop from "./ui/header-desktop/header-desktop"
import TopBar from "./ui/top-bar/top-bar"

export function Header() {
  return (
    <>
    <TopBar />
    <header className="sticky top-0 z-[200]">
      <div className="relative z-30 px-4 py-4 bg-gray-100 shadow-md lg:py-5">
        <div className="mx-auto max-w-7xl">
          {/* Mobile Layout (< 768px) */}
          <HeaderMobile />
          {/* Tablet & Desktop Layout (>= 768px) */}
          <HeaderDesktop />
        </div>
      </div>
      <CartDrawer />
      <AuthDialog />
    </header>
    </>
  )
}
