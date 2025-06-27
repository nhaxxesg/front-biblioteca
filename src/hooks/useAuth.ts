import { useState, useEffect, createContext, useContext } from 'react'
import type { Perfil, User } from '../types/database'
import { authApi } from '../lib/api'

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
    const initAuth = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      const token = localStorage.getItem('access_token')
      
      if (isLoggedIn && token) {
        try {
          // Verificar si el token es válido
          const userData = await authApi.me()
          
          // Crear objetos User y Profile desde la respuesta de la API
          const apiUser: User = {
            id: userData.id?.toString() || userData.sub?.toString() || 'unknown',
            email: userData.email,
            created_at: userData.created_at || new Date().toISOString()
          }
          
          const apiProfile: Perfil = {
            id: apiUser.id,
            nombre: userData.name || userData.nombre || 'Usuario',
            email: userData.email,
            telefono: userData.telefono || undefined,
            direccion: userData.direccion || undefined,
            fecha_registro: userData.created_at || new Date().toISOString(),
            estado: 'activo',
            created_at: userData.created_at || new Date().toISOString(),
            updated_at: userData.updated_at || new Date().toISOString()
          }
          
          setUser(apiUser)
          setProfile(apiProfile)
        } catch (error) {
          console.error('Token inválido:', error)
          // Limpiar localStorage si el token no es válido
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('access_token')
          localStorage.removeItem('token_type')
          localStorage.removeItem('expires_in')
        }
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await authApi.login({ email, password, application: 'web' })
      
      // Obtener datos del usuario después del login
      const userData = await authApi.me()
      
      const apiUser: User = {
        id: userData.id?.toString() || userData.sub?.toString() || 'unknown',
        email: userData.email,
        created_at: userData.created_at || new Date().toISOString()
      }
      
      const apiProfile: Perfil = {
        id: apiUser.id,
        nombre: userData.name || userData.nombre || 'Usuario',
        email: userData.email,
        telefono: userData.telefono || undefined,
        direccion: userData.direccion || undefined,
        fecha_registro: userData.created_at || new Date().toISOString(),
        estado: 'activo',
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: userData.updated_at || new Date().toISOString()
      }
      
      setUser(apiUser)
      setProfile(apiProfile)
      
      return {}
    } catch (error: any) {
      console.error('Error en login:', error)
      return { error: error.message || 'Error al iniciar sesión' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, nombre: string) => {
    try {
      setLoading(true)
      
      // Registrar usuario con role_id por defecto (1 para usuario normal)
      const response = await authApi.register({
        name: nombre,
        email,
        password,
        role_id: 1
      })
      
      // Obtener datos del usuario después del registro
      const userData = await authApi.me()
      
      const apiUser: User = {
        id: userData.id?.toString() || userData.sub?.toString() || 'unknown',
        email: userData.email,
        created_at: userData.created_at || new Date().toISOString()
      }
      
      const apiProfile: Perfil = {
        id: apiUser.id,
        nombre: userData.name || userData.nombre || nombre,
        email: userData.email,
        telefono: userData.telefono || undefined,
        direccion: userData.direccion || undefined,
        fecha_registro: userData.created_at || new Date().toISOString(),
        estado: 'activo',
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: userData.updated_at || new Date().toISOString()
      }
      
      setUser(apiUser)
      setProfile(apiProfile)
      
      return {}
    } catch (error: any) {
      console.error('Error en registro:', error)
      return { error: error.message || 'Error al crear la cuenta' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      setUser(null)
      setProfile(null)
    }
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