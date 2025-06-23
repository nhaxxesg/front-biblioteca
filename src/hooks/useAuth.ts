import { useState, useEffect, createContext, useContext } from 'react'
import type { Perfil, User } from '../types/database'
import { mockUser, mockProfile } from '../data/mockData'

interface AuthContextType {
  user: User | null
  profile: Perfil | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, nombre: string) => Promise<{ error?: string }>
  signOut: () => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      // Check if user is logged in (using localStorage for demo)
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      if (isLoggedIn) {
        setUser(mockUser)
        setProfile(mockProfile)
      }
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simple validation for demo
    if (email === 'usuario@ejemplo.com' && password === 'password') {
      localStorage.setItem('isLoggedIn', 'true')
      setUser(mockUser)
      setProfile(mockProfile)
      return {}
    } else {
      return { error: 'Credenciales inválidas' }
    }
  }

  const signUp = async (email: string, password: string, nombre: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo, always succeed
    const newUser: User = {
      id: 'new-user-' + Date.now(),
      email,
      created_at: new Date().toISOString()
    }
    
    const newProfile: Perfil = {
      id: newUser.id,
      nombre,
      email,
      fecha_registro: new Date().toISOString(),
      estado: 'activo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    localStorage.setItem('isLoggedIn', 'true')
    setUser(newUser)
    setProfile(newProfile)
    return {}
  }

  const signOut = async () => {
    localStorage.removeItem('isLoggedIn')
    setUser(null)
    setProfile(null)
    return {}
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  }
}

export { AuthContext }