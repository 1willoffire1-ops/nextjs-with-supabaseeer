import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import Button from './Button';
import { useExport } from '../../hooks/useExport';

const ExportMenu = ({ data, filename = 'report' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isExporting, exportProgress, exportToCSV, exportToPDF, exportToExcel } = useExport();

  const exportOptions = [
    { id: 'csv', label: 'Export as CSV', icon: 'FileText', action: () => exportToCSV(data, `${filename}.csv`) },
    { id: 'excel', label: 'Export as Excel', icon: 'FileSpreadsheet', action: () => exportToExcel(data, `${filename}.xlsx`) },
    { id: 'pdf', label: 'Export as PDF', icon: 'FileDown', action: () => exportToPDF('report-content', `${filename}.pdf`) },
  ];

  const handleExport = async (action) => {
    setIsOpen(false);
    await action();
  };

  return (
    <div className="relative">
      <Button 
        variant="glass" 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <Icons.Loader className="w-4 h-4 animate-spin" />
            Exporting... {exportProgress}%
          </>
        ) : (
          <>
            <Icons.Download className="w-4 h-4" />
            Export
            <Icons.ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-56 glass-card p-2 z-50"
            >
              {exportOptions.map((option) => {
                const Icon = Icons[option.icon];
                return (
                  <button
                    key={option.id}
                    onClick={() => handleExport(option.action)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportMenu;