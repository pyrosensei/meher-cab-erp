import { create } from 'zustand'

interface AppState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  notificationCount: number
  setNotificationCount: (count: number) => void
  currentUser: {
    name: string
    email: string
    role: string
    avatar: string
  }
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  notificationCount: 5,
  setNotificationCount: (count) => set({ notificationCount: count }),
  currentUser: {
    name: 'Rajesh Sharma',
    email: 'rajesh@mehercabs.in',
    role: 'Fleet Manager',
    avatar: 'RS',
  },
}))
