"use client"
import { create } from "zustand"
import { request } from "@/utils/request"
import type { User } from "@/payload-types"

export type TUserResponse = {user : User | null}

type AuthState = {
  user: User | null
  loading: boolean
  error: string | null
  fetchMe: () => Promise<TUserResponse>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  fetchMe: async () => {
    set({ loading: true, error: null })
    try {
      const me = await request<TUserResponse>({
        method: "GET",
        url: "/api/users/me",
        credentials: true,
      })
      set({ user: me.user, loading : false });
      console.log(me);
      return me;
    } catch (e) {
      set({ user: null, error : "Не удалось загрузить пользователя" , loading : false });
      throw e
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const rezult = await request({url : "/api/users/login", 
        method : "POST",
        credentials : true,
        headers : {"Content-Type" : "application/json"},
        body : {email, password}
      })
      console.log(rezult);
    //   await useAuthStore.getState().fetchMe()
    } catch (err: any) {
      set({ error: err?.message || "Ошибка авторизации" })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const rezult = await request({url : "/api/users/register", method : "POST", 
        body : {email, password},  credentials : true, headers : {
            "Content-Type" : "application/json"
        }
      })
      console.log(rezult);
    //   await get().login(email, password);
    } catch (err: any) {
      set({ error: err?.message || "Ошибка регистрации" })
      throw err
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    set({ loading: true, error: null })
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      })
      set({ user: null })
    } catch (e) {
      // ignore
    } finally {
      set({ loading: false })
    }
  },
}))
