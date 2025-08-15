"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { request } from "@/utils/request"
import { useAuthStore } from "../auth/authStore"

export interface Address {
  id?: number | string
  street: string
  apartment?: string
  entrance?: string
  floor?: string
  comment?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

interface AddressStore {
  isOpen: boolean
  currentAddress: Address | null
  loading: boolean
  syncing: boolean
  isHydrated: boolean
  openDialog: () => void
  closeDialog: () => void
  setAddress: (address: any) => Promise<void>
  clearAddress: () => Promise<void>
  getFullAddress: () => string
  loadAddress: () => Promise<void>
}

type TChangeResponse = {
    doc : Address
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      currentAddress: null,
      loading: false,
      syncing: false,
      isHydrated: false,

      openDialog: () => set({ isOpen: true }),
      closeDialog: () => set({ isOpen: false }),

      setAddress: async (address: any) => {
        set({ syncing: true })

        try {
          // Проверяем, авторизован ли пользователь
          const authStore = useAuthStore.getState()
          const user = authStore.user
          if (user) {
            // Пользователь авторизован - сохраняем в БД
            const currentAddress = get().currentAddress

            if (currentAddress?.id) {
              // Обновляем существующий адрес
              const updatedAddress = await request<TChangeResponse>({
                url: `/api/addresses/${currentAddress.id}`,
                method: "PATCH",
                body: {
                  street: address.street,
                  apartment: address.apartment,
                  entrance: address.entrance,
                  floor: address.floor,
                  comment: address.comment,
                  coordinates: address.coordinates,
                },
                credentials: true,
              })
              console.log(updatedAddress)

              set({ currentAddress: updatedAddress.doc })
            } else {
              // Создаем новый адрес
              const newAddress = await request<TChangeResponse>({
                url: "/api/addresses",
                method: "POST",
                body: {
                  street: address.street,
                  apartment: address.apartment,
                  entrance: address.entrance,
                  floor: address.floor,
                  comment: address.comment,
                  coordinates: address.coordinates,
                },
                credentials: true,
              })
              set({ currentAddress: newAddress.doc })
            }
          } else {
            // Пользователь не авторизован - сохраняем в localStorage
            set({ currentAddress: address })
          }
        } catch (error) {
          console.error("Error saving address:", error)
          // В случае ошибки сохраняем локально
          set({ currentAddress: address })
        } finally {
          set({ syncing: false })
        }
      },

      clearAddress: async () => {
        const authStore = useAuthStore.getState()
        const user = authStore.user

        if (user && get().currentAddress?.id) {
          try {
            await request({
              url: `/api/addresses/${get().currentAddress?.id}`,
              method: "DELETE",
              credentials: true,
            })

            set({ currentAddress: null })
          } catch (error) {
            console.error("Error deleting address:", error)
          }
        } else {
          set({ currentAddress: null })
        }
      },

      loadAddress: async () => {
        set({ loading: true })

        try {
          const authStore = useAuthStore.getState()
          const user = authStore.user

          if (user) {
            // Загружаем адрес из БД
            const response = await request<{ docs: Address[] }>({
              url: "/api/addresses",
              method: "GET",
              query: {
                limit: "1",
              },
              credentials: true,
            })
            const address = response.docs[0] || null
            set({ currentAddress: address })
          }
          // Если пользователь не авторизован, используем данные из localStorage (persist)
        } catch (error) {
          console.error("Error loading address:", error)
        } finally {
          set({ loading: false })
        }
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

        return fullAddress.charAt(0).toUpperCase() + fullAddress.slice(1)
      },
    }),
    {
      name: "address-store",
      partialize: (state) => ({
        currentAddress: state.currentAddress,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true
        }
      },
    },
  ),
)
