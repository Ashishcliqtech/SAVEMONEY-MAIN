/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `store_id` (uuid, foreign key)
      - `offer_id` (uuid, foreign key, optional)
      - `order_id` (text)
      - `amount` (numeric)
      - `cashback_earned` (numeric)
      - `cashback_rate` (numeric)
      - `status` (enum: pending, confirmed, cancelled)
      - `tracking_id` (text, optional)
      - `confirmed_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policy for users to read their own transactions
    - Add policy for admins to manage all transactions
*/

-- Create enum for transaction status
CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES stores(id),
  offer_id uuid REFERENCES offers(id),
  order_id text NOT NULL,
  amount numeric NOT NULL,
  cashback_earned numeric NOT NULL DEFAULT 0,
  cashback_rate numeric NOT NULL DEFAULT 0,
  status transaction_status DEFAULT 'pending',
  tracking_id text,
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update user cashback when transaction is confirmed
CREATE OR REPLACE FUNCTION update_user_cashback()
RETURNS TRIGGER AS $$
BEGIN
  -- When transaction is confirmed, update user cashback
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    UPDATE users 
    SET 
      total_cashback = total_cashback + NEW.cashback_earned,
      pending_cashback = pending_cashback + NEW.cashback_earned
    WHERE id = NEW.user_id;
  END IF;
  
  -- When transaction is cancelled, remove cashback if it was confirmed
  IF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
    UPDATE users 
    SET 
      total_cashback = total_cashback - NEW.cashback_earned,
      pending_cashback = GREATEST(0, pending_cashback - NEW.cashback_earned)
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update user cashback
CREATE TRIGGER update_user_cashback_trigger
  AFTER UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_cashback();