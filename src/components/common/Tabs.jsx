import { motion } from 'framer-motion';
import Badge from './Badge';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-dark-tertiary/60 rounded-xl p-1 flex gap-1 mb-6 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap
              ${isActive 
                ? 'text-primary' 
                : 'text-gray-400 hover:text-primary hover:bg-primary/5'
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            
            <span className="relative flex items-center gap-2">
              {tab.label}
              {tab.badge && (
                <Badge variant="primary" size="sm">
                  {tab.badge}
                </Badge>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;