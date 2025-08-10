"use client"
import { create } from "zustand"

type Mode = "login" | "register"

type AuthDialogStore = {
  open: boolean
  mode: Mode
  openDialog: (mode?: Mode) => void
  closeDialog: () => void
  setMode: (mode: Mode) => void
  toggle: () => void
}

export const useAuthDialogStore = create<AuthDialogStore>((set, get) => ({
  open: false,
  mode: "login",
  openDialog: (mode = "login") => set({ open: true, mode }),
  closeDialog: () => set({ open: false }),
  setMode: (mode) => set({ mode }),
  toggle: () => set({ open: !get().open }),
}))
