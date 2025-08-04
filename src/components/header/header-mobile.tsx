import React from 'react';
import { Button } from '../ui/button';
import { MapPin, Menu, Search, ShoppingCart, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import Image from 'next/image';
import { Input } from '../ui/input';

const HeaderMobile = () => {
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
                <Button variant="outline" size="sm" className="p-2 bg-transparent">
                  <ShoppingCart className="h-4 w-4" />
                </Button>

                <Sheet >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="p-2 bg-transparent">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 bg-white">
                    <div className="space-y-4 mt-6">
                      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                        <Image alt="ГрандБАЗАР магазин" width={20} height={20} src={"/catalog.svg"} />
                        <span className="text-sm font-medium">Каталог</span>
                      </Button>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">Адрес доставки</span>
                        </div>
                        <p className="text-xs text-gray-500 pl-6">И мы рассчитаем время и стоимость доставки</p>
                      </div>

                      <div className="p-3 rounded-lg bg-white border">
                        <p className="text-sm font-medium">Мин. сумма заказа 2000 ₽</p>
                        <p className="text-xs text-gray-500">Доставим за 299 ₽</p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Search bar for mobile */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input type="text" placeholder="Поиск по товарам" className="pl-10 h-10 w-full" />
            </div>
          </div>

    );
};

export default HeaderMobile;