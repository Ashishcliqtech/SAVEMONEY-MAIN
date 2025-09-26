/*
  # Insert sample data for development

  1. Sample Data
    - Sample stores with proper categories
    - Sample offers linked to stores
    - Sample admin user
    - Sample content sections

  2. Notes
    - This is for development/demo purposes
    - Real production data should be added via admin panel
*/

-- Insert sample stores
INSERT INTO stores (name, slug, description, logo_url, cashback_rate, category_id, is_popular, is_featured) 
SELECT 
  'Amazon',
  'amazon',
  'World''s largest online marketplace with millions of products across all categories.',
  'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  5,
  c.id,
  true,
  true
FROM categories c WHERE c.slug = 'electronics'
ON CONFLICT (name) DO NOTHING;

INSERT INTO stores (name, slug, description, logo_url, cashback_rate, category_id, is_popular, is_featured) 
SELECT 
  'Flipkart',
  'flipkart',
  'India''s leading e-commerce platform offering fashion, electronics, and more.',
  'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  8,
  c.id,
  true,
  true
FROM categories c WHERE c.slug = 'fashion'
ON CONFLICT (name) DO NOTHING;

INSERT INTO stores (name, slug, description, logo_url, cashback_rate, category_id, is_popular) 
SELECT 
  'Myntra',
  'myntra',
  'Fashion and lifestyle destination with top brands and latest trends.',
  'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  12,
  c.id,
  false
FROM categories c WHERE c.slug = 'fashion'
ON CONFLICT (name) DO NOTHING;

INSERT INTO stores (name, slug, description, logo_url, cashback_rate, category_id, is_popular) 
SELECT 
  'Nykaa',
  'nykaa',
  'Beauty and wellness products from top brands worldwide.',
  'https://images.pexels.com/photos/5938567/pexels-photo-5938567.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  15,
  c.id,
  true
FROM categories c WHERE c.slug = 'beauty'
ON CONFLICT (name) DO NOTHING;

-- Insert sample offers
INSERT INTO offers (title, description, store_id, category_id, cashback_rate, original_price, discounted_price, coupon_code, offer_type, image_url, terms, min_order_value, expiry_date, is_exclusive, is_trending, is_featured)
SELECT 
  'Flat 50% Off + 15% Cashback on Electronics',
  'Get additional savings on smartphones, laptops, and gadgets. Limited time offer!',
  s.id,
  c.id,
  15,
  50000,
  25000,
  'SAVE50',
  'deal',
  'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
  ARRAY['Valid on electronics only', 'Minimum order ₹10,000', 'Cannot be combined with other offers'],
  10000,
  now() + interval '30 days',
  true,
  true,
  true
FROM stores s, categories c 
WHERE s.slug = 'amazon' AND c.slug = 'electronics'
ON CONFLICT DO NOTHING;

INSERT INTO offers (title, description, store_id, category_id, cashback_rate, coupon_code, offer_type, image_url, terms, min_order_value, expiry_date, is_trending, is_featured)
SELECT 
  'Fashion Sale - Up to 70% Off',
  'Latest trends at unbeatable prices. Shop from top fashion brands.',
  s.id,
  c.id,
  12,
  'FASHION70',
  'coupon',
  'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
  ARRAY['Valid on fashion items only', 'Minimum order ₹2,000'],
  2000,
  now() + interval '20 days',
  true,
  true
FROM stores s, categories c 
WHERE s.slug = 'flipkart' AND c.slug = 'fashion'
ON CONFLICT DO NOTHING;

-- Insert sample content sections
INSERT INTO content_sections (name, type, content, position, is_active) VALUES
  (
    'Hero Section',
    'hero',
    '{"title": "Save Money on Every Purchase", "subtitle": "Get cashback and exclusive deals from top brands", "buttonText": "Start Saving Now", "buttonLink": "/offers", "imageUrl": "https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"}',
    1,
    true
  ),
  (
    'Featured Deals Section',
    'featured',
    '{"title": "Featured Deals", "description": "Limited time exclusive offers just for you"}',
    2,
    true
  )
ON CONFLICT DO NOTHING;

-- Create admin user (password will be set via Supabase Auth)
-- This is just the profile data
INSERT INTO users (id, email, name, role, is_verified, is_active, referral_code) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'ashish84048@gmail.com',
    'Admin User',
    'admin',
    true,
    true,
    'ADMIN001'
  )
ON CONFLICT (email) DO NOTHING;