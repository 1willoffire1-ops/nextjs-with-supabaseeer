# Apply VAT Validations Migration to Supabase

## 🎯 Quick Instructions

Since some migrations are already applied, here's how to manually apply the new VAT validations table:

### Option 1: Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**:
   - URL: https://app.supabase.com/project/trojfnjtcwjitlziurkl
   - Navigate to: **SQL Editor**

2. **Create New Query**:
   - Click "+ New query"

3. **Copy and paste this SQL**:

```sql
-- VAT Validations Table
CREATE TABLE IF NOT EXISTS vat_validations (
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
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vat_validations_user_id ON vat_validations(user_id);
CREATE INDEX IF NOT EXISTS idx_vat_validations_vat_number ON vat_validations(vat_number);
CREATE INDEX IF NOT EXISTS idx_vat_validations_created_at ON vat_validations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vat_validations_is_valid ON vat_validations(is_valid);

-- RLS Policies
ALTER TABLE vat_validations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own VAT validations" ON vat_validations;
DROP POLICY IF EXISTS "Users can insert their own VAT validations" ON vat_validations;
DROP POLICY IF EXISTS "Users can delete their own VAT validations" ON vat_validations;

-- Users can view their own validations
CREATE POLICY "Users can view their own VAT validations"
  ON vat_validations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own validations
CREATE POLICY "Users can insert their own VAT validations"
  ON vat_validations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own validations
CREATE POLICY "Users can delete their own VAT validations"
  ON vat_validations FOR DELETE
  USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE vat_validations IS 'Stores VAT number validation history with results from VIES or other sources';
COMMENT ON COLUMN vat_validations.consultation_number IS 'Unique consultation number from VIES as proof of validation';
COMMENT ON COLUMN vat_validations.validation_source IS 'Source of validation: VIES, Manual, or other service';
```

4. **Run the Query**:
   - Click "Run" or press `Ctrl+Enter`
   - You should see: "Success. No rows returned"

5. **Verify**:
   - Go to **Table Editor**
   - Look for `vat_validations` table
   - Confirm it has all columns

### Option 2: Using psql (Advanced)

If you have PostgreSQL client installed:

```bash
# Get your connection string from Supabase Dashboard > Project Settings > Database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.trojfnjtcwjitlziurkl.supabase.co:5432/postgres" \
  -f supabase/migrations/20251009000000_create_vat_validations.sql
```

### Option 3: Supabase CLI (After fixing migrations)

```bash
# Mark existing migrations as applied
supabase migration repair 20251005165746_team_collaboration.sql --status applied
supabase migration repair 20251005170021_webhooks_system.sql --status applied

# Then push only the new migration
supabase db push
```

---

## ✅ Verification

After applying the migration, verify it worked:

1. **Check Table Exists**:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_name = 'vat_validations';
   ```

2. **Check RLS is Enabled**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'vat_validations';
   ```
   Should return: `rowsecurity = true`

3. **Check Policies**:
   ```sql
   SELECT policyname 
   FROM pg_policies 
   WHERE tablename = 'vat_validations';
   ```
   Should return 3 policies

4. **Test Insert** (from your app):
   - Go to `/validation` page
   - Validate a VAT number
   - Check if it saves to database

---

## 🔧 Troubleshooting

### "Table already exists" error
If you see this error, the table is already created. Just verify the RLS policies exist:

```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'vat_validations';
```

### "Permission denied" error
Make sure you're running the query as a Supabase admin user in the SQL Editor.

### "Function does not exist" error
Make sure the `auth.uid()` function is available. It should be by default in Supabase.

---

## 📊 What This Migration Does

1. **Creates `vat_validations` table** to store:
   - VAT numbers and validation results
   - Company information from VIES
   - Validation history
   - Error messages if validation fails

2. **Adds performance indexes** for:
   - Fast lookups by user
   - Fast lookups by VAT number
   - Efficient date-based queries
   - Filtering by validation status

3. **Configures Row Level Security** so:
   - Users can only see their own validations
   - Users can only insert their own validations
   - Users can only delete their own validations
   - Admin access remains unrestricted

4. **Enables the VAT Validation API** at:
   - `POST /api/validation/vat` - Validate a VAT number
   - `GET /api/validation/vat` - Get validation history

---

## 🎉 Success!

Once applied, you should be able to:
- ✅ Validate VAT numbers on `/validation` page
- ✅ See real-time VIES validation results
- ✅ View validation history
- ✅ Store validation proof (consultation numbers)

The migration is safe to run multiple times thanks to `IF NOT EXISTS` clauses.
