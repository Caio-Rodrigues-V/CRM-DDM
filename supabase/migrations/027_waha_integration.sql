-- ============================================================
-- WAHA (WhatsApp HTTP API) integration
--
-- What this migration adds:
--
--   1. `provider` - type of WhatsApp provider: 'meta' or 'waha'
--   2. `waha_url` - target URL for the WAHA instance
--   3. `waha_session` - session ID/name configured in WAHA
--   4. `waha_api_key` - optional API token/key for WAHA security
-- ============================================================

ALTER TABLE wacrm.whatsapp_config 
  ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'meta' CHECK (provider IN ('meta', 'waha')),
  ADD COLUMN IF NOT EXISTS waha_url TEXT,
  ADD COLUMN IF NOT EXISTS waha_session TEXT,
  ADD COLUMN IF NOT EXISTS waha_api_key TEXT;

-- Re-grant schema permissions to roles so the new columns are queryable
GRANT ALL ON ALL TABLES IN SCHEMA wacrm TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA wacrm TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA wacrm TO anon, authenticated, service_role;
