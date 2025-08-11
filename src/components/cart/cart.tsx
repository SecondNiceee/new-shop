import { DELIVERY_FEE, MIN_ORDER } from '@/constants/dynamic-constants';
import { useCartStore } from '@/entities/cart/cartStore';
import { Loader2, ShoppingCart } from 'lucide-react';
import React, { FC } from 'react';

const Cart:FC = () => {
  const { open, totalPrice, isCartLoaded, isHydrated } = useCartStore();
  
  if (!isCartLoaded || !isHydrated){
    return  <div className="flex justify-center p-4 bg-white rounded-2xl min-w-[150px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
  }
  const isProducts = totalPrice > 0;
  const isLess = totalPrice < MIN_ORDER;
  return (
    <div
      onClick={open}
      className={`${isProducts ? isLess ? "bg-orange-400" : "bg-green-500" : "bg-white"}  cursor-pointer md:flex items-center gap-2 px-4 py-2 rounded-2xl flex-shrink-0`}
    >
      <div className="text-right">
        {totalPrice > 0 ? (
            <div className='flex justify-between items-center gap-4'>
                <ShoppingCart color='white' size={20} />
                <p className="text-base text-white font-semibold whitespace-nowrap">{totalPrice} ₽</p>
          </div>
        ) : (
          <>
            <p className="text-sm whitespace-nowrap">
              Мин. сумма заказа {MIN_ORDER} ₽
            </p>
            <p className="text-xs text-gray-500 whitespace-nowrap">
              Доставим за {DELIVERY_FEE} ₽
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;