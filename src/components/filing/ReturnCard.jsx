import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { getDaysRemainingColor, getPendingItemType } from '../../utils/filingHelpers';

const ReturnCard = ({ returnData, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <GlassCard 
        hover={false}
        className={`
          p-6 
          ${returnData.status === 'urgent' ? 'border-l-4 border-red-500 animate-pulse' : ''}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{returnData.flag}</div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {returnData.country} - {returnData.period}
              </h3>
              <div className="text-sm text-gray-400">{returnData.reference}</div>
            </div>
          </div>

          <div className="text-right">
            <StatusBadge status={returnData.status} className="mb-2" />
            <div className="text-sm text-gray-400">Due: {returnData.dueDate}</div>
            <div className={`text-sm font-semibold ${getDaysRemainingColor(returnData.daysRemaining)}`}>
              {returnData.daysRemaining} days remaining
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Filing Progress</span>
            <span className="text-primary font-semibold">{returnData.progress}% complete</span>
          </div>
          <ProgressBar value={returnData.progress} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-dark-primary/40 p-4 rounded-lg border border-primary/10">
            <div className="text-sm text-gray-400 mb-1">VAT Collected</div>
            <div className="text-xl font-bold text-white">
              {formatCurrency(returnData.metrics.vatCollected)}
            </div>
            <div className="text-xs text-green-400 mt-1">
              +{returnData.comparison.vatCollectedChange}% vs Q3
            </div>
          </div>

          <div className="bg-dark-primary/40 p-4 rounded-lg border border-primary/10">
            <div className="text-sm text-gray-400 mb-1">VAT Paid</div>
            <div className="text-xl font-bold text-white">
              {formatCurrency(returnData.metrics.vatPaid)}
            </div>
            <div className="text-xs text-green-400 mt-1">
              +{returnData.comparison.vatPaidChange}% vs Q3
            </div>
          </div>

          <div className="bg-dark-primary/40 p-4 rounded-lg border border-primary/10">
            <div className="text-sm text-gray-400 mb-1">Net VAT Payable</div>
            <div className="text-xl font-bold gradient-text">
              {formatCurrency(returnData.metrics.netVat)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              To be paid by {returnData.dueDate}
            </div>
          </div>

          <div className="bg-dark-primary/40 p-4 rounded-lg border border-primary/10">
            <div className="text-sm text-gray-400 mb-1">Transactions</div>
            <div className="text-xl font-bold text-white">
              {returnData.metrics.transactions}
            </div>
            <div className="text-xs text-gray-400 mt-1">Processed</div>
          </div>
        </div>

        {/* Pending Items */}
        {returnData.pendingItems.length > 0 && (
          <div className="space-y-2 mb-6">
            {returnData.pendingItems.map((item) => {
              const itemType = getPendingItemType(item.type);
              const ItemIcon = Icons[itemType.icon];

              return (
                <div
                  key={item.id}
                  className={`${itemType.bg} border-l-4 ${itemType.border} p-3 rounded`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ItemIcon className="w-4 h-4" />
                      <span className="text-sm">{item.message}</span>
                    </div>
                    <button className="text-primary text-sm hover:underline font-medium">
                      {item.action} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Milestones */}
        <div className="flex items-center gap-4 mb-6">
          {returnData.milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center gap-2 text-sm">
              {milestone.completed ? (
                <Icons.CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Icons.Circle className="w-4 h-4 text-gray-600" />
              )}
              <span className={milestone.completed ? 'text-gray-300' : 'text-gray-500'}>
                {milestone.label}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {returnData.status === 'ready' ? (
            <Button variant="primary" className="flex-1">
              <Icons.Send className="w-4 h-4" />
              Submit Now
            </Button>
          ) : (
            <Button variant="primary" className="flex-1">
              <Icons.ArrowRight className="w-4 h-4" />
              Continue Filing
            </Button>
          )}
          <Button variant="glass">
            <Icons.Eye className="w-4 h-4" />
            View Details
          </Button>
          <Button variant="glass">
            <Icons.Download className="w-4 h-4" />
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default ReturnCard;