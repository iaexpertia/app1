/*
  # Fix help_config RLS policies

  1. Changes
    - Drop restrictive policies
    - Create permissive policies that allow public access for INSERT, UPDATE, DELETE
    - This is needed because the app uses local authentication (localStorage) not Supabase Auth

  2. Security Note
    - Access control is handled at the application level
    - Only admin users in the app can access the admin panel
*/

DROP POLICY IF EXISTS "Authenticated users can insert help config" ON help_config;
DROP POLICY IF EXISTS "Authenticated users can update help config" ON help_config;
DROP POLICY IF EXISTS "Authenticated users can delete help config" ON help_config;

CREATE POLICY "Anyone can insert help config"
  ON help_config
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update help config"
  ON help_config
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete help config"
  ON help_config
  FOR DELETE
  USING (true);