"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Search, Loader2 } from "lucide-react"
import { useAddressStore } from "@/entities/address/addressStore"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import { AddressFormData, addressSchema } from "./schemas/addressSchema"
import { formatAddress } from "./utils/formateAddress";
import { Address } from "@/payload-types"


// Динамический импорт карты для избежания SSR проблем
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
        <p>Загрузка карты...</p>
      </div>
    </div>
  ),
})


const AddressPopup = () => {

  const { isOpen, closeDialog, setAddress, currentAddress } = useAddressStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: "onChange",
    defaultValues: {
      street: "",
      apartment: "",
      entrance: "",
      floor: "",
      comment: "",
    },
  })

  // Загружаем текущий адрес при открытии
  useEffect(() => {
    if (isOpen && currentAddress) {
      setValue("street", currentAddress.street)
      setValue("apartment", currentAddress.apartment || "")
      setValue("entrance", currentAddress.entrance || "")
      setValue("floor", currentAddress.floor || "")
      setValue("comment", currentAddress.comment || "")
      setSearchQuery(currentAddress.street)
      setCoordinates(currentAddress.coordinates)
    }
  }, [isOpen, currentAddress, setValue])

  const searchAddress = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      // Используем Nominatim API для геокодирования (бесплатный)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ", Ставропольский край",
        )}&limit=1&addressdetails=1`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]
        const coords = {
          lat: Number.parseFloat(result.lat),
          lng: Number.parseFloat(result.lon),
        }

        // Форматируем адрес
        const formattedAddress = formatAddress(result.display_name)
        setValue("street", formattedAddress)
        setCoordinates(coords)
        // Обновляем карту через событие (только на клиенте)
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("updateMapLocation", {
              detail: { coords, address: formattedAddress },
            }),
          )
        }
      }
    } catch (error) {
      console.error("Ошибка поиска адреса:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    setCoordinates(coords)
    // Обратное геокодирование БЕЗ обновления центра карты
    reverseGeocode(coords)
  }

  const reverseGeocode = async (coords: { lat: number; lng: number }) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1`,
      )
      const data = await response.json()

      if (data && data.display_name) {
        // Форматируем адрес
        const formattedAddress = formatAddress(data.display_name)

        setSearchQuery(formattedAddress)
        setValue("street", formattedAddress)
      }
    } catch (error) {
      console.error("Ошибка обратного геокодирования:", error)
    }
  }

  const onSubmit = async (data: AddressFormData) => {
    const isFormValid = await trigger()
    if (!isFormValid) return

    if (!coordinates) {
      alert("Пожалуйста, выберите адрес на карте")
      return
    }

    const addressData:Address = {
      id: currentAddress?.id,
      street: data.street,
      apartment: data.apartment,
      entrance: data.entrance,
      floor: data.floor,
      comment: data.comment,
      coordinates,
    }

    try {
      await setAddress(addressData)
      closeDialog()
    } catch (error) {
      console.error("Ошибка сохранения адреса:", error)
    }
  }

  const handleClose = () => {
    reset()
    setSearchQuery("")
    setCoordinates(undefined)
    closeDialog()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden rounded-2xl bg-white">
        {/* Фиксированный заголовок */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100">
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Выберите адрес доставки</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
        </div>

        {/* Основной контент с фиксированной высотой */}
        <div className="flex overflow-y-auto flex-col md:flex-row flex-1 min-h-0">
          {/* Карта */}
          <div className="flex-1 relative min-h-[400px]">
            {/* Поиск адреса */}
            <div className="absolute top-4 left-4 right-4 z-[1000]">
              <div className="flex gap-2 bg-white rounded-lg shadow-lg p-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Введите адрес для поиска"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchAddress()}
                    className="pl-10 placeholder:text-gray-400/60 selection:bg-sky-200 focus-visible:border-sky-400 focus-visible:ring-sky-400/30"
                  />
                </div>
                <Button onClick={searchAddress} size="sm" disabled={isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Найти"}
                </Button>
              </div>
            </div>

            {/* Контейнер для карты с фиксированными размерами */}
            <div className="w-full h-full" style={{ position: "relative", zIndex: 1 }}>
              {isOpen && (
                <LeafletMap onMapClick={handleMapClick} initialCoords={coordinates} className="w-full h-full" />
              )}
            </div>
          </div>

          {/* Форма с деталями адреса */}
          <div className="w-full md:w-80 border-l border-gray-100 bg-gray-50 flex flex-col">
            <div className="flex-1 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="street" className="text-sm font-medium text-gray-900">
                    Адрес <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="street"
                    {...register("street")}
                    placeholder="Выберите на карте или введите адрес"
                    className={`mt-1 placeholder:text-gray-400/60 selection:bg-sky-200 focus-visible:border-sky-400 focus-visible:ring-sky-400/30 ${
                      errors.street ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30" : ""
                    }`}
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="apartment" className="text-sm font-medium text-gray-900">
                      Кв/офис
                    </Label>
                    <Input
                      id="apartment"
                      {...register("apartment")}
                      placeholder="123"
                      className="mt-1 placeholder:text-gray-400/60 selection:bg-sky-200 focus-visible:border-sky-400 focus-visible:ring-sky-400/30"
                    />
                  </div>

                  <div>
                    <Label htmlFor="entrance" className="text-sm font-medium text-gray-900">
                      Подъезд
                    </Label>
                    <Input
                      id="entrance"
                      {...register("entrance")}
                      placeholder="1"
                      className="mt-1 placeholder:text-gray-400/60 selection:bg-sky-200 focus-visible:border-sky-400 focus-visible:ring-sky-400/30"
                    />
                  </div>

                  <div>
                    <Label htmlFor="floor" className="text-sm font-medium text-gray-900">
                      Этаж
                    </Label>
                    <Input
                      id="floor"
                      {...register("floor")}
                      placeholder="5"
                      className="mt-1 placeholder:text-gray-400/60 selection:bg-sky-200 focus-visible:border-sky-400 focus-visible:ring-sky-400/30"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="comment" className="text-sm font-medium text-gray-900">
                    Комментарий к доставке
                  </Label>
                  <textarea
                    id="comment"
                    {...register("comment")}
                    placeholder="Дополнительная информация для курьера (домофон, ориентиры и т.д.)"
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder:text-gray-400/60 selection:bg-sky-200 focus-visible:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-400/30 focus-visible:outline-none resize-none"
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!coordinates}
                  >
                    Сохранить адрес
                  </Button>

                  <Button type="button" onClick={handleClose} variant="outline" className="w-full bg-transparent">
                    Отмена
                  </Button>
                </div>

                {/* Инструкция */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Как выбрать адрес:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Кликните по карте в нужном месте</li>
                    <li>• Или введите адрес в поле поиска</li>
                    <li>• Перетащите маркер для точной настройки</li>
                    <li>• Заполните дополнительные поля</li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddressPopup
