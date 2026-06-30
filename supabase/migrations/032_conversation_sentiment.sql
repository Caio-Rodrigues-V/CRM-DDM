-- 032_conversation_sentiment.sql
-- Add sentiment analysis column to conversations

ALTER TABLE wacrm.conversations 
  ADD COLUMN IF NOT EXISTS sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative', 'mixed', 'unknown')) DEFAULT 'unknown';
