import { Liabilities } from '@shared/schema';
import { formatCurrency, Currency, getCurrencySymbol } from '@/lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, MinusCircle, Home, CreditCard, GraduationCap, Car, Calculator, InfoIcon } from 'lucide-react';

interface LiabilitiesFormProps {
  liabilities: Liabilities;
  currency: Currency;
  onLiabilitiesChange: (liabilities: Partial<Liabilities>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LiabilitiesForm({ liabilities, currency, onLiabilitiesChange, onNext, onBack }: LiabilitiesFormProps) {
  const currencySymbol = getCurrencySymbol(currency);

  const handleInputChange = (field: keyof Liabilities, value: string) => {
    const numValue = parseFloat(value) || 0;
    onLiabilitiesChange({ [field]: numValue });
  };

  const calculateCategoryTotal = (fields: (keyof Liabilities)[]): number => {
    return fields.reduce((sum, field) => sum + (liabilities[field] || 0), 0);
  };

  const mortgageTotal = calculateCategoryTotal(['primaryMortgage', 'homeEquityLoan', 'investmentMortgage']);
  const creditCardTotal = calculateCategoryTotal(['creditCard1', 'creditCard2', 'creditCard3']);
  const personalLoanTotal = calculateCategoryTotal(['studentLoan', 'personalLoan', 'otherDebt']);
  const vehicleLoanTotal = calculateCategoryTotal(['carLoan1', 'carLoan2']);
  const totalLiabilities = mortgageTotal + creditCardTotal + personalLoanTotal + vehicleLoanTotal;

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center">
              <div className="bg-orange-500 text-white rounded-lg p-2 mr-3">
                <MinusCircle className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Your Liabilities</CardTitle>
                <p className="text-gray-600">Add all debts and money you owe</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mortgages & Home Loans */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-orange-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Mortgages & Home Loans</h3>
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Outstanding balance on your mortgage and home equity loans</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-orange-500" data-testid="mortgage-total">
                    {formatCurrency(mortgageTotal, currency)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="primaryMortgage" className="sr-only">Primary Mortgage</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="primaryMortgage"
                        type="number"
                        placeholder="Primary Mortgage"
                        value={liabilities.primaryMortgage || ''}
                        onChange={(e) => handleInputChange('primaryMortgage', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-primary-mortgage"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="homeEquityLoan" className="sr-only">Home Equity Loan</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="homeEquityLoan"
                        type="number"
                        placeholder="Home Equity Loan"
                        value={liabilities.homeEquityLoan || ''}
                        onChange={(e) => handleInputChange('homeEquityLoan', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-home-equity-loan"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="investmentMortgage" className="sr-only">Investment Property Mortgage</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="investmentMortgage"
                        type="number"
                        placeholder="Investment Property Mortgage"
                        value={liabilities.investmentMortgage || ''}
                        onChange={(e) => handleInputChange('investmentMortgage', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-investment-mortgage"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Credit Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-orange-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Credit Card Debt</h3>
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Outstanding balances on all credit cards</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-orange-500" data-testid="credit-card-total">
                    {formatCurrency(creditCardTotal, currency)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="creditCard1" className="sr-only">Credit Card 1</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="creditCard1"
                        type="number"
                        placeholder="Credit Card 1"
                        value={liabilities.creditCard1 || ''}
                        onChange={(e) => handleInputChange('creditCard1', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-credit-card-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="creditCard2" className="sr-only">Credit Card 2</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="creditCard2"
                        type="number"
                        placeholder="Credit Card 2"
                        value={liabilities.creditCard2 || ''}
                        onChange={(e) => handleInputChange('creditCard2', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-credit-card-2"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="creditCard3" className="sr-only">Credit Card 3</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="creditCard3"
                        type="number"
                        placeholder="Credit Card 3"
                        value={liabilities.creditCard3 || ''}
                        onChange={(e) => handleInputChange('creditCard3', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-credit-card-3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal & Student Loans */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-orange-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Personal & Student Loans</h3>
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Student loans, personal loans, and other debt</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-orange-500" data-testid="personal-loan-total">
                    {formatCurrency(personalLoanTotal, currency)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="studentLoan" className="sr-only">Student Loans</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="studentLoan"
                        type="number"
                        placeholder="Student Loans"
                        value={liabilities.studentLoan || ''}
                        onChange={(e) => handleInputChange('studentLoan', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-student-loan"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="personalLoan" className="sr-only">Personal Loans</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="personalLoan"
                        type="number"
                        placeholder="Personal Loans"
                        value={liabilities.personalLoan || ''}
                        onChange={(e) => handleInputChange('personalLoan', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-personal-loan"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="otherDebt" className="sr-only">Other Debt</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="otherDebt"
                        type="number"
                        placeholder="Other Debt"
                        value={liabilities.otherDebt || ''}
                        onChange={(e) => handleInputChange('otherDebt', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-other-debt"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Loans */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-orange-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Vehicle Loans</h3>
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Outstanding balance on auto loans and vehicle financing</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-orange-500" data-testid="vehicle-loan-total">
                    {formatCurrency(vehicleLoanTotal, currency)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="carLoan1" className="sr-only">Car Loan 1</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="carLoan1"
                        type="number"
                        placeholder="Car Loan 1"
                        value={liabilities.carLoan1 || ''}
                        onChange={(e) => handleInputChange('carLoan1', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-car-loan-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="carLoan2" className="sr-only">Car Loan 2</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="carLoan2"
                        type="number"
                        placeholder="Car Loan 2"
                        value={liabilities.carLoan2 || ''}
                        onChange={(e) => handleInputChange('carLoan2', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-car-loan-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Liabilities Display */}
            <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MinusCircle className="h-6 w-6 text-red-600 mr-3" />
                  <span className="text-lg font-semibold text-gray-900">Total Liabilities</span>
                </div>
                <div className="text-2xl font-bold text-red-600" data-testid="total-liabilities">
                  {formatCurrency(totalLiabilities, currency)}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              <Button 
                onClick={onBack} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 font-medium"
                data-testid="button-back-assets"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assets
              </Button>
              <Button 
                onClick={onNext} 
                className="bg-primary hover:bg-blue-700 text-white px-6 py-3 font-medium"
                data-testid="button-calculate-net-worth"
              >
                Calculate Net Worth <Calculator className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
