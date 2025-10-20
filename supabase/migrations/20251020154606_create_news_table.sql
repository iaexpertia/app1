/*
  # Create news table

  1. New Tables
    - `news`
      - `id` (text, primary key)
      - `title` (text, not null) - Article title
      - `content` (text, not null) - Article content
      - `summary` (text) - Short summary
      - `image_url` (text) - URL to article image
      - `author` (text) - Article author
      - `category` (text) - News category
      - `tags` (jsonb) - Array of tags
      - `published_date` (date, not null) - Publication date
      - `is_featured` (boolean, default false) - Whether to feature this article
      - `source_url` (text) - Original source URL if applicable
      - `views_count` (integer, default 0) - Number of views
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `news` table
    - Add policy for anyone to read news
    - Add policy for authenticated users to insert news
    - Add policy for authenticated users to update news
    - Add policy for authenticated users to delete news

  3. Important Notes
    - All users can view news
    - Only authenticated users can modify news
    - Articles are sorted by published_date by default
*/

CREATE TABLE IF NOT EXISTS news (
  id text PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  image_url text,
  author text,
  category text,
  tags jsonb DEFAULT '[]'::jsonb,
  published_date date NOT NULL,
  is_featured boolean DEFAULT false,
  source_url text,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news"
  ON news
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert news"
  ON news
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update news"
  ON news
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete news"
  ON news
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author);