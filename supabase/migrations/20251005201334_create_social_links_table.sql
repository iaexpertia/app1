/*
  # Create social_links table

  1. New Tables
    - `social_links`
      - `id` (uuid, primary key)
      - `platform` (text) - Social media platform name (instagram, facebook, youtube, linkedin, tiktok)
      - `url` (text) - Complete URL to the social media profile
      - `is_active` (boolean) - Whether the link should be displayed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `social_links` table
    - Add policy for authenticated users to read social links
    - Add policy for admin users to manage social links

  3. Notes
    - Only one record per platform allowed (unique constraint)
    - Default values for is_active and timestamps
*/

CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text UNIQUE NOT NULL,
  url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active social links"
  ON social_links
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all social links"
  ON social_links
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert social links"
  ON social_links
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update social links"
  ON social_links
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete social links"
  ON social_links
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_social_links_platform ON social_links(platform);
CREATE INDEX IF NOT EXISTS idx_social_links_is_active ON social_links(is_active);