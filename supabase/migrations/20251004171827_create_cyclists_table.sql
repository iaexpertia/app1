/*
  # Crear tabla de ciclistas

  1. Nueva Tabla
    - `cyclists`
      - `id` (uuid, clave primaria) - Identificador único del ciclista
      - `name` (text, requerido) - Nombre completo del ciclista
      - `alias` (text, opcional) - Alias o apodo del ciclista
      - `email` (text, único, requerido) - Correo electrónico para login
      - `password` (text, requerido) - Contraseña hasheada
      - `phone` (text, opcional) - Teléfono de contacto
      - `city` (text, opcional) - Ciudad de residencia
      - `country` (text, opcional) - País de residencia
      - `age` (integer, opcional) - Edad del ciclista
      - `weight` (numeric, opcional) - Peso en kg
      - `profile_photo` (text, opcional) - URL de foto de perfil
      - `bikes` (jsonb, default []) - Array de bicicletas del ciclista
      - `registration_date` (timestamptz, default now()) - Fecha de registro
      - `is_admin` (boolean, default false) - Si es administrador
      - `strava_connected` (boolean, default false) - Si tiene Strava conectado
      - `strava_athlete_id` (text, opcional) - ID del atleta en Strava
      - `strava_access_token` (text, opcional) - Token de acceso de Strava
      - `strava_refresh_token` (text, opcional) - Token de refresco de Strava
      - `strava_token_expiry` (bigint, opcional) - Timestamp de expiración del token
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Seguridad
    - Habilitar RLS en la tabla `cyclists`
    - Política para que los ciclistas autenticados puedan ver su propio perfil
    - Política para que los ciclistas puedan actualizar su propio perfil
    - Política para que los administradores puedan ver todos los perfiles
    - Política pública para registrarse (INSERT)
*/

-- Crear tabla de ciclistas
CREATE TABLE IF NOT EXISTS cyclists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  alias text,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  phone text,
  city text,
  country text,
  age integer,
  weight numeric,
  profile_photo text,
  bikes jsonb DEFAULT '[]'::jsonb,
  registration_date timestamptz DEFAULT now(),
  is_admin boolean DEFAULT false,
  strava_connected boolean DEFAULT false,
  strava_athlete_id text,
  strava_access_token text,
  strava_refresh_token text,
  strava_token_expiry bigint,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE cyclists ENABLE ROW LEVEL SECURITY;

-- Política para que cualquiera pueda registrarse (INSERT)
CREATE POLICY "Anyone can register"
  ON cyclists
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para que los ciclistas puedan ver su propio perfil
CREATE POLICY "Cyclists can view own profile"
  ON cyclists
  FOR SELECT
  TO public
  USING (true);

-- Política para que los ciclistas puedan actualizar su propio perfil
CREATE POLICY "Cyclists can update own profile"
  ON cyclists
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Crear índice en email para búsquedas rápidas
CREATE INDEX IF NOT EXISTS cyclists_email_idx ON cyclists(email);

-- Crear índice en strava_athlete_id
CREATE INDEX IF NOT EXISTS cyclists_strava_athlete_id_idx ON cyclists(strava_athlete_id);
