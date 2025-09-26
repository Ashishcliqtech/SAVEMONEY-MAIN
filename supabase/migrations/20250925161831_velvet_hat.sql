/*
  # Create content management tables

  1. New Tables
    - `content_sections`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (enum: hero, featured, highlighted, banner, testimonial)
      - `content` (jsonb)
      - `position` (integer)
      - `devices` (text array)
      - `is_active` (boolean)
      - `scheduled_date` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `featured_offers`
      - `id` (uuid, primary key)
      - `offer_id` (uuid, foreign key)
      - `section_type` (enum: hero, featured, trending, exclusive)
      - `position` (integer)
      - `start_date` (timestamp, optional)
      - `end_date` (timestamp, optional)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read and admin management
*/

-- Create enums
CREATE TYPE content_section_type AS ENUM ('hero', 'featured', 'highlighted', 'banner', 'testimonial');
CREATE TYPE featured_section_type AS ENUM ('hero', 'featured', 'trending', 'exclusive');

-- Create content_sections table
CREATE TABLE IF NOT EXISTS content_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type content_section_type NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  position integer DEFAULT 0,
  devices text[] DEFAULT ARRAY['desktop', 'tablet', 'mobile'],
  is_active boolean DEFAULT true,
  scheduled_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create featured_offers table
CREATE TABLE IF NOT EXISTS featured_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  section_type featured_section_type NOT NULL,
  position integer DEFAULT 0,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_offers ENABLE ROW LEVEL SECURITY;

-- Policies for content_sections
CREATE POLICY "Content sections are publicly readable"
  ON content_sections
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND (scheduled_date IS NULL OR scheduled_date <= now()));

CREATE POLICY "Admins can manage content sections"
  ON content_sections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for featured_offers
CREATE POLICY "Featured offers are publicly readable"
  ON featured_offers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND (end_date IS NULL OR end_date > now()));

CREATE POLICY "Admins can manage featured offers"
  ON featured_offers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Triggers
CREATE TRIGGER update_content_sections_updated_at
  BEFORE UPDATE ON content_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();