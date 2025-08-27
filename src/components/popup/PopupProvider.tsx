'use client';
import { ReactNode, useEffect } from 'react';
import { useProductsStore } from '@/entities/products/productsStore';
import { useCatalogStore } from '@/entities/catalog/catalogStore'; // если есть
import CategoryPopup from '@/components/category-popup/CategoryPopup';
import { useAddressStore } from '@/entities/address/addressStore';
import AddressPopup from '../address-popup/address-popup';
import ProductPopup from '../product-popup/product-popup';
import GuestBenefitsModal, { useGuestBenefitsStore } from '../auth/guest-benefits-modal';
import { useSearchParams } from 'next/navigation';
export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const {isCatalogPopupOpened} = useCatalogStore()
  const {isProductsPopupOpened, setProductsPopup} = useProductsStore()
   const { isOpen: isAddressPopupOpen } = useAddressStore()
   const {open : isGuestPopupOpened} = useGuestBenefitsStore();
  const searchParams = useSearchParams()
  const productValue = searchParams.get("product");
  useEffect( () => {
    if (productValue){
      setProductsPopup(true);
    }
  }, [productValue] )
  return (
    <>
      {children}
      {/* Глобальные попапы */}
      {isCatalogPopupOpened && <CategoryPopup />}
      {isProductsPopupOpened && <ProductPopup/>}
       {isAddressPopupOpen && <AddressPopup />}
       {isGuestPopupOpened && <GuestBenefitsModal />}
       
    </>
  );
};