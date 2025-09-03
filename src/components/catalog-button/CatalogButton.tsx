import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useCatalogStore } from '@/entities/catalog/catalogStore';

const CatalogButton = () => {
    const {setPopupCatalogOpened} = useCatalogStore();
    return (
      <Button onClick={() => {setPopupCatalogOpened(true)}} variant="outline" className="flex h-[53.6px] sm:h-auto justify-start md:justify-center w-full md:w-auto items-center gap-2 bg-transparent  lg:h-11">
        <Image
          alt="ГрандБАЗАР магазин"
          width={24}
          height={24}
          src={'/catalog.svg'}
          className="lg:w-[30px] lg:h-[30px] my-0"
        />
        <span className="text-sm font-medium">Каталог</span>
      </Button>
    );
};

export default CatalogButton;