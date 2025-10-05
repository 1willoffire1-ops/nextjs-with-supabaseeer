import { Tables } from '@/types/database';

// Base types from database
export type Invoice = Tables<'invoices'>;
export type VATError = Tables<'vat_errors'>;
export type CostSavings = Tables<'cost_savings'>;
export type FixHistory = Tables<'fix_history'>;
export type User = Tables<'users'>;
export type Upload = Tables<'uploads'>;

// PDF Document Types
export interface PDFReportMeta {
  title: string;
  generatedAt: Date;
  generatedBy: string;
  companyName: string;
  period?: string;
  reportType: 'VAT_ERRORS' | 'INVOICES' | 'COST_SAVINGS' | 'FIX_HISTORY' | 'COMPREHENSIVE';
}

// VAT Error Report Data
export interface VATErrorReportData {
  meta: PDFReportMeta;
  summary: {
    totalErrors: number;
    criticalErrors: number;
    autoFixableErrors: number;
    totalPenaltyRisk: number;
    errorsByType: Record<string, number>;
    errorsBySeverity: Record<string, number>;
  };
  errors: Array<VATError & {
    invoice: Invoice;
  }>;
}

// Invoice Report Data
export interface InvoiceReportData {
  meta: PDFReportMeta;
  summary: {
    totalInvoices: number;
    totalNetAmount: number;
    totalVATAmount: number;
    totalGrossAmount: number;
    invoicesByCountry: Record<string, number>;
    invoicesByVATRate: Record<string, number>;
    averageInvoiceValue: number;
  };
  invoices: Invoice[];
  errors?: VATError[];
}

// Cost Savings Report Data
export interface CostSavingsReportData {
  meta: PDFReportMeta;
  summary: {
    totalSavings: number;
    totalErrorsFixed: number;
    totalPenaltyAvoided: number;
    processingTimeSaved: number;
    roi: number;
    autofixVsManual: {
      autofix: number;
      manual: number;
    };
  };
  costSavings: CostSavings[];
  monthlyBreakdown: Array<{
    month: string;
    savings: number;
    errorsFixed: number;
    penaltyAvoided: number;
  }>;
}

// Fix History Report Data
export interface FixHistoryReportData {
  meta: PDFReportMeta;
  summary: {
    totalFixes: number;
    totalPenaltyAvoided: number;
    totalTimeSaved: number;
    fixesByType: Record<string, number>;
    fixesByStrategy: Record<string, number>;
  };
  fixes: Array<FixHistory & {
    invoice: Invoice;
  }>;
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  category?: string;
}

// PDF Style Configuration
export interface PDFStyleConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
    text: string;
    textSecondary: string;
    background: string;
    border: string;
  };
  fonts: {
    regular: string;
    bold: string;
    light: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// PDF Export Options
export interface PDFExportOptions {
  filename?: string;
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  includeCharts?: boolean;
  includeDetails?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Common PDF Component Props
export interface BasePDFComponentProps {
  data: any;
  options?: PDFExportOptions;
  style?: Partial<PDFStyleConfig>;
}