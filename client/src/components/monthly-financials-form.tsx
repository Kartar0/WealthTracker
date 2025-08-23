import { useState } from 'react';
import { motion } from 'framer-motion';
import { MonthlyFinancials, monthlyFinancialsSchema } from '@shared/schema';
import { Currency, formatCurrency } from '@/lib/currency';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MonthlyFinancialsFormProps {
  monthlyFinancials: MonthlyFinancials;
  currency: Currency;
  onMonthlyFinancialsChange: (monthlyFinancials: MonthlyFinancials) => void;
  onNext: () => void;
  onBack: () => void;
}

export function MonthlyFinancialsForm({
  monthlyFinancials,
  currency,
  onMonthlyFinancialsChange,
  onNext,
  onBack,
}: MonthlyFinancialsFormProps) {
  const { toast } = useToast();

  const handleFieldChange = (field: keyof MonthlyFinancials, value: string) => {
    const numericValue = value === '' ? 0 : Number(value);
    if (isNaN(numericValue) || numericValue < 0) return;

    onMonthlyFinancialsChange({
      ...monthlyFinancials,
      [field]: numericValue,
    });
  };

  const handleSubmit = () => {
    try {
      monthlyFinancialsSchema.parse(monthlyFinancials);
      onNext();
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Please check your entries and try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate totals
  const totalMonthlyIncome = 
    monthlyFinancials.salary + 
    monthlyFinancials.bonuses + 
    monthlyFinancials.freelance + 
    monthlyFinancials.rentalIncome + 
    monthlyFinancials.investments + 
    monthlyFinancials.otherIncome;

  const totalMonthlyExpenses = 
    monthlyFinancials.housing + 
    monthlyFinancials.utilities + 
    monthlyFinancials.groceries + 
    monthlyFinancials.transportation + 
    monthlyFinancials.insurance + 
    monthlyFinancials.healthcare + 
    monthlyFinancials.entertainment + 
    monthlyFinancials.dining + 
    monthlyFinancials.shopping + 
    monthlyFinancials.subscriptions + 
    monthlyFinancials.otherExpenses;

  const monthlyCashFlow = totalMonthlyIncome - totalMonthlyExpenses;

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="bg-primary text-white rounded-full p-3">
            <DollarSign className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Monthly Income & Expenses</h2>
        <p className="text-lg text-gray-600">Track your monthly cash flow to understand your financial health</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Monthly Income</p>
                <p className="text-2xl font-bold text-green-700" data-testid="text-monthly-income">
                  {formatCurrency(totalMonthlyIncome, currency)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Monthly Expenses</p>
                <p className="text-2xl font-bold text-red-700" data-testid="text-monthly-expenses">
                  {formatCurrency(totalMonthlyExpenses, currency)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${monthlyCashFlow >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${monthlyCashFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  Cash Flow
                </p>
                <p className={`text-2xl font-bold ${monthlyCashFlow >= 0 ? 'text-blue-700' : 'text-orange-700'}`} data-testid="text-cash-flow">
                  {formatCurrency(monthlyCashFlow, currency)}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${monthlyCashFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Income */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Monthly Income
              </CardTitle>
              <CardDescription>
                Enter all sources of your monthly income
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="salary">Salary/Wages</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.salary || ''}
                  onChange={(e) => handleFieldChange('salary', e.target.value)}
                  placeholder="0"
                  data-testid="input-salary"
                />
              </div>

              <div>
                <Label htmlFor="bonuses">Bonuses/Commission</Label>
                <Input
                  id="bonuses"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.bonuses || ''}
                  onChange={(e) => handleFieldChange('bonuses', e.target.value)}
                  placeholder="0"
                  data-testid="input-bonuses"
                />
              </div>

              <div>
                <Label htmlFor="freelance">Freelance/Side Gigs</Label>
                <Input
                  id="freelance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.freelance || ''}
                  onChange={(e) => handleFieldChange('freelance', e.target.value)}
                  placeholder="0"
                  data-testid="input-freelance"
                />
              </div>

              <div>
                <Label htmlFor="rentalIncome">Rental Income</Label>
                <Input
                  id="rentalIncome"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.rentalIncome || ''}
                  onChange={(e) => handleFieldChange('rentalIncome', e.target.value)}
                  placeholder="0"
                  data-testid="input-rental-income"
                />
              </div>

              <div>
                <Label htmlFor="investments">Investment Income</Label>
                <Input
                  id="investments"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.investments || ''}
                  onChange={(e) => handleFieldChange('investments', e.target.value)}
                  placeholder="0"
                  data-testid="input-investment-income"
                />
              </div>

              <div>
                <Label htmlFor="otherIncome">Other Income</Label>
                <Input
                  id="otherIncome"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.otherIncome || ''}
                  onChange={(e) => handleFieldChange('otherIncome', e.target.value)}
                  placeholder="0"
                  data-testid="input-other-income"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingDown className="mr-2 h-5 w-5 text-red-600" />
                Monthly Expenses
              </CardTitle>
              <CardDescription>
                Enter all your regular monthly expenses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="housing">Housing (Rent/Mortgage)</Label>
                <Input
                  id="housing"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.housing || ''}
                  onChange={(e) => handleFieldChange('housing', e.target.value)}
                  placeholder="0"
                  data-testid="input-housing"
                />
              </div>

              <div>
                <Label htmlFor="utilities">Utilities</Label>
                <Input
                  id="utilities"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.utilities || ''}
                  onChange={(e) => handleFieldChange('utilities', e.target.value)}
                  placeholder="0"
                  data-testid="input-utilities"
                />
              </div>

              <div>
                <Label htmlFor="groceries">Groceries</Label>
                <Input
                  id="groceries"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.groceries || ''}
                  onChange={(e) => handleFieldChange('groceries', e.target.value)}
                  placeholder="0"
                  data-testid="input-groceries"
                />
              </div>

              <div>
                <Label htmlFor="transportation">Transportation</Label>
                <Input
                  id="transportation"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.transportation || ''}
                  onChange={(e) => handleFieldChange('transportation', e.target.value)}
                  placeholder="0"
                  data-testid="input-transportation"
                />
              </div>

              <div>
                <Label htmlFor="insurance">Insurance</Label>
                <Input
                  id="insurance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.insurance || ''}
                  onChange={(e) => handleFieldChange('insurance', e.target.value)}
                  placeholder="0"
                  data-testid="input-insurance"
                />
              </div>

              <div>
                <Label htmlFor="healthcare">Healthcare</Label>
                <Input
                  id="healthcare"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.healthcare || ''}
                  onChange={(e) => handleFieldChange('healthcare', e.target.value)}
                  placeholder="0"
                  data-testid="input-healthcare"
                />
              </div>

              <div>
                <Label htmlFor="entertainment">Entertainment</Label>
                <Input
                  id="entertainment"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.entertainment || ''}
                  onChange={(e) => handleFieldChange('entertainment', e.target.value)}
                  placeholder="0"
                  data-testid="input-entertainment"
                />
              </div>

              <div>
                <Label htmlFor="dining">Dining Out</Label>
                <Input
                  id="dining"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.dining || ''}
                  onChange={(e) => handleFieldChange('dining', e.target.value)}
                  placeholder="0"
                  data-testid="input-dining"
                />
              </div>

              <div>
                <Label htmlFor="shopping">Shopping</Label>
                <Input
                  id="shopping"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.shopping || ''}
                  onChange={(e) => handleFieldChange('shopping', e.target.value)}
                  placeholder="0"
                  data-testid="input-shopping"
                />
              </div>

              <div>
                <Label htmlFor="subscriptions">Subscriptions</Label>
                <Input
                  id="subscriptions"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.subscriptions || ''}
                  onChange={(e) => handleFieldChange('subscriptions', e.target.value)}
                  placeholder="0"
                  data-testid="input-subscriptions"
                />
              </div>

              <div>
                <Label htmlFor="otherExpenses">Other Expenses</Label>
                <Input
                  id="otherExpenses"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyFinancials.otherExpenses || ''}
                  onChange={(e) => handleFieldChange('otherExpenses', e.target.value)}
                  placeholder="0"
                  data-testid="input-other-expenses"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div variants={itemVariants} className="flex justify-between pt-8">
        <Button 
          onClick={onBack} 
          variant="outline"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Liabilities
        </Button>
        
        <Button 
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90"
          data-testid="button-next"
        >
          View Results
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}