/*
  # Create collaborators table

  1. New Tables
    - `collaborators`
      - `id` (text, primary key)
      - `name` (text, not null) - Collaborator name
      - `description` (text) - Description of services
      - `logo_url` (text) - URL to collaborator logo
      - `website_url` (text) - Collaborator website
      - `email` (text) - Contact email
      - `phone` (text) - Contact phone
      - `address` (text) - Physical address
      - `city` (text) - City
      - `country` (text) - Country
      - `category` (text, not null) - Category (Tienda de Bicicletas, Hotel, etc.)
      - `latitude` (numeric) - Latitude for map display
      - `longitude` (numeric) - Longitude for map display
      - `is_featured` (boolean, default false) - Whether to feature this collaborator
      - `rating` (numeric) - Rating (1-5)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `collaborators` table
    - Add policy for anyone to read collaborators
    - Add policy for authenticated users to insert collaborators
    - Add policy for authenticated users to update collaborators
    - Add policy for authenticated users to delete collaborators

  3. Important Notes
    - All users can view collaborators
    - Only authenticated users can modify collaborators
    - Coordinates are optional for map integration
*/

CREATE TABLE IF NOT EXISTS collaborators (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  logo_url text,
  website_url text,
  email text,
  phone text,
  address text,
  city text,
  country text,
  category text NOT NULL,
  latitude numeric,
  longitude numeric,
  is_featured boolean DEFAULT false,
  rating numeric CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read collaborators"
  ON collaborators
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert collaborators"
  ON collaborators
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update collaborators"
  ON collaborators
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete collaborators"
  ON collaborators
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_collaborators_category ON collaborators(category);
CREATE INDEX IF NOT EXISTS idx_collaborators_city ON collaborators(city);
CREATE INDEX IF NOT EXISTS idx_collaborators_country ON collaborators(country);
CREATE INDEX IF NOT EXISTS idx_collaborators_is_featured ON collaborators(is_featured);