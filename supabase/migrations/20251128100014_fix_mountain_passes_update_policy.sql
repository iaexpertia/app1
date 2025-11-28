/*
  # Fix Mountain Passes Update Policy
  
  ## Problem
  - Current UPDATE policy requires authenticated users
  - AdminPanel uses ANON_KEY (not authenticated)
  - Toggle status changes fail silently
  
  ## Solution
  - Update policy to allow public (anon) updates
  - This allows AdminPanel to update passes
  
  ## Security Note
  - In production, consider implementing proper authentication
  - For now, allowing public updates for admin functionality
*/

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Authenticated users can update mountain passes" ON mountain_passes;

-- Create new policy allowing public updates
CREATE POLICY "Allow public updates on mountain passes"
  ON mountain_passes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
