import { format } from 'date-fns';
import { StyleSheet } from '@react-pdf/renderer';
import { PDFStyleConfig } from './types';

// Default PDF Style Configuration
export const defaultPDFStyle: PDFStyleConfig = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0ea5e9',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#1f2937',
    textSecondary: '#6b7280',
    background: '#ffffff',
    border: '#e5e7eb',
  },
  fonts: {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold',
    light: 'Helvetica-Oblique',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

// Create PDF StyleSheet from configuration
export const createPDFStyles = (config: Partial<PDFStyleConfig> = {}) => {
  const style = { ...defaultPDFStyle, ...config };
  
  return StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: style.colors.background,
      padding: style.spacing.lg,
      fontFamily: style.fonts.regular,
      fontSize: 10,
      color: style.colors.text,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: style.spacing.lg,
      paddingBottom: style.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: style.colors.border,
    },
    logo: {
      fontSize: 24,
      fontFamily: style.fonts.bold,
      color: style.colors.primary,
    },
    title: {
      fontSize: 18,
      fontFamily: style.fonts.bold,
      color: style.colors.text,
      marginBottom: style.spacing.md,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: style.fonts.bold,
      color: style.colors.textSecondary,
      marginBottom: style.spacing.sm,
    },
    section: {
      marginBottom: style.spacing.lg,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    column: {
      flexDirection: 'column',
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: style.colors.border,
      marginBottom: style.spacing.md,
    },
    tableRow: {
      margin: 'auto',
      flexDirection: 'row',
    },
    tableHeader: {
      backgroundColor: style.colors.primary,
      color: style.colors.background,
      fontFamily: style.fonts.bold,
    },
    tableCell: {
      margin: 'auto',
      padding: style.spacing.sm,
      fontSize: 9,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: style.colors.border,
      flex: 1,
    },
    summaryCard: {
      backgroundColor: '#f8fafc',
      padding: style.spacing.md,
      marginBottom: style.spacing.md,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: style.colors.border,
    },
    metricValue: {
      fontSize: 16,
      fontFamily: style.fonts.bold,
      color: style.colors.primary,
    },
    metricLabel: {
      fontSize: 10,
      color: style.colors.textSecondary,
      marginTop: style.spacing.xs,
    },
    errorCritical: {
      color: style.colors.danger,
      fontFamily: style.fonts.bold,
    },
    errorWarning: {
      color: style.colors.warning,
    },
    errorInfo: {
      color: style.colors.secondary,
    },
    footer: {
      position: 'absolute',
      bottom: style.spacing.lg,
      left: style.spacing.lg,
      right: style.spacing.lg,
      textAlign: 'center',
      fontSize: 8,
      color: style.colors.textSecondary,
      borderTopWidth: 1,
      borderTopColor: style.colors.border,
      paddingTop: style.spacing.sm,
    },
    chart: {
      width: '100%',
      height: 200,
      marginBottom: style.spacing.md,
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 8,
      bottom: style.spacing.md,
      right: style.spacing.md,
      color: style.colors.textSecondary,
    },
  });
};

// Formatting utilities
export const formatCurrency = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-EU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm');
};

// Data processing utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sumBy = <T>(array: T[], key: keyof T): number => {
  return array.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
};

export const countBy = <T>(array: T[], key: keyof T): Record<string, number> => {
  return array.reduce((counts, item) => {
    const group = String(item[key]);
    counts[group] = (counts[group] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
};

// Chart utilities
export const generateChartData = (data: Record<string, number>) => {
  return Object.entries(data).map(([label, value]) => ({
    label,
    value,
  }));
};

export const calculatePercentages = (data: Record<string, number>) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, total > 0 ? value / total : 0])
  );
};

// PDF filename generator
export const generatePDFFilename = (
  reportType: string,
  companyName: string,
  period?: string
): string => {
  const sanitizedCompany = companyName.replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = format(new Date(), 'yyyy-MM-dd');
  const periodStr = period ? `_${period}` : '';
  
  return `${reportType}_${sanitizedCompany}${periodStr}_${timestamp}.pdf`;
};

// Severity styling helpers
export const getSeverityStyle = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return { color: defaultPDFStyle.colors.danger };
    case 'high':
      return { color: defaultPDFStyle.colors.warning };
    case 'medium':
      return { color: defaultPDFStyle.colors.secondary };
    case 'low':
      return { color: defaultPDFStyle.colors.textSecondary };
    default:
      return { color: defaultPDFStyle.colors.text };
  }
};

// Table utilities
export const createTableData = <T extends Record<string, any>>(
  data: T[],
  columns: Array<{
    key: keyof T;
    header: string;
    width?: string;
    formatter?: (value: any) => string;
  }>
) => {
  return {
    headers: columns.map(col => col.header),
    rows: data.map(row =>
      columns.map(col => {
        const value = row[col.key];
        return col.formatter ? col.formatter(value) : String(value || '');
      })
    ),
    widths: columns.map(col => col.width || 'auto'),
  };
};

// Summary calculation utilities
export const calculateErrorSummary = (errors: any[]) => {
  return {
    totalErrors: errors.length,
    criticalErrors: errors.filter(e => e.severity === 'critical').length,
    autoFixableErrors: errors.filter(e => e.auto_fixable).length,
    totalPenaltyRisk: sumBy(errors, 'penalty_risk_eur'),
    errorsByType: countBy(errors, 'error_type'),
    errorsBySeverity: countBy(errors, 'severity'),
  };
};

export const calculateInvoiceSummary = (invoices: any[]) => {
  const totalNetAmount = sumBy(invoices, 'net_amount');
  const totalVATAmount = sumBy(invoices, 'vat_amount');
  
  return {
    totalInvoices: invoices.length,
    totalNetAmount,
    totalVATAmount,
    totalGrossAmount: totalNetAmount + totalVATAmount,
    invoicesByCountry: countBy(invoices, 'customer_country'),
    invoicesByVATRate: countBy(invoices, 'vat_rate_percent'),
    averageInvoiceValue: invoices.length > 0 ? totalNetAmount / invoices.length : 0,
  };
};

export const calculateCostSavingsSummary = (costSavings: any[]) => {
  return {
    totalSavings: sumBy(costSavings, 'net_savings'),
    totalErrorsFixed: sumBy(costSavings, 'total_errors_fixed'),
    totalPenaltyAvoided: sumBy(costSavings, 'total_penalty_avoided'),
    processingTimeSaved: sumBy(costSavings, 'processing_time_saved_hours'),
    roi: sumBy(costSavings, 'roi_percentage') / costSavings.length,
    autofixVsManual: {
      autofix: sumBy(costSavings, 'auto_fix_count'),
      manual: sumBy(costSavings, 'manual_fix_count'),
    },
  };
};