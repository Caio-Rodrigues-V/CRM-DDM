-- 028_auto_create_deals.sql
-- Automate deal creation for new contacts in the first pipeline stage of their account

CREATE OR REPLACE FUNCTION wacrm.create_deal_for_new_contact()
RETURNS TRIGGER AS $$
DECLARE
  v_pipeline_id UUID;
  v_stage_id UUID;
BEGIN
  -- 1. Find a pipeline for this account (the first one by created_at)
  SELECT id INTO v_pipeline_id
  FROM wacrm.pipelines
  WHERE account_id = NEW.account_id
  ORDER BY created_at ASC
  LIMIT 1;

  -- 2. If a pipeline is found, find its first stage (lowest position)
  IF v_pipeline_id IS NOT NULL THEN
    SELECT id INTO v_stage_id
    FROM wacrm.pipeline_stages
    WHERE pipeline_id = v_pipeline_id
    ORDER BY position ASC, created_at ASC
    LIMIT 1;

    -- 3. If a stage is found, insert a new deal
    IF v_stage_id IS NOT NULL THEN
      -- Check if a deal already exists for this contact to prevent duplicates
      IF NOT EXISTS (
        SELECT 1 FROM wacrm.deals
        WHERE contact_id = NEW.id AND pipeline_id = v_pipeline_id
      ) THEN
        INSERT INTO wacrm.deals (
          user_id,
          account_id,
          pipeline_id,
          stage_id,
          contact_id,
          title,
          value,
          status
        ) VALUES (
          NEW.user_id,
          NEW.account_id,
          v_pipeline_id,
          v_stage_id,
          NEW.id,
          COALESCE(NEW.name, NEW.phone),
          0,
          'open'
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_create_deal_for_new_contact ON wacrm.contacts;
CREATE TRIGGER trigger_create_deal_for_new_contact
AFTER INSERT ON wacrm.contacts
FOR EACH ROW
EXECUTE FUNCTION wacrm.create_deal_for_new_contact();
