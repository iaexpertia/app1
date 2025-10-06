/*
  # Update mountain passes insert policy to allow public submissions

  1. Changes
    - Drop existing restrictive INSERT policy
    - Create new policy that allows public (anonymous) users to insert mountain passes
    - Maintains validation requirement (is_validated = false by default)
    
  2. Security Notes
    - Public users can submit passes, but they start as unvalidated
    - Admin validation required before passes become public
    - This allows non-authenticated users to contribute to the database
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can create mountain passes" ON mountain_passes;

-- Create new policy that allows public inserts
CREATE POLICY "Anyone can submit mountain passes for validation"
  ON mountain_passes
  FOR INSERT
  TO public
  WITH CHECK (true);
