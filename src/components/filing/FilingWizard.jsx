import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import Modal from '../common/Modal';
import Stepper from '../common/Stepper';
import Button from '../common/Button';
import { useFilingWizard } from '../../hooks/useFilingWizard';
import { filingData } from '../../data/filingData';

const FilingWizard = ({ isOpen, onClose }) => {
  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    resetWizard,
    isFirstStep,
    isLastStep,
  } = useFilingWizard(5);

  const { wizardSteps } = filingData;

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1SelectPeriod formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2Review formData={formData} />;
      case 3:
        return <Step3Calculate formData={formData} />;
      case 4:
        return <Step4Validate formData={formData} />;
      case 5:
        return <Step5Submit formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New VAT Return" size="xl">
      {/* Stepper */}
      <Stepper steps={wizardSteps} currentStep={currentStep} />

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[300px]"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-800 mt-6">
        <Button variant="glass" onClick={handleClose}>
          <Icons.X className="w-4 h-4" />
          Cancel
        </Button>

        <div className="flex items-center gap-3">
          {!isFirstStep && (
            <Button variant="glass" onClick={prevStep}>
              <Icons.ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          
          {!isLastStep ? (
            <Button variant="primary" onClick={nextStep}>
              Next: {wizardSteps[currentStep]?.label}
              <Icons.ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleClose}>
              <Icons.Send className="w-4 h-4" />
              Submit Return
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

// Step 1: Select Period
const Step1SelectPeriod = ({ formData, updateFormData }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Select Country and Period</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.country}
            onChange={(e) => updateFormData({ country: e.target.value })}
            className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">Select a country</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="NL">Netherlands</option>
            <option value="ES">Spain</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            VAT Period <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.period}
            onChange={(e) => updateFormData({ period: e.target.value })}
            className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">Select a period</option>
            <option value="Q4-2024">Q4 2024 (Oct - Dec)</option>
            <option value="Q3-2024">Q3 2024 (Jul - Sep)</option>
            <option value="Q2-2024">Q2 2024 (Apr - Jun)</option>
            <option value="Q1-2024">Q1 2024 (Jan - Mar)</option>
          </select>
        </div>

        <div className="glass-card p-4 bg-blue-500/5 border-blue-500/20">
          <div className="flex items-start gap-3">
            <Icons.Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              This will create a new VAT return for the selected period. Transaction data will be automatically imported from your connected systems.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Review
const Step2Review = ({ formData }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Review Transactions</h3>
      
      <div className="space-y-4">
        <div className="glass-card p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Country</div>
              <div className="text-white font-semibold">{formData.country || 'Not selected'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Period</div>
              <div className="text-white font-semibold">{formData.period || 'Not selected'}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <h4 className="font-semibold text-white mb-3">Transaction Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Transactions</span>
              <span className="text-white font-semibold">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Validated</span>
              <span className="text-green-400 font-semibold">1,220</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pending Review</span>
              <span className="text-yellow-400 font-semibold">27</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Calculate
const Step3Calculate = ({ formData }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Calculate VAT Amounts</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <div className="text-sm text-gray-400 mb-2">Output VAT (Collected)</div>
            <div className="text-2xl font-bold gradient-text">€125,450</div>
            <div className="text-xs text-green-400 mt-1">+8.5% vs previous period</div>
          </div>

          <div className="glass-card p-4">
            <div className="text-sm text-gray-400 mb-2">Input VAT (Paid)</div>
            <div className="text-2xl font-bold text-white">€45,200</div>
            <div className="text-xs text-green-400 mt-1">+12.3% vs previous period</div>
          </div>
        </div>

        <div className="glass-card p-6 bg-primary/5 border-primary/20">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Net VAT Payable</div>
            <div className="text-4xl font-bold gradient-text mb-2">€80,250</div>
            <div className="text-sm text-gray-400">Due by: Jan 31, 2025</div>
          </div>
        </div>

        <div className="glass-card p-4">
          <h4 className="font-semibold text-white mb-3">Breakdown by Rate</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Standard Rate (20%)</span>
              <span className="text-white font-semibold">€98,560</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Reduced Rate (5%)</span>
              <span className="text-white font-semibold">€18,240</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Zero Rate (0%)</span>
              <span className="text-white font-semibold">€8,650</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Validate
const Step4Validate = ({ formData }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Validate Data</h3>
      
      <div className="space-y-4">
        <div className="glass-card p-4 bg-green-500/5 border-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Icons.CheckCircle className="w-6 h-6 text-green-400" />
            <span className="font-semibold text-white">All Checks Passed</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <Icons.Check className="w-4 h-4" />
              <span>All VAT numbers validated</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Icons.Check className="w-4 h-4" />
              <span>Transaction data complete</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Icons.Check className="w-4 h-4" />
              <span>Calculations verified</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Icons.Check className="w-4 h-4" />
              <span>Supporting documents attached</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 bg-yellow-500/5 border-yellow-500/20">
          <div className="flex items-center gap-3 mb-2">
            <Icons.AlertCircle className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-white">Warnings (Optional)</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-yellow-400">
              <Icons.AlertTriangle className="w-4 h-4" />
              <span>Consider reviewing 3 high-value transactions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 5: Submit
const Step5Submit = ({ formData }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Review and Submit</h3>
      
      <div className="space-y-4">
        <div className="glass-card p-6 text-center">
          <Icons.FileCheck className="w-16 h-16 text-primary mx-auto mb-4" />
          <h4 className="text-xl font-bold text-white mb-2">Ready to Submit</h4>
          <p className="text-gray-400 mb-4">
            Your VAT return is complete and ready for submission to the tax authority.
          </p>
        </div>

        <div className="glass-card p-4">
          <h4 className="font-semibold text-white mb-3">Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Reference</span>
              <span className="text-white font-mono">VAT-GB-2024-Q4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Period</span>
              <span className="text-white">Q4 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount Payable</span>
              <span className="text-primary font-bold">€80,250</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Due Date</span>
              <span className="text-white">Jan 31, 2025</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 bg-blue-500/5 border-blue-500/20">
          <div className="flex items-start gap-3">
            <Icons.Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              By submitting this return, you confirm that the information provided is accurate and complete. The return will be electronically submitted to HM Revenue & Customs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilingWizard;