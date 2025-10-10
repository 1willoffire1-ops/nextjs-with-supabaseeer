import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true, 
  delay = 0,
  onClick,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={hover ? { y: -2, scale: 1.02 } : {}}
      onClick={onClick}
      className={`
        bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6
        shadow-xl transition-all duration-300 cursor-pointer
        hover:bg-white/15 hover:border-white/30 hover:shadow-2xl
        dark:bg-gray-800/20 dark:border-gray-700/30 dark:hover:bg-gray-800/30
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;