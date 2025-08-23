import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Assets, Liabilities, MonthlyFinancials } from '@shared/schema';
import { formatCurrency, Currency } from '@/lib/currency';
import { exportToPDF, exportToJSON } from '@/lib/export';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, PieChart, PlusCircle, MinusCircle, Percent, Printer, Download, Smile, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface ResultsDashboardProps {
  assets: Assets;
  liabilities: Liabilities;
  monthlyFinancials: MonthlyFinancials;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToAssetRatio: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  currency: Currency;
  onBack: () => void;
  onReset: () => void;
}

export function ResultsDashboard({
  assets,
  liabilities,
  monthlyFinancials,
  totalAssets,
  totalLiabilities,
  netWorth,
  debtToAssetRatio,
  monthlyIncome,
  monthlyExpenses,
  monthlyCashFlow,
  currency,
  onBack,
  onReset,
}: ResultsDashboardProps) {
  const assetsChartRef = useRef<HTMLCanvasElement>(null);
  const comparisonChartRef = useRef<HTMLCanvasElement>(null);
  const assetsChartInstance = useRef<Chart | null>(null);
  const comparisonChartInstance = useRef<Chart | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const data = {
      assets,
      liabilities,
      totalAssets,
      totalLiabilities,
      netWorth,
      currency,
    };
    exportToPDF(data);
  };

  const handleExportJSON = () => {
    const data = {
      assets,
      liabilities,
      monthlyFinancials,
      totalAssets,
      totalLiabilities,
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      monthlyCashFlow,
      currency,
    };
    exportToJSON(data);
  };

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? This will clear all entered data.')) {
      onReset();
    }
  };

  // Asset category calculations
  const assetCategories = [
    {
      name: 'Cash & Bank',
      value: (assets.checking || 0) + (assets.savings || 0) + (assets.cash || 0),
      icon: 'university',
      color: '#00BCD4',
    },
    {
      name: 'Real Estate',
      value: (assets.primaryHome || 0) + (assets.rentalProperty || 0) + (assets.otherRealEstate || 0),
      icon: 'home',
      color: '#1565C0',
    },
    {
      name: 'Investments',
      value: (assets.stocks || 0) + (assets.retirement || 0) + (assets.bonds || 0),
      icon: 'chart-line',
      color: '#2E7D32',
    },
    {
      name: 'Personal Property',
      value: (assets.vehicles || 0) + (assets.jewelry || 0) + (assets.business || 0),
      icon: 'car',
      color: '#FF9800',
    },
  ];

  const liabilityCategories = [
    {
      name: 'Mortgages & Home Loans',
      value: (liabilities.primaryMortgage || 0) + (liabilities.homeEquityLoan || 0) + (liabilities.investmentMortgage || 0),
      icon: 'home',
    },
    {
      name: 'Credit Card Debt',
      value: (liabilities.creditCard1 || 0) + (liabilities.creditCard2 || 0) + (liabilities.creditCard3 || 0),
      icon: 'credit-card',
    },
    {
      name: 'Personal & Student Loans',
      value: (liabilities.studentLoan || 0) + (liabilities.personalLoan || 0) + (liabilities.otherDebt || 0),
      icon: 'graduation-cap',
    },
    {
      name: 'Vehicle Loans',
      value: (liabilities.carLoan1 || 0) + (liabilities.carLoan2 || 0),
      icon: 'car',
    },
  ];

  // Filter out zero-value categories
  const nonZeroAssetCategories = assetCategories.filter(cat => cat.value > 0);
  const nonZeroLiabilityCategories = liabilityCategories.filter(cat => cat.value > 0);

  // Initialize charts
  useEffect(() => {
    if (assetsChartRef.current) {
      // Destroy existing chart
      if (assetsChartInstance.current) {
        assetsChartInstance.current.destroy();
      }

      if (nonZeroAssetCategories.length > 0) {
        const ctx = assetsChartRef.current.getContext('2d');
        if (ctx) {
          const config: ChartConfiguration = {
            type: 'doughnut',
            data: {
              labels: nonZeroAssetCategories.map(cat => cat.name),
              datasets: [{
                data: nonZeroAssetCategories.map(cat => cat.value),
                backgroundColor: nonZeroAssetCategories.map(cat => cat.color),
                borderWidth: 2,
                borderColor: '#FFFFFF',
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    font: {
                      family: 'Inter',
                    },
                  },
                },
              },
            },
          };

          assetsChartInstance.current = new Chart(ctx, config);
        }
      }
    }

    if (comparisonChartRef.current) {
      // Destroy existing chart
      if (comparisonChartInstance.current) {
        comparisonChartInstance.current.destroy();
      }

      const ctx = comparisonChartRef.current.getContext('2d');
      if (ctx) {
        const config: ChartConfiguration = {
          type: 'bar',
          data: {
            labels: ['Assets', 'Liabilities', 'Net Worth'],
            datasets: [{
              data: [totalAssets, totalLiabilities, Math.abs(netWorth)],
              backgroundColor: [
                '#2E7D32',
                '#F44336',
                netWorth >= 0 ? '#1565C0' : '#F44336',
              ],
              borderRadius: 4,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return formatCurrency(Number(value), currency);
                  },
                  font: {
                    family: 'Inter',
                  },
                },
              },
              x: {
                ticks: {
                  font: {
                    family: 'Inter',
                  },
                },
              },
            },
          },
        };

        comparisonChartInstance.current = new Chart(ctx, config);
      }
    }

    return () => {
      if (assetsChartInstance.current) {
        assetsChartInstance.current.destroy();
      }
      if (comparisonChartInstance.current) {
        comparisonChartInstance.current.destroy();
      }
    };
  }, [nonZeroAssetCategories, totalAssets, totalLiabilities, netWorth, currency]);

  return (
    <div className="space-y-8 print-section">
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-cyan-500 text-white rounded-lg p-2 mr-3">
                <PieChart className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Your Net Worth Summary</CardTitle>
                <p className="text-gray-600">Your complete financial overview</p>
              </div>
            </div>
            
            <div className="flex space-x-3 no-print">
              <Button 
                onClick={handlePrint} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                data-testid="button-print"
              >
                <Printer className="mr-2 h-4 w-4" />Print
              </Button>
              <Button 
                onClick={handleExportPDF} 
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-export-pdf"
              >
                <Download className="mr-2 h-4 w-4" />Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Net Worth Display */}
          <div className="text-center mb-8 p-6 bg-gradient-to-r from-primary to-cyan-500 text-white rounded-lg">
            <h3 className="text-lg font-medium mb-2">Your Total Net Worth</h3>
            <div className="text-4xl font-bold mb-2" data-testid="net-worth-amount">
              {netWorth >= 0 ? '' : '-'}{formatCurrency(Math.abs(netWorth), currency)}
            </div>
            <p className="text-sm opacity-90" data-testid="net-worth-description">
              {netWorth >= 0 ? 'Assets minus Liabilities' : 'Negative Net Worth (Liabilities exceed Assets)'}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 text-2xl mb-2">
                <PlusCircle className="h-8 w-8 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Total Assets</h4>
              <div className="text-xl font-bold text-green-600" data-testid="summary-assets">
                {formatCurrency(totalAssets, currency)}
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 text-2xl mb-2">
                <MinusCircle className="h-8 w-8 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Total Liabilities</h4>
              <div className="text-xl font-bold text-red-600" data-testid="summary-liabilities">
                {formatCurrency(totalLiabilities, currency)}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-primary text-2xl mb-2">
                <Percent className="h-8 w-8 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Debt-to-Asset Ratio</h4>
              <div className="text-xl font-bold text-primary" data-testid="debt-ratio">
                {debtToAssetRatio}%
              </div>
            </div>
          </div>

          {/* Monthly Cash Flow Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 text-2xl mb-2">
                <TrendingUp className="h-8 w-8 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Monthly Income</h4>
              <div className="text-xl font-bold text-green-600" data-testid="summary-monthly-income">
                {formatCurrency(monthlyIncome, currency)}
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 text-2xl mb-2">
                <TrendingDown className="h-8 w-8 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Monthly Expenses</h4>
              <div className="text-xl font-bold text-red-600" data-testid="summary-monthly-expenses">
                {formatCurrency(monthlyExpenses, currency)}
              </div>
            </div>
            
            <div className={`${monthlyCashFlow >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} rounded-lg p-6 text-center`}>
              <div className={`${monthlyCashFlow >= 0 ? 'text-primary' : 'text-orange-600'} text-2xl mb-2`}>
                <DollarSign className="h-8 w-8 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Monthly Cash Flow</h4>
              <div className={`text-xl font-bold ${monthlyCashFlow >= 0 ? 'text-primary' : 'text-orange-600'}`} data-testid="summary-cash-flow">
                {formatCurrency(monthlyCashFlow, currency)}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Asset Breakdown Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Asset Breakdown</h4>
              <div className="relative h-64">
                {nonZeroAssetCategories.length > 0 ? (
                  <canvas ref={assetsChartRef} data-testid="assets-chart"></canvas>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <PlusCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No assets to display</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Net Worth vs Debt Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Assets vs Liabilities</h4>
              <div className="relative h-64">
                <canvas ref={comparisonChartRef} data-testid="comparison-chart"></canvas>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assets Breakdown */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Assets Breakdown</h4>
              <div className="space-y-3" data-testid="assets-breakdown">
                {nonZeroAssetCategories.map((category) => {
                  const percentage = totalAssets > 0 ? Math.round((category.value / totalAssets) * 100) : 0;
                  return (
                    <div key={category.name} className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                      <div className="flex items-center">
                        <PlusCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(category.value, currency)}</div>
                        <div className="text-sm text-gray-600">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
                {nonZeroAssetCategories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <PlusCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No assets entered</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Liabilities Breakdown */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Liabilities Breakdown</h4>
              <div className="space-y-3" data-testid="liabilities-breakdown">
                {nonZeroLiabilityCategories.map((category) => {
                  const percentage = totalLiabilities > 0 ? Math.round((category.value / totalLiabilities) * 100) : 0;
                  return (
                    <div key={category.name} className="flex items-center justify-between p-3 bg-red-50 rounded-md">
                      <div className="flex items-center">
                        <MinusCircle className="h-5 w-5 text-red-600 mr-3" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(category.value, currency)}</div>
                        <div className="text-sm text-gray-600">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
                {nonZeroLiabilityCategories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Smile className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p className="font-medium text-green-600">No liabilities! Great job!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between no-print">
            <Button 
              onClick={onBack} 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 font-medium"
              data-testid="button-back-liabilities"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Liabilities
            </Button>
            <Button 
              onClick={handleStartOver} 
              className="bg-primary hover:bg-blue-700 text-white px-6 py-3 font-medium"
              data-testid="button-start-over"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
