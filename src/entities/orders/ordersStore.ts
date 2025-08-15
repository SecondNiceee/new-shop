"use client"

import { create } from "zustand"
import { request } from "@/utils/request"
import type { Order } from "@/payload-types"

type OrderListResponse = {
  docs: Order[]
  totalDocs: number
  page: number
  totalPages: number
}

export type OrdersState = {
  orders: Order[]
  loading: boolean
  loaded: boolean
  error: string | null
  refreshingOrderId: number | null
  // actions
  loadOrders: () => Promise<void>
  clearOrders: () => void
  addOrder: (order: any) => Promise<void>
  refreshOrder: (orderId: number) => Promise<void>
}

export const useOrdersStore = create<OrdersState>()((set, get) => ({
  orders: [],
  loading: false,
  loaded: false,
  error: null,
  refreshingOrderId: null,

  loadOrders: async () => {
    if (get().loaded && get().orders.length > 0) {
      return
    }
    try {
      set({ loading: true, error: null })

      const response = await request<OrderListResponse>({
        method: "GET",
        url: "/api/orders",
        query: {
          depth: "2",
          sort: "-createdAt",
          limit: "50",
        },
        credentials: true,
      })

      if (response?.docs) {
        set({
          orders: response.docs,
          loaded: true,
          loading: false,
        })
      }
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error)
      set({
        error: "Ошибка при загрузке истории заказов",
        loading: false,
      })
    }
  },

  clearOrders: () => {
    set({
      orders: [],
      loaded: false,
      error: null,
    })
  },

  addOrder: async (data: any) => {
    try {
      const rezult = await request<{ doc: Order }>({
        url: "/api/orders",
        method: "POST",
        body: data,
        credentials: true,
      })
      set((state) => ({
        orders: [rezult.doc, ...state.orders],
      }))
    } catch (e) {
      // Вывожу ошибку и кидаю дальше на клиент, чтобы можно было отслеживать
      console.log(e)
      throw e
    }
  },

  refreshOrder: async (orderId: number) => {
    try {
      set({ refreshingOrderId: orderId })

      const response = await request<Order>({
        method: "GET",
        url: `/api/orders/${orderId}`,
        query: {
          depth: "2",
        },
        credentials: true,
      })

      if (response) {
        set((state) => ({
          orders: state.orders.map((order) => (order.id === orderId ? response : order)),
          refreshingOrderId: null,
        }))
      }
    } catch (error) {
      console.error("Ошибка обновления заказа:", error)
      set({
        error: "Ошибка при обновлении заказа",
        refreshingOrderId: null,
      })
    }
  },
}))
