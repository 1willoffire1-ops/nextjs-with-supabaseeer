import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { filingData } from '../../data/filingData';

const FilingLayout = ({ children }) => {
  const { currentPeriod } = filingData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 bg-dark-primary/80 backdrop-blur-xl border-b border-primary/10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icons.FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  VAT Filing & Compliance
                </h1>
                <p className="text-sm text-gray-400">
                  Manage your VAT returns across multiple jurisdictions
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {currentPeriod.returnsDue}
                </div>
                <div className="text-xs text-gray-400">Returns Due</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {currentPeriod.pendingActions}
                </div>
                <div className="text-xs text-gray-400">Pending Actions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {currentPeriod.progress}%
                </div>
                <div className="text-xs text-gray-400">Complete</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Period Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="container mx-auto px-6 py-4"
      >
        <GlassCard className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Icons.Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-white">
                  Current Period: {currentPeriod.period}
                </div>
                <div className="text-sm text-gray-400">
                  {currentPeriod.startDate} to {currentPeriod.endDate} • 
                  Next due: {currentPeriod.nextDueDate}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${currentPeriod.complianceStatus === 'good' 
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
                }
              `}>
                Compliance: {currentPeriod.complianceStatus}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        {children}
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 py-4 mt-12">
        <div className="text-center text-sm text-gray-500">
          <p>
            VATANA VAT Filing System • Built for multi-jurisdiction compliance
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilingLayout;