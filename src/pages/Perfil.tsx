import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, Shield, Edit, Save, X, LogOut, AlertTriangle } from 'lucide-react'
import { useSolicitudes } from '../hooks/useSolicitudes'
import type { Perfil as PerfilType } from '../types/database'

export const Perfil: React.FC = () => {
  const { user, profile, signOut } = useAuth()
  const { sanciones, hasSancionesActivas, getSancionesActivas } = useSolicitudes()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: ''
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        nombre: profile.nombre || '',
        telefono: profile.telefono || '',
        direccion: profile.direccion || ''
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Perfil actualizado exitosamente')
    setEditing(false)
    setLoading(false)
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        nombre: profile.nombre || '',
        telefono: profile.telefono || '',
        direccion: profile.direccion || ''
      })
    }
    setEditing(false)
  }

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      setLogoutLoading(true)
      try {
        await signOut()
        navigate('/login')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        setLogoutLoading(false)
      }
    }
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 rounded w-1/3 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="bg-gray-200 h-6 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-4 w-4" />
          <span>{logoutLoading ? 'Cerrando...' : 'Cerrar Sesión'}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-full">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Información Personal
              </h2>
              <p className="text-sm text-gray-600">
                Actualiza tu información de contacto y preferencias
              </p>
            </div>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El correo no se puede modificar
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ingresa tu teléfono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado de Cuenta
                  </label>
                  <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                    profile.estado === 'activo' 
                      ? 'bg-secondary-100 text-secondary-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <Shield className="h-4 w-4 mr-1" />
                    {profile.estado === 'activo' ? 'Activa' : 'Suspendida'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ingresa tu dirección completa"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nombre Completo
                  </label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{profile.nombre}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{profile.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Teléfono
                  </label>
                  <span className="text-gray-900">
                    {profile.telefono || 'No especificado'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Fecha de Registro
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(profile.fecha_registro).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Estado de Cuenta
                  </label>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    profile.estado === 'activo' 
                      ? 'bg-secondary-100 text-secondary-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <Shield className="h-4 w-4 mr-1" />
                    {profile.estado === 'activo' ? 'Activa' : 'Suspendida'}
                  </div>
                </div>
              </div>

              {profile.direccion && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Dirección
                  </label>
                  <p className="text-gray-900">{profile.direccion}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sección de Sanciones */}
      <div className="bg-white rounded-lg shadow-sm border mt-6">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
          <div className={`p-2 rounded-full ${hasSancionesActivas() ? 'bg-red-100' : 'bg-gray-100'}`}>
            <AlertTriangle className={`h-6 w-6 ${hasSancionesActivas() ? 'text-red-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Sanciones
            </h2>
            <p className="text-sm text-gray-600">
              {hasSancionesActivas() 
                ? `Tienes ${getSancionesActivas().length} sanción(es) activa(s)`
                : 'No tienes sanciones activas'
              }
            </p>
          </div>
        </div>
        
        <div className="px-6 py-6">
          {sanciones.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sin sanciones
              </h3>
              <p className="text-gray-600">
                No tienes sanciones registradas en tu historial.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sanciones.map((sancion) => (
                <div 
                  key={sancion.id} 
                  className={`p-4 rounded-lg border ${
                    sancion.estado === 'activa' 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sancion.estado === 'activa'
                            ? 'bg-red-100 text-red-800'
                            : sancion.estado === 'cumplida'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {sancion.estado === 'activa' ? 'Activa' : 
                           sancion.estado === 'cumplida' ? 'Cumplida' : 'Anulada'}
                        </span>
                        <span className="text-sm text-gray-500">
                          Sanción #{sancion.id}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-900 mb-2">
                        <strong>Motivo:</strong> {sancion.motivo}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Fecha inicio:</strong> {new Date(sancion.fecha_inicio).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Fecha fin:</strong> {new Date(sancion.fecha_fin).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}