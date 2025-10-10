-- Safe VAT Validations Migration Script
-- This script checks for existing tables before creating them

-- Check if vat_validations table exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'vat_validations') THEN
    
    -- Create VAT Validations Table
    CREATE TABLE vat_validations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vat_number TEXT NOT NULL,
      country_code TEXT NOT NULL,
      company_name TEXT,
      address TEXT,
      is_valid BOOLEAN,
      validation_source TEXT DEFAULT 'VIES',
      consultation_number TEXT,
      error_message TEXT,
      validated_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT vat_validations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_vat_validations_user_id ON vat_validations(user_id);
    CREATE INDEX IF NOT EXISTS idx_vat_validations_vat_number ON vat_validations(vat_number);
    CREATE INDEX IF NOT EXISTS idx_vat_validations_created_at ON vat_validations(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_vat_validations_is_valid ON vat_validations(is_valid);

    -- Enable RLS
    ALTER TABLE vat_validations ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies
    CREATE POLICY "Users can view their own VAT validations"
      ON vat_validations FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own VAT validations"
      ON vat_validations FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own VAT validations"
      ON vat_validations FOR DELETE
      USING (auth.uid() = user_id);

    -- Add comments
    COMMENT ON TABLE vat_validations IS 'Stores VAT number validation history with results from VIES or other sources';
    COMMENT ON COLUMN vat_validations.consultation_number IS 'Unique consultation number from VIES as proof of validation';
    COMMENT ON COLUMN vat_validations.validation_source IS 'Source of validation: VIES, Manual, or other service';

    RAISE NOTICE 'VAT validations table created successfully';
  ELSE
    RAISE NOTICE 'VAT validations table already exists, skipping creation';
  END IF;
END $$;