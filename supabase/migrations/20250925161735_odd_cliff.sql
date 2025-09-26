/*
  # Create offers table

  1. New Tables
    - `offers`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `store_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key, optional)
      - `cashback_rate` (numeric)
      - `original_price` (numeric, optional)
      - `discounted_price` (numeric, optional)
      - `coupon_code` (text, optional)
      - `offer_type` (enum: cashback, coupon, deal)
      - `image_url` (text, optional)
      - `terms` (text array, optional)
      - `min_order_value` (numeric, default 0)
      - `expiry_date` (timestamp, optional)
      - `is_exclusive` (boolean, default false)
      - `is_trending` (boolean, default false)
      - `is_featured` (boolean, default false)
      - `is_active` (boolean, default true)
      - `click_count` (integer, default 0)
      - `conversion_count` (integer, default 0)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `offers` table
    - Add policy for public read access
    - Add policy for admins to manage offers
*/

-- Create enum for offer types
CREATE TYPE offer_type AS ENUM ('cashback', 'coupon', 'deal');

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  cashback_rate numeric NOT NULL DEFAULT 0,
  original_price numeric,
  discounted_price numeric,
  coupon_code text,
  offer_type offer_type NOT NULL DEFAULT 'deal',
  image_url text,
  terms text[],
  min_order_value numeric DEFAULT 0,
  expiry_date timestamptz,
  is_exclusive boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  click_count integer DEFAULT 0,
  conversion_count integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Offers are publicly readable"
  ON offers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND (expiry_date IS NULL OR expiry_date > now()));

CREATE POLICY "Admins can manage offers"
  ON offers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update store and category offer counts
CREATE OR REPLACE FUNCTION update_offer_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update offer count for old store and category
  IF TG_OP = 'UPDATE' AND (OLD.store_id IS DISTINCT FROM NEW.store_id OR OLD.category_id IS DISTINCT FROM NEW.category_id) THEN
    UPDATE stores SET total_offers = total_offers - 1 WHERE id = OLD.store_id;
    UPDATE categories SET offer_count = offer_count - 1 WHERE id = OLD.category_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE stores SET total_offers = total_offers - 1 WHERE id = OLD.store_id;
    UPDATE categories SET offer_count = offer_count - 1 WHERE id = OLD.category_id;
    RETURN OLD;
  END IF;
  
  -- Update offer count for new store and category
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (OLD.store_id IS DISTINCT FROM NEW.store_id OR OLD.category_id IS DISTINCT FROM NEW.category_id)) THEN
    UPDATE stores SET total_offers = total_offers + 1 WHERE id = NEW.store_id;
    UPDATE categories SET offer_count = offer_count + 1 WHERE id = NEW.category_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update offer counts
CREATE TRIGGER update_offer_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_offer_counts();