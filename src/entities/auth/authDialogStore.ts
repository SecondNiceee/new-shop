"use client"
import { create } from "zustand"

type Mode = "login" | "register"

type AuthDialogStore = {
  open: boolean
  mode: Mode
  openDialog: (mode?: Mode, isRedirect?:boolean) => void
  closeDialog: () => void
  setMode: (mode: Mode) => void
  toggle: () => void,
  isRedirect : boolean
}

export const useAuthDialogStore = create<AuthDialogStore>((set, get) => ({
  open: false,
  mode: "login",
  isRedirect : true,
  openDialog: (mode = "login", isRedirect = true) => {
    set({ open: true, mode,  isRedirect})
  } ,
  closeDialog: () => set({ open: false }),
  setMode: (mode) => set({ mode }),
  toggle: () => set({ open: !get().open })
}))
