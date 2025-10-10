import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';
import ProgressBar from '../common/ProgressBar';
import { filingData } from '../../data/filingData';

const ComplianceChecklist = () => {
  const { complianceChecklist } = filingData;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <Icons.CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Icons.Circle className="w-5 h-5 text-gray-500" />;
      case 'blocked':
        return <Icons.Lock className="w-5 h-5 text-gray-600" />;
      default:
        return <Icons.Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div>
      {/* Overall Score */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              Overall Compliance Score
            </h3>
            <p className="text-sm text-gray-400">
              Your compliance health across all categories
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold gradient-text">
              {complianceChecklist.overallScore}%
            </div>
            <div className="text-sm text-green-400">Excellent</div>
          </div>
        </div>
        <ProgressBar value={complianceChecklist.overallScore} />
      </GlassCard>

      {/* Categories */}
      <div className="space-y-6">
        {complianceChecklist.categories.map((category, catIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: catIndex * 0.1 }}
          >
            <GlassCard className="p-6">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {category.completedItems} of {category.totalItems} items complete
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold gradient-text">
                    {category.progress}%
                  </div>
                </div>
              </div>

              <ProgressBar value={category.progress} className="mb-6" />

              {/* Items */}
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                    className={`
                      flex items-start gap-3 p-4 rounded-lg transition-all
                      ${item.status === 'complete' 
                        ? 'bg-green-500/5 border border-green-500/20' 
                        : item.status === 'pending' 
                        ? 'bg-yellow-500/5 border border-yellow-500/20'
                        : 'bg-gray-500/5 border border-gray-700/20'
                      }
                    `}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(item.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`
                          font-medium
                          ${item.status === 'complete' ? 'text-white' : 'text-gray-300'}
                        `}>
                          {item.label}
                        </span>
                        {item.priority && (
                          <span className={`text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                            {item.priority.toUpperCase()} PRIORITY
                          </span>
                        )}
                      </div>

                      {item.completedDate && (
                        <div className="text-xs text-gray-500">
                          Completed: {item.completedDate}
                        </div>
                      )}

                      {item.status === 'pending' && item.priority && (
                        <button className="text-primary text-sm hover:underline mt-2">
                          Complete now →
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceChecklist;