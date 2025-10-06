/*
  # Add validation status to mountain passes

  1. Changes
    - Add `is_validated` column to track if the pass has been validated by admin
    - Add `submitted_by` column to track who submitted the pass
    - Add `validated_by` column to track which admin validated the pass
    - Add `validation_notes` column for admin notes during validation
    - Create index on is_validated for better query performance
    
  2. Notes
    - Existing passes will be marked as validated (true) by default
    - New passes submitted will default to false (pending validation)
    - Only validated passes will be visible to regular users
    - Admins can see all passes regardless of validation status
*/

-- Add validation columns
ALTER TABLE mountain_passes 
ADD COLUMN IF NOT EXISTS is_validated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS submitted_by text,
ADD COLUMN IF NOT EXISTS validated_by text,
ADD COLUMN IF NOT EXISTS validation_notes text;

-- Set existing passes as validated
UPDATE mountain_passes 
SET is_validated = true 
WHERE is_validated IS NULL OR is_validated = false;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_mountain_passes_is_validated 
ON mountain_passes(is_validated);

-- Create index for name lookups (for duplicate checking)
CREATE INDEX IF NOT EXISTS idx_mountain_passes_name_country 
ON mountain_passes(name, country, region);
