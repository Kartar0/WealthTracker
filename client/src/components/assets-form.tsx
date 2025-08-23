import { motion } from 'framer-motion';
import { Assets } from '@shared/schema';
import { formatCurrency, Currency, getCurrencySymbol } from '@/lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle, Home, TrendingUp, Car, University, InfoIcon } from 'lucide-react';

interface AssetsFormProps {
  assets: Assets;
  currency: Currency;
  onAssetsChange: (assets: Partial<Assets>) => void;
  onNext: () => void;
}

export function AssetsForm({ assets, currency, onAssetsChange, onNext }: AssetsFormProps) {
  const currencySymbol = getCurrencySymbol(currency);

  const handleInputChange = (field: keyof Assets, value: string) => {
    const numValue = parseFloat(value) || 0;
    onAssetsChange({ [field]: numValue });
  };

  const calculateCategoryTotal = (fields: (keyof Assets)[]): number => {
    return fields.reduce((sum, field) => sum + (assets[field] || 0), 0);
  };

  const cashTotal = calculateCategoryTotal(['checking', 'savings', 'cash']);
  const realEstateTotal = calculateCategoryTotal(['primaryHome', 'rentalProperty', 'otherRealEstate']);
  const investmentsTotal = calculateCategoryTotal(['stocks', 'retirement', 'bonds']);
  const personalTotal = calculateCategoryTotal(['vehicles', 'jewelry', 'business']);
  const totalAssets = cashTotal + realEstateTotal + investmentsTotal + personalTotal;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <TooltipProvider>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
            <div className="flex items-center">
              <div className="bg-green-500 text-white rounded-lg p-2 mr-3">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Your Assets</CardTitle>
                <p className="text-gray-600">Add all items you own that have monetary value</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cash & Bank Accounts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <University className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Cash & Bank Accounts</h3>
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Include checking, savings, money market accounts, and cash on hand</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-primary" data-testid="cash-total">
                    {formatCurrency(cashTotal, currency)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="checking" className="sr-only">Checking Account</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="checking"
                        type="number"
                        placeholder="Checking Account"
                        value={assets.checking || ''}
                        onChange={(e) => handleInputChange('checking', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-checking"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="savings" className="sr-only">Savings Account</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="savings"
                        type="number"
                        placeholder="Savings Account"
                        value={assets.savings || ''}
                        onChange={(e) => handleInputChange('savings', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-savings"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="cash" className="sr-only">Cash on Hand</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="cash"
                        type="number"
                        placeholder="Cash on Hand"
                        value={assets.cash || ''}
                        onChange={(e) => handleInputChange('cash', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-cash"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Estate */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Real Estate</h3>
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current market value of your primary residence and any rental properties</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-primary" data-testid="real-estate-total">
                    {formatCurrency(realEstateTotal, currency)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="primaryHome" className="sr-only">Primary Residence</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="primaryHome"
                        type="number"
                        placeholder="Primary Residence"
                        value={assets.primaryHome || ''}
                        onChange={(e) => handleInputChange('primaryHome', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-primary-home"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="rentalProperty" className="sr-only">Rental Properties</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="rentalProperty"
                        type="number"
                        placeholder="Rental Properties"
                        value={assets.rentalProperty || ''}
                        onChange={(e) => handleInputChange('rentalProperty', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-rental-property"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="otherRealEstate" className="sr-only">Other Real Estate</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="otherRealEstate"
                        type="number"
                        placeholder="Other Real Estate"
                        value={assets.otherRealEstate || ''}
                        onChange={(e) => handleInputChange('otherRealEstate', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-other-real-estate"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Investments */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Investments</h3>
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Stocks, bonds, mutual funds, ETFs, retirement accounts (401k, IRA, etc.)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-primary" data-testid="investments-total">
                    {formatCurrency(investmentsTotal, currency)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="stocks" className="sr-only">Stocks & ETFs</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="stocks"
                        type="number"
                        placeholder="Stocks & ETFs"
                        value={assets.stocks || ''}
                        onChange={(e) => handleInputChange('stocks', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-stocks"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="retirement" className="sr-only">Retirement Accounts</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="retirement"
                        type="number"
                        placeholder="Retirement Accounts"
                        value={assets.retirement || ''}
                        onChange={(e) => handleInputChange('retirement', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-retirement"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="bonds" className="sr-only">Bonds & Fixed Income</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="bonds"
                        type="number"
                        placeholder="Bonds & Fixed Income"
                        value={assets.bonds || ''}
                        onChange={(e) => handleInputChange('bonds', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-bonds"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicles & Personal Property */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Vehicles & Personal Property</h3>
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current market value of vehicles, jewelry, electronics, furniture, and other valuables</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-primary" data-testid="personal-total">
                    {formatCurrency(personalTotal, currency)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="vehicles" className="sr-only">Vehicles</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="vehicles"
                        type="number"
                        placeholder="Vehicles"
                        value={assets.vehicles || ''}
                        onChange={(e) => handleInputChange('vehicles', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-vehicles"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="jewelry" className="sr-only">Jewelry & Valuables</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="jewelry"
                        type="number"
                        placeholder="Jewelry & Valuables"
                        value={assets.jewelry || ''}
                        onChange={(e) => handleInputChange('jewelry', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-jewelry"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="business" className="sr-only">Business Ownership</Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-primary font-semibold">
                        {currencySymbol}
                      </span>
                      <Input
                        id="business"
                        type="number"
                        placeholder="Business Ownership"
                        value={assets.business || ''}
                        onChange={(e) => handleInputChange('business', e.target.value)}
                        className="pl-8 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                        min="0"
                        data-testid="input-business"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Assets Display */}
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PlusCircle className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-lg font-semibold text-gray-900">Total Assets</span>
                </div>
                <div className="text-2xl font-bold text-green-600" data-testid="total-assets">
                  {formatCurrency(totalAssets, currency)}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={onNext} 
                className="bg-primary hover:bg-blue-700 text-white px-6 py-3 font-medium"
                data-testid="button-continue-liabilities"
              >
                Continue to Liabilities <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}
