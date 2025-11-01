import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../lib/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
      },
      
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
      },
      
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export const useSessionStore = create((set) => ({
  currentSession: null,
  sessions: [],
  
  setCurrentSession: (session) => set({ currentSession: session }),
  
  setSessions: (sessions) => set({ sessions }),
  
  addSession: (session) => set((state) => ({
    sessions: [session, ...state.sessions]
  })),
  
  updateSession: (id, updates) => set((state) => ({
    currentSession: state.currentSession?.id === id 
      ? { ...state.currentSession, ...updates }
      : state.currentSession,
    sessions: state.sessions.map(s => 
      s.id === id ? { ...s, ...updates } : s
    )
  })),
  
  removeSession: (id) => set((state) => ({
    currentSession: state.currentSession?.id === id ? null : state.currentSession,
    sessions: state.sessions.filter(s => s.id !== id)
  })),
}))

export const useChatStore = create((set) => ({
  messages: [],
  isTyping: false,
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setTyping: (isTyping) => set({ isTyping }),
  
  clearMessages: () => set({ messages: [], isTyping: false }),
}))

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : 'dark'
      })),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
)
