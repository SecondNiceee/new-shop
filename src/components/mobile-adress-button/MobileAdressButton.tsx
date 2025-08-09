import { MapPin } from 'lucide-react';
import React from 'react';

const MobileAdressButton = () => {
    return (
        <div className="py-2 cursor-pointer border-black border-solid border-2 rounded-lg p-2 flex gap-4 items-center justify-between">
        <MapPin className="h-8 w-8 text-gray-600" />
        <div className="flex flex-col gap-1 m-0">
            <span className="text-sm font-medium">Выберите адрес доставки</span>
            <p className="text-xs text-gray-500">
            И мы рассчитаем время и стоимость доставки
            </p>
        </div>
        </div>
    );
};

export default MobileAdressButton;