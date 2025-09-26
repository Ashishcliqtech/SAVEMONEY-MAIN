/*
  # Create referrals table

  1. New Tables
    - `referrals`
      - `id` (uuid, primary key)
      - `referrer_id` (uuid, foreign key)
      - `referred_id` (uuid, foreign key)
      - `bonus_amount` (numeric, default 100)
      - `status` (enum: pending, completed, cancelled)
      - `completed_at` (timestamp, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `referrals` table
    - Add policies for users and admins
*/

-- Create enum for referral status
CREATE TYPE referral_status AS ENUM ('pending', 'completed', 'cancelled');

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bonus_amount numeric DEFAULT 100,
  status referral_status DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "Admins can manage all referrals"
  ON referrals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to process referral bonus
CREATE OR REPLACE FUNCTION process_referral_bonus()
RETURNS TRIGGER AS $$
BEGIN
  -- When referral is completed, add bonus to both users
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Add bonus to referrer
    UPDATE users 
    SET 
      total_cashback = total_cashback + NEW.bonus_amount,
      available_cashback = available_cashback + NEW.bonus_amount
    WHERE id = NEW.referrer_id;
    
    -- Add welcome bonus to referred user
    UPDATE users 
    SET 
      total_cashback = total_cashback + (NEW.bonus_amount / 2),
      available_cashback = available_cashback + (NEW.bonus_amount / 2)
    WHERE id = NEW.referred_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to process referral bonus
CREATE TRIGGER process_referral_bonus_trigger
  AFTER UPDATE ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION process_referral_bonus();