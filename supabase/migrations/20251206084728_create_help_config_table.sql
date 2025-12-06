/*
  # Create help configuration table

  1. New Tables
    - `help_config`
      - `id` (uuid, primary key) - Unique identifier
      - `help_url` (text) - URL for the help link
      - `is_active` (boolean) - Whether the help link is active
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `help_config` table
    - Add policy for public read access (anyone can read the active help link)
    - Add policy for authenticated admin users to insert/update/delete

  3. Notes
    - Only one record should exist in this table
    - The help link will be displayed in the frontend header
*/

CREATE TABLE IF NOT EXISTS help_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  help_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE help_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active help config"
  ON help_config
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert help config"
  ON help_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update help config"
  ON help_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete help config"
  ON help_config
  FOR DELETE
  TO authenticated
  USING (true);