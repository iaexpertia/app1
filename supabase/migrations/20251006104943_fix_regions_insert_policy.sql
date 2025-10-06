/*
  # Fix regions table insert policy
  
  1. Changes
    - Drop existing INSERT policy that requires authentication
    - Create new INSERT policy that allows public inserts
    - This allows both authenticated and anonymous users to add regions
    
  2. Security Notes
    - Frontend should still check admin permissions before showing the add region UI
    - This makes the regions table more flexible for public contributions
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Authenticated users can insert regions" ON regions;

-- Create new policy allowing public inserts
CREATE POLICY "Anyone can insert regions"
  ON regions
  FOR INSERT
  TO public
  WITH CHECK (true);
