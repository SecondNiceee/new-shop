'use client';
import { ReactNode, useEffect } from 'react';
import { useCatalogStore } from '@/entities/catalog/catalogStore'; // если есть
import CategoryPopup from '@/components/category-popup/CategoryPopup';
import { useAddressStore } from '@/entities/address/addressStore';
import AddressPopup from '../address-popup/address-popup';
import GuestBenefitsModal, { useGuestBenefitsStore } from '../auth/guest-benefits-modal';
import { useSearchParams } from 'next/navigation';
export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const {isCatalogPopupOpened} = useCatalogStore()
   const { isOpen: isAddressPopupOpen } = useAddressStore()
   const {open : isGuestPopupOpened} = useGuestBenefitsStore();
  const searchParams = useSearchParams()
  const productValue = searchParams.get("product");
  return (
    <>
      {children}
      {/* Глобальные попапы */}
      {isCatalogPopupOpened && <CategoryPopup />}
       {isAddressPopupOpen && <AddressPopup />}
       {isGuestPopupOpened && <GuestBenefitsModal />}
    </>
  );
};