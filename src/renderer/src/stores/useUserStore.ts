import { AuthData, User } from '@common/types/database'
import { message } from 'antd'
import { create } from 'zustand'

interface UserStore {
  user: User | null
  isAdmin: boolean
  loading: boolean
  register: (data: AuthData, onSuccess?: () => void) => void
  login: (data: AuthData, onSuccess?: () => void) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAdmin: false,
  loading: false,
  // Действия
  register: async (data, onSuccess) => {
    set({ loading: true })
    const res = await window.electronAPI.user.register(data)
    if (res.success) {
      message.success(res.message)
      onSuccess?.()
    } else {
      message.error(res.message)
    }
    set({ loading: false })
  },

  login: async (data, onSuccess) => {
    set({ loading: true })
    const res = await window.electronAPI.user.login(data)
    if (res.success) {
      set({ user: res.user, isAdmin: res.user.role === 'admin' })
      message.success(res.message)
      onSuccess?.()
    } else {
      message.error(res.message)
    }
    set({ loading: false })
  },

  logout: () => {
    set({ user: null, isAdmin: false })
  }
}))
