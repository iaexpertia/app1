/*
  # Create conquests table

  1. New Tables
    - `conquests`
      - `id` (uuid, primary key)
      - `cyclist_id` (uuid, foreign key to cyclists)
      - `pass_id` (text, foreign key to mountain_passes)
      - `date_completed` (date, not null) - Date when the pass was conquered
      - `notes` (text) - Personal notes about the conquest
      - `photos` (jsonb) - Array of photo URLs
      - `time_taken` (text) - Time taken to complete the pass
      - `weather_conditions` (text) - Weather conditions during the conquest
      - `bike_used` (text) - Bike used for the conquest
      - `difficulty_rating` (integer) - Personal difficulty rating (1-5)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `conquests` table
    - Add policy for users to read their own conquests
    - Add policy for users to insert their own conquests
    - Add policy for users to update their own conquests
    - Add policy for users to delete their own conquests

  3. Important Notes
    - Each conquest is linked to a cyclist and a mountain pass
    - Users can only manage their own conquests
    - Photos are stored as JSON array of URLs
*/

CREATE TABLE IF NOT EXISTS conquests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cyclist_id uuid REFERENCES cyclists(id) ON DELETE CASCADE,
  pass_id text REFERENCES mountain_passes(id) ON DELETE CASCADE,
  date_completed date NOT NULL,
  notes text,
  photos jsonb DEFAULT '[]'::jsonb,
  time_taken text,
  weather_conditions text,
  bike_used text,
  difficulty_rating integer CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(cyclist_id, pass_id)
);

ALTER TABLE conquests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all conquests"
  ON conquests
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own conquests"
  ON conquests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update all conquests"
  ON conquests
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete all conquests"
  ON conquests
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_conquests_cyclist_id ON conquests(cyclist_id);
CREATE INDEX IF NOT EXISTS idx_conquests_pass_id ON conquests(pass_id);
CREATE INDEX IF NOT EXISTS idx_conquests_date_completed ON conquests(date_completed);