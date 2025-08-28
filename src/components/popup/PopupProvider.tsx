'use client';
import { ReactNode } from 'react';
import { useCatalogStore } from '@/entities/catalog/catalogStore'; // если есть
import CategoryPopup from '@/components/category-popup/CategoryPopup';
import { useAddressStore } from '@/entities/address/addressStore';
import AddressPopup from '../address-popup/address-popup';
import GuestBenefitsModal, { useGuestBenefitsStore } from '../auth/guest-benefits-modal';
export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const {isCatalogPopupOpened} = useCatalogStore()
   const { isOpen: isAddressPopupOpen } = useAddressStore()
   const {open : isGuestPopupOpened} = useGuestBenefitsStore();
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