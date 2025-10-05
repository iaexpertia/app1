/*
  # Update social_links policies for public access

  1. Changes
    - Drop existing restrictive policies
    - Add new policies that allow public INSERT, UPDATE, DELETE operations
    - This allows the admin panel to work without Supabase Auth
    - Keep SELECT policy for active links for public viewing

  2. Security Note
    - In production, you should implement proper authentication
    - These policies are permissive for development purposes
*/

DROP POLICY IF EXISTS "Authenticated users can view all social links" ON social_links;
DROP POLICY IF EXISTS "Authenticated users can insert social links" ON social_links;
DROP POLICY IF EXISTS "Authenticated users can update social links" ON social_links;
DROP POLICY IF EXISTS "Authenticated users can delete social links" ON social_links;

CREATE POLICY "Public can view all social links"
  ON social_links
  FOR SELECT
  USING (true);

CREATE POLICY "Public can insert social links"
  ON social_links
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update social links"
  ON social_links
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete social links"
  ON social_links
  FOR DELETE
  USING (true);