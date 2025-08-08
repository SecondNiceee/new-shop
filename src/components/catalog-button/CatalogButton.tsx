import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useCatalogStore } from '@/entities/catalog/catalogStore';

const CatalogButton = () => {
    const {setPopupCatalogOpened} = useCatalogStore();
    return (
      <Button onClick={() => setPopupCatalogOpened(true)} variant="outline" className="flex items-center gap-2 bg-transparent h-10 lg:h-11">
        <Image
          alt="ГрандБАЗАР магазин"
          width={24}
          height={24}
          src={'/catalog.svg'}
          className="lg:w-[30px] lg:h-[30px]"
        />
        <span className="text-sm font-medium">Каталог</span>
      </Button>
    );
};

export default CatalogButton;