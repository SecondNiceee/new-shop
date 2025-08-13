"use client"
import { Button } from "../../../ui/button"
import { Menu, ShoppingCart } from "lucide-react"
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">ГрандБАЗАР</h1>
        </div>

        <div className="flex items-center gap-2">
          <UserLink />
          <Button
            variant="outline"
            size="sm"
            className="relative p-2 bg-transparent"
            onClick={open}
            aria-label="Открыть корзину"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                {totalCount}
              </span>
            )}
          </Button>

          <Sheet onOpenChange={setOpened} open={isOpened}>
            <SheetTrigger onClick={() => setOpened(true)} asChild>
              <Button variant="outline" size="sm" className="p-2 bg-transparent">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white">
              <SheetTitle className="space-y-4 mt-6">
                <CatalogButton />
                <AddressButton className="py-2 gap-1 cursor-pointer border-black border-solid border-2 rounded-lg p-2 flex items-center " />
              </SheetTitle>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search bar for mobile */}
      <ProductSearch onProductSelect={() => {}} />
    </div>
  )
}

export default HeaderMobile
