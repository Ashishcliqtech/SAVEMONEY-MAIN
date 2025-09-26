-- DEV ONLY: Allow all selects from users table
CREATE POLICY "Allow all select (dev)" ON users FOR SELECT TO public USING (true);
