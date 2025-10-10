import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { formatRelativeTime } from '../../utils/formatters';

const ActivityTimeline = ({ activities, title = "Recent Activity" }) => {
  return (
    <GlassCard className="h-96 overflow-hidden" delay={0.4}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <button className="text-sm text-primary hover:text-primary-light transition-colors">
          View All
        </button>
      </div>

      <div className="overflow-y-auto h-full scrollbar-hide">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = Icons[activity.icon];
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                {/* Icon */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${activity.iconColor}20` }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: activity.iconColor }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      {activity.details && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {activity.details}
                        </p>
                      )}
                    </div>
                    
                    {/* Badge or Action */}
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className="text-xs text-gray-400">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                      
                      {activity.badge && (
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activity.type === 'success' ? 'bg-green-500/20 text-green-400' :
                            activity.type === 'error' ? 'bg-red-500/20 text-red-400' :
                            activity.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {activity.badge}
                        </span>
                      )}
                      
                      {activity.action && (
                        <button className="text-xs text-primary hover:text-primary-light transition-colors">
                          {activity.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};

export default ActivityTimeline;