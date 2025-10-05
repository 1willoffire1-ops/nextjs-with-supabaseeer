# Getting Started with VATANA

Welcome to VATANA - your AI-powered VAT compliance assistant for Ireland! 🇮🇪

---

## Quick Start (5 minutes)

### 1. Create Your Account

1. Go to [vatana.ie](https://vatana.ie)
2. Click **"Sign Up"** in the top right
3. Enter your details:
   - Email address
   - Company name
   - Password (minimum 8 characters)
4. Verify your email address
5. Complete your profile (optional but recommended)

**First-time users get a 14-day free trial!** ✨

---

### 2. Upload Your First Invoice File

#### Prepare Your File
- **Supported formats:** CSV, XLSX, XLS
- **Maximum size:** 50 MB
- **See below for required columns**

#### Upload Steps
1. Click the **"Upload"** button on the dashboard
2. Drag & drop your file, or click to browse
3. Select your invoice CSV/Excel file
4. Click **"Analyze VAT Issues"**
5. Wait 30-60 seconds for AI analysis

**💡 Tip:** Don't have a file ready? [Download our sample CSV](../samples/sample-invoices.csv)

---

### 3. Review Detected Errors

After processing, you'll see:

#### Dashboard Overview
- **Total Invoices:** Number processed
- **Issues Found:** VAT compliance errors detected
- **Critical Issues:** High-priority problems
- **Penalty Risk:** Estimated fines avoided (in €)
- **Compliance Score:** Overall health rating

#### Error Details
Each error shows:
- 🚨 **Severity Level:** Critical, High, Medium, or Low
- 📄 **Invoice ID:** Which invoice has the issue
- 💰 **Penalty Risk:** Estimated fine for this error
- 🔧 **Suggested Fix:** AI-recommended solution
- ✅ **Auto-Fix Available:** Can be fixed automatically

---

### 4. Fix Errors

#### Manual Review & Fix
1. Click on any error to see full details
2. Review the **"Suggested Fix"**
3. Click **"Fix Error"** button
4. Preview the proposed change
5. Click **"Apply Fix"** to confirm

#### Bulk Auto-Fix (Premium)
1. Select multiple errors with checkboxes
2. Click **"Auto-Fix Selected"**
3. Review all proposed changes
4. Confirm bulk application
5. See your savings increase! 💰

---

## CSV File Format

### Required Columns

Your CSV file **must** include these columns:

| Column Name | Description | Example | Required |
|-------------|-------------|---------|----------|
| `invoice_id` | Unique invoice identifier | INV-2024-001 | ✅ Yes |
| `date` | Invoice date | 2024-01-15 | ✅ Yes |
| `customer_name` | Customer/client name | Acme Corp Ltd | ✅ Yes |
| `customer_country` | 2-letter country code | IE, GB, FR | ✅ Yes |
| `customer_vat` | Customer VAT number | IE1234567X | ⚠️ Recommended |
| `net_amount` | Amount before VAT | 1000.00 | ✅ Yes |
| `vat_rate` | VAT rate as decimal | 0.23 (for 23%) | ✅ Yes |
| `vat_amount` | VAT amount charged | 230.00 | ✅ Yes |
| `gross_amount` | Total including VAT | 1230.00 | ⚠️ Recommended |
| `product_type` | Goods or Services | Services | ⚠️ Recommended |
| `invoice_currency` | Currency code | EUR | ⚠️ Recommended |

### Optional but Helpful Columns

- `description` - Product/service description
- `quantity` - Number of items
- `unit_price` - Price per item
- `supplier_vat` - Your VAT number
- `reverse_charge` - True/False for reverse charge
- `exemption_reason` - If VAT exempt

### Date Formats Supported

VATANA accepts various date formats:
- `YYYY-MM-DD` (recommended): 2024-01-15
- `DD/MM/YYYY`: 15/01/2024
- `MM/DD/YYYY`: 01/15/2024
- `DD-MMM-YYYY`: 15-Jan-2024

### Example CSV Format

```csv
invoice_id,date,customer_name,customer_country,customer_vat,net_amount,vat_rate,vat_amount,gross_amount,product_type
INV-001,2024-01-15,Acme Corp Ltd,IE,IE1234567X,1000.00,0.23,230.00,1230.00,Services
INV-002,2024-01-16,Tech Solutions,GB,GB987654321,2500.00,0.23,575.00,3075.00,Goods
INV-003,2024-01-17,Dublin Restaurant,IE,IE9876543Z,500.00,0.135,67.50,567.50,Services
```

**📥 [Download Sample CSV Template](../samples/sample-invoices.csv)**

---

## Common VAT Issues Detected

VATANA automatically detects:

### 1. Missing VAT Numbers ⚠️
- **Problem:** Invoice missing customer VAT number
- **Risk:** High - Revenue may reject
- **Fix:** Add valid VAT number

### 2. Incorrect VAT Rates 🔴
- **Problem:** Wrong VAT rate applied
- **Risk:** Critical - Penalties up to €4,000
- **Standard rate:** 23%
- **Reduced rate:** 13.5%
- **Second reduced rate:** 9%
- **Zero rate:** 0%

### 3. Invalid VAT Number Format ⚠️
- **Problem:** VAT number doesn't match Irish format
- **Risk:** Medium - Audit issues
- **Irish format:** IE + 7 digits + 1-2 letters (e.g., IE1234567X)

### 4. Missing Invoice Details ⚠️
- **Problem:** Required fields blank or invalid
- **Risk:** Medium - Compliance failure
- **Fix:** Complete all required fields

### 5. Calculation Errors 🔴
- **Problem:** VAT amount doesn't match rate × net amount
- **Risk:** High - Incorrect VAT reporting
- **Fix:** Recalculate VAT amounts

### 6. Date Format Issues ⚠️
- **Problem:** Invalid or ambiguous dates
- **Risk:** Low - Processing errors
- **Fix:** Use YYYY-MM-DD format

### 7. Reverse Charge Errors ⚠️
- **Problem:** Reverse charge not applied correctly
- **Risk:** High - Double taxation
- **Fix:** Apply reverse charge rules

---

## Understanding Your Compliance Score

VATANA calculates your compliance score based on:

- **100%** = Perfect compliance, no issues
- **90-99%** = Excellent - Minor issues only
- **75-89%** = Good - Some attention needed
- **50-74%** = Fair - Action required
- **Below 50%** = Poor - Urgent action needed

### How It's Calculated

```
Compliance Score = (Valid Invoices / Total Invoices) × 100
```

Weighted by severity:
- Critical errors: -5 points each
- High errors: -3 points each
- Medium errors: -1 point each
- Low errors: -0.5 points each

---

## Penalty Savings Explained

VATANA estimates penalties you've **avoided** by fixing errors:

### Irish Revenue Penalty Structure

| Error Type | Penalty Range | Example |
|------------|---------------|---------|
| Missing VAT number | €500 - €1,000 | €750 average |
| Wrong VAT rate | €1,000 - €4,000 | €2,500 average |
| Calculation error | €250 - €1,500 | €875 average |
| Missing details | €100 - €500 | €300 average |

**Your savings = Sum of all avoided penalties**

---

## Tips for Best Results

### Data Quality
✅ **DO:**
- Use consistent date formats
- Include all required columns
- Validate VAT numbers beforehand
- Keep records organized

❌ **DON'T:**
- Mix date formats in one file
- Leave required fields empty
- Use informal customer names
- Include non-invoice data

### File Preparation
1. **Clean your data** before uploading
2. **Remove duplicate** invoices
3. **Check calculations** manually first
4. **Use templates** provided by VATANA

### Regular Monitoring
- **Upload weekly** for best results
- **Review dashboard** regularly
- **Fix critical issues** immediately
- **Track your compliance score** over time

---

## Next Steps

### Explore Features
- 📊 [View Analytics Dashboard](./analytics-guide.md)
- 📄 [Generate Reports](./reports-guide.md)
- 🔧 [Auto-Fix Settings](./autofix-guide.md)
- 👥 [Team Management](./team-guide.md)

### Get Help
- 💬 [Live Chat](https://vatana.ie/support)
- 📧 [Email Support](mailto:support@vatana.ie)
- 📚 [Knowledge Base](./faq.md)
- 🎥 [Video Tutorials](https://vatana.ie/tutorials)

### Stay Updated
- 📰 [Release Notes](./changelog.md)
- 🔔 [Subscribe to Updates](https://vatana.ie/updates)
- 🐦 [Follow on Twitter](https://twitter.com/vatana_ie)

---

## Keyboard Shortcuts

Speed up your workflow:

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Upload file | `Ctrl + U` | `⌘ + U` |
| Search | `Ctrl + K` | `⌘ + K` |
| View dashboard | `Ctrl + D` | `⌘ + D` |
| Generate report | `Ctrl + R` | `⌘ + R` |
| Help | `F1` | `F1` |

---

## Troubleshooting

### File Won't Upload
- Check file size (max 50MB)
- Verify file format (CSV, XLSX, XLS only)
- Ensure file isn't corrupted
- Try different browser

### Errors Not Detected
- Verify CSV has required columns
- Check data format matches specifications
- Ensure dates are valid
- Review sample CSV format

### Wrong VAT Rate Applied
- Check product type classification
- Verify customer country code
- Review reverse charge rules
- Contact support if unsure

---

## Support

Need help? We're here for you!

### Contact Options
- **Live Chat:** Available 9 AM - 6 PM IST
- **Email:** support@vatana.ie (24-hour response)
- **Phone:** +353 1 XXX XXXX (Business hours)
- **Help Center:** [help.vatana.ie](https://help.vatana.ie)

### Emergency Support
For critical issues:
- **Priority Email:** urgent@vatana.ie
- **Response Time:** Within 2 hours

---

## Terms & Privacy

By using VATANA, you agree to:
- [Terms of Service](https://vatana.ie/terms)
- [Privacy Policy](https://vatana.ie/privacy)
- [Data Processing Agreement](https://vatana.ie/dpa)

**Your data is secure** - we're GDPR compliant and use bank-level encryption. 🔒

---

**Last Updated:** 2024-10-05  
**Version:** 1.0.0  
**Questions?** support@vatana.ie
