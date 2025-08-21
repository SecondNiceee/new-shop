'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, Product} from '@/payload-types'
import { request } from '@/utils/request'
import { calcTotal } from './helpers/calcTotal'
import { toPayloadItems } from './helpers/toPayloadItems'
import { useAuthStore } from '../auth/authStore'

// Local types for cart (avoid relying on generated types)
export type CartItem = {
  product: Product
  quantity: number
}

type CartListResponse = {
  docs: Cart[]
  totalDocs: number
}

export type CartState = {
  isOpen: boolean
  items: CartItem[]
  serverCartId: number | string | null
  syncing: boolean,
  isHydrated : boolean,
  isCartLoaded : boolean,
  // derived
  totalCount: number
  totalPrice: number,
  // actions
  open: () => void
  close: () => void
  toggle: () => void
  remove: (productId: number | string) => Promise<void> | void,
  clear: () => Promise<void> | void
  // server sync
  loadServer: () => Promise<void>
  upsertServer: () => Promise<void>
  mergeLocalIntoServer: () => Promise<void>,
  increment : (product:Product) => Promise<void> | void,
  dicrement : (productId : number) => Promise<void> | void,
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      items: [],
      serverCartId: null,
      syncing: false,
      totalCount: 0,
      totalPrice: 0,
      isHydrated : false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      isCartLoaded : false,
      increment: async (product : Product) => {
        const {totalCount : previousTotalCount, totalPrice : previousTotalSumm} = get()
        const items = [...get().items];
        const index = items.findIndex((it) => it.product.id === product.id);
        if (index >= 0){
            items[index] = {...items[index], quantity : items[index].quantity + 1}
        }
        else{
            const newProduct:CartItem = {product, quantity : 1}
            items.push(newProduct);
        }
        set({items, totalCount : previousTotalCount + 1, totalPrice : previousTotalSumm + product.price});
        try{
          await get().upsertServer()
        }
        catch{

        }
      },
      
      dicrement: async (prodcutId) => {
        const items = [...get().items];
        const index = items.findIndex( (item) => item.product.id === prodcutId );
        if (index >= 0){
            const newItem = {...items[index], quantity : items[index].quantity - 1 };
            if (newItem.quantity <= 0){
                return get().remove(prodcutId);
            }
            items[index] = newItem;
        }
        const {totalCount, totalPrice} = calcTotal(items);
        set({items, totalCount, totalPrice});
        try{
          await get().upsertServer()
        }
        catch{
          
        }
      },

      remove: async (productId) => {
        const items = get().items.filter((i) => i.product.id !== productId)
        const { totalCount, totalPrice } = calcTotal(items)
        set({ items, totalCount, totalPrice })
        try {
          await get().upsertServer()
        } catch {}
        
      },

      clear: async () => {
        set({ items: [], totalCount: 0, totalPrice: 0 })
        try {
          // If server cart exists, clear it
          const serverCartId = get().serverCartId
          if (serverCartId) {
            await request({
              method: 'PATCH',
              url: `/api/carts/${serverCartId}`,
              body: { items: [] },
              credentials: true,
            })
          }
        } catch {}
      },

      // Load the server cart (if logged in), and set items to server version
      loadServer: async () => {
        try {
          const {user} = useAuthStore();
          const userId = user?.id;
          if (!userId) {
            set({isCartLoaded : true})
            return;
          }
          const res = await request<CartListResponse>({
            method: 'GET',
            url: '/api/carts',
            query: {
              'where[user][equals]': String(userId),
              depth: '2',
              limit: '1',
            },
            credentials: true,
          })
          if (res.totalDocs > 0) {
            const doc = res.docs[0]
            const items: CartItem[] =
              (doc.items || []).map((it) => ({
                product: it.product as Product,
                quantity: it.quantity,
              })) ?? []
            const { totalCount, totalPrice } = calcTotal(items)
            set({ items, serverCartId: doc.id, totalCount, totalPrice })
          }
        } catch {
          // Not logged-in or no cart
        }
        set({isCartLoaded : true});
      },

      // Upsert (create or update) server cart with current items
      upsertServer: async () => {
        try {
          const {user} = useAuthStore();
          const userId = user?.id
          if (!userId) return

          set({ syncing: true })

          const serverCartId = get().serverCartId
          const payloadItems = toPayloadItems(get().items)

          if (serverCartId) {
            await request({
              method: 'PATCH',
              url: `/api/carts/${serverCartId}`,
              body: { items: payloadItems },
              credentials: true,
            })
          } else {
            const created = await request<{doc : Cart}>({
              method: 'POST',
              url: '/api/carts',
              body: { user: userId, items: payloadItems },
              credentials: true
            })
            set({ serverCartId: created.doc.id })
          }
        } catch {
          // Guest or no session
        } finally {
          set({ syncing: false })
        }
      },

      // Merge local items into server cart (on login)
      mergeLocalIntoServer: async () => {
        try {
          const user = useAuthStore().user;
          if (!user) return
          set({ syncing: true })
          // Get existing server cart
          const res = await request<CartListResponse>({
            method: 'GET',
            url: '/api/carts',
            query: {
              'where[user][equals]': String(user.id),
              depth: '2',
              limit: '1',
            },
            credentials: true
          })

          const localItems = get().items
          const mergedMap = new Map<number | string, CartItem>()

          // Start with server items if exists
          if (res.totalDocs > 0) {
            const doc = res.docs[0]
            const serverItems: CartItem[] =
              (doc.items || []).map((it) => ({
                product: it.product as Product,
                quantity: it.quantity,
              })) ?? []
            for (const it of serverItems) {
              mergedMap.set(it.product.id, { ...it })
            }
            // Merge local additions
            for (const it of localItems) {
              const current = mergedMap.get(it.product.id)
              if (current) {
                mergedMap.set(it.product.id, {
                  product: it.product,
                  quantity: current.quantity + it.quantity,
                })
              } else {
                mergedMap.set(it.product.id, { ...it })
              }
            }

            const mergedItems = Array.from(mergedMap.values())
            const payloadItems = toPayloadItems(mergedItems)
            await request({
              method: 'PATCH',
              url: `/api/carts/${doc.id}`,
              body: { items: payloadItems },
              credentials: true,
            })
            const { totalCount, totalPrice } = calcTotal(mergedItems)
            set({ items: mergedItems, serverCartId: doc.id, totalCount, totalPrice })
          } else {
            // No server cart yet -> create with local items
            const created = await request<{doc : Cart}>({
              method: 'POST',
              url: '/api/carts',
              body: {
                user: user.id,
                items: toPayloadItems(localItems),
              },
              credentials: true,
            })
            const { totalCount, totalPrice } = calcTotal(localItems)
            set({ serverCartId: created.doc.id, totalCount, totalPrice })
          }
        } catch {
          // Ignore if not logged in
        } finally {
          set({ syncing : false })
        }
      },
    }),
    
    {
      name: 'cart-v1',
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const { totalCount, totalPrice } = calcTotal(state.items)
        state.totalCount = totalCount
        state.totalPrice = totalPrice
        state.isHydrated = true
      },
    }
  )
)
