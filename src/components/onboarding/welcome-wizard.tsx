'use client'

import { useState } from 'react'
import { CheckCircle, Upload, FileText, TrendingUp, X } from 'lucide-react'

interface WelcomeWizardProps {
  onComplete?: () => void
  onSkip?: () => void
}

export function WelcomeWizard({ onComplete, onSkip }: WelcomeWizardProps) {
  const [step, setStep] = useState(1)
  const [isVisible, setIsVisible] = useState(true)

  const steps = [
    {
      id: 1,
      title: "Welcome to VATANA!",
      description: "Let's get you started with VAT compliance automation in just 3 easy steps.",
      icon: CheckCircle,
      action: "Get Started",
      details: [
        "Automatically detect VAT errors",
        "AI-powered fix suggestions",
        "Avoid Revenue penalties"
      ]
    },
    {
      id: 2,
      title: "Upload Your Invoices",
      description: "Upload a CSV or Excel file with your invoice data. We'll analyze it for VAT compliance issues.",
      icon: Upload,
      action: "Try Sample Upload",
      details: [
        "Supports CSV, XLSX, XLS formats",
        "Process up to 50MB files",
        "Analysis takes 30-60 seconds"
      ]
    },
    {
      id: 3,
      title: "Review & Fix Errors",
      description: "VATANA will detect errors and suggest fixes. Apply them with one click!",
      icon: FileText,
      action: "View Demo",
      details: [
        "See all errors in one dashboard",
        "Get AI-suggested fixes",
        "Track penalty savings"
      ]
    },
    {
      id: 4,
      title: "Track Your Savings",
      description: "Monitor your compliance score and see how much you've saved by avoiding penalties.",
      icon: TrendingUp,
      action: "Go to Dashboard",
      details: [
        "Real-time compliance score",
        "Total penalty savings",
        "Monthly analytics"
      ]
    }
  ]

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    onComplete?.()
  }

  const handleSkip = () => {
    setIsVisible(false)
    onSkip?.()
  }

  if (!isVisible) {
    return null
  }

  const currentStep = steps[step - 1]
  const Icon = currentStep.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Skip tutorial"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {step} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Skip tutorial
            </button>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                s.id < step
                  ? 'bg-green-500 border-green-500 text-white'
                  : s.id === step
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-400'
              }`}
            >
              {s.id < step ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{s.id}</span>
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
            <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {currentStep.title}
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {currentStep.description}
          </p>

          <div className="space-y-3 mb-8">
            {currentStep.details.map((detail, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-3 text-gray-700 dark:text-gray-300"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {step < steps.length ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {currentStep.action}
              </button>
            )}
          </div>
        </div>

        {/* Helper text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You can access this tutorial anytime from{' '}
            <span className="font-medium">Help → Getting Started</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Compact version for returning users
export function WelcomePrompt({ onStart, onDismiss }: { onStart: () => void; onDismiss: () => void }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">👋 Welcome to VATANA!</h3>
          <p className="text-blue-50 mb-4">
            New here? Take a quick 2-minute tour to learn how VATANA works.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onStart}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Start Tour
            </button>
            <button
              onClick={onDismiss}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default WelcomeWizard
