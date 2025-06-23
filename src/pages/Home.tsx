import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Clock, Award } from 'lucide-react'
import { BookCarousel } from '../components/BookCarousel'
import { useAuth } from '../hooks/useAuth'

export const Home: React.FC = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: BookOpen,
      title: 'Amplio Catálogo',
      description: 'Miles de libros disponibles en diferentes categorías y géneros',
      color: 'text-primary-600'
    },
    {
      icon: Clock,
      title: 'Préstamos Rápidos',
      description: 'Sistema ágil de solicitud y gestión de préstamos',
      color: 'text-secondary-600'
    },
    {
      icon: Users,
      title: 'Comunidad Activa',
      description: 'Únete a nuestra comunidad de lectores apasionados',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      title: 'Calidad Garantizada',
      description: 'Libros cuidadosamente seleccionados y mantenidos',
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Bienvenido a BiblioWeb
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Tu biblioteca digital donde los libros cobran vida
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/catalogo"
                className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Explorar Catálogo
              </Link>
              {!user && (
                <Link
                  to="/registro"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Únete Ahora
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir BiblioWeb?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre las ventajas de nuestro sistema de biblioteca digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 group-hover:shadow-xl transition-shadow ${feature.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookCarousel />
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para comenzar tu aventura literaria?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Únete a miles de lectores que ya disfrutan de nuestro servicio
            </p>
            <Link
              to="/registro"
              className="inline-block px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Crear Cuenta Gratuita
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}