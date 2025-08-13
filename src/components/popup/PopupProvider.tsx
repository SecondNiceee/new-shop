'use client';
import { ReactNode } from 'react';
import { useProductsStore } from '@/entities/products/productsStore';
import { useCatalogStore } from '@/entities/catalog/catalogStore'; // если есть
import CategoryPopup from '@/components/category-popup/CategoryPopup';
import ProductPopup from '../product-popup/product-popup';
import { useAddressStore } from '@/entities/address/addressStore';
import AddressPopup from '../address-popup/address-popup';
export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const {isCatalogPopupOpened} = useCatalogStore()
  const {isProductsPopupOpened} = useProductsStore()
   const { isOpen: isAddressPopupOpen } = useAddressStore()
  return (
    <>
      {children}
      {/* Глобальные попапы */}
      {isCatalogPopupOpened && <CategoryPopup />}
      {isProductsPopupOpened && <ProductPopup/>}
       {isAddressPopupOpen && <AddressPopup />}
    </>
  );
};