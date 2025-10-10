import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';

const ReportsLayout = ({ children }) => {
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
                <Icons.BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  Reports & Analytics
                </h1>
                <p className="text-sm text-gray-400">
                  Comprehensive VAT reporting and business insights
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  €1.25M
                </div>
                <div className="text-xs text-gray-400">VAT Collected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  1,247
                </div>
                <div className="text-xs text-gray-400">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  5
                </div>
                <div className="text-xs text-gray-400">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        {children}
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 py-4 mt-12">
        <div className="text-center text-sm text-gray-500">
          <p>
            VATANA Reports System • Advanced analytics and insights for VAT compliance
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsLayout;