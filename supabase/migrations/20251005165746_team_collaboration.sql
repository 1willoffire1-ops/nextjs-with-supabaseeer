-- Team Members Table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user', 'viewer')),
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  permissions JSONB DEFAULT '{"canFix": true, "canUpload": true, "canExport": true, "canInvite": false}',
  last_active TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team Invitations Table
CREATE TABLE team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  invited_by UUID REFERENCES users(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activity Log Table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_team_members_company ON team_members(company_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_status ON team_members(status);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
CREATE INDEX idx_team_invitations_token ON team_invitations(token);
CREATE INDEX idx_activity_log_company ON activity_log(company_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at);

-- RLS Policies
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Team members can view their own team
CREATE POLICY "Users can view their team members"
  ON team_members FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Admins can manage team members
CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE user_id = auth.uid()
      AND role = 'admin'
      AND company_id = team_members.company_id
    )
  );

-- Only admins can invite
CREATE POLICY "Admins can invite team members"
  ON team_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE user_id = auth.uid()
      AND role = 'admin'
      AND company_id = team_invitations.company_id
    )
  );

-- Users can view their invitations
CREATE POLICY "Users can view invitations"
  ON team_invitations FOR SELECT
  USING (
    email = (SELECT email FROM users WHERE id = auth.uid())
    OR
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Users can view their company's activity log
CREATE POLICY "Users can view company activity log"
  ON activity_log FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- All authenticated users can insert activity logs
CREATE POLICY "Users can insert activity logs"
  ON activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update last_active timestamp
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE team_members
  SET last_active = NOW()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_active on activity
CREATE TRIGGER trigger_update_last_active
  AFTER INSERT ON activity_log
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();

-- Function to clean up expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS void AS $$
BEGIN
  DELETE FROM team_invitations
  WHERE expires_at < NOW() AND accepted = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE team_members IS 'Stores team member information with role-based access control';
COMMENT ON TABLE team_invitations IS 'Manages pending team member invitations';
COMMENT ON TABLE activity_log IS 'Audit trail for all user actions in the system';
COMMENT ON COLUMN team_members.permissions IS 'JSON object containing granular permissions for the user';
COMMENT ON COLUMN activity_log.details IS 'JSON object containing action-specific details';