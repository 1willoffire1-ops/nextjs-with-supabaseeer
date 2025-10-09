-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vat_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vat_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Uploads table policies
CREATE POLICY "Users can read own uploads" ON public.uploads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own uploads" ON public.uploads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own uploads" ON public.uploads
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploads" ON public.uploads
    FOR DELETE USING (auth.uid() = user_id);

-- Invoices table policies
CREATE POLICY "Users can read own invoices" ON public.invoices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.uploads 
            WHERE uploads.id = invoices.upload_id 
            AND uploads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create invoices for own uploads" ON public.invoices
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.uploads 
            WHERE uploads.id = invoices.upload_id 
            AND uploads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own invoices" ON public.invoices
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.uploads 
            WHERE uploads.id = invoices.upload_id 
            AND uploads.user_id = auth.uid()
        )
    );

-- VAT errors table policies  
CREATE POLICY "Users can read own vat errors" ON public.vat_errors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.invoices 
            JOIN public.uploads ON uploads.id = invoices.upload_id
            WHERE invoices.id = vat_errors.invoice_id 
            AND uploads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create vat errors for own invoices" ON public.vat_errors
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.invoices 
            JOIN public.uploads ON uploads.id = invoices.upload_id
            WHERE invoices.id = vat_errors.invoice_id 
            AND uploads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own vat errors" ON public.vat_errors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.invoices 
            JOIN public.uploads ON uploads.id = invoices.upload_id
            WHERE invoices.id = vat_errors.invoice_id 
            AND uploads.user_id = auth.uid()
        )
    );

-- VAT validations table policies (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vat_validations') THEN
        EXECUTE '
        CREATE POLICY "Users can read own vat validations" ON public.vat_validations
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can create own vat validations" ON public.vat_validations
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update own vat validations" ON public.vat_validations
            FOR UPDATE USING (auth.uid() = user_id);
        ';
    END IF;
END
$$;

-- Push subscriptions policies (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'push_subscriptions') THEN
        EXECUTE '
        CREATE POLICY "Users can manage own push subscriptions" ON public.push_subscriptions
            FOR ALL USING (auth.uid() = user_id);
        ';
    END IF;
END
$$;

-- Team members policies (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'team_members') THEN
        EXECUTE '
        CREATE POLICY "Team members can read team data" ON public.team_members
            FOR SELECT USING (
                auth.uid() = user_id OR 
                EXISTS (
                    SELECT 1 FROM public.users 
                    WHERE users.id = auth.uid() 
                    AND users.company_id = team_members.company_id
                )
            );
        
        CREATE POLICY "Admins can manage team members" ON public.team_members
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.team_members tm
                    WHERE tm.user_id = auth.uid() 
                    AND tm.company_id = team_members.company_id
                    AND tm.role IN (''admin'', ''owner'')
                )
            );
        ';
    END IF;
END
$$;

-- Webhooks policies (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'webhooks') THEN
        EXECUTE '
        CREATE POLICY "Users can manage own webhooks" ON public.webhooks
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.users 
                    WHERE users.id = auth.uid() 
                    AND users.company_id = webhooks.company_id
                )
            );
        ';
    END IF;
END
$$;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant select/insert/update permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.users (
        id, 
        email, 
        company_name,
        country_code,
        health_score
    ) VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'company_name', 'Unknown Company'),
        COALESCE(NEW.raw_user_meta_data->>'country_code', 'US'),
        100
    );
    RETURN NEW;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- Create demo data insertion function (optional for testing)
CREATE OR REPLACE FUNCTION public.create_demo_data(user_email text DEFAULT 'demo@vatana.io')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    demo_user_id uuid;
    demo_upload_id uuid;
    demo_invoice_id uuid;
BEGIN
    -- Create demo user if not exists
    INSERT INTO public.users (
        id, 
        email, 
        company_name, 
        country_code, 
        health_score,
        plan_tier
    ) VALUES (
        gen_random_uuid(),
        user_email,
        'Demo VAT Company',
        'NL',
        87,
        'pro'
    ) 
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO demo_user_id;
    
    -- Get the user ID if it already existed
    IF demo_user_id IS NULL THEN
        SELECT id INTO demo_user_id FROM public.users WHERE email = user_email;
    END IF;
    
    -- Create demo upload
    INSERT INTO public.uploads (
        id,
        user_id,
        filename,
        file_type,
        file_size,
        row_count,
        processed,
        processing_status,
        errors_found,
        period
    ) VALUES (
        gen_random_uuid(),
        demo_user_id,
        'demo-invoices-q4-2024.csv',
        'text/csv',
        15680,
        47,
        true,
        'completed',
        3,
        '2024-Q4'
    )
    RETURNING id INTO demo_upload_id;
    
    -- Create demo invoices
    FOR i IN 1..5 LOOP
        INSERT INTO public.invoices (
            id,
            upload_id,
            invoice_id,
            customer_name,
            customer_country,
            customer_vat_id,
            date,
            net_amount,
            vat_amount,
            vat_rate_percent,
            product_type,
            status
        ) VALUES (
            gen_random_uuid(),
            demo_upload_id,
            'INV-2024-' || LPAD(i::text, 4, '0'),
            CASE i 
                WHEN 1 THEN 'Tech Solutions BV'
                WHEN 2 THEN 'Digital Marketing GmbH'
                WHEN 3 THEN 'European Logistics SA'
                WHEN 4 THEN 'Innovation Labs Ltd'
                ELSE 'Global Services AB'
            END,
            CASE i 
                WHEN 1 THEN 'NL'
                WHEN 2 THEN 'DE'
                WHEN 3 THEN 'FR'
                WHEN 4 THEN 'UK'
                ELSE 'SE'
            END,
            CASE i 
                WHEN 1 THEN 'NL123456789B01'
                WHEN 2 THEN 'DE987654321'
                WHEN 3 THEN 'FR45678912345'
                WHEN 4 THEN 'GB123456789'
                ELSE 'SE556789012301'
            END,
            CURRENT_DATE - INTERVAL '30 days' + (i * INTERVAL '5 days'),
            1000 + (i * 250),
            (1000 + (i * 250)) * 0.21,
            21,
            'Software License',
            CASE WHEN i <= 3 THEN 'valid' ELSE 'error' END
        ) RETURNING id INTO demo_invoice_id;
        
        -- Create some demo errors for the last 2 invoices
        IF i > 3 THEN
            INSERT INTO public.vat_errors (
                id,
                invoice_id,
                error_type,
                severity,
                description,
                suggested_fix,
                penalty_risk_eur,
                resolved
            ) VALUES (
                gen_random_uuid(),
                demo_invoice_id,
                CASE WHEN i = 4 THEN 'vat_rate_mismatch' ELSE 'missing_vat_id' END,
                CASE WHEN i = 4 THEN 'high' ELSE 'medium' END,
                CASE WHEN i = 4 THEN 'VAT rate should be 20% for UK customers' ELSE 'Customer VAT ID is required for B2B transactions' END,
                CASE WHEN i = 4 THEN 'Update VAT rate to 20%' ELSE 'Request valid VAT ID from customer' END,
                CASE WHEN i = 4 THEN 150.00 ELSE 75.00 END,
                false
            );
        END IF;
    END LOOP;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON public.uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_upload_id ON public.invoices(upload_id);
CREATE INDEX IF NOT EXISTS idx_vat_errors_invoice_id ON public.vat_errors(invoice_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON public.users(company_id);

-- Comments
COMMENT ON TABLE public.users IS 'User profiles and company information';
COMMENT ON TABLE public.uploads IS 'File uploads and processing status';  
COMMENT ON TABLE public.invoices IS 'Invoice data extracted from uploads';
COMMENT ON TABLE public.vat_errors IS 'VAT compliance errors detected in invoices';
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user profile when new auth user is created';
COMMENT ON FUNCTION public.create_demo_data(text) IS 'Creates demo data for testing and demonstrations';