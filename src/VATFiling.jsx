import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

// Layout
import FilingLayout from './components/layout/FilingLayout';

// Common Components
import Tabs from './components/common/Tabs';
import Button from './components/common/Button';

// Filing Components
import ActiveReturns from './components/filing/ActiveReturns';
import FilingHistory from './components/filing/FilingHistory';
import ComplianceChecklist from './components/filing/ComplianceChecklist';
import DocumentsSection from './components/filing/DocumentsSection';
import CountrySettings from './components/filing/CountrySettings';
import FilingWizard from './components/filing/FilingWizard';

// Hooks and Data
import { useTabs } from './hooks/useTabs';
import { useModal } from './hooks/useModal';
import { filingData } from './data/filingData';

const VATFiling = () => {
  const { tabs } = filingData;
  const { activeTab, switchTab } = useTabs('active-returns');
  const wizardModal = useModal();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'active-returns':
        return <ActiveReturns />;
      case 'filing-history':
        return <FilingHistory />;
      case 'compliance':
        return <ComplianceChecklist />;
      case 'documents':
        return <DocumentsSection />;
      case 'settings':
        return <CountrySettings />;
      default:
        return <ActiveReturns />;
    }
  };

  return (
    <FilingLayout>
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
              VAT Returns Management
            </h2>
            <p className="text-sm text-gray-400">
              Track, manage, and submit your VAT returns across all jurisdictions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="glass">
              <Icons.RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
            <Button variant="glass">
              <Icons.Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button 
              variant="primary"
              onClick={wizardModal.openModal}
            >
              <Icons.Plus className="w-4 h-4" />
              New Return
            </Button>
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
        >
          {renderTabContent()}
        </motion.div>

        {/* Filing Wizard Modal */}
        <FilingWizard
          isOpen={wizardModal.isOpen}
          onClose={wizardModal.closeModal}
        />
      </div>
    </FilingLayout>
  );
};

export default VATFiling;