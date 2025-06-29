import { useState, useEffect } from 'react'
import { solicitudesApi, booksApi, prestamosApi, sancionesApi } from '../lib/api'
import { useAuth } from './useAuth'
import type { Solicitud, PrestamoAPI, Sancion } from '../types/database'

interface SolicitudConLibro extends Solicitud {
  libro: {
    titulo: string
    autor: string
    portada_url?: string
  }
}

export const useSolicitudes = () => {
  const { user } = useAuth()
  const [solicitudes, setSolicitudes] = useState<SolicitudConLibro[]>([])
  const [prestamosActivos, setPrestamosActivos] = useState<PrestamoAPI[]>([])
  const [sanciones, setSanciones] = useState<Sancion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSolicitudes = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      // Obtener solicitudes, préstamos y sanciones en paralelo
      const [solicitudesData, prestamosData, sancionesData] = await Promise.all([
        solicitudesApi.getSolicitudes(),
        prestamosApi.getPrestamos(),
        sancionesApi.getSanciones()
      ])
      
      console.log('📋 Solicitudes obtenidas:', solicitudesData.length)
      console.log('📋 Préstamos obtenidos:', prestamosData.length)
      console.log('📋 Sanciones obtenidas:', sancionesData.length)
      
      // Procesar solicitudes con información de libros
      const librosPromises = solicitudesData.map(async (solicitud: Solicitud) => {
        try {
          // Obtener todos los libros y buscar el específico
          const libros = await booksApi.getBooks()
          const libro = libros.find(l => Number(l.id) === Number(solicitud.id_libro))
          
          return {
            ...solicitud,
            libro: {
              titulo: libro?.titulo || 'Libro no encontrado',
              autor: libro?.autor || `Autor ID: ${libro?.id_autor}` || 'Autor desconocido',
              portada_url: libro?.imagen || libro?.portada_url
            }
          }
        } catch (error) {
          console.error('❌ Error al obtener datos del libro:', error)
          return {
            ...solicitud,
            libro: {
              titulo: 'Libro no encontrado',
              autor: 'Autor desconocido',
              portada_url: undefined
            }
          }
        }
      })

      const solicitudesConLibros = await Promise.all(librosPromises)
      console.log('📋 Solicitudes procesadas:', solicitudesConLibros.length)
      
      // Filtrar préstamos activos (pendientes)
      const prestamosActivosFiltered = prestamosData.filter(prestamo => 
        prestamo.estado === 'pendiente' || prestamo.estado === 'activo'
      ) as PrestamoAPI[]
      
      setSolicitudes(solicitudesConLibros)
      setPrestamosActivos(prestamosActivosFiltered)
      setSanciones(sancionesData)
      
    } catch (error: any) {
      console.error('❌ Error al obtener solicitudes, préstamos y sanciones:', error)
      setError(error.message || 'Error al cargar los datos')
      setSolicitudes([])
      setPrestamosActivos([])
      setSanciones([])
    } finally {
      setLoading(false)
    }
  }

  // Verificar si ya existe una solicitud para un libro específico
  const hasSolicitudForBook = (id_libro: number): boolean => {
    return solicitudes.some(solicitud => 
      Number(solicitud.id_libro) === Number(id_libro) && 
      solicitud.estado === 'pendiente'
    )
  }

  // Obtener solicitud específica para un libro (si existe)
  const getSolicitudForBook = (id_libro: number): SolicitudConLibro | null => {
    return solicitudes.find(solicitud => 
      Number(solicitud.id_libro) === Number(id_libro) && 
      solicitud.estado === 'pendiente'
    ) || null
  }

  // Verificar si el usuario tiene un préstamo activo para un libro específico
  const hasPrestamoActivoForBook = (id_libro: number): boolean => {
    return prestamosActivos.some(prestamo => 
      Number(prestamo.id_libro) === Number(id_libro) && 
      (prestamo.estado === 'pendiente' || prestamo.estado === 'activo')
    )
  }

  // Obtener préstamo activo específico para un libro (si existe)
  const getPrestamoActivoForBook = (id_libro: number): PrestamoAPI | null => {
    return prestamosActivos.find(prestamo => 
      Number(prestamo.id_libro) === Number(id_libro) && 
      (prestamo.estado === 'pendiente' || prestamo.estado === 'activo')
    ) || null
  }

  // Verificar si el usuario tiene sanciones activas
  const hasSancionesActivas = (): boolean => {
    return sanciones.some(sancion => sancion.estado === 'activa')
  }

  // Obtener sanciones activas
  const getSancionesActivas = (): Sancion[] => {
    return sanciones.filter(sancion => sancion.estado === 'activa')
  }

  // Verificar si un libro está bloqueado para solicitudes (ya tiene solicitud pendiente O préstamo activo O usuario tiene sanciones activas)
  const isBookBlockedForRequest = (id_libro: number): { blocked: boolean, reason: string, details?: any } => {
    // Verificar sanciones activas primero
    if (hasSancionesActivas()) {
      return {
        blocked: true,
        reason: 'sanciones_activas',
        details: getSancionesActivas()
      }
    }

    const prestamo = getPrestamoActivoForBook(id_libro)
    if (prestamo) {
      return {
        blocked: true,
        reason: 'prestamo_activo',
        details: prestamo
      }
    }

    const solicitud = getSolicitudForBook(id_libro)
    if (solicitud) {
      return {
        blocked: true,
        reason: 'solicitud_pendiente',
        details: solicitud
      }
    }

    return { blocked: false, reason: 'disponible' }
  }

  const createSolicitud = async (id_libro: number) => {
    try {
      setLoading(true)
      
      // Verificar si el libro está bloqueado para solicitudes
      const { blocked, reason, details } = isBookBlockedForRequest(id_libro)
      
      if (blocked) {
        if (reason === 'sanciones_activas') {
          throw new Error('No puedes solicitar libros mientras tengas sanciones activas')
        } else if (reason === 'prestamo_activo') {
          throw new Error('Ya tienes un préstamo activo para este libro')
        } else if (reason === 'solicitud_pendiente') {
          throw new Error('Ya tienes una solicitud pendiente para este libro')
        }
      }
      
      // Usar la nueva API que obtiene automáticamente el ID del usuario del token
      const response = await solicitudesApi.createSolicitud({
        id_libro,
        estado: 'pendiente'
      })
      
      console.log('✅ Solicitud creada para libro ID:', id_libro)
      
      // Refrescar la lista de solicitudes
      await fetchSolicitudes()
      
      return response
    } catch (error: any) {
      console.error('❌ Error al crear solicitud:', error)
      setError(error.message || 'Error al crear la solicitud')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Cargar solicitudes cuando el usuario cambie
  useEffect(() => {
    if (user) {
      fetchSolicitudes()
    }
  }, [user])

  return {
    solicitudes,
    loading,
    error,
    fetchSolicitudes,
    createSolicitud,
    refetch: fetchSolicitudes,
    hasSolicitudForBook,
    getSolicitudForBook,
    hasPrestamoActivoForBook,
    getPrestamoActivoForBook,
    isBookBlockedForRequest,
    sanciones,
    hasSancionesActivas,
    getSancionesActivas
  }
} 