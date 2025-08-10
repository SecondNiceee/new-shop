"use client"

import { useEffect, useRef } from "react"
import { useCartStore } from "@/entities/cart/cartStore"
import { useCategoriesStore } from "@/entities/categories/categoriesStore"
import { useAuthStore } from "@/entities/auth/authStore"

/**
 * AppInit runs once on the client to bootstrap session, cart, and other app data.
 * It renders nothing.
 */
export default function AppInit() {
  const didBoot = useRef(false)
  const fetchMe = useAuthStore((s) => s.fetchMe)
  const loadServerCart = useCartStore((s) => s.loadServer)
  const getCategories = useCategoriesStore((s) => s.getCategories)

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
        // 3) Prefetch categories (optional, improves UX of header/catalog)
        await getCategories()
      } catch {}
    })()
  }, [fetchMe, loadServerCart, getCategories])

  return null
}
