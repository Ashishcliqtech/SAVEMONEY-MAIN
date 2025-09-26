/*
  # Create support system tables

  1. New Tables
    - `support_tickets`
      - `id` (uuid, primary key)
      - `ticket_number` (text, unique)
      - `user_id` (uuid, foreign key)
      - `subject` (text)
      - `message` (text)
      - `priority` (enum: low, medium, high, urgent)
      - `status` (enum: open, in-progress, resolved, closed)
      - `category` (enum: cashback, withdrawal, account, technical, general)
      - `assigned_to` (uuid, foreign key, optional)
      - `attachments` (text array, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `support_responses`
      - `id` (uuid, primary key)
      - `ticket_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `message` (text)
      - `is_admin_response` (boolean)
      - `attachments` (text array, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users and admins
*/

-- Create enums
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_status AS ENUM ('open', 'in-progress', 'resolved', 'closed');
CREATE TYPE ticket_category AS ENUM ('cashback', 'withdrawal', 'account', 'technical', 'general');

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL DEFAULT 'TKT-' || substr(gen_random_uuid()::text, 1, 8),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  priority ticket_priority DEFAULT 'medium',
  status ticket_status DEFAULT 'open',
  category ticket_category DEFAULT 'general',
  assigned_to uuid REFERENCES users(id),
  attachments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create support_responses table
CREATE TABLE IF NOT EXISTS support_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  message text NOT NULL,
  is_admin_response boolean DEFAULT false,
  attachments text[],
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_responses ENABLE ROW LEVEL SECURITY;

-- Policies for support_tickets
CREATE POLICY "Users can read own tickets"
  ON support_tickets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets"
  ON support_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all tickets"
  ON support_tickets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Policies for support_responses
CREATE POLICY "Users can read responses for own tickets"
  ON support_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create responses for own tickets"
  ON support_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all responses"
  ON support_responses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Triggers
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();