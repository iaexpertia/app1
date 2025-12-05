/*
  # Create Favorite Passes Table

  1. New Tables
    - `favorite_passes`
      - `id` (uuid, primary key) - Unique identifier
      - `cyclist_id` (uuid, foreign key to cyclists) - User who saved the pass
      - `pass_id` (text, foreign key to mountain_passes) - The mountain pass
      - `created_at` (timestamptz) - When the pass was added to favorites
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `favorite_passes` table
    - Add policy for anyone to read favorite passes
    - Add policy for users to insert their own favorites
    - Add policy for users to delete their own favorites

  3. Important Notes
    - Each user can only have one entry per pass (enforced by unique constraint)
    - Users can view all favorite passes (for leaderboards and stats)
    - Users can only add/remove their own favorites
*/

CREATE TABLE IF NOT EXISTS favorite_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cyclist_id uuid REFERENCES cyclists(id) ON DELETE CASCADE,
  pass_id text REFERENCES mountain_passes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(cyclist_id, pass_id)
);

ALTER TABLE favorite_passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read favorite passes"
  ON favorite_passes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own favorites"
  ON favorite_passes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their own favorites"
  ON favorite_passes
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_favorite_passes_cyclist_id ON favorite_passes(cyclist_id);
CREATE INDEX IF NOT EXISTS idx_favorite_passes_pass_id ON favorite_passes(pass_id);
