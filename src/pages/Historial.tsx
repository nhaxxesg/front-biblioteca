import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { mockPrestamos, getLibroById } from '../data/mockData'
import { 
  Book,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react'
import type { Prestamo } from '../types/database'

interface PrestamoConLibro extends Prestamo {
  libros: {
    titulo: string
    autor: string
    portada_url?: string
  }
}

export const Historial: React.FC = () => {
  const { user } = useAuth()
  const [prestamos, setPrestamos] = useState<PrestamoConLibro[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'activo' | 'devuelto' | 'vencido'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user) {
      fetchPrestamos()
    }
  }, [user])

  const fetchPrestamos = async () => {
    if (!user) return

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Transform mock data to include book information
    const prestamosConLibros = mockPrestamos.map(prestamo => {
      const libro = getLibroById(prestamo.libro_id)
      return {
        ...prestamo,
        libros: {
          titulo: libro?.titulo || 'Libro no encontrado',
          autor: libro?.autor || 'Autor desconocido',
          portada_url: libro?.portada_url
        }
      }
    })

    setPrestamos(prestamosConLibros)
    setLoading(false)
  }

  const handleDevolucion = async (prestamoId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update local state
    setPrestamos(prev => prev.map(prestamo => 
      prestamo.id === prestamoId 
        ? { 
            ...prestamo, 
            fecha_devolucion_real: new Date().toISOString(),
            estado: 'devuelto' as const
          }
        : prestamo
    ))

    alert('Libro marcado como devuelto exitosamente')
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-blue-100 text-blue-800'
      case 'devuelto':
        return 'bg-secondary-100 text-secondary-800'
      case 'vencido':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Clock className="h-4 w-4" />
      case 'devuelto':
        return <CheckCircle className="h-4 w-4" />
      case 'vencido':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Book className="h-4 w-4" />
    }
  }

  const filteredPrestamos = prestamos.filter(prestamo => {
    const matchesFilter = filter === 'all' || prestamo.estado === filter
    const matchesSearch = 
      prestamo.libros.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.libros.autor.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const isVencido = (fechaDevolucion: string, estado: string) => {
    if (estado === 'devuelto') return false
    return new Date(fechaDevolucion) < new Date()
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Historial de Préstamos
        </h1>
        <p className="text-gray-600">
          Revisa todos tus préstamos activos y pasados
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por título o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="devuelto">Devueltos</option>
              <option value="vencido">Vencidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredPrestamos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {prestamos.length === 0 ? 'No tienes préstamos' : 'No se encontraron resultados'}
            </h3>
            <p className="text-gray-600 mb-4">
              {prestamos.length === 0 
                ? 'Solicita tu primer libro desde el catálogo'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
            {prestamos.length === 0 && (
              <a
                href="/catalogo"
                className="inline-block px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                Explorar Catálogo
              </a>
            )}
          </div>
        ) : (
          filteredPrestamos.map((prestamo) => {
            const vencido = isVencido(prestamo.fecha_devolucion_programada, prestamo.estado)
            const estado = vencido && prestamo.estado === 'activo' ? 'vencido' : prestamo.estado

            return (
              <div key={prestamo.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {prestamo.libros.portada_url ? (
                      <img
                        src={prestamo.libros.portada_url}
                        alt={prestamo.libros.titulo}
                        className="w-16 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-primary-100 rounded flex items-center justify-center">
                        <Book className="h-8 w-8 text-primary-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {prestamo.libros.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          por {prestamo.libros.autor}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Prestado: {new Date(prestamo.fecha_prestamo).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Devolver: {new Date(prestamo.fecha_devolucion_programada).toLocaleDateString()}
                            </span>
                          </div>

                          {prestamo.fecha_devolucion_real && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-secondary-600" />
                              <span>
                                Devuelto: {new Date(prestamo.fecha_devolucion_real).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-3">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(estado)}`}>
                          {getEstadoIcon(estado)}
                          <span className="ml-1 capitalize">{estado}</span>
                        </div>

                        {prestamo.estado === 'activo' && (
                          <button
                            onClick={() => handleDevolucion(prestamo.id)}
                            className="px-4 py-2 bg-secondary-600 text-white text-sm font-medium rounded-md hover:bg-secondary-700 transition-colors"
                          >
                            Marcar como Devuelto
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}