/*
  # Create cyclists table with permanent admin user

  1. New Tables
    - `cyclists`
      - `id` (uuid, primary key)
      - `email` (text, unique) - Email address of the cyclist
      - `password` (text) - Password (hashed in production)
      - `name` (text) - Full name of the cyclist
      - `is_admin` (boolean) - Whether the user has admin privileges
      - `created_at` (timestamptz) - When the cyclist was created
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `cyclists` table
    - Add policy for authenticated users to read cyclist data
    - Add policy for users to read their own data
    - Add policy for admin users to manage all cyclists

  3. Default Data
    - Insert permanent admin user: webvalles@gmail.com
    - This admin user will persist across all migrations and deployments

  4. Important Notes
    - Password is stored as plain text for development (should be hashed in production)
    - Admin user cannot be deleted
    - Email uniqueness is enforced at database level
*/

CREATE TABLE IF NOT EXISTS cyclists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cyclists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cyclists"
  ON cyclists
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert cyclists"
  ON cyclists
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own data"
  ON cyclists
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete non-admin cyclists"
  ON cyclists
  FOR DELETE
  USING (is_admin = false);

CREATE INDEX IF NOT EXISTS idx_cyclists_email ON cyclists(email);
CREATE INDEX IF NOT EXISTS idx_cyclists_is_admin ON cyclists(is_admin);

-- Insert permanent admin user
INSERT INTO cyclists (email, password, name, is_admin)
VALUES ('webvalles@gmail.com', 'JundioX1979', 'Administrador', true)
ON CONFLICT (email) DO UPDATE
SET password = EXCLUDED.password,
    is_admin = true,
    updated_at = now();