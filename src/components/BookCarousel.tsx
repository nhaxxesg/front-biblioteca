import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BookCard } from './BookCard'
import { mockLibros } from '../data/mockData'
import type { Libro } from '../types/database'

export const BookCarousel: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularBooks()
  }, [])

  const fetchPopularBooks = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Get first 8 books with available quantity > 0
    const availableBooks = mockLibros
      .filter(libro => libro.cantidad_disponible > 0)
      .slice(0, 8)
    
    setLibros(availableBooks)
    setLoading(false)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, libros.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, libros.length - 3) : prev - 1
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-96"></div>
          ))}
        </div>
      </div>
    )
  }

  if (libros.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay libros disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Libros Populares</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex >= libros.length - 3}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {libros.map((libro) => (
            <div key={libro.id} className="w-full md:w-1/3 flex-shrink-0 px-3">
              <BookCard libro={libro} />
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.max(1, libros.length - 2) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex === index ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}