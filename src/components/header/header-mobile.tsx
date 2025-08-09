"use client"
import React from 'react';
import { Button } from '../ui/button';
import { Menu, ShoppingCart, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import ProductSearch from '../product-search/ProductSearch';
import CatalogButton from '../catalog-button/CatalogButton';
import { useCartStore } from '@/entities/cart/cartStore';
import MobileAdressButton from '../mobile-adress-button/MobileAdressButton';
import { useMobileStore } from '@/entities/mobileMenu/mobileMenuStore';

const HeaderMobile = () => {
    const { open, totalCount } = useCartStore();
    const {isOpened, setOpened, toggle} = useMobileStore();
    return (
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {}}
                  className="p-2 bg-green-400 hover:bg-green-300 rounded-full"
                >
                  <User className="h-4 w-4 text-white" />
                </Button>
                <h1 className="text-xl font-bold ml-2">ГрандБАЗАР</h1>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="relative p-2 bg-transparent" onClick={open} aria-label="Открыть корзину">
                  <ShoppingCart className="h-4 w-4" />
                  {totalCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                      {totalCount}
                    </span>
                  )}
                </Button>

                <Sheet onOpenChange={setOpened} open = {isOpened} >
                  <SheetTrigger onClick={() => setOpened(true)} asChild>
                    <Button variant="outline" size="sm" className="p-2 bg-transparent">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 bg-white">
                    <SheetTitle className="space-y-4 mt-6">
                      <CatalogButton />
                      <MobileAdressButton />
                    </SheetTitle>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Search bar for mobile */}
            <ProductSearch onProductSelect={() => {}}   />
          </div>

    );
};

export default HeaderMobile;
