import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

// Layout
import ReportsLayout from './components/layout/ReportsLayout';

// Common Components
import Tabs from './components/common/Tabs';
import Button from './components/common/Button';
import DateRangePicker from './components/common/DateRangePicker';
import ExportMenu from './components/common/ExportMenu';

// Report Components
import ReportTemplates from './components/reports/ReportTemplates';
import SummaryMetrics from './components/reports/SummaryMetrics';
import VATAnalysisChart from './components/reports/VATAnalysisChart';
import TransactionTable from './components/reports/TransactionTable';

// Hooks
import { useTabs } from './hooks/useTabs';
import { useReportFilters } from './hooks/useReportFilters';

// Data
import { reportsData } from './data/reportsData';

const Reports = () => {
  const tabs = [
    { id: 'overview', label: 'Overview', badge: null },
    { id: 'analytics', label: 'Analytics', badge: null },
    { id: 'transactions', label: 'Transactions', badge: reportsData.transactions.length },
    { id: 'templates', label: 'Templates', badge: null },
  ];

  const { activeTab, switchTab } = useTabs('overview');
  const { filters, updateDateRange } = useReportFilters();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    // In a real app, this would generate the report
    console.log('Selected template:', templateId);
    switchTab('overview');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <SummaryMetrics />
            <div className="grid lg:grid-cols-2 gap-8">
              <VATAnalysisChart />
              <div className="space-y-6">
                {/* Country Breakdown Placeholder */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Country Breakdown</h3>
                  <div className="space-y-3">
                    {reportsData.countryBreakdown.slice(0, 3).map((country) => (
                      <div key={country.code} className="flex items-center justify-between p-3 bg-dark-primary/40 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <div>
                            <div className="font-medium text-white">{country.country}</div>
                            <div className="text-sm text-gray-400">{country.transactions} transactions</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">€{(country.vatCollected / 1000).toFixed(0)}K</div>
                          <div className="text-sm text-gray-400">{country.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="glass" className="w-full justify-start">
                      <Icons.FileText className="w-4 h-4" />
                      Generate VAT Summary
                    </Button>
                    <Button variant="glass" className="w-full justify-start">
                      <Icons.Download className="w-4 h-4" />
                      Export All Data
                    </Button>
                    <Button variant="glass" className="w-full justify-start">
                      <Icons.Mail className="w-4 h-4" />
                      Schedule Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8">
            <SummaryMetrics />
            <VATAnalysisChart />
          </div>
        );

      case 'transactions':
        return <TransactionTable />;

      case 'templates':
        return <ReportTemplates onSelectTemplate={handleTemplateSelect} />;

      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <ReportsLayout>
      <div className="space-y-6">
        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">
              Business Intelligence Dashboard
            </h2>
            <p className="text-sm text-gray-400">
              Generate reports, analyze trends, and export data across all jurisdictions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker
              value={filters.dateRange}
              onChange={updateDateRange}
            />
            <Button variant="glass">
              <Icons.RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <ExportMenu 
              data={reportsData.transactions} 
              filename="vat-report" 
            />
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={switchTab}
          />
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          id="report-content"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </ReportsLayout>
  );
};

export default Reports;