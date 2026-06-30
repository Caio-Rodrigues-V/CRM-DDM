-- 030_deal_aging_rules.sql
-- Table and functions to store and run stage-aging automations (e.g. move to Lead Frio after X days)

CREATE TABLE IF NOT EXISTS wacrm.deal_aging_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES wacrm.accounts(id) ON DELETE CASCADE,
  source_stage_id UUID NOT NULL REFERENCES wacrm.pipeline_stages(id) ON DELETE CASCADE,
  target_stage_id UUID NOT NULL REFERENCES wacrm.pipeline_stages(id) ON DELETE CASCADE,
  days_limit INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wacrm.deal_aging_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage deal aging rules" ON wacrm.deal_aging_rules;
CREATE POLICY "Users can manage deal aging rules" ON wacrm.deal_aging_rules FOR ALL
  USING (wacrm.is_account_member(account_id));

-- Function to run all aging rules for an account
CREATE OR REPLACE FUNCTION wacrm.run_all_deal_aging_rules(p_account_id UUID)
RETURNS TABLE (
  rule_id UUID,
  moved_count INT
) AS $$
DECLARE
  v_rule RECORD;
  v_moved INT;
BEGIN
  FOR v_rule IN 
    SELECT id, source_stage_id, target_stage_id, days_limit 
    FROM wacrm.deal_aging_rules 
    WHERE account_id = p_account_id
  LOOP
    v_moved := wacrm.move_stale_deals(v_rule.source_stage_id, v_rule.target_stage_id, v_rule.days_limit);
    
    rule_id := v_rule.id;
    moved_count := v_moved;
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
