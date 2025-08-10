'use client';
import { ReactNode } from 'react';
import { useProductsStore } from '@/entities/products/productsStore';
import { useCatalogStore } from '@/entities/catalog/catalogStore'; // если есть
import CategoryPopup from '@/components/category-popup/CategoryPopup';
import ProductPopup from '../product-popup/product-popup';
export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const {isCatalogPopupOpened} = useCatalogStore()
  const {isProductsPopupOpened} = useProductsStore()
  return (
    <>
      {children}
      {/* Глобальные попапы */}
      {isCatalogPopupOpened && <CategoryPopup />}
      {isProductsPopupOpened && <ProductPopup/>}
    </>
  );
};