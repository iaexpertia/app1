/*
  # Update mountain passes index for name-only duplicate checking

  1. Changes
    - Drop the old composite index on (name, country, region)
    - Create a new index only on name (case-insensitive)
    - This allows checking duplicates by name only, ignoring case
    
  2. Notes
    - Duplicate checking will now be based solely on the pass name
    - Country and region differences are ignored for duplicate detection
    - This prevents adding "Col du Galibier" multiple times even if in different regions
*/

-- Drop the old composite index
DROP INDEX IF EXISTS idx_mountain_passes_name_country;

-- Create a case-insensitive index on name only
CREATE INDEX IF NOT EXISTS idx_mountain_passes_name_lower 
ON mountain_passes(LOWER(name));
