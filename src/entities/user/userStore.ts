'use client'

import { create } from 'zustand'
import { User } from '@/payload-types'
import { request, RequestError } from '@/utils/request'


interface UserStore {
  user: User | null
  isLoading: boolean
  error: RequestError | null
  login: (email: string, password: string) => Promise<void>
  findMe: () => Promise<void>
  logout: () => Promise<void>
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const rezult = await request({
        method: 'POST',
        url: '/api/users/login',
        body: { email, password },
        credentials: true,
      })
      console.log(rezult)
      set({ user: rezult.user, isLoading: false, error: null })
    } catch (e) {
      const error = e as RequestError
      set({ isLoading: false, error })
      throw error
    }
  },

  findMe: async () => {
    set({ isLoading: true, error: null })
    try {
      const rezult = await request({
        method: 'GET',
        url: '/api/users/me',
        credentials: true,
      })
      set({ user: rezult.user, isLoading: false, error: null })
    } catch (e) {
      const error = e as RequestError
      set({
        user: null,
        isLoading: false,
        error: {
          message: error.message || 'Пользователь не авторизован',
          name: error.name || 'NotAuthorized',
          status: error.status || 401,
        },
      })
      throw error
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null })
    try {
      await request({
        method: 'POST',
        url: '/api/users/logout',
        credentials: true,
      })
      set({ user: null, isLoading: false, error: null })
    } catch (e) {
      const error = e as RequestError
      set({ isLoading: false, error })
      throw error
    }
  },
}))
