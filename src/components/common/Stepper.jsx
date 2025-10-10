import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8 relative">
      {/* Connection Line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-primary/20" style={{ zIndex: 0 }} />
      
      {/* Active Line */}
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.5 }}
        className="absolute top-5 left-0 h-0.5 bg-primary"
        style={{ zIndex: 0 }}
      />

      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step.id} className="flex flex-col items-center relative z-10" style={{ flex: 1 }}>
            {/* Circle */}
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
                backgroundColor: isCompleted || isActive ? '#00D9B4' : 'rgba(26, 31, 46, 0.8)',
              }}
              className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2
                ${isCompleted || isActive ? 'border-transparent' : 'border-primary/30'}
                ${isActive ? 'shadow-lg shadow-primary/50' : ''}
              `}
            >
              {isCompleted ? (
                <Check className="w-5 h-5 text-dark-primary" />
              ) : (
                <span className={`font-semibold ${isCompleted || isActive ? 'text-dark-primary' : 'text-gray-400'}`}>
                  {stepNumber}
                </span>
              )}
            </motion.div>

            {/* Label */}
            <div className="text-center">
              <div className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {step.label}
              </div>
              {step.description && (
                <div className="text-xs text-gray-500 mt-1 hidden md:block">
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;