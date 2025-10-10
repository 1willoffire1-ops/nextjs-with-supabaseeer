import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from './GlassCard';
import { formatCurrency, formatPercentage, getColorByValue } from '../../utils/reportHelpers';

const MetricCard = ({ metric, delay = 0 }) => {
  const Icon = Icons[metric.icon] || Icons.TrendingUp;
  const changeColor = getColorByValue(metric.change);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <GlassCard hover={false} className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm text-gray-400 mb-2 uppercase tracking-wide">
              {metric.label}
            </div>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              className="text-3xl font-bold gradient-text"
            >
              {metric.isCurrency ? formatCurrency(metric.value) : metric.value.toLocaleString()}
            </motion.div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>

        {metric.change !== undefined && (
          <div className={`flex items-center gap-2 text-sm ${changeColor}`}>
            {metric.change > 0 ? (
              <Icons.TrendingUp className="w-4 h-4" />
            ) : metric.change < 0 ? (
              <Icons.TrendingDown className="w-4 h-4" />
            ) : (
              <Icons.Minus className="w-4 h-4" />
            )}
            <span className="font-semibold">{formatPercentage(metric.change)}</span>
            <span className="text-gray-400">vs previous period</span>
          </div>
        )}

        {metric.subtitle && (
          <div className="text-xs text-gray-500 mt-2">
            {metric.subtitle}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default MetricCard;