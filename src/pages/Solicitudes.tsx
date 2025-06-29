import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSolicitudes } from '../hooks/useSolicitudes'
import { mockSanciones } from '../data/mockData'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Book,
  Calendar,
  FileText,
  RefreshCw
} from 'lucide-react'
import type { Sancion } from '../types/database'

export const Solicitudes: React.FC = () => {
  const { user } = useAuth()
  const { solicitudes, loading: solicitudesLoading, error: solicitudesError, refetch } = useSolicitudes()
  const [sanciones, setSanciones] = useState<Sancion[]>([])
  const [sancionesLoading, setSancionesLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'solicitudes' | 'sanciones'>('solicitudes')

  // El loading general depende de ambos estados
  const loading = solicitudesLoading || sancionesLoading

  useEffect(() => {
    if (user) {
      fetchSanciones()
    }
  }, [user])

  const fetchSanciones = async () => {
    if (!user) return

    try {
      setSancionesLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      setSanciones(mockSanciones)
    } catch (error) {
      console.error('Error al obtener sanciones:', error)
    } finally {
      setSancionesLoading(false)
    }
  }

  const handleRefresh = () => {
    refetch()
    fetchSanciones()
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'aprobada':
        return 'bg-secondary-100 text-secondary-800'
      case 'rechazada':
        return 'bg-red-100 text-red-800'
      case 'activa':
        return 'bg-red-100 text-red-800'
      case 'cumplida':
        return 'bg-gray-100 text-gray-800'
      case 'anulada':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Clock className="h-4 w-4" />
      case 'aprobada':
        return <CheckCircle className="h-4 w-4" />
      case 'rechazada':
        return <XCircle className="h-4 w-4" />
      case 'activa':
        return <AlertTriangle className="h-4 w-4" />
      case 'cumplida':
        return <CheckCircle className="h-4 w-4" />
      case 'anulada':
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Solicitudes y Sanciones
            </h1>
            <p className="text-gray-600">
              Revisa el estado de tus solicitudes de préstamo y sanciones activas
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:bg-primary-300"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('solicitudes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'solicitudes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Solicitudes
            {solicitudes.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {solicitudes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sanciones')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sanciones'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sanciones
            {sanciones.filter(s => s.estado === 'activa').length > 0 && (
              <span className="ml-2 bg-red-100 text-red-900 py-0.5 px-2.5 rounded-full text-xs">
                {sanciones.filter(s => s.estado === 'activa').length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'solicitudes' ? (
        <div className="space-y-4">
          {solicitudes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes solicitudes
              </h3>
              <p className="text-gray-600 mb-4">
                Ve al catálogo para solicitar tu primer libro
              </p>
              <a
                href="/catalogo"
                className="inline-block px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                Explorar Catálogo
              </a>
            </div>
          ) : (
            solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {solicitud.libro.portada_url ? (
                      <img
                        src={solicitud.libro.portada_url}
                        alt={solicitud.libro.titulo}
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
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {solicitud.libro.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          por {solicitud.libro.autor}
                        </p>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Solicitado el {new Date(solicitud.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(solicitud.estado)}`}>
                        {getEstadoIcon(solicitud.estado)}
                        <span className="ml-1 capitalize">{solicitud.estado}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sanciones.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <CheckCircle className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sin sanciones activas
              </h3>
              <p className="text-gray-600">
                Mantén un buen historial devolviendo los libros a tiempo
              </p>
            </div>
          ) : (
            sanciones.map((sancion) => (
              <div key={sancion.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Sanción {sancion.estado === 'activa' ? 'Activa' : 'Finalizada'}
                      </h3>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{sancion.motivo}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Inicio: {new Date(sancion.fecha_inicio).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Fin: {new Date(sancion.fecha_fin).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(sancion.estado)}`}>
                    {getEstadoIcon(sancion.estado)}
                    <span className="ml-1 capitalize">{sancion.estado}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}