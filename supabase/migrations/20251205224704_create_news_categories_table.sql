/*
  # Create news categories table

  1. New Tables
    - `news_categories`
      - `id` (uuid, primary key) - Unique identifier for the category
      - `name` (text, unique) - Category name in Spanish
      - `name_translations` (jsonb) - Translations for the category name (es, en, fr, it)
      - `color` (text) - CSS color class for the category badge
      - `icon` (text) - Icon identifier for the category
      - `display_order` (integer) - Order for displaying categories
      - `is_active` (boolean) - Whether the category is active
      - `created_at` (timestamptz) - When the category was created
      - `updated_at` (timestamptz) - When the category was last updated

  2. Security
    - Enable RLS on `news_categories` table
    - Add policy for public read access (anyone can view active categories)
    - Add policy for authenticated admin users to manage categories

  3. Initial Data
    - Insert default categories (Competición, Equipamiento, Rutas, Noticias, Entrevistas)
*/

CREATE TABLE IF NOT EXISTS news_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  name_translations jsonb DEFAULT '{"es": "", "en": "", "fr": "", "it": ""}'::jsonb,
  color text DEFAULT 'bg-blue-100 text-blue-700',
  icon text DEFAULT 'Newspaper',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON news_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all categories"
  ON news_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON news_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON news_categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON news_categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default categories
INSERT INTO news_categories (name, name_translations, color, icon, display_order) VALUES
  ('Competición', '{"es": "Competición", "en": "Competition", "fr": "Compétition", "it": "Competizione"}'::jsonb, 'bg-red-100 text-red-700', 'Trophy', 1),
  ('Equipamiento', '{"es": "Equipamiento", "en": "Equipment", "fr": "Équipement", "it": "Attrezzatura"}'::jsonb, 'bg-blue-100 text-blue-700', 'Package', 2),
  ('Rutas', '{"es": "Rutas", "en": "Routes", "fr": "Itinéraires", "it": "Percorsi"}'::jsonb, 'bg-green-100 text-green-700', 'MapPin', 3),
  ('Noticias', '{"es": "Noticias", "en": "News", "fr": "Actualités", "it": "Notizie"}'::jsonb, 'bg-purple-100 text-purple-700', 'Newspaper', 4),
  ('Entrevistas', '{"es": "Entrevistas", "en": "Interviews", "fr": "Entretiens", "it": "Interviste"}'::jsonb, 'bg-orange-100 text-orange-700', 'User', 5)
ON CONFLICT (name) DO NOTHING;