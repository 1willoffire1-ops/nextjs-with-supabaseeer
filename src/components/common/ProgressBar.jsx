import { motion } from 'framer-motion';

const ProgressBar = ({ value, max = 100, showLabel = false, className = '' }) => {
  const percentage = (value / max) * 100;

  return (
    <div className={className}>
      <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
        />
      </div>
      {showLabel && (
        <div className="text-xs text-gray-400 mt-1">
          {Math.round(percentage)}% complete
        </div>
      )}
    </div>
  );
};

export default ProgressBar;