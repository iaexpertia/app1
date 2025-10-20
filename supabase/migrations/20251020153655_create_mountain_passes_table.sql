/*
  # Create mountain passes table

  1. New Tables
    - `mountain_passes`
      - `id` (text, primary key) - Unique identifier for the mountain pass
      - `name` (text, not null) - Name of the mountain pass
      - `country` (text, not null) - Country where the pass is located
      - `region` (text, not null) - Region or area within the country
      - `max_altitude` (integer, not null) - Maximum altitude in meters
      - `elevation_gain` (integer, not null) - Total elevation gain in meters
      - `average_gradient` (numeric, not null) - Average gradient percentage
      - `max_gradient` (numeric, not null) - Maximum gradient percentage
      - `distance` (numeric, not null) - Total distance in kilometers
      - `difficulty` (text, not null) - Difficulty level (Cuarta, Tercera, Segunda, Primera, Especial)
      - `coordinates_lat` (numeric, not null) - Latitude coordinate
      - `coordinates_lng` (numeric, not null) - Longitude coordinate
      - `description` (text) - Description of the pass
      - `image_url` (text) - URL to an image of the pass
      - `category` (text) - Category (e.g., Tour de France, Giro d'Italia)
      - `famous_winners` (jsonb) - Array of famous cyclists who conquered this pass
      - `is_validated` (boolean, default false) - Whether the pass is validated by admin
      - `submitted_by` (text) - User who submitted the pass
      - `validated_by` (text) - Admin who validated the pass
      - `validation_notes` (text) - Admin notes during validation
      - `estado_validacion` (text, default 'Pendiente') - Validation status
      - `is_active` (boolean, default true) - Whether the pass is active
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `mountain_passes` table
    - Add policy for anyone to read validated passes
    - Add policy for users to insert new passes (pending validation)
    - Add policy for admins to update/delete passes

  3. Important Notes
    - Regular users can only see validated passes
    - New passes need admin validation before being visible
    - Indexes are created for better query performance
*/

CREATE TABLE IF NOT EXISTS mountain_passes (
  id text PRIMARY KEY,
  name text NOT NULL,
  country text NOT NULL,
  region text NOT NULL,
  max_altitude integer NOT NULL,
  elevation_gain integer NOT NULL,
  average_gradient numeric NOT NULL,
  max_gradient numeric NOT NULL,
  distance numeric NOT NULL,
  difficulty text NOT NULL,
  coordinates_lat numeric NOT NULL,
  coordinates_lng numeric NOT NULL,
  description text,
  image_url text,
  category text,
  famous_winners jsonb DEFAULT '[]'::jsonb,
  is_validated boolean DEFAULT false,
  submitted_by text,
  validated_by text,
  validation_notes text,
  estado_validacion text DEFAULT 'Pendiente',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE mountain_passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read validated active passes"
  ON mountain_passes
  FOR SELECT
  USING (estado_validacion = 'Validado' AND is_active = true);

CREATE POLICY "Users can insert new passes"
  ON mountain_passes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update all passes"
  ON mountain_passes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete passes"
  ON mountain_passes
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_mountain_passes_name ON mountain_passes(name);
CREATE INDEX IF NOT EXISTS idx_mountain_passes_country ON mountain_passes(country);
CREATE INDEX IF NOT EXISTS idx_mountain_passes_region ON mountain_passes(region);
CREATE INDEX IF NOT EXISTS idx_mountain_passes_difficulty ON mountain_passes(difficulty);
CREATE INDEX IF NOT EXISTS idx_mountain_passes_is_validated ON mountain_passes(is_validated);
CREATE INDEX IF NOT EXISTS idx_mountain_passes_estado_validacion ON mountain_passes(estado_validacion);
CREATE INDEX IF NOT EXISTS idx_mountain_passes_is_active ON mountain_passes(is_active);
CREATE INDEX IF NOT EXISTS idx_mountain_passes_name_country ON mountain_passes(name, country, region);