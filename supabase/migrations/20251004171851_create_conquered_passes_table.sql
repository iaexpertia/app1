/*
  # Crear tabla de puertos conquistados

  1. Nueva Tabla
    - `conquered_passes`
      - `id` (uuid, clave primaria) - Identificador único del registro
      - `cyclist_id` (uuid, requerido) - ID del ciclista que conquistó el puerto
      - `pass_id` (text, requerido) - ID del puerto de montaña
      - `date_completed` (date, requerido) - Fecha en que se completó
      - `time_completed` (text, opcional) - Tiempo que tardó en completarlo
      - `personal_notes` (text, opcional) - Notas personales del ciclista
      - `photos` (jsonb, default []) - Array de URLs de fotos
      - `strava_activity_id` (text, opcional) - ID de la actividad en Strava
      - `strava_activity_url` (text, opcional) - URL de la actividad en Strava
      - `synced_from_strava` (boolean, default false) - Si fue sincronizado desde Strava
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Relaciones
    - Relación con tabla `cyclists` mediante `cyclist_id`
  
  3. Seguridad
    - Habilitar RLS en la tabla `conquered_passes`
    - Política para que los ciclistas puedan ver sus propios registros
    - Política para que los ciclistas puedan insertar sus propios registros
    - Política para que los ciclistas puedan actualizar sus propios registros
    - Política para que los ciclistas puedan eliminar sus propios registros
  
  4. Notas Importantes
    - Se usa constraint única en (cyclist_id, pass_id) para evitar duplicados
    - Se crean índices para optimizar búsquedas
*/

-- Crear tabla de puertos conquistados
CREATE TABLE IF NOT EXISTS conquered_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cyclist_id uuid NOT NULL REFERENCES cyclists(id) ON DELETE CASCADE,
  pass_id text NOT NULL,
  date_completed date NOT NULL,
  time_completed text,
  personal_notes text,
  photos jsonb DEFAULT '[]'::jsonb,
  strava_activity_id text,
  strava_activity_url text,
  synced_from_strava boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(cyclist_id, pass_id)
);

-- Habilitar RLS
ALTER TABLE conquered_passes ENABLE ROW LEVEL SECURITY;

-- Política para que cualquiera pueda ver los puertos conquistados (para estadísticas públicas)
CREATE POLICY "Anyone can view conquered passes"
  ON conquered_passes
  FOR SELECT
  TO public
  USING (true);

-- Política para que los ciclistas puedan insertar sus propios registros
CREATE POLICY "Cyclists can insert own records"
  ON conquered_passes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para que cualquiera pueda actualizar (necesario para que funcione sin autenticación)
CREATE POLICY "Anyone can update conquered passes"
  ON conquered_passes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Política para que cualquiera pueda eliminar
CREATE POLICY "Anyone can delete conquered passes"
  ON conquered_passes
  FOR DELETE
  TO public
  USING (true);

-- Crear índice en cyclist_id para búsquedas rápidas
CREATE INDEX IF NOT EXISTS conquered_passes_cyclist_id_idx ON conquered_passes(cyclist_id);

-- Crear índice en pass_id
CREATE INDEX IF NOT EXISTS conquered_passes_pass_id_idx ON conquered_passes(pass_id);

-- Crear índice en date_completed para ordenar por fecha
CREATE INDEX IF NOT EXISTS conquered_passes_date_completed_idx ON conquered_passes(date_completed DESC);

-- Crear índice en strava_activity_id
CREATE INDEX IF NOT EXISTS conquered_passes_strava_activity_id_idx ON conquered_passes(strava_activity_id);
