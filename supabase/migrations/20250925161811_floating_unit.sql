/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `message` (text)
      - `type` (enum: deal, cashback, withdrawal, referral, support, system)
      - `action_url` (text, optional)
      - `image_url` (text, optional)
      - `metadata` (jsonb, optional)
      - `is_read` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `notifications` table
    - Add policy for users to read their own notifications
    - Add policy for admins to manage all notifications
*/

-- Create enum for notification types
CREATE TYPE notification_type AS ENUM ('deal', 'cashback', 'withdrawal', 'referral', 'support', 'system');

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type NOT NULL,
  action_url text,
  image_url text,
  metadata jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );