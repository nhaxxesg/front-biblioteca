export interface Libro {
  id: number
  id_autor: number
  titulo: string
  anio_publicacion: number
  ejemplares: number
  estado: 'disponible' | 'prestado' | 'mantenimiento'
  imagen: string
  created_at: string
  updated_at: string
  // Campos opcionales para compatibilidad con el frontend existente
  autor?: string
  descripcion?: string
  categoria?: string
  isbn?: string
  editorial?: string
  cantidad_disponible?: number
  portada_url?: string
}

export interface Solicitud {
  id: number
  id_usuario: number
  id_libro: number
  estado: 'pendiente' | 'aprobada' | 'rechazada'
  created_at: string
  updated_at: string
}

// Tipo para crear una nueva solicitud
export interface SolicitudCreate {
  id_usuario: number
  id_libro: number
  estado: 'pendiente'
}

// Tipo para la solicitud con información del libro incluida
export interface SolicitudConLibro extends Solicitud {
  libro: {
    titulo: string
    autor: string
    portada_url?: string
  }
}

export interface Sancion {
  id: string
  usuario_id: string
  motivo: string
  fecha_inicio: string
  fecha_fin: string
  estado: 'activa' | 'cumplida' | 'anulada'
  created_at: string
  updated_at: string
}

export interface Prestamo {
  id: string
  usuario_id: string
  libro_id: string
  fecha_prestamo: string
  fecha_devolucion_programada: string
  fecha_devolucion_real?: string
  estado: 'activo' | 'devuelto' | 'vencido'
  created_at: string
  updated_at: string
}

// Interfaz para la respuesta de la API de préstamos
export interface PrestamoAPI {
  id: number
  id_admin: number
  id_lector: number
  id_libro: number
  loan_date: string
  f_devolucion_establecida: string
  f_devolucion_real: string | null
  estado: 'pendiente' | 'activo' | 'devuelto' | 'vencido'
  created_at: string
  updated_at: string
}

export interface Perfil {
  id: string
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  fecha_registro: string
  estado: 'activo' | 'suspendido' | 'inactivo'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}