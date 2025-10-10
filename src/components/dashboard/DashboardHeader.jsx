import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const DashboardHeader = ({ user, onSidebarToggle, isMobile }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-8 p-6 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl"
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Icons.Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's your VAT compliance overview
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
          <Icons.Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* Search */}
        <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors hidden sm:block">
          <Icons.Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors hidden sm:block">
          <Icons.Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.role}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-white font-medium">
            {user.initials}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;