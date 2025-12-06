/*
  # Create Race Finishes Table
  
  1. New Tables
    - `race_finishes`
      - `id` (uuid, primary key)
      - `cyclist_id` (uuid, references cyclists)
      - `race_id` (text, race identifier)
      - `race_name` (text, race name for display)
      - `year` (integer, year the race was completed)
      - `finish_time` (text, time in HH:MM:SS format)
      - `finish_time_seconds` (integer, time in seconds for comparisons)
      - `notes` (text, optional notes)
      - `date_completed` (date, date of completion)
      - `is_pr` (boolean, indicates if this is personal record)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `race_finishes` table
    - Add policies for cyclists to manage their own finishes
  
  3. Indexes
    - Index on cyclist_id for faster queries
    - Index on race_id for faster queries
    - Index on finish_time_seconds for PR detection
*/

CREATE TABLE IF NOT EXISTS race_finishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cyclist_id uuid NOT NULL REFERENCES cyclists(id) ON DELETE CASCADE,
  race_id text NOT NULL,
  race_name text NOT NULL,
  year integer NOT NULL,
  finish_time text NOT NULL,
  finish_time_seconds integer NOT NULL,
  notes text DEFAULT '',
  date_completed date NOT NULL,
  is_pr boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE race_finishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cyclists can view own race finishes"
  ON race_finishes
  FOR SELECT
  TO authenticated
  USING (cyclist_id = auth.uid());

CREATE POLICY "Cyclists can insert own race finishes"
  ON race_finishes
  FOR INSERT
  TO authenticated
  WITH CHECK (cyclist_id = auth.uid());

CREATE POLICY "Cyclists can update own race finishes"
  ON race_finishes
  FOR UPDATE
  TO authenticated
  USING (cyclist_id = auth.uid())
  WITH CHECK (cyclist_id = auth.uid());

CREATE POLICY "Cyclists can delete own race finishes"
  ON race_finishes
  FOR DELETE
  TO authenticated
  USING (cyclist_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_race_finishes_cyclist_id ON race_finishes(cyclist_id);
CREATE INDEX IF NOT EXISTS idx_race_finishes_race_id ON race_finishes(race_id);
CREATE INDEX IF NOT EXISTS idx_race_finishes_time ON race_finishes(finish_time_seconds);
CREATE INDEX IF NOT EXISTS idx_race_finishes_year ON race_finishes(year);

CREATE UNIQUE INDEX IF NOT EXISTS idx_race_finishes_unique 
  ON race_finishes(cyclist_id, race_id, year);
