import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, UserRole } from '../types'

interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: '852456',
    user: { id: 'u1', name: 'Administrador', role: 'admin' as UserRole },
  },
  presidente: {
    password: '852456',
    user: { id: 'u2', name: 'André Costa', role: 'presidente' as UserRole, setor: 'Setor A' },
  },
  morador: {
    password: '852456',
    user: { id: 'u3', name: 'Carlos Morador', role: 'morador' as UserRole },
  },
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('fc_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (username: string, password: string) => {
    await new Promise(r => setTimeout(r, 800))

    const entry = USERS[username.toLowerCase()]
    if (!entry || entry.password !== password) {
      return { success: false, error: 'Usuário ou senha incorretos.' }
    }

    setUser(entry.user)
    localStorage.setItem('fc_user', JSON.stringify(entry.user))
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('fc_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
