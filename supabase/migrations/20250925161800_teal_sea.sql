/*
  # Create withdrawals table

  1. New Tables
    - `withdrawals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `amount` (numeric)
      - `method` (enum: upi, bank, paytm, voucher)
      - `account_details` (jsonb)
      - `status` (enum: pending, processing, completed, failed)
      - `admin_notes` (text, optional)
      - `transaction_id` (text, optional)
      - `processed_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `withdrawals` table
    - Add policy for users to read their own withdrawals
    - Add policy for admins to manage all withdrawals
*/

-- Create enums
CREATE TYPE withdrawal_method AS ENUM ('upi', 'bank', 'paytm', 'voucher');
CREATE TYPE withdrawal_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  method withdrawal_method NOT NULL,
  account_details jsonb NOT NULL,
  status withdrawal_status DEFAULT 'pending',
  admin_notes text,
  transaction_id text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own withdrawals"
  ON withdrawals
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create withdrawals"
  ON withdrawals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all withdrawals"
  ON withdrawals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_withdrawals_updated_at
  BEFORE UPDATE ON withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update user cashback when withdrawal is processed
CREATE OR REPLACE FUNCTION process_withdrawal()
RETURNS TRIGGER AS $$
BEGIN
  -- When withdrawal is completed, deduct from available cashback
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE users 
    SET available_cashback = GREATEST(0, available_cashback - NEW.amount)
    WHERE id = NEW.user_id;
  END IF;
  
  -- When withdrawal is failed, add back to available cashback if it was deducted
  IF NEW.status = 'failed' AND OLD.status = 'processing' THEN
    UPDATE users 
    SET available_cashback = available_cashback + NEW.amount
    WHERE id = NEW.user_id;
  END IF;
  
  -- When withdrawal is approved (pending to processing), move from pending to available
  IF NEW.status = 'processing' AND OLD.status = 'pending' THEN
    UPDATE users 
    SET 
      pending_cashback = GREATEST(0, pending_cashback - NEW.amount),
      available_cashback = available_cashback + NEW.amount
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to process withdrawal
CREATE TRIGGER process_withdrawal_trigger
  AFTER UPDATE ON withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION process_withdrawal();