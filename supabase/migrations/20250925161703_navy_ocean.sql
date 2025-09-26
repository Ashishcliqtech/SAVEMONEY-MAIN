/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text, optional)
      - `avatar_url` (text, optional)
      - `referral_code` (text, unique)
      - `total_cashback` (numeric, default 0)
      - `available_cashback` (numeric, default 0)
      - `pending_cashback` (numeric, default 0)
      - `is_verified` (boolean, default false)
      - `is_active` (boolean, default true)
      - `role` (enum: user, admin, moderator, default user)
      - `referred_by` (uuid, optional foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read/update their own data
    - Add policy for admins to manage all users
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  avatar_url text,
  referral_code text UNIQUE NOT NULL DEFAULT 'USER' || substr(gen_random_uuid()::text, 1, 8),
  total_cashback numeric DEFAULT 0,
  available_cashback numeric DEFAULT 0,
  pending_cashback numeric DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  role user_role DEFAULT 'user',
  referred_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();