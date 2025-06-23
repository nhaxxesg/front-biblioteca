/*
  # Datos iniciales para el sistema de biblioteca

  1. Libros de ejemplo
    - Variedad de géneros y categorías
    - Diferentes autores y años de publicación
    - Algunos con portadas de Pexels
    - Cantidades disponibles variadas

  2. Datos de prueba
    - Libros populares y clásicos
    - Categorías: Ficción, Ciencia, Historia, Biografía, Tecnología
*/

-- Insertar libros de ejemplo
INSERT INTO libros (titulo, autor, año, cantidad_disponible, descripcion, categoria, isbn, editorial, portada_url) VALUES
(
  'Cien años de soledad',
  'Gabriel García Márquez',
  1967,
  3,
  'Una obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.',
  'Ficción',
  '978-0-06-088328-7',
  'Editorial Sudamericana',
  'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'Don Quijote de la Mancha',
  'Miguel de Cervantes',
  1605,
  2,
  'La novela más influyente de la literatura española y una de las primeras novelas modernas de la literatura universal.',
  'Ficción',
  '978-84-376-0494-7',
  'Real Academia Española',
  'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'El origen de las especies',
  'Charles Darwin',
  1859,
  2,
  'Obra científica de Charles Darwin publicada que se considera uno de los trabajos precursores de la literatura científica.',
  'Ciencia',
  '978-84-376-0495-4',
  'Cambridge University Press',
  'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'Una breve historia del tiempo',
  'Stephen Hawking',
  1988,
  4,
  'Un libro de divulgación científica que trata de explicar una gama de temas de cosmología, incluyendo el Big Bang, los agujeros negros y los conos de luz.',
  'Ciencia',
  '978-0-553-38016-3',
  'Bantam Dell',
  'https://images.pexels.com/photos/1741231/pexels-photo-1741231.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  '1984',
  'George Orwell',
  1949,
  5,
  'Una novela política de ficción distópica que presenta el concepto del omnipresente y vigilante Gran Hermano.',
  'Ficción',
  '978-0-452-28423-4',
  'Penguin Books',
  'https://images.pexels.com/photos/1130641/pexels-photo-1130641.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'Sapiens: De animales a dioses',
  'Yuval Noah Harari',
  2011,
  3,
  'Una breve historia de la humanidad que explora cómo el Homo sapiens llegó a dominar el mundo.',
  'Historia',
  '978-0-06-231609-7',
  'Harper',
  'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'El código limpio',
  'Robert C. Martin',
  2008,
  2,
  'Manual de artesanía de software ágil que enseña las técnicas y prácticas para escribir código limpio.',
  'Tecnología',
  '978-0-13-235088-4',
  'Prentice Hall',
  'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'Steve Jobs',
  'Walter Isaacson',
  2011,
  3,
  'Biografía autorizada de Steve Jobs basada en más de cuarenta entrevistas con el propio Jobs.',
  'Biografía',
  '978-1-4516-4853-9',
  'Simon & Schuster',
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'El principito',
  'Antoine de Saint-Exupéry',
  1943,
  6,
  'Una novela corta y la obra más famosa del escritor y aviador francés Antoine de Saint-Exupéry.',
  'Ficción',
  '978-0-15-601219-5',
  'Harcourt Brace Jovanovich',
  'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'Breve historia de casi todo',
  'Bill Bryson',
  2003,
  2,
  'Un libro de divulgación científica que explica algunos aspectos de la ciencia de manera accesible al público general.',
  'Ciencia',
  '978-0-7679-0817-9',
  'Broadway Books',
  'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'El arte de la guerra',
  'Sun Tzu',
  500,
  4,
  'Tratado militar escrito durante el período de los Reinos Combatientes de la antigua China.',
  'Historia',
  '978-1-59030-963-7',
  'Shambhala Publications',
  'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'Atomic Habits',
  'James Clear',
  2018,
  3,
  'Un método sencillo y comprobado para desarrollar buenos hábitos y elim inar los malos.',
  'Autoayuda',
  '978-0-7352-1129-2',
  'Avery',
  'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'Matar a un ruiseñor',
  'Harper Lee',
  1960,
  2,
  'Novela que aborda los temas del racismo y la pérdida de la inocencia en el sur de Estados Unidos.',
  'Ficción',
  '978-0-06-112008-4',
  'J.B. Lippincott & Co.',
  'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'El gen egoísta',
  'Richard Dawkins',
  1976,
  2,
  'Libro sobre evolución que popularizó la visión evolutiva centrada en los genes.',
  'Ciencia',
  '978-0-19-929114-4',
  'Oxford University Press',
  'https://images.pexels.com/photos/1741231/pexels-photo-1741231.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'Thinking, Fast and Slow',
  'Daniel Kahneman',
  2011,
  3,
  'Libro que resume décadas de investigación para explicar cuándo podemos confiar en nuestras intuiciones.',
  'Psicología',
  '978-0-374-27563-1',
  'Farrar, Straus and Giroux',
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
),
(
  'El nombre del viento',
  'Patrick Rothfuss',
  2007,
  4,
  'Primera novela de la serie Crónica del asesino de reyes, una obra de fantasía épica.',
  'Fantasía',
  '978-0-7564-0474-1',
  'DAW Books',
  'https://images.pexels.com/photos/1130641/pexels-photo-1130641.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
);