-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enhanced users table for VATANA
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  company_name VARCHAR NOT NULL,
  vat_id VARCHAR,
  country_code VARCHAR(2) NOT NULL DEFAULT 'RO',
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  plan_tier VARCHAR DEFAULT 'free' CHECK (plan_tier IN ('free', 'professional', 'enterprise')),
  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,
  subscription_status VARCHAR,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uploads table
CREATE TABLE public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  filename VARCHAR NOT NULL,
  file_type VARCHAR NOT NULL,
  file_size BIGINT,
  period VARCHAR, -- YYYY-MM format
  row_count INTEGER DEFAULT 0,
  processed BOOLEAN DEFAULT false,
  errors_found INTEGER DEFAULT 0,
  processing_status VARCHAR DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  processing_progress INTEGER DEFAULT 0 CHECK (processing_progress >= 0 AND processing_progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID REFERENCES public.uploads(id) ON DELETE CASCADE NOT NULL,
  invoice_id VARCHAR NOT NULL,
  date DATE NOT NULL,
  customer_name VARCHAR,
  customer_vat_id VARCHAR,
  customer_country VARCHAR(2) NOT NULL,
  net_amount DECIMAL(12,2) NOT NULL CHECK (net_amount >= 0),
  vat_rate_percent DECIMAL(5,2) NOT NULL CHECK (vat_rate_percent >= 0 AND vat_rate_percent <= 100),
  vat_amount DECIMAL(12,2) NOT NULL CHECK (vat_amount >= 0),
  product_type VARCHAR DEFAULT 'goods' CHECK (product_type IN ('goods', 'services', 'digital_service')),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'error', 'fixed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VAT errors table
CREATE TABLE public.vat_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  error_type VARCHAR NOT NULL,
  severity VARCHAR DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  penalty_risk_eur DECIMAL(10,2) DEFAULT 0 CHECK (penalty_risk_eur >= 0),
  suggested_fix TEXT,
  auto_fixable BOOLEAN DEFAULT false,
  resolved BOOLEAN DEFAULT false,
  confidence_score DECIMAL(3,2) DEFAULT 0.95,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_plan_tier ON public.users(plan_tier);
CREATE INDEX idx_uploads_user_id ON public.uploads(user_id);
CREATE INDEX idx_uploads_status ON public.uploads(processing_status);
CREATE INDEX idx_invoices_upload_id ON public.invoices(upload_id);
CREATE INDEX idx_invoices_country ON public.invoices(customer_country);
CREATE INDEX idx_vat_errors_invoice_id ON public.vat_errors(invoice_id);
CREATE INDEX idx_vat_errors_resolved ON public.vat_errors(resolved);
CREATE INDEX idx_vat_errors_severity ON public.vat_errors(severity);

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vat_errors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own uploads" ON public.uploads
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own uploads" ON public.uploads
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (
    upload_id IN (SELECT id FROM public.uploads WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own errors" ON public.vat_errors
  FOR SELECT USING (
    invoice_id IN (
      SELECT i.id FROM public.invoices i
      JOIN public.uploads u ON i.upload_id = u.id
      WHERE u.user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_uploads_updated_at
  BEFORE UPDATE ON public.uploads
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- User creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    company_name,
    vat_id,
    country_code
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Unnamed Company'),
    NEW.raw_user_meta_data->>'vat_id',
    COALESCE(NEW.raw_user_meta_data->>'country_code', 'RO')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Cost Savings Tracking Table
CREATE TABLE public.cost_savings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  period TEXT NOT NULL, -- e.g., "2024-Q1"
  
  -- Savings breakdown
  total_errors_fixed INTEGER DEFAULT 0,
  total_penalty_avoided DECIMAL(12,2) DEFAULT 0,
  auto_fix_count INTEGER DEFAULT 0,
  manual_fix_count INTEGER DEFAULT 0,
  
  -- Time savings
  processing_time_saved_hours DECIMAL(10,2) DEFAULT 0,
  estimated_manual_cost DECIMAL(12,2) DEFAULT 0,
  
  -- Comparison metrics
  traditional_method_cost DECIMAL(12,2) DEFAULT 0,
  vatana_cost DECIMAL(12,2) DEFAULT 0,
  net_savings DECIMAL(12,2) DEFAULT 0,
  roi_percentage DECIMAL(5,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix History Table
CREATE TABLE public.fix_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  error_id UUID REFERENCES public.vat_errors(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  
  -- Fix details
  fix_type TEXT NOT NULL, -- 'auto', 'manual', 'bulk'
  fix_strategy TEXT NOT NULL, -- 'recalculate_vat', 'apply_reverse_charge', etc.
  
  -- Before/After values
  before_value JSONB NOT NULL,
  after_value JSONB NOT NULL,
  
  -- Financial impact
  penalty_avoided DECIMAL(12,2) NOT NULL,
  time_saved_minutes INTEGER DEFAULT 0,
  
  -- Metadata
  fixed_at TIMESTAMPTZ DEFAULT NOW(),
  can_undo BOOLEAN DEFAULT TRUE,
  undone BOOLEAN DEFAULT FALSE,
  undone_at TIMESTAMPTZ
);

-- Notifications Table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification details
  type TEXT NOT NULL, -- 'error_alert', 'deadline_reminder', 'savings_report', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'critical'
  
  -- Delivery
  sent_via TEXT[], -- ['email', 'in_app']
  sent_at TIMESTAMPTZ,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Action link
  action_url TEXT,
  action_label TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Additional Indexes for new tables
CREATE INDEX idx_cost_savings_company_id ON public.cost_savings(company_id);
CREATE INDEX idx_cost_savings_user_id ON public.cost_savings(user_id);
CREATE INDEX idx_cost_savings_period ON public.cost_savings(period);
CREATE INDEX idx_fix_history_company_id ON public.fix_history(company_id);
CREATE INDEX idx_fix_history_user_id ON public.fix_history(user_id);
CREATE INDEX idx_fix_history_error_id ON public.fix_history(error_id);
CREATE INDEX idx_fix_history_invoice_id ON public.fix_history(invoice_id);
CREATE INDEX idx_notifications_company_id ON public.notifications(company_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- Row Level Security for new tables
ALTER TABLE public.cost_savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fix_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "Users can view their own cost savings" ON public.cost_savings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cost savings" ON public.cost_savings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cost savings" ON public.cost_savings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own fix history" ON public.fix_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fix history" ON public.fix_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fix history" ON public.fix_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_cost_savings_updated_at
  BEFORE UPDATE ON public.cost_savings
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add company_id column to existing users table if needed
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_id UUID DEFAULT gen_random_uuid();
CREATE INDEX IF NOT EXISTS idx_users_company_id ON public.users(company_id);
