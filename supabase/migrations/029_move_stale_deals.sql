-- 029_move_stale_deals.sql
-- Function to move deals that have been stuck in a specific stage for X days to a target stage (e.g. Lead Frio)

CREATE OR REPLACE FUNCTION wacrm.move_stale_deals(
  p_source_stage_id UUID,
  p_target_stage_id UUID,
  p_days_limit INT
)
RETURNS INT AS $$
DECLARE
  v_updated_count INT;
BEGIN
  UPDATE wacrm.deals
  SET stage_id = p_target_stage_id,
      updated_at = NOW()
  WHERE stage_id = p_source_stage_id
    AND status = 'open'
    AND updated_at < NOW() - (p_days_limit || ' days')::INTERVAL;
    
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  RETURN v_updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
