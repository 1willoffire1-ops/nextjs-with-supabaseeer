import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';

const UpcomingDeadlines = ({ deadlines, title = "Upcoming Deadlines" }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getDaysColor = (days) => {
    if (days <= 7) return 'text-red-400';
    if (days <= 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <GlassCard className="h-96 overflow-hidden" delay={0.6}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <button className="text-sm text-primary hover:text-primary-light transition-colors">
          View Calendar
        </button>
      </div>

      <div className="overflow-y-auto h-full scrollbar-hide">
        <div className="space-y-4">
          {deadlines.map((deadline, index) => (
            <motion.div
              key={deadline.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              {/* Date */}
              <div className="text-center flex-shrink-0">
                <div className="text-2xl font-bold text-primary">
                  {deadline.day}
                </div>
                <div className="text-xs text-gray-400 uppercase">
                  {deadline.month}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {deadline.title}
                    </h4>
                    
                    {deadline.country && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {deadline.country}
                      </p>
                    )}
                    
                    {deadline.amount && (
                      <p className="text-sm font-medium text-primary">
                        {deadline.amount}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-2">
                      {/* Priority */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                        {deadline.priority.toUpperCase()}
                      </span>
                      
                      {/* Days remaining */}
                      <span className={`text-xs ${getDaysColor(deadline.daysRemaining)}`}>
                        {deadline.daysRemaining} days left
                      </span>
                    </div>
                  </div>
                  
                  {/* Action button */}
                  <button className="text-xs text-primary hover:text-primary-light transition-colors px-3 py-1 border border-primary/30 rounded-full">
                    {deadline.action}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default UpcomingDeadlines;