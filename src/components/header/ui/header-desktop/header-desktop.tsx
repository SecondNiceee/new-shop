"use client"
import React from 'react'
import { Menu } from 'lucide-react'
import Cart from '@/components/cart/cart'
import CatalogButton from '@/components/catalog-button/CatalogButton'
import ProductSearch from '@/components/product-search/ProductSearch'
import { Button } from '@/components/ui/button'
import { SheetTrigger, SheetContent, SheetTitle, Sheet } from '@/components/ui/sheet'
import UserLink from '../user-link/user-link'
import AddressButton from '../address-button/address-button'
import HeaderLogo from '../header-logo/header-logo'

const HeaderDesktop = () => {
  return (
    <div className="hidden md:flex items-center justify-between gap-6">
      
      <HeaderLogo />

      <div className="flex-1 max-w-sm lg:max-w-md">
        <ProductSearch />
      </div>

      <CatalogButton />
      {/* Menu for tablet - shows address and delivery info */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden w-10 h-10 p-2 bg-transparent">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 bg-white">
          <SheetTitle className="space-y-4 mt-6">
            <AddressButton className='py-2 cursor-pointer border-black border-solid border-2 rounded-lg p-2 flex  ' />
            <Cart />
          </SheetTitle>
        </SheetContent>
      </Sheet>

      {/* Address info - hidden on tablet, shown on desktop */}

      <AddressButton className='hidden lg:flex' />
      {/* Mini cart summary (dynamic) */}
      <Cart />
      <UserLink />
    </div>
  )
}

export default HeaderDesktop
