import Image from 'next/image'
import React, { useRef } from 'react'
import { Button } from '../ui/button'
import { MapPin, Menu, User } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import ProductSearch from '../product-search/ProductSearch'
import CatalogButton from '../catalog-button/CatalogButton'

const HeaderDesktop = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  return (
    <div className="hidden md:flex items-center justify-between gap-6">
      <div ref={logoRef} className="flex items-center flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold ml-2 lg:ml-3">ГрандБАЗАР</h1>
      </div>

      <div className="flex-1 max-w-sm lg:max-w-md">
        <ProductSearch  />
      </div>

      <CatalogButton />

      {/* Address info - hidden on tablet, shown on desktop */}
      <div className="hidden lg:flex items-center space-x-2 min-w-0">
        <MapPin size={24} className="text-black flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">Выберите адрес доставки</p>
          <p className="text-xs text-gray-500 truncate">
            И мы рассчитаем время и стоимость доставки
          </p>
        </div>
      </div>

      {/* Delivery info - hidden on tablet, shown on desktop */}
      <div className="hidden lg:flex items-center gap-2 p-4 rounded-2xl bg-white flex-shrink-0">
        <div className="text-right">
          <p className="text-sm whitespace-nowrap">Мин. сумма заказа 2000 ₽</p>
          <p className="text-xs text-gray-500 whitespace-nowrap">Доставим за 299 ₽</p>
        </div>
      </div>

      {/* Menu for tablet - shows address and delivery info */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden w-10 h-10 p-2 bg-transparent">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 bg-white">
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Выберите адрес доставки</span>
              </div>
              <p className="text-xs text-gray-500 pl-6">
                И мы рассчитаем время и стоимость доставки
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white border">
              <p className="text-sm font-medium">Мин. сумма заказа 2000 ₽</p>
              <p className="text-xs text-gray-500">Доставим за 299 ₽</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Button
        variant="default"
        size="sm"
        onClick={() => {}}
        className="p-2 bg-green-400 hover:bg-green-300 rounded-full"
      >
        <User className="h-4 w-4 text-white" />
      </Button>
    </div>
  )
}

export default HeaderDesktop
