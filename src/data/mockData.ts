import type { Libro, Perfil, Solicitud, Sancion, Prestamo, User } from '../types/database'

// Mock user data
export const mockUser: User = {
  id: 'user-123',
  email: 'usuario@ejemplo.com',
  created_at: '2024-01-15T10:00:00Z'
}

export const mockProfile: Perfil = {
  id: 'user-123',
  nombre: 'Juan Pérez',
  email: 'usuario@ejemplo.com',
  telefono: '+1234567890',
  direccion: 'Calle Principal 123, Ciudad',
  fecha_registro: '2024-01-15T10:00:00Z',
  estado: 'activo',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z'
}

// Mock books data
export const mockLibros: Libro[] = [
  {
    id: '1',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    año: 1967,
    cantidad_disponible: 3,
    descripcion: 'Una obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.',
    categoria: 'Ficción',
    isbn: '978-0-06-088328-7',
    editorial: 'Editorial Sudamericana',
    portada_url: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    titulo: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    año: 1605,
    cantidad_disponible: 2,
    descripcion: 'La novela más influyente de la literatura española y una de las primeras novelas modernas de la literatura universal.',
    categoria: 'Ficción',
    isbn: '978-84-376-0494-7',
    editorial: 'Real Academia Española',
    portada_url: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    titulo: 'El origen de las especies',
    autor: 'Charles Darwin',
    año: 1859,
    cantidad_disponible: 2,
    descripcion: 'Obra científica de Charles Darwin publicada que se considera uno de los trabajos precursores de la literatura científica.',
    categoria: 'Ciencia',
    isbn: '978-84-376-0495-4',
    editorial: 'Cambridge University Press',
    portada_url: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    titulo: 'Una breve historia del tiempo',
    autor: 'Stephen Hawking',
    año: 1988,
    cantidad_disponible: 4,
    descripcion: 'Un libro de divulgación científica que trata de explicar una gama de temas de cosmología, incluyendo el Big Bang, los agujeros negros y los conos de luz.',
    categoria: 'Ciencia',
    isbn: '978-0-553-38016-3',
    editorial: 'Bantam Dell',
    portada_url: 'https://images.pexels.com/photos/1741231/pexels-photo-1741231.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    titulo: '1984',
    autor: 'George Orwell',
    año: 1949,
    cantidad_disponible: 5,
    descripcion: 'Una novela política de ficción distópica que presenta el concepto del omnipresente y vigilante Gran Hermano.',
    categoria: 'Ficción',
    isbn: '978-0-452-28423-4',
    editorial: 'Penguin Books',
    portada_url: 'https://images.pexels.com/photos/1130641/pexels-photo-1130641.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    titulo: 'Sapiens: De animales a dioses',
    autor: 'Yuval Noah Harari',
    año: 2011,
    cantidad_disponible: 3,
    descripcion: 'Una breve historia de la humanidad que explora cómo el Homo sapiens llegó a dominar el mundo.',
    categoria: 'Historia',
    isbn: '978-0-06-231609-7',
    editorial: 'Harper',
    portada_url: 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    titulo: 'El código limpio',
    autor: 'Robert C. Martin',
    año: 2008,
    cantidad_disponible: 2,
    descripcion: 'Manual de artesanía de software ágil que enseña las técnicas y prácticas para escribir código limpio.',
    categoria: 'Tecnología',
    isbn: '978-0-13-235088-4',
    editorial: 'Prentice Hall',
    portada_url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    titulo: 'Steve Jobs',
    autor: 'Walter Isaacson',
    año: 2011,
    cantidad_disponible: 3,
    descripcion: 'Biografía autorizada de Steve Jobs basada en más de cuarenta entrevistas con el propio Jobs.',
    categoria: 'Biografía',
    isbn: '978-1-4516-4853-9',
    editorial: 'Simon & Schuster',
    portada_url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '9',
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    año: 1943,
    cantidad_disponible: 6,
    descripcion: 'Una novela corta y la obra más famosa del escritor y aviador francés Antoine de Saint-Exupéry.',
    categoria: 'Ficción',
    isbn: '978-0-15-601219-5',
    editorial: 'Harcourt Brace Jovanovich',
    portada_url: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '10',
    titulo: 'Breve historia de casi todo',
    autor: 'Bill Bryson',
    año: 2003,
    cantidad_disponible: 2,
    descripcion: 'Un libro de divulgación científica que explica algunos aspectos de la ciencia de manera accesible al público general.',
    categoria: 'Ciencia',
    isbn: '978-0-7679-0817-9',
    editorial: 'Broadway Books',
    portada_url: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '11',
    titulo: 'El arte de la guerra',
    autor: 'Sun Tzu',
    año: 500,
    cantidad_disponible: 4,
    descripcion: 'Tratado militar escrito durante el período de los Reinos Combatientes de la antigua China.',
    categoria: 'Historia',
    isbn: '978-1-59030-963-7',
    editorial: 'Shambhala Publications',
    portada_url: 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '12',
    titulo: 'Atomic Habits',
    autor: 'James Clear',
    año: 2018,
    cantidad_disponible: 3,
    descripcion: 'Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos.',
    categoria: 'Autoayuda',
    isbn: '978-0-7352-1129-2',
    editorial: 'Avery',
    portada_url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '13',
    titulo: 'Matar a un ruiseñor',
    autor: 'Harper Lee',
    año: 1960,
    cantidad_disponible: 2,
    descripcion: 'Novela que aborda los temas del racismo y la pérdida de la inocencia en el sur de Estados Unidos.',
    categoria: 'Ficción',
    isbn: '978-0-06-112008-4',
    editorial: 'J.B. Lippincott & Co.',
    portada_url: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '14',
    titulo: 'El gen egoísta',
    autor: 'Richard Dawkins',
    año: 1976,
    cantidad_disponible: 2,
    descripcion: 'Libro sobre evolución que popularizó la visión evolutiva centrada en los genes.',
    categoria: 'Ciencia',
    isbn: '978-0-19-929114-4',
    editorial: 'Oxford University Press',
    portada_url: 'https://images.pexels.com/photos/1741231/pexels-photo-1741231.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '15',
    titulo: 'Thinking, Fast and Slow',
    autor: 'Daniel Kahneman',
    año: 2011,
    cantidad_disponible: 3,
    descripcion: 'Libro que resume décadas de investigación para explicar cuándo podemos confiar en nuestras intuiciones.',
    categoria: 'Psicología',
    isbn: '978-0-374-27563-1',
    editorial: 'Farrar, Straus and Giroux',
    portada_url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '16',
    titulo: 'El nombre del viento',
    autor: 'Patrick Rothfuss',
    año: 2007,
    cantidad_disponible: 4,
    descripcion: 'Primera novela de la serie Crónica del asesino de reyes, una obra de fantasía épica.',
    categoria: 'Fantasía',
    isbn: '978-0-7564-0474-1',
    editorial: 'DAW Books',
    portada_url: 'https://images.pexels.com/photos/1130641/pexels-photo-1130641.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

// Mock solicitudes data
export const mockSolicitudes: Solicitud[] = [
  {
    id: 'sol-1',
    usuario_id: 'user-123',
    libro_id: '1',
    descripcion: 'Solicitud de préstamo para "Cien años de soledad"',
    estado: 'aprobada',
    fecha_realizada: '2024-01-20T10:00:00Z',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-21T09:00:00Z'
  },
  {
    id: 'sol-2',
    usuario_id: 'user-123',
    libro_id: '5',
    descripcion: 'Solicitud de préstamo para "1984"',
    estado: 'pendiente',
    fecha_realizada: '2024-01-22T14:30:00Z',
    created_at: '2024-01-22T14:30:00Z',
    updated_at: '2024-01-22T14:30:00Z'
  },
  {
    id: 'sol-3',
    usuario_id: 'user-123',
    libro_id: '3',
    descripcion: 'Solicitud de préstamo para "El origen de las especies"',
    estado: 'rechazada',
    fecha_realizada: '2024-01-18T16:00:00Z',
    created_at: '2024-01-18T16:00:00Z',
    updated_at: '2024-01-19T10:00:00Z'
  }
]

// Mock sanciones data
export const mockSanciones: Sancion[] = [
  {
    id: 'san-1',
    usuario_id: 'user-123',
    motivo: 'Devolución tardía del libro "Don Quijote de la Mancha"',
    fecha_inicio: '2024-01-10T00:00:00Z',
    fecha_fin: '2024-01-17T00:00:00Z',
    estado: 'cumplida',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-17T00:00:00Z'
  }
]

// Mock prestamos data
export const mockPrestamos: Prestamo[] = [
  {
    id: 'pres-1',
    usuario_id: 'user-123',
    libro_id: '1',
    fecha_prestamo: '2024-01-21T10:00:00Z',
    fecha_devolucion_programada: '2024-02-04T10:00:00Z',
    fecha_devolucion_real: '2024-02-03T15:30:00Z',
    estado: 'devuelto',
    created_at: '2024-01-21T10:00:00Z',
    updated_at: '2024-02-03T15:30:00Z'
  },
  {
    id: 'pres-2',
    usuario_id: 'user-123',
    libro_id: '6',
    fecha_prestamo: '2024-01-25T11:00:00Z',
    fecha_devolucion_programada: '2024-02-08T11:00:00Z',
    estado: 'activo',
    created_at: '2024-01-25T11:00:00Z',
    updated_at: '2024-01-25T11:00:00Z'
  }
]

// Helper function to get book by ID
export const getLibroById = (id: string): Libro | undefined => {
  return mockLibros.find(libro => libro.id === id)
}

// Helper function to get unique categories
export const getCategories = (): string[] => {
  const categories = mockLibros
    .map(libro => libro.categoria)
    .filter(Boolean) as string[]
  return [...new Set(categories)]
}