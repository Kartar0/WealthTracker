import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const steps = [
    { number: 1, label: 'Assets' },
    { number: 2, label: 'Liabilities' },
    { number: 3, label: 'Results' },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-2 transition-all ${
                      step.number < currentStep
                        ? 'bg-green-500 text-white'
                        : step.number === currentStep
                        ? 'bg-primary text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                    data-testid={`step-indicator-${step.number}`}
                  >
                    {step.number < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-gray-300 ml-4 mt-4"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-sm text-gray-600" data-testid="step-counter">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
}
