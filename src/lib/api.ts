const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

// Tipos para las respuestas de la API
interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// Configuración de headers con token
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Función para hacer peticiones HTTP
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      ...options
    })

    if (!response.ok) {
      let errorData: ApiError
      try {
        errorData = await response.json()
      } catch {
        // Si no se puede parsear JSON, crear error genérico
        if (response.status === 401) {
          errorData = { message: 'No autorizado. Verifica tus credenciales.' }
        } else if (response.status >= 500) {
          errorData = { message: 'Error del servidor. Intenta más tarde.' }
        } else if (response.status >= 400) {
          errorData = { message: 'Datos inválidos. Verifica la información.' }
        } else {
          errorData = { message: 'Error de conexión con el servidor' }
        }
      }
      throw new Error(errorData.message || 'Error en la petición')
    }

    return response.json()
  } catch (error: any) {
    // Si es un error de red (fetch falló)
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifica que el servidor esté funcionando.')
    }
    // Si ya es un error personalizado, lo re-lanzamos
    throw error
  }
}

// Funciones de autenticación
export const authApi = {
  // Registro de usuario
  register: async (data: {
    name: string
    email: string
    password: string
    role_id: number
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    // Guardar token en localStorage
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('token_type', response.token_type)
    localStorage.setItem('expires_in', response.expires_in.toString())
    localStorage.setItem('isLoggedIn', 'true')
    
    return response
  },

  // Login de usuario
  login: async (data: {
    email: string
    password: string
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    // Guardar token en localStorage
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('token_type', response.token_type)
    localStorage.setItem('expires_in', response.expires_in.toString())
    localStorage.setItem('isLoggedIn', 'true')
    
    return response
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error al hacer logout:', error)
    } finally {
      // Limpiar localStorage siempre
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_type')
      localStorage.removeItem('expires_in')
      localStorage.removeItem('isLoggedIn')
    }
  },

  // Verificar si el token es válido
  me: async (): Promise<any> => {
    return apiRequest('/auth/me', {
      method: 'GET'
    })
  }
}

export default apiRequest 