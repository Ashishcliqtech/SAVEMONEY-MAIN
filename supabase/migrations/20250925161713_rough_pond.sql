/*
  # Create categories table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text, optional)
      - `icon` (text)
      - `image_url` (text, optional)
      - `store_count` (integer, default 0)
      - `offer_count` (integer, default 0)
      - `sort_order` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policy for public read access
    - Add policy for admins to manage categories
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'package',
  image_url text,
  store_count integer DEFAULT 0,
  offer_count integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Categories are publicly readable"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
  ('Fashion', 'fashion', 'Clothing, shoes, and accessories for men and women', 'shirt', 1),
  ('Electronics', 'electronics', 'Smartphones, laptops, gadgets, and tech accessories', 'smartphone', 2),
  ('Travel', 'travel', 'Flight bookings, hotels, and travel packages', 'plane', 3),
  ('Food & Dining', 'food-dining', 'Food delivery, restaurant bookings, and dining offers', 'utensils', 4),
  ('Beauty', 'beauty', 'Skincare, makeup, and personal care products', 'sparkles', 5),
  ('Home & Garden', 'home-garden', 'Home decor, furniture, and gardening supplies', 'home', 6),
  ('Books', 'books', 'Books, e-books, and educational materials', 'book-open', 7),
  ('Health', 'health', 'Healthcare products, medicines, and wellness', 'heart', 8)
ON CONFLICT (name) DO NOTHING;