import { useState } from 'react';

export const useFilingWizard = (totalSteps = 5) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    country: '',
    period: '',
    transactions: [],
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const updateFormData = (data) => {
    setFormData({ ...formData, ...data });
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setFormData({
      country: '',
      period: '',
      transactions: [],
    });
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return {
    currentStep,
    formData,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    resetWizard,
    isFirstStep,
    isLastStep,
  };
};