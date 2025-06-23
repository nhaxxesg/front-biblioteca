/*
  # Esquema completo para sistema de biblioteca

  1. Nuevas Tablas
    - `perfiles` - Información de usuarios registrados
      - `id` (uuid, primary key, references auth.users)
      - `nombre` (text)
      - `email` (text, unique)
      - `telefono` (text, optional)
      - `direccion` (text, optional)
      - `fecha_registro` (timestamptz)
      - `estado` (text, default 'activo')
      - `created_at`, `updated_at` (timestamptz)
    
    - `libros` - Catálogo de libros disponibles
      - `id` (uuid, primary key)
      - `titulo` (text)
      - `autor` (text)
      - `año` (integer)
      - `cantidad_disponible` (integer, default 0)
      - `descripcion` (text, optional)
      - `portada_url` (text, optional)
      - `categoria` (text, optional)
      - `isbn` (text, optional)
      - `editorial` (text, optional)
      - `created_at`, `updated_at` (timestamptz)
    
    - `solicitudes` - Solicitudes de préstamo realizadas por usuarios
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, references perfiles)
      - `libro_id` (uuid, references libros)
      - `descripcion` (text, optional)
      - `estado` (text, default 'pendiente')
      - `fecha_realizada` (timestamptz)
      - `created_at`, `updated_at` (timestamptz)
    
    - `sanciones` - Sanciones aplicadas a usuarios
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, references perfiles)
      - `motivo` (text)
      - `fecha_inicio` (timestamptz)
      - `fecha_fin` (timestamptz)
      - `estado` (text, default 'activa')
      - `created_at`, `updated_at` (timestamptz)
    
    - `prestamos` - Registro de préstamos activos y completados
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, references perfiles)
      - `libro_id` (uuid, references libros)
      - `fecha_prestamo` (timestamptz)
      - `fecha_devolucion_programada` (timestamptz)
      - `fecha_devolucion_real` (timestamptz, optional)
      - `estado` (text, default 'activo')
      - `created_at`, `updated_at` (timestamptz)

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para que usuarios solo accedan a sus propios datos
    - Políticas de lectura para el catálogo de libros (público)
    
  3. Funciones
    - Función para incrementar cantidad de libros disponibles
    - Triggers para actualizar timestamps automáticamente
*/

-- Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS perfiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  telefono text,
  direccion text,
  fecha_registro timestamptz DEFAULT now(),
  estado text DEFAULT 'activo' CHECK (estado IN ('activo', 'suspendido', 'inactivo')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de libros
CREATE TABLE IF NOT EXISTS libros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  autor text NOT NULL,
  año integer NOT NULL,
  cantidad_disponible integer DEFAULT 0 CHECK (cantidad_disponible >= 0),
  descripcion text,
  portada_url text,
  categoria text,
  isbn text,
  editorial text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  libro_id uuid NOT NULL REFERENCES libros(id) ON DELETE CASCADE,
  descripcion text,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  fecha_realizada timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de sanciones
CREATE TABLE IF NOT EXISTS sanciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  motivo text NOT NULL,
  fecha_inicio timestamptz DEFAULT now(),
  fecha_fin timestamptz NOT NULL,
  estado text DEFAULT 'activa' CHECK (estado IN ('activa', 'cumplida', 'anulada')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de prestamos
CREATE TABLE IF NOT EXISTS prestamos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  libro_id uuid NOT NULL REFERENCES libros(id) ON DELETE CASCADE,
  fecha_prestamo timestamptz DEFAULT now(),
  fecha_devolucion_programada timestamptz NOT NULL,
  fecha_devolucion_real timestamptz,
  estado text DEFAULT 'activo' CHECK (estado IN ('activo', 'devuelto', 'vencido')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE libros ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestamos ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Users can read own profile"
  ON perfiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON perfiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON perfiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas para libros (lectura pública)
CREATE POLICY "Anyone can read books"
  ON libros
  FOR SELECT
  TO authenticated
  USING (true);

-- Políticas para solicitudes
CREATE POLICY "Users can read own solicitudes"
  ON solicitudes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own solicitudes"
  ON solicitudes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own solicitudes"
  ON solicitudes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Políticas para sanciones
CREATE POLICY "Users can read own sanciones"
  ON sanciones
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Políticas para prestamos
CREATE POLICY "Users can read own prestamos"
  ON prestamos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can update own prestamos"
  ON prestamos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Función para incrementar cantidad de libros
CREATE OR REPLACE FUNCTION increment_book_quantity(libro_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE libros
  SET cantidad_disponible = cantidad_disponible + 1,
      updated_at = now()
  WHERE id = libro_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers a todas las tablas
CREATE TRIGGER update_perfiles_updated_at BEFORE UPDATE ON perfiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_libros_updated_at BEFORE UPDATE ON libros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solicitudes_updated_at BEFORE UPDATE ON solicitudes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sanciones_updated_at BEFORE UPDATE ON sanciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prestamos_updated_at BEFORE UPDATE ON prestamos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();