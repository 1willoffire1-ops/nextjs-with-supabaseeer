import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from './GlassCard';

const StatCard = ({ stat, delay = 0 }) => {
  const Icon = Icons[stat.icon];
  
  const changeColorClass = 
    stat.changeType === 'positive' ? 'text-green-400' :
    stat.changeType === 'negative' ? 'text-red-400' :
    'text-gray-400';

  return (
    <GlassCard delay={delay} hover={false} className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-sm text-gray-400 uppercase tracking-wide font-medium">
            {stat.label}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Value */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="text-4xl font-bold gradient-text mb-2"
        >
          {stat.value}
        </motion.div>

        {/* Change */}
        <div className={`text-sm flex items-center gap-1 ${changeColorClass}`}>
          <span>{stat.change}</span>
        </div>

        {/* Badge */}
        {stat.badge && (
          <div className="mt-3 inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-medium">
            {stat.badge}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default StatCard;