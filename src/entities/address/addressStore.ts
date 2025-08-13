"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Address {
  street: string
  apartment?: string
  entrance?: string
  floor?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

interface AddressStore {
  isOpen: boolean
  currentAddress: Address | null
  openDialog: () => void
  closeDialog: () => void
  setAddress: (address: Address) => void
  clearAddress: () => void
  getFullAddress: () => string
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      currentAddress: null,

      openDialog: () => set({ isOpen: true }),
      closeDialog: () => set({ isOpen: false }),

      setAddress: (address: Address) => {
        set({ currentAddress: address })
      },

      clearAddress: () => {
        set({ currentAddress: null })
      },

    getFullAddress: () => {
    const { currentAddress } = get()
    if (!currentAddress) return ""

    let fullAddress = currentAddress.street

    const details = []
    if (currentAddress.apartment) details.push(`кв. ${currentAddress.apartment}`)
    if (currentAddress.entrance) details.push(`подъезд ${currentAddress.entrance}`)
    if (currentAddress.floor) details.push(`этаж ${currentAddress.floor}`)

    if (details.length > 0) {
        fullAddress += `, ${details.join(", ")}`
    }

    // Делаем первую букву заглавной
    return fullAddress.charAt(0).toUpperCase() + fullAddress.slice(1)
    },
    }),
    {
      name: "address-store",
      partialize: (state) => ({
        currentAddress: state.currentAddress,
      }),
    },
  ),
)
