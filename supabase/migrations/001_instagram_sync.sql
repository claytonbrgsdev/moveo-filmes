-- Migration: Add Instagram sync support
-- Run this in Supabase SQL Editor

-- Add Instagram-specific columns to posts table (if they don't exist)
-- Note: The existing 'tipo' column will be used for category ('instagram', 'manual', etc.)

-- Create index for faster lookups by tipo (category)
CREATE INDEX IF NOT EXISTS idx_posts_tipo ON posts(tipo);

-- Create sync log table for tracking Instagram syncs
CREATE TABLE IF NOT EXISTS instagram_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL,
  posts_synced INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on sync log table
ALTER TABLE instagram_sync_log ENABLE ROW LEVEL SECURITY;

-- Allow service role to read/write sync logs
CREATE POLICY "Service role can manage sync logs"
  ON instagram_sync_log
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE instagram_sync_log IS 'Tracks Instagram sync operations for monitoring and debugging';
COMMENT ON COLUMN instagram_sync_log.sync_type IS 'Type of sync: polling, webhook, or manual';
COMMENT ON COLUMN instagram_sync_log.status IS 'Status: success, error, or partial';
COMMENT ON COLUMN instagram_sync_log.posts_synced IS 'Number of posts successfully synced';
COMMENT ON COLUMN instagram_sync_log.error_message IS 'Error details if sync failed or was partial';

-- Enable pg_net extension for HTTP requests from database (if needed for cron)
-- Note: This may already be enabled on Supabase
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- Example cron job setup (run this after enabling pg_cron extension):
-- SELECT cron.schedule(
--   'instagram-sync-hourly',
--   '0 * * * *',
--   $$
--   SELECT net.http_post(
--     url := 'https://<your-project-ref>.supabase.co/functions/v1/instagram-sync',
--     headers := '{"Authorization": "Bearer <your-service-role-key>", "Content-Type": "application/json"}'::jsonb,
--     body := '{}'::jsonb
--   );
--   $$
-- );
