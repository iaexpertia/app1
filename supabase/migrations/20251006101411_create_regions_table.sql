/*
  # Create regions table for dynamic region management

  1. New Tables
    - `regions`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Name of the region
      - `country` (text) - Country where the region is located
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `regions` table
    - Add policy for public read access (anyone can view regions)
    - Add policy for authenticated users to add new regions
*/

-- Create regions table
CREATE TABLE IF NOT EXISTS regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL DEFAULT 'Sin especificar',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index on name to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_regions_name_unique ON regions(LOWER(name));

-- Enable RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read regions
CREATE POLICY "Anyone can read regions"
  ON regions
  FOR SELECT
  TO public
  USING (true);

-- Policy: Authenticated users can insert regions
CREATE POLICY "Authenticated users can insert regions"
  ON regions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert some default regions
INSERT INTO regions (name, country) VALUES
  ('Alpes', 'Francia'),
  ('Pirineos', 'España'),
  ('Dolomitas', 'Italia'),
  ('Provenza', 'Francia'),
  ('Asturias', 'España'),
  ('Lombardy', 'Italia'),
  ('Lake District', 'Inglaterra'),
  ('Sin especificar', 'Sin especificar')
ON CONFLICT DO NOTHING;
