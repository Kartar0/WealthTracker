import { useState } from 'react';
import { useNetWorth } from '@/hooks/use-net-worth';
import { AssetsForm } from './assets-form';
import { LiabilitiesForm } from './liabilities-form';
import { ResultsDashboard } from './results-dashboard';
import { ProgressIndicator } from './progress-indicator';
import { CurrencySelector } from './currency-selector';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calculator, Save } from 'lucide-react';

export function NetWorthCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const { data, calculations, updateAssets, updateLiabilities, updateCurrency, reset, saveToLocalStorage } = useNetWorth();
  const { toast } = useToast();

  const handleSave = () => {
    const success = saveToLocalStorage();
    if (success) {
      toast({
        title: "Progress Saved",
        description: "Your data has been saved successfully.",
        variant: "default",
      });
    } else {
      toast({
        title: "Save Failed",
        description: "Unable to save your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-primary text-white rounded-lg p-2 mr-3">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900" data-testid="app-title">NetWorth Pro</h1>
                <p className="text-sm text-gray-600">Professional Net Worth Calculator</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <CurrencySelector value={data.currency} onChange={updateCurrency} />
              
              <Button 
                onClick={handleSave} 
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-save"
              >
                <Save className="mr-2 h-4 w-4" />Save Progress
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} totalSteps={3} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <AssetsForm
            assets={data.assets}
            currency={data.currency}
            onAssetsChange={updateAssets}
            onNext={() => handleStepChange(2)}
          />
        )}

        {currentStep === 2 && (
          <LiabilitiesForm
            liabilities={data.liabilities}
            currency={data.currency}
            onLiabilitiesChange={updateLiabilities}
            onNext={() => handleStepChange(3)}
            onBack={() => handleStepChange(1)}
          />
        )}

        {currentStep === 3 && (
          <ResultsDashboard
            assets={data.assets}
            liabilities={data.liabilities}
            totalAssets={calculations.totalAssets}
            totalLiabilities={calculations.totalLiabilities}
            netWorth={calculations.netWorth}
            debtToAssetRatio={calculations.debtToAssetRatio}
            currency={data.currency}
            onBack={() => handleStepChange(2)}
            onReset={() => {
              reset();
              handleStepChange(1);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white rounded-lg p-2 mr-3">
                  <Calculator className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg">NetWorth Pro</span>
              </div>
              <p className="text-gray-600 text-sm">
                Professional financial planning made simple. Calculate and track your net worth with confidence.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Features</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Real-time calculations</li>
                <li>✓ Multiple currencies</li>
                <li>✓ Secure & private</li>
                <li>✓ Export & print results</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📖 How to use</li>
                <li>🔒 Privacy policy</li>
                <li>📧 Contact support</li>
                <li>❓ FAQs</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 NetWorth Pro. Professional financial planning tools. Data stored locally on your device.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
