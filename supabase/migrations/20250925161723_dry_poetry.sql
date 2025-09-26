/*
  # Create stores table

  1. New Tables
    - `stores`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text, optional)
      - `logo_url` (text, optional)
      - `banner_url` (text, optional)
      - `website_url` (text, optional)
      - `cashback_rate` (numeric)
      - `category_id` (uuid, foreign key)
      - `is_popular` (boolean, default false)
      - `is_featured` (boolean, default false)
      - `is_active` (boolean, default true)
      - `total_offers` (integer, default 0)
      - `total_clicks` (integer, default 0)
      - `total_conversions` (integer, default 0)
      - `commission_rate` (numeric, default 0)
      - `tracking_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `stores` table
    - Add policy for public read access
    - Add policy for admins to manage stores
*/

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo_url text,
  banner_url text,
  website_url text,
  cashback_rate numeric NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id),
  is_popular boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  total_offers integer DEFAULT 0,
  total_clicks integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  commission_rate numeric DEFAULT 0,
  tracking_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Stores are publicly readable"
  ON stores
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage stores"
  ON stores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update category store count
CREATE OR REPLACE FUNCTION update_category_store_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update store count for old category
  IF TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id THEN
    UPDATE categories 
    SET store_count = store_count - 1 
    WHERE id = OLD.category_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE categories 
    SET store_count = store_count - 1 
    WHERE id = OLD.category_id;
    RETURN OLD;
  END IF;
  
  -- Update store count for new category
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id) THEN
    UPDATE categories 
    SET store_count = store_count + 1 
    WHERE id = NEW.category_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update category store count
CREATE TRIGGER update_category_store_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_category_store_count();