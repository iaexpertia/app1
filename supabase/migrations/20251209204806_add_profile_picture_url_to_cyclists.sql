/*
  # Add profile_picture_url to cyclists table

  1. Changes
    - Add `profile_picture_url` column to store Supabase Storage URLs for avatars
    - This column will store public URLs from the profiles bucket

  2. Notes
    - The existing `profile_photo` column stores base64 encoded images
    - The new `profile_picture_url` will store Supabase Storage URLs
    - Both columns can coexist for backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cyclists' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE cyclists ADD COLUMN profile_picture_url text;
  END IF;
END $$;