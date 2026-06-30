-- 031_ai_agent_config.sql
-- Table to store AI chatbot agent configuration for each account

CREATE TABLE IF NOT EXISTS wacrm.ai_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES wacrm.accounts(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  api_provider TEXT NOT NULL DEFAULT 'gemini' CHECK (api_provider IN ('gemini', 'openai', 'claude', 'hermes')),
  api_key TEXT,
  system_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id)
);

-- Enable RLS
ALTER TABLE wacrm.ai_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own AI config" ON wacrm.ai_config;
CREATE POLICY "Users can manage own AI config" ON wacrm.ai_config FOR ALL
  USING (wacrm.is_account_member(account_id));
