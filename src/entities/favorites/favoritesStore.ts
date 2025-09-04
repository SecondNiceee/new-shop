import { Favorite, Product } from '@/payload-types'
import { favoritesService } from '@/services/favoritesService/favoritesService'
import { RequestError } from '@/utils/request'
import { create } from 'zustand'
import { useAuthStore } from '../auth/authStore'

interface FavoritesState {
  favorites: Favorite[]
  favoriteProductIds: Set<number>
  loading: boolean
  error: null | RequestError

  // Actions
  loadFavorites: () => Promise<void>
  addToFavorites: (productId: number) => Promise<void>
  removeFromFavorites: (productId: number) => Promise<void>
  loadFavoritiesIds: () => Promise<void>
  loadMoreFavorites: () => Promise<void>

  hasMore: boolean
  isLoadingMore: boolean
  currentPage: number
  limit: number
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  favoriteProductIds: new Set(),
  loading: false,
  error: null,

  // Pagination state

  hasMore: false,
  isLoadingMore: false,
  currentPage: 1,
  limit: 10,
  loadFavorites: async () => {
    set({ loading: true, error: null })
    try {
      const response = await favoritesService.getFavorites(1, get().limit)
      set({
        favorites: response.docs,
        loading: false,
        hasMore: response.hasNextPage,
        currentPage: 1,
      })
    } catch (error) {
      console.error('Error loading favorites:', error)
      set({ loading: false, error: { message: 'Не удалось получить товары', status: 500 } })
    }
  },

  loadFavoritiesIds: async () => {
    const user = useAuthStore().user;
    if (!user){
      return;
    }
    const favoritesIds = await favoritesService.getFavoritiesIds()
    const favoritiesIdsSet = new Set(favoritesIds)
    set({ favoriteProductIds: favoritiesIdsSet })
  },

  loadMoreFavorites: async () => {
    const { isLoadingMore, hasMore, currentPage } = get()

    if (isLoadingMore || !hasMore) return

    set({ isLoadingMore: true })
    try {
      const nextPage = currentPage + 1
      const response = await favoritesService.getFavorites(nextPage, get().limit)
      set({
        favorites: [...get().favorites, ...response.docs],
        isLoadingMore: false,
        hasMore: response.hasNextPage,
        currentPage: nextPage,
      })
    } catch (error) {
      console.error('Error loading more favorites:', error)
      set({ isLoadingMore: false })
    }
  },

  addToFavorites: async (productId: number) => {
    const newFavorite = await favoritesService.addToFavorites(productId)
    const { favoriteProductIds, favorites } = get()
    const newFavoriteProductIds = new Set(favoriteProductIds)
    newFavoriteProductIds.add((newFavorite.product as Product).id)
    set({ favoriteProductIds: newFavoriteProductIds, favorites: [...favorites, newFavorite] })
  },

  removeFromFavorites: async (productId: number) => {
    await favoritesService.removeFromFavorites(productId)
    const { favoriteProductIds, favorites } = get()
    const newFavoriteProductIds = new Set(favoriteProductIds)
    newFavoriteProductIds.delete(productId)
    const updatedFavorites = favorites.filter((fav) => (fav.product as Product).id !== productId)
    set({
      favoriteProductIds: newFavoriteProductIds,
      favorites: updatedFavorites,
    })
  },
}))
