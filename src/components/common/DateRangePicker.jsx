import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { getDateRangePresets } from '../../utils/reportHelpers';

const DateRangePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const presets = getDateRangePresets();

  const formatDateRange = () => {
    if (value.preset && presets[value.preset]) {
      return presets[value.preset].label;
    }
    return `${value.start.toLocaleDateString()} - ${value.end.toLocaleDateString()}`;
  };

  const selectPreset = (presetKey) => {
    const preset = presets[presetKey];
    onChange(preset.start, preset.end, presetKey);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button flex items-center gap-2 min-w-[200px]"
      >
        <Icons.Calendar className="w-4 h-4" />
        <span className="flex-1 text-left">{formatDateRange()}</span>
        <Icons.ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-64 glass-card p-2 z-50"
            >
              <div className="space-y-1">
                {Object.entries(presets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => selectPreset(key)}
                    className={`
                      w-full text-left px-4 py-2 rounded-lg text-sm transition-colors
                      ${value.preset === key 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-300 hover:bg-primary/5 hover:text-primary'
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-800 mt-2 pt-2">
                <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">
                  <Icons.Calendar className="w-4 h-4 inline mr-2" />
                  Custom Range...
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangePicker;