"use client"
import { Button } from "../../../ui/button"
import { Menu, ShoppingCart, MapPin } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../../ui/sheet"
import ProductSearch from "../../../product-search/ProductSearch"
import CatalogButton from "../../../catalog-button/CatalogButton"
import { useCartStore } from "@/entities/cart/cartStore"
import { useMobileStore } from "@/entities/mobileMenu/mobileMenuStore"
import UserLink from "../user-link/user-link"
import AddressButton from "../address-button/address-button"

const HeaderMobile = () => {
  const { open, totalCount } = useCartStore()
  const { isOpened, setOpened } = useMobileStore()
  return (
    <div className="md:hidden">
      <div className="flex items-center gap-3">
        {/* Search takes most space */}
        <div className="flex-1">
          <ProductSearch onProductSelect={() => {}} />
        </div>

        {/* Menu button */}
        <Sheet onOpenChange={setOpened} open={isOpened}>
          <SheetTrigger onClick={() => setOpened(true)} asChild>
            <Button variant="outline" size="sm" className="p-2 bg-transparent shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white">
            <SheetTitle className="sr-only">Меню</SheetTitle>
            <div className="space-y-4 mt-6">
              <CatalogButton />
              <Button
                variant="outline"
                className="w-full justify-start gap-3 p-4 h-auto bg-transparent"
                onClick={() => {
                  open()
                  setOpened(false)
                }}
              >
                <ShoppingCart className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>Корзина</span>
                  {totalCount > 0 && <span className="text-sm text-gray-500">{totalCount} товаров</span>}
                </div>
                {totalCount > 0 && (
                  <span className="ml-auto bg-green-500 text-white text-xs rounded-full px-2 py-1">{totalCount}</span>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full h-[53.6px] justify-start gap-3 p-4 bg-transparent"
                onClick={() => {
                  open()
                  setOpened(false)
                }}
              >
                <UserLink />
                <p className="">Аккаунт</p>
              </Button>

              <AddressButton className="w-full flex justify-start gap-3 p-4 h-auto border-2 border-gray-200 rounded-lg"/>

            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default HeaderMobile
