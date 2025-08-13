"use client"

import { useEffect, useRef } from "react"
import { useCartStore } from "@/entities/cart/cartStore"
import { useCategoriesStore } from "@/entities/categories/categoriesStore"
import { useAuthStore } from "@/entities/auth/authStore"
import { useAddressStore } from "@/entities/address/addressStore"

/**
 * AppInit runs once on the client to bootstrap session, cart, address, and other app data.
 * It renders nothing.
 */
export default function AppInit() {
  const didBoot = useRef(false)
  const fetchMe = useAuthStore((s) => s.fetchMe)
  const loadServerCart = useCartStore((s) => s.loadServer)
  const getCategories = useCategoriesStore((s) => s.getCategories)
  const loadAddress = useAddressStore((s) => s.loadAddress)

  useEffect(() => {
    if (didBoot.current) return
    didBoot.current = true
    ;(async () => {
      try {
        // 1) Fetch current user session
        await fetchMe()
      } catch {}

      try {
        // 2) Load server cart if user exists
        await loadServerCart()
      } catch {}

      try {
        // 3) Load address (from server if logged in, from localStorage if not)
        await loadAddress()
      } catch {}

      try {
        // 4) Prefetch categories (optional, improves UX of header/catalog)
        await getCategories()
      } catch {}
    })()
  }, [fetchMe, loadServerCart, getCategories, loadAddress])

  return null
}
