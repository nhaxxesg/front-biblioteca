const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://auth.proyectoinsti.site/api'
const BOOKS_API_URL = (import.meta as any).env?.VITE_BOOKS_API_URL || 'https://book.proyectoinsti.site/api'
const PRESTAMOS_API_URL = (import.meta as any).env?.VITE_PRESTAMOS_API_URL || 'https://loan.proyectoinsti.site/api'
const SOLICITUDES_API_URL = (import.meta as any).env?.VITE_SOLICITUDES_API_URL || 'https://request.proyectoinsti.site/api'

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

// Tipo para los préstamos
interface Prestamo {
  id: number
  id_admin: number
  id_lector: number
  id_libro: number
  loan_date: string
  f_devolucion_establecida: string
  f_devolucion_real: string | null
  estado: string
  created_at: string
  updated_at: string
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
  options: RequestInit = {},
  baseUrl: string = API_BASE_URL
): Promise<T> => {
  const url = `${baseUrl}${endpoint}`
  
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
    application: string
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

// Funciones para libros
export const booksApi = {
  // Obtener todos los libros
  getBooks: async (): Promise<any[]> => {
    try {
      const response = await apiRequest('/book', {
        method: 'GET'
      }, BOOKS_API_URL)
      
      console.log('Libros obtenidos:', response)
      return Array.isArray(response) ? response : []
    } catch (error: any) {
      console.error('Error al obtener libros:', error)
      return []
    }
  },

  // Obtener categorías únicas de los libros
  getCategories: async (): Promise<string[]> => {
    try {
      const books = await booksApi.getBooks()
      // Como la nueva estructura no tiene campo categoria, devolvemos categorías predefinidas
      // o puedes adaptar esto según tu nueva estructura de datos
      const categories = [...new Set(books.map(book => book.categoria).filter(Boolean))]
      
      // Si no hay categorías en los datos, devolver algunas por defecto
      if (categories.length === 0) {
        return ['Ficción', 'Ciencia', 'Historia', 'Tecnología', 'Biografía', 'Autoayuda']
      }
      
      return categories
    } catch (error: any) {
      console.error('Error al obtener categorías:', error)
      return ['Ficción', 'Ciencia', 'Historia', 'Tecnología', 'Biografía', 'Autoayuda']
    }
  }
}

// Funciones para préstamos
export const prestamosApi = {
  // Obtener préstamos del usuario
  getPrestamos: async (userId?: number): Promise<Prestamo[]> => {
    try {
      // Si no se proporciona userId, obtenerlo del token
      if (!userId) {
        try {
          const userInfo = await authApi.me()
          // El ID puede venir como 'id' o 'sub' en el JWT
          userId = Number(userInfo.id || userInfo.sub)
          console.log('📡 Obteniendo préstamos para usuario ID:', userId)
        } catch (error) {
          console.error('❌ No se pudo obtener el ID del usuario desde el token:', error)
          throw new Error('No se pudo obtener el ID del usuario. Inicia sesión nuevamente.')
        }
      }

      const response = await apiRequest<Prestamo[]>(`/prestamos/usuario/${userId}`, {
        method: 'GET'
      }, PRESTAMOS_API_URL)
      
      console.log('✅ Préstamos obtenidos:', response?.length || 0, 'préstamos')
      return Array.isArray(response) ? response : []
    } catch (error: any) {
      console.error('❌ Error al obtener préstamos:', error)
      return []
    }
  },

  // Obtener todos los préstamos (para administradores)
  getAllPrestamos: async (): Promise<Prestamo[]> => {
    try {
      const response = await apiRequest<Prestamo[]>('/prestamos', {
        method: 'GET'
      }, PRESTAMOS_API_URL)
      
      console.log('Todos los préstamos obtenidos:', response)
      return Array.isArray(response) ? response : []
    } catch (error: any) {
      console.error('Error al obtener todos los préstamos:', error)
      return []
    }
  },

  // Obtener préstamo por ID
  getPrestamoById: async (prestamoId: number): Promise<Prestamo | null> => {
    try {
      const response = await apiRequest<Prestamo>(`/prestamos/${prestamoId}`, {
        method: 'GET'
      }, PRESTAMOS_API_URL)
      
      console.log('Préstamo obtenido:', response)
      return response
    } catch (error: any) {
      console.error('Error al obtener préstamo:', error)
      return null
    }
  },

  // Filtrar préstamos por estado
  getPrestamosByEstado: async (userId: number, estado: string): Promise<Prestamo[]> => {
    try {
      const prestamos = await prestamosApi.getPrestamos(userId)
      return prestamos.filter(prestamo => prestamo.estado === estado)
    } catch (error: any) {
      console.error('Error al filtrar préstamos por estado:', error)
      return []
    }
  },

  // Obtener préstamos activos (pendientes)
  getPrestamosActivos: async (userId: number): Promise<Prestamo[]> => {
    return prestamosApi.getPrestamosByEstado(userId, 'pendiente')
  },

  // Obtener préstamos vencidos
  getPrestamosVencidos: async (userId: number): Promise<Prestamo[]> => {
    try {
      const prestamos = await prestamosApi.getPrestamos(userId)
      const hoy = new Date()
      
      return prestamos.filter(prestamo => {
        const fechaDevolucion = new Date(prestamo.f_devolucion_establecida)
        return prestamo.estado === 'pendiente' && fechaDevolucion < hoy
      })
    } catch (error: any) {
      console.error('Error al obtener préstamos vencidos:', error)
      return []
    }
  }
}

// Funciones para solicitudes de préstamos
export const solicitudesApi = {
  // Crear una nueva solicitud de préstamo
  createSolicitud: async (data: {
    id_libro: number,
    estado?: 'pendiente'
  }): Promise<any> => {
    try {
      // Obtener el ID del usuario del token
      const userInfo = await authApi.me()
      const userId = Number(userInfo.id || userInfo.sub)

      // Verificar si ya existe una solicitud pendiente para este libro
      try {
        const [solicitudesExistentes, prestamosExistentes] = await Promise.all([
          apiRequest(`/solicitudes/usuario/${userId}`, {
            method: 'GET'
          }, SOLICITUDES_API_URL),
          apiRequest(`/prestamos/usuario/${userId}`, {
            method: 'GET'
          }, PRESTAMOS_API_URL)
        ])
        
        // Verificar préstamos activos
        const prestamoActivo = Array.isArray(prestamosExistentes) && 
          prestamosExistentes.find(p => 
            Number(p.id_libro) === Number(data.id_libro) && 
            (p.estado === 'pendiente' || p.estado === 'activo')
          )
        
        if (prestamoActivo) {
          throw new Error('Ya tienes un préstamo activo para este libro')
        }
        
        // Verificar solicitudes pendientes
        const solicitudExistente = Array.isArray(solicitudesExistentes) && 
          solicitudesExistentes.find(s => 
            Number(s.id_libro) === Number(data.id_libro) && 
            s.estado === 'pendiente'
          )
        
        if (solicitudExistente) {
          throw new Error('Ya tienes una solicitud pendiente para este libro')
        }
      } catch (validationError: any) {
        // Si el error es de validación, lo lanzamos
        if (validationError.message.includes('préstamo activo') || 
            validationError.message.includes('solicitud pendiente')) {
          throw validationError
        }
        // Si es otro error (ej. red), continuamos (no queremos bloquear por errores de red)
        console.warn('No se pudo validar solicitudes/préstamos existentes:', validationError)
      }

      const solicitudData = {
        id_usuario: userId,
        id_libro: data.id_libro,
        estado: data.estado || 'pendiente' as 'pendiente'
      }

      console.log('📡 Creando solicitud para libro ID:', data.id_libro)
      
      const response = await apiRequest('/solicitudes', {
        method: 'POST',
        body: JSON.stringify(solicitudData)
      }, SOLICITUDES_API_URL)
      
      console.log('✅ Solicitud creada exitosamente')
      return response
    } catch (error: any) {
      console.error('❌ Error al crear solicitud:', error)
      
      // Mejorar el mensaje de error
      if (error.message.includes('préstamo activo') || 
          error.message.includes('solicitud pendiente')) {
        throw error // Pasar el mensaje de validación tal como está
      } else if (error.message.includes('syntax error')) {
        throw new Error('Error de formato en los datos. Verifica que el servidor esté funcionando correctamente.')
      }
      
      throw error
    }
  },

  // Obtener todas las solicitudes del usuario
  getSolicitudes: async (userId?: number): Promise<any[]> => {
    try {
      // Si no se proporciona userId, obtenerlo del token
      if (!userId) {
        try {
          const userInfo = await authApi.me()
          // El ID puede venir como 'id' o 'sub' en el JWT
          userId = Number(userInfo.id || userInfo.sub)
          console.log('📡 Obteniendo solicitudes para usuario ID:', userId)
        } catch (error) {
          console.error('❌ No se pudo obtener el ID del usuario desde el token:', error)
          throw new Error('No se pudo obtener el ID del usuario. Inicia sesión nuevamente.')
        }
      }

      const response = await apiRequest(`/solicitudes/usuario/${userId}`, {
        method: 'GET'
      }, SOLICITUDES_API_URL)
      
      console.log('✅ Solicitudes obtenidas:', Array.isArray(response) ? response.length : 0, 'solicitudes')
      return Array.isArray(response) ? response : []
    } catch (error: any) {
      console.error('❌ Error al obtener solicitudes:', error)
      return []
    }
  },

  // Obtener solicitudes de un usuario específico
  getSolicitudesByUsuario: async (userId: number): Promise<any[]> => {
    try {
      const response = await apiRequest(`/solicitudes/usuario/${userId}`, {
        method: 'GET'
      }, SOLICITUDES_API_URL)
      
      console.log('Solicitudes del usuario obtenidas:', response)
      return Array.isArray(response) ? response : []
    } catch (error: any) {
      console.error('Error al obtener solicitudes del usuario:', error)
      return []
    }
  }
}

// Funciones para sanciones
export const sancionesApi = {
  // Obtener sanciones del usuario
  getSanciones: async (userId?: number): Promise<import('../types/database').Sancion[]> => {
    try {
      // Si no se proporciona userId, obtenerlo del token
      if (!userId) {
        try {
          const userInfo = await authApi.me()
          userId = Number(userInfo.id || userInfo.sub)
          console.log('📡 Obteniendo sanciones para usuario ID:', userId)
        } catch (error) {
          console.error('❌ No se pudo obtener el ID del usuario desde el token:', error)
          throw new Error('No se pudo obtener el ID del usuario. Inicia sesión nuevamente.')
        }
      }

      const response = await apiRequest<import('../types/database').SancionesResponse>(`/sanciones/usuario/${userId}`, {
        method: 'GET'
      }, 'https://penalty.proyectoinsti.site/api')
      
      console.log('✅ Sanciones obtenidas:', response?.data?.length || 0, 'sanciones')
      return Array.isArray(response?.data) ? response.data : []
    } catch (error: any) {
      console.error('❌ Error al obtener sanciones:', error)
      return []
    }
  },

  // Verificar si el usuario tiene sanciones activas
  hasSancionesActivas: async (userId?: number): Promise<boolean> => {
    try {
      const sanciones = await sancionesApi.getSanciones(userId)
      return sanciones.some(sancion => sancion.estado === 'activa')
    } catch (error: any) {
      console.error('❌ Error al verificar sanciones activas:', error)
      return false
    }
  }
}

export default apiRequest 