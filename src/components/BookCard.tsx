import React from 'react'
import { Calendar, User, Book, CheckCircle, X } from 'lucide-react'
import type { Libro } from '../types/database'
import { useAuth } from '../hooks/useAuth'
import { useSolicitudes } from '../hooks/useSolicitudes'
import { useToast, Toast } from './Toast'
import { useState } from 'react'

interface BookCardProps {
  libro: Libro
  onRequestBook?: (libroId: number) => void
  showRequestButton?: boolean
}

export const BookCard: React.FC<BookCardProps> = ({ 
  libro, 
  onRequestBook, 
  showRequestButton = true 
}) => {
  const { user } = useAuth()
  const { createSolicitud, isBookBlockedForRequest } = useSolicitudes()
  const { success: showSuccess, error: showError, toasts, removeToast } = useToast()
  const [requesting, setRequesting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Determinar disponibilidad basado en el estado del libro
  const isAvailable = libro.estado === 'disponible'
  const cantidadDisponible = libro.ejemplares ?? (isAvailable ? 1 : 0)
  const imagenUrl = libro.imagen || libro.portada_url
  
  // Verificar si el libro está bloqueado para solicitudes
  const { blocked, reason, details } = isBookBlockedForRequest(libro.id)

  // Debug temporal
  console.log(`📚 Libro ${libro.id} (${libro.titulo}):`, { blocked, reason, details })

  // Variables para compatibilidad con la UI existente
  const alreadyRequested = blocked
  const existingSolicitud = reason === 'solicitud_pendiente' ? details : null
  const prestamoActivo = reason === 'prestamo_activo' ? details : null
  const sancionesActivas = reason === 'sanciones_activas' ? details : null

  const handleRequestClick = () => {
    // Verificación adicional antes de mostrar el modal
    if (blocked) {
      if (reason === 'sanciones_activas') {
        showError(
          'Usuario sancionado',
          'No puedes solicitar libros mientras tengas sanciones activas'
        )
      } else if (reason === 'prestamo_activo') {
        showError(
          'Préstamo activo',
          'Ya tienes un préstamo activo para este libro'
        )
      } else if (reason === 'solicitud_pendiente') {
        showError(
          'Solicitud ya existente',
          'Ya tienes una solicitud pendiente para este libro'
        )
      }
      return
    }
    
    setShowModal(true)
  }

  const handleConfirmRequest = async () => {
    if (!user || requesting) return

    setRequesting(true)
    
    try {
      const response = await createSolicitud(libro.id)
      
      setShowModal(false)
      onRequestBook?.(libro.id)
      
      // Mostrar notificación de éxito
      showSuccess(
        '¡Solicitud realizada exitosamente!',
        `Solicitud #${response.id} creada - Estado: ${response.estado}`
      )
      
    } catch (error: any) {
      console.error('Error al crear solicitud:', error)
      
      // Cerrar modal y mostrar error específico según el tipo
      setShowModal(false)
      
      if (error.message.includes('sanciones activas')) {
        showError(
          'Usuario sancionado',
          'No puedes solicitar libros mientras tengas sanciones activas'
        )
      } else if (error.message.includes('préstamo activo')) {
        showError(
          'Préstamo activo',
          'Ya tienes un préstamo activo para este libro'
        )
      } else if (error.message.includes('solicitud pendiente')) {
        showError(
          'Solicitud ya existente',
          'Ya tienes una solicitud pendiente para este libro'
        )
      } else {
        showError(
          'Error al realizar solicitud',
          error.message
        )
      }
    } finally {
      setRequesting(false)
    }
  }

  const handleCancelRequest = () => {
    setShowModal(false)
  }

  return (
    <>
      {/* Renderizar toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
        {/* Imagen del libro */}
        <div className="aspect-[3/4] bg-gradient-to-br from-primary-50 to-primary-100 relative overflow-hidden">
          {imagenUrl ? (
            <img
              src={imagenUrl}
              alt={libro.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Book className="h-16 w-16 text-primary-300" />
            </div>
          )}
          
          {/* Badge de disponibilidad */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            isAvailable
              ? 'bg-secondary-100 text-secondary-800' 
              : libro.estado === 'prestado'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {isAvailable ? 'Disponible' : 
             libro.estado === 'prestado' ? 'Prestado' : 
             libro.estado === 'mantenimiento' ? 'Mantenimiento' : 'No disponible'}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {libro.titulo}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span>{libro.autor || `Autor ID: ${libro.id_autor}`}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{libro.anio_publicacion}</span>
            </div>

            {libro.categoria && (
              <div className="flex items-start space-x-2">
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {libro.categoria}
                </span>
              </div>
            )}
          </div>

          {/* Descripción */}
          {libro.descripcion && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {libro.descripcion}
            </p>
          )}

          {/* Información de ejemplares */}
          <div className="text-xs text-gray-500 mb-4">
            Ejemplares disponibles: {cantidadDisponible}
          </div>

          {/* Botón de solicitud */}
          {showRequestButton && user && (
            <div className="mt-4">
              {alreadyRequested ? (
                <div className="space-y-2">
                  {sancionesActivas ? (
                    // Mostrar información de sanciones activas
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-800 rounded-md border border-red-200">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">Usuario Sancionado</span>
                    </div>
                  ) : prestamoActivo ? (
                    // Mostrar información de préstamo activo
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Préstamo Activo</span>
                    </div>
                  ) : (
                    // Mostrar información de solicitud pendiente
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Ya Solicitado</span>
                    </div>
                  )}
                  
                  {/* Mostrar información específica según el tipo */}
                  {sancionesActivas && (
                    <div className="text-xs text-red-600 text-center">
                      Tienes {sancionesActivas.length} sanción(es) activa(s)
                      <br />
                      No puedes solicitar libros hasta resolver las sanciones
                    </div>
                  )}
                  
                  {prestamoActivo && (
                    <div className="text-xs text-gray-500 text-center">
                      Préstamo #{prestamoActivo.id} - Estado: {prestamoActivo.estado}
                      <br />
                      Prestado el {new Date(prestamoActivo.loan_date).toLocaleDateString()}
                      <br />
                      Devolver antes del {new Date(prestamoActivo.f_devolucion_establecida).toLocaleDateString()}
                    </div>
                  )}
                  
                  {existingSolicitud && (
                    <div className="text-xs text-gray-500 text-center">
                      Solicitud #{existingSolicitud.id} - Estado: {existingSolicitud.estado}
                      <br />
                      Solicitado el {new Date(existingSolicitud.created_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleRequestClick}
                  disabled={requesting || !isAvailable}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !isAvailable
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : requesting
                      ? 'bg-primary-200 text-primary-700 cursor-wait'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {requesting ? 'Solicitando...' : 'Solicitar Préstamo'}
                </button>
              )}
            </div>
          )}

          {/* Info adicional */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Estado: {libro.estado}</span>
              {libro.isbn && <span>ISBN: {libro.isbn}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {imagenUrl ? (
                  <img
                    src={imagenUrl}
                    alt={libro.titulo}
                    className="w-16 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-20 bg-primary-100 rounded flex items-center justify-center">
                    <Book className="h-8 w-8 text-primary-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirmar Solicitud de Préstamo
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>{libro.titulo}</strong>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  por {libro.autor || `Autor ID: ${libro.id_autor}`}
                </p>
                <p className="text-sm text-gray-700">
                  ¿Estás seguro de que deseas solicitar este libro en préstamo?
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCancelRequest}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                disabled={requesting}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRequest}
                disabled={requesting}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:bg-primary-300"
              >
                {requesting ? 'Solicitando...' : 'Confirmar Solicitud'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}