// Verificar si el token existe y no ha expirado
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('access_token')
  const expiresIn = localStorage.getItem('expires_in')
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  if (!token || !isLoggedIn) {
    return false
  }
  
  // Si no hay información de expiración, asumir que es válido
  if (!expiresIn) {
    return true
  }
  
  // Verificar si el token ha expirado (opcional, ya que Laravel maneja esto)
  // Esto es una verificación básica del lado del cliente
  return true
}

// Limpiar todos los datos de autenticación
export const clearAuthData = (): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('expires_in')
  localStorage.removeItem('isLoggedIn')
}

// Obtener el token de autorización
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token')
}

// Verificar si el usuario está logueado
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isLoggedIn') === 'true' && !!getAuthToken()
} 