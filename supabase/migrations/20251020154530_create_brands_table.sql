/*
  # Create brands table

  1. New Tables
    - `brands`
      - `id` (text, primary key)
      - `name` (text, not null) - Brand name
      - `description` (text) - Brand description
      - `logo_url` (text) - URL to brand logo
      - `website_url` (text) - Brand website
      - `category` (text, not null) - Brand category (Bicicletas, Componentes, Ropa, etc.)
      - `country` (text) - Country of origin
      - `founded_year` (integer) - Year the brand was founded
      - `is_featured` (boolean, default false) - Whether to feature this brand
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `brands` table
    - Add policy for anyone to read brands
    - Add policy for authenticated users to insert brands
    - Add policy for authenticated users to update brands
    - Add policy for authenticated users to delete brands

  3. Important Notes
    - All users can view brands
    - Only authenticated users can modify brands
*/

CREATE TABLE IF NOT EXISTS brands (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  logo_url text,
  website_url text,
  category text NOT NULL,
  country text,
  founded_year integer,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read brands"
  ON brands
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert brands"
  ON brands
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update brands"
  ON brands
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete brands"
  ON brands
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_brands_category ON brands(category);
CREATE INDEX IF NOT EXISTS idx_brands_is_featured ON brands(is_featured);
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);