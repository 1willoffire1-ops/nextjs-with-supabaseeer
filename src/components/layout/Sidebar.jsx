import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { dashboardData } from '../../data/dashboardData';

const Sidebar = ({ isOpen, isMobile, onClose }) => {
  const { navigation, user } = dashboardData;
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={isMobile ? { x: -280 } : { x: 0 }}
        animate={{ x: isMobile && !isOpen ? -280 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed top-0 left-0 h-screen w-60 bg-gray-900/95 backdrop-blur-xl
          border-r border-primary/10 z-50 flex flex-col
          ${isMobile ? 'shadow-2xl' : ''}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="text-2xl font-bold gradient-text">VATANA</div>
          <div className="text-sm text-gray-400 mt-1">VAT Compliance</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-hide">
          {navigation.map((item) => {
            const Icon = Icons[item.icon];
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={isMobile ? onClose : undefined}
                className={`
                  flex items-center gap-3 px-4 py-3 mx-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                    : 'text-gray-400 hover:bg-primary/5 hover:text-primary'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`
                    ml-auto px-2 py-0.5 rounded-full text-xs font-semibold
                    ${item.badge.type === 'warning' 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-primary/20 text-primary'
                    }
                  `}>
                    {item.badge.value}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 cursor-pointer hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-white font-bold flex-shrink-0">
                {user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {user.name}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;