import { useState, useCallback, useEffect } from 'react';
import { Assets, Liabilities, MonthlyFinancials } from '@shared/schema';
import { Currency } from '@/lib/currency';

interface NetWorthData {
  assets: Assets;
  liabilities: Liabilities;
  monthlyFinancials: MonthlyFinancials;
  currency: Currency;
}

interface NetWorthCalculations {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToAssetRatio: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
}

const defaultAssets: Assets = {
  checking: 0,
  savings: 0,
  cash: 0,
  primaryHome: 0,
  rentalProperty: 0,
  otherRealEstate: 0,
  stocks: 0,
  retirement: 0,
  bonds: 0,
  vehicles: 0,
  jewelry: 0,
  business: 0,
};

const defaultLiabilities: Liabilities = {
  primaryMortgage: 0,
  homeEquityLoan: 0,
  investmentMortgage: 0,
  creditCard1: 0,
  creditCard2: 0,
  creditCard3: 0,
  studentLoan: 0,
  personalLoan: 0,
  otherDebt: 0,
  carLoan1: 0,
  carLoan2: 0,
};

const defaultMonthlyFinancials: MonthlyFinancials = {
  salary: 0,
  bonuses: 0,
  freelance: 0,
  rentalIncome: 0,
  investments: 0,
  otherIncome: 0,
  housing: 0,
  utilities: 0,
  groceries: 0,
  transportation: 0,
  insurance: 0,
  healthcare: 0,
  entertainment: 0,
  dining: 0,
  shopping: 0,
  subscriptions: 0,
  otherExpenses: 0,
};

export function useNetWorth() {
  const [data, setData] = useState<NetWorthData>({
    assets: defaultAssets,
    liabilities: defaultLiabilities,
    monthlyFinancials: defaultMonthlyFinancials,
    currency: 'USD',
  });

  const [calculations, setCalculations] = useState<NetWorthCalculations>({
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    debtToAssetRatio: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyCashFlow: 0,
  });

  const calculateTotals = useCallback((assets: Assets, liabilities: Liabilities, monthlyFinancials: MonthlyFinancials) => {
    const totalAssets = Object.values(assets).reduce((sum, value) => sum + (value || 0), 0);
    const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + (value || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    const debtToAssetRatio = totalAssets > 0 ? Math.round((totalLiabilities / totalAssets) * 100) : 0;

    const monthlyIncome = monthlyFinancials.salary + monthlyFinancials.bonuses + monthlyFinancials.freelance + monthlyFinancials.rentalIncome + monthlyFinancials.investments + monthlyFinancials.otherIncome;
    const monthlyExpenses = monthlyFinancials.housing + monthlyFinancials.utilities + monthlyFinancials.groceries + monthlyFinancials.transportation + monthlyFinancials.insurance + monthlyFinancials.healthcare + monthlyFinancials.entertainment + monthlyFinancials.dining + monthlyFinancials.shopping + monthlyFinancials.subscriptions + monthlyFinancials.otherExpenses;
    const monthlyCashFlow = monthlyIncome - monthlyExpenses;

    return {
      totalAssets,
      totalLiabilities,
      netWorth,
      debtToAssetRatio,
      monthlyIncome,
      monthlyExpenses,
      monthlyCashFlow,
    };
  }, []);

  const updateAssets = useCallback((newAssets: Partial<Assets>) => {
    setData(prev => {
      const updatedAssets = { ...prev.assets, ...newAssets };
      const newCalculations = calculateTotals(updatedAssets, prev.liabilities, prev.monthlyFinancials);
      setCalculations(newCalculations);
      
      return {
        ...prev,
        assets: updatedAssets,
      };
    });
  }, [calculateTotals]);

  const updateLiabilities = useCallback((newLiabilities: Partial<Liabilities>) => {
    setData(prev => {
      const updatedLiabilities = { ...prev.liabilities, ...newLiabilities };
      const newCalculations = calculateTotals(prev.assets, updatedLiabilities, prev.monthlyFinancials);
      setCalculations(newCalculations);
      
      return {
        ...prev,
        liabilities: updatedLiabilities,
      };
    });
  }, [calculateTotals]);

  const updateMonthlyFinancials = useCallback((newMonthlyFinancials: Partial<MonthlyFinancials>) => {
    setData(prev => {
      const updatedMonthlyFinancials = { ...prev.monthlyFinancials, ...newMonthlyFinancials };
      const newCalculations = calculateTotals(prev.assets, prev.liabilities, updatedMonthlyFinancials);
      setCalculations(newCalculations);
      
      return {
        ...prev,
        monthlyFinancials: updatedMonthlyFinancials,
      };
    });
  }, [calculateTotals]);

  const updateCurrency = useCallback((currency: Currency) => {
    setData(prev => ({
      ...prev,
      currency,
    }));
  }, []);

  const reset = useCallback(() => {
    setData({
      assets: defaultAssets,
      liabilities: defaultLiabilities,
      monthlyFinancials: defaultMonthlyFinancials,
      currency: 'USD',
    });
    setCalculations({
      totalAssets: 0,
      totalLiabilities: 0,
      netWorth: 0,
      debtToAssetRatio: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      monthlyCashFlow: 0,
    });
  }, []);

  const saveToLocalStorage = useCallback(() => {
    try {
      const dataToSave = {
        ...data,
        ...calculations,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('netWorthData', JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }, [data, calculations]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem('netWorthData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setData({
          assets: parsed.assets || defaultAssets,
          liabilities: parsed.liabilities || defaultLiabilities,
          monthlyFinancials: parsed.monthlyFinancials || defaultMonthlyFinancials,
          currency: parsed.currency || 'USD',
        });
        
        const newCalculations = calculateTotals(
          parsed.assets || defaultAssets,
          parsed.liabilities || defaultLiabilities,
          parsed.monthlyFinancials || defaultMonthlyFinancials
        );
        setCalculations(newCalculations);
        return true;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return false;
  }, [calculateTotals]);

  // Load data on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Auto-save on data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage();
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, calculations, saveToLocalStorage]);

  return {
    data,
    calculations,
    updateAssets,
    updateLiabilities,
    updateMonthlyFinancials,
    updateCurrency,
    reset,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
}
