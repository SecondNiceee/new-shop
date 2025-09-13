import { useAddressStore } from '@/entities/address/addressStore'
import { useMobileStore } from '@/entities/mobileMenu/mobileMenuStore'
import { MapPin } from 'lucide-react'
import React, { FC } from 'react'

interface IAddressButton {
  className?: string
}
const AddressButton: FC<IAddressButton> = ({ className }) => {
  const { getFullAddress, openDialog } = useAddressStore()
  const fullAddress = getFullAddress()
  const { setOpened } = useMobileStore()
  const clickHandler = () => {
    setOpened(false)
    openDialog()
  }
  return (
    <div
      onClick={clickHandler}
      className={`cursor-pointer items-center space-x-2 min-w-0 ${className}`}
    >
      <MapPin size={24} className="text-black flex-shrink-0" />
      <div className="flex flex-col">
        {fullAddress ? (
          <>
            <p className="text-sm font-medium truncate max-w-[200px] lg:max-w-[20ch] xl:max-w-xs text-gray-900">
              {fullAddress}
            </p>
            <p className="lg:text-xs text-sm text-green-600 truncate">Нажмите, чтобы изменить</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium truncate">Выберите адрес доставки</p>
            <p className="text-xs text-gray-500 truncate">Ставропольский край</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AddressButton
