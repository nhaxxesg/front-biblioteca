export interface Libro {
  id: number
  titulo: string
  autor: string
  anio_publicacion: number
  categoria: string
  estado: 'disponible' | 'prestado' | 'mantenimiento'
  created_at: string
  updated_at: string
  // Campos opcionales para compatibilidad con el frontend existente
  descripcion?: string
  portada_url?: string
  isbn?: string
  editorial?: string
  cantidad_disponible?: number
}

export interface Solicitud {
  id: string
  usuario_id: string
  libro_id: string
  descripcion?: string
  estado: 'pendiente' | 'aprobada' | 'rechazada'
  fecha_realizada: string
  created_at: string
  updated_at: string
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