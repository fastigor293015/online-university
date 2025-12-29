import { create } from 'zustand'

interface AppStore {
  // Состояние приложения
  theme: 'light' | 'dark'
  language: 'ru' | 'en'
  sidebarCollapsed: boolean
  loading: boolean
  notifications: Notification[]
  user: User | null

  // Действия
  toggleTheme: () => void
  setLanguage: (language: 'ru' | 'en') => void
  toggleSidebar: () => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notification, 'id' | 'date'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setUser: (user: User | null) => void
  logout: () => void
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  date: Date
}

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
  avatar?: string
}

export const useAppStore = create<AppStore>((set) => ({
  // Начальное состояние
  theme: 'light',
  language: 'ru',
  sidebarCollapsed: false,
  loading: false,
  notifications: [],
  user: null,

  // Действия
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      // Сохраняем в localStorage
      localStorage.setItem('theme', newTheme)
      return { theme: newTheme }
    })
  },

  setLanguage: (language) => {
    set({ language })
    localStorage.setItem('language', language)
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
  },

  setLoading: (loading) => {
    set({ loading })
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      read: false,
      ...notification
    }

    set((state) => ({
      notifications: [newNotification, ...state.notifications]
    }))
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },

  setUser: (user) => {
    set({ user })
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },

  logout: () => {
    set({ user: null })
    localStorage.removeItem('user')
  }
}))
