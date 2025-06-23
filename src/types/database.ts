export interface Libro {
  id: string
  titulo: string
  autor: string
  año: number
  cantidad_disponible: number
  descripcion?: string
  portada_url?: string
  categoria?: string
  isbn?: string
  editorial?: string
  created_at: string
  updated_at: string
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