import React from 'react'
import { Calendar, User, Book, CheckCircle } from 'lucide-react'
import type { Libro } from '../types/database'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

interface BookCardProps {
  libro: Libro
  onRequestBook?: (libroId: string) => void
  showRequestButton?: boolean
}

export const BookCard: React.FC<BookCardProps> = ({ 
  libro, 
  onRequestBook, 
  showRequestButton = true 
}) => {
  const { user } = useAuth()
  const [requesting, setRequesting] = useState(false)
  const [requested, setRequested] = useState(false)

  const handleRequest = async () => {
    if (!user || requesting) return

    setRequesting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setRequested(true)
    onRequestBook?.(libro.id)
    alert('Solicitud realizada exitosamente')
    setRequesting(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Imagen del libro */}
      <div className="aspect-[3/4] bg-gradient-to-br from-primary-50 to-primary-100 relative overflow-hidden">
        {libro.portada_url ? (
          <img
            src={libro.portada_url}
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
          libro.cantidad_disponible > 0 
            ? 'bg-secondary-100 text-secondary-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {libro.cantidad_disponible > 0 ? 'Disponible' : 'No disponible'}
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
            <span>{libro.autor}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{libro.año}</span>
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

        {/* Botón de solicitud */}
        {showRequestButton && user && (
          <div className="mt-4">
            {requested ? (
              <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-50 text-secondary-700 rounded-md">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Solicitado</span>
              </div>
            ) : (
              <button
                onClick={handleRequest}
                disabled={requesting || libro.cantidad_disponible === 0}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  libro.cantidad_disponible === 0
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
            <span>Disponibles: {libro.cantidad_disponible}</span>
            {libro.isbn && <span>ISBN: {libro.isbn}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}