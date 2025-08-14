"use client"
import { create } from "zustand"
import { request, RequestError } from "@/utils/request"
import type { User } from "@/payload-types"
export type TUserResponse = {user : User | null}
type AuthState = {
  user: User | null
  loading: boolean
  error: RequestError | null,
  fetchMe: () => Promise<TUserResponse>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>,
}
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  fetchMe: async () => {
    set({ loading: true, error : null })
    try {
      const me = await request<TUserResponse>({
        method: "GET",
        url: "/api/users/me",
        credentials: true,
      })
      console.log(me);
      set({ user: me.user, loading : false });
      return me;
    } catch (e) {
      // Не нужно этого делать, потому что мы используем это для проверки зарегестрирован ли пользователь
      // поэтому просто выкидываем ошибку на клиент, тем самым редирекнув там на другую страничку
      // А если и интернета нет, то мы получим так и так это уведомление
      const error = e as RequestError;
      console.log(e);
      set({error, loading : false })
      throw e
    }
  },

  login: async (email, password) => {
    try {
      const rezult = await request<{user : User}>({url : "/api/users/login", 
        method : "POST",
        credentials : true,
        headers : {"Content-Type" : "application/json"},
        body : {email, password}
      })
      set({user : rezult.user})
    } catch (err: any) {
        const requestError:RequestError = {message : "Не удалось зайти", status : 404}
        throw requestError;
    } 
  },

  register: async (email, password) => {
    try {
      await request<User>({url : "/api/auth/register", method : "POST", 
        body : {email, password},  credentials : true, headers : {
            "Content-Type" : "application/json"
        }
      });
    } catch (err: any) {
        throw err
    }
  },

  logout: async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      })
      set({ user: null })
    } catch (e) {
      // ignore
    } 
  },
}))
