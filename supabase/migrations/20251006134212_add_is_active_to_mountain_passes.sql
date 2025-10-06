/*
  # Add is_active field to mountain_passes

  1. Changes
    - Add `is_active` boolean column to `mountain_passes` table
    - Default value is `true` (active)
    - Set all existing passes to active

  2. Purpose
    - Allow administrators to activate/deactivate passes without deleting them
    - Hidden passes won't appear in public views
    - Maintains data integrity by keeping records
*/

-- Add is_active column with default true
ALTER TABLE mountain_passes 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- Set all existing passes to active
UPDATE mountain_passes 
SET is_active = true 
WHERE is_active IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_mountain_passes_is_active 
ON mountain_passes(is_active);
