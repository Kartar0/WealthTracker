import jsPDF from 'jspdf';
import { Assets, Liabilities } from '@shared/schema';
import { formatCurrency, Currency } from './currency';

export interface NetWorthData {
  assets: Assets;
  liabilities: Liabilities;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  currency: Currency;
}

export function exportToPDF(data: NetWorthData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Net Worth Report', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;

  // Summary
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Assets: ${formatCurrency(data.totalAssets, data.currency)}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Total Liabilities: ${formatCurrency(data.totalLiabilities, data.currency)}`, 20, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'bold');
  doc.text(`Net Worth: ${formatCurrency(data.netWorth, data.currency)}`, 20, yPosition);
  yPosition += 15;

  // Assets Breakdown
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Assets Breakdown', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const assetCategories = [
    { name: 'Cash & Bank Accounts', items: [
      { label: 'Checking Account', value: data.assets.checking },
      { label: 'Savings Account', value: data.assets.savings },
      { label: 'Cash on Hand', value: data.assets.cash },
    ]},
    { name: 'Real Estate', items: [
      { label: 'Primary Residence', value: data.assets.primaryHome },
      { label: 'Rental Properties', value: data.assets.rentalProperty },
      { label: 'Other Real Estate', value: data.assets.otherRealEstate },
    ]},
    { name: 'Investments', items: [
      { label: 'Stocks & ETFs', value: data.assets.stocks },
      { label: 'Retirement Accounts', value: data.assets.retirement },
      { label: 'Bonds & Fixed Income', value: data.assets.bonds },
    ]},
    { name: 'Personal Property', items: [
      { label: 'Vehicles', value: data.assets.vehicles },
      { label: 'Jewelry & Valuables', value: data.assets.jewelry },
      { label: 'Business Ownership', value: data.assets.business },
    ]},
  ];

  assetCategories.forEach(category => {
    const categoryTotal = category.items.reduce((sum, item) => sum + item.value, 0);
    if (categoryTotal > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text(category.name, 20, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'normal');
      category.items.forEach(item => {
        if (item.value > 0) {
          doc.text(`  ${item.label}: ${formatCurrency(item.value, data.currency)}`, 25, yPosition);
          yPosition += 4;
        }
      });
      yPosition += 3;
    }
  });

  // Liabilities Breakdown
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Liabilities Breakdown', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const liabilityCategories = [
    { name: 'Mortgages & Home Loans', items: [
      { label: 'Primary Mortgage', value: data.liabilities.primaryMortgage },
      { label: 'Home Equity Loan', value: data.liabilities.homeEquityLoan },
      { label: 'Investment Property Mortgage', value: data.liabilities.investmentMortgage },
    ]},
    { name: 'Credit Card Debt', items: [
      { label: 'Credit Card 1', value: data.liabilities.creditCard1 },
      { label: 'Credit Card 2', value: data.liabilities.creditCard2 },
      { label: 'Credit Card 3', value: data.liabilities.creditCard3 },
    ]},
    { name: 'Personal & Student Loans', items: [
      { label: 'Student Loans', value: data.liabilities.studentLoan },
      { label: 'Personal Loans', value: data.liabilities.personalLoan },
      { label: 'Other Debt', value: data.liabilities.otherDebt },
    ]},
    { name: 'Vehicle Loans', items: [
      { label: 'Car Loan 1', value: data.liabilities.carLoan1 },
      { label: 'Car Loan 2', value: data.liabilities.carLoan2 },
    ]},
  ];

  liabilityCategories.forEach(category => {
    const categoryTotal = category.items.reduce((sum, item) => sum + item.value, 0);
    if (categoryTotal > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text(category.name, 20, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'normal');
      category.items.forEach(item => {
        if (item.value > 0) {
          doc.text(`  ${item.label}: ${formatCurrency(item.value, data.currency)}`, 25, yPosition);
          yPosition += 4;
        }
      });
      yPosition += 3;
    }
  });

  if (data.totalLiabilities === 0) {
    doc.text('No liabilities reported.', 20, yPosition);
  }

  // Save the PDF
  const fileName = `net-worth-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

export function exportToJSON(data: NetWorthData): void {
  const exportData = {
    timestamp: new Date().toISOString(),
    currency: data.currency,
    netWorth: data.netWorth,
    totalAssets: data.totalAssets,
    totalLiabilities: data.totalLiabilities,
    debtToAssetRatio: data.totalAssets > 0 ? Math.round((data.totalLiabilities / data.totalAssets) * 100) : 0,
    assets: data.assets,
    liabilities: data.liabilities,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `net-worth-report-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}
