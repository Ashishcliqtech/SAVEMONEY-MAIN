-- DEV ONLY: Allow all inserts to users table
CREATE POLICY "Allow all inserts (dev)" ON users FOR INSERT TO public WITH CHECK (true);
