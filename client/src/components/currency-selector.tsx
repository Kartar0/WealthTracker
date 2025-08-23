import { Currency, currencies } from '@/lib/currency';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="currency" className="text-sm font-medium text-gray-600">
        Currency:
      </Label>
      <Select value={value} onValueChange={(val) => onChange(val as Currency)}>
        <SelectTrigger 
          id="currency" 
          className="w-32 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
          data-testid="select-currency"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.value} value={currency.value}>
              {currency.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
