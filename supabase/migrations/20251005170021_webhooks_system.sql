-- Webhooks Table
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Deliveries Table
CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  response_code INTEGER,
  response_body TEXT,
  error_message TEXT,
  attempt_count INTEGER DEFAULT 1,
  delivered_at TIMESTAMP DEFAULT NOW(),
  next_retry_at TIMESTAMP
);

-- Webhook Events Queue (for async processing)
CREATE TABLE webhook_events_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_webhooks_company ON webhooks(company_id);
CREATE INDEX idx_webhooks_active ON webhooks(active);
CREATE INDEX idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_created ON webhook_deliveries(delivered_at);
CREATE INDEX idx_webhook_events_queue_processed ON webhook_events_queue(processed);
CREATE INDEX idx_webhook_events_queue_company ON webhook_events_queue(company_id);

-- RLS Policies
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events_queue ENABLE ROW LEVEL SECURITY;

-- Users can view their company's webhooks
CREATE POLICY "Users can view company webhooks"
  ON webhooks FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Admins can manage webhooks
CREATE POLICY "Admins can manage webhooks"
  ON webhooks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE user_id = auth.uid()
      AND role = 'admin'
      AND company_id = webhooks.company_id
    )
  );

-- Users can view their webhook deliveries
CREATE POLICY "Users can view webhook deliveries"
  ON webhook_deliveries FOR SELECT
  USING (
    webhook_id IN (
      SELECT id FROM webhooks
      WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- System can insert events
CREATE POLICY "System can insert events"
  ON webhook_events_queue FOR INSERT
  WITH CHECK (true);

-- Function to update webhook timestamp
CREATE OR REPLACE FUNCTION update_webhook_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update webhooks timestamp
CREATE TRIGGER trigger_update_webhook_timestamp
  BEFORE UPDATE ON webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_timestamp();

-- Function to clean up old deliveries (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_deliveries()
RETURNS void AS $$
BEGIN
  DELETE FROM webhook_deliveries
  WHERE delivered_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE webhooks IS 'Webhook subscriptions for real-time event notifications';
COMMENT ON TABLE webhook_deliveries IS 'Log of all webhook delivery attempts';
COMMENT ON TABLE webhook_events_queue IS 'Queue for async webhook event processing';
COMMENT ON COLUMN webhooks.secret IS 'HMAC secret for webhook signature verification';
COMMENT ON COLUMN webhook_deliveries.attempt_count IS 'Number of delivery attempts made';