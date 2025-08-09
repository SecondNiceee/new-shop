import { create } from 'zustand'

type TMobileMenuState = {
  isOpened: boolean
  setOpened: (value: boolean) => void
  toggle: () => void
}
export const useMobileStore = create<TMobileMenuState>((set, get) => ({
  isOpened: false,
  toggle: () => {
    const previousIsOpened = get().isOpened
    set({ isOpened: !previousIsOpened })
  },
  setOpened: (value: boolean) => {
    set({ isOpened: value })
  },
}))
