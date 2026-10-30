import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { toast } from 'react-toastify';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../common/Card';
import CurrencyConversionModal from '../modals/CurrencyConversionModal';
import { CURRENCIES } from '../currencies';

// One setting per row: label on the left, control on the right (stacked on mobile)
const SettingRow = ({ label, description, children }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4 first:pt-0 last:pb-0">
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      )}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

// Segmented control built on radio inputs so it stays keyboard and screen-reader friendly
const OptionGroup = ({ name, label, value, options, onChange, disabled }) => (
  <div role="radiogroup" aria-label={label} className="inline-flex w-full sm:w-auto bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
    {options.map((option) => {
      const Icon = option.icon;
      const selected = value === option.value;
      return (
        <label
          key={option.value}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors whitespace-nowrap has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 ${
            selected
              ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selected}
            onChange={() => onChange(option.value)}
            disabled={disabled}
            className="sr-only"
          />
          {Icon && <Icon className="w-4 h-4" />}
          {option.label}
        </label>
      );
    })}
  </div>
);

const PreferencesSection = ({ onCurrencyChangeComplete }) => {
  const { preferences, updatePreferences, changeCurrency } = usePreferencesContext();
  const [isSavingCurrency, setIsSavingCurrency] = useState(false);
  const [conversion, setConversion] = useState(null);

  const currency = preferences.currency || 'USD';

  const formatSample = (currencyDisplay) => {
    try {
      return new Intl.NumberFormat(navigator?.language || 'en-US', {
        style: 'currency',
        currency,
        currencyDisplay: currencyDisplay === 'code' ? 'code' : currency === 'NGN' ? 'narrowSymbol' : 'symbol',
      }).format(1234);
    } catch {
      return `${currency} 1,234`;
    }
  };

  const finishCurrencyChange = async (result, newCurrency) => {
    if (result?.converted) {
      const eCount = result.conversion?.expenses?.converted || 0;
      const bCount = result.conversion?.budgets?.converted || 0;
      toast.success(`Currency updated! Converted ${eCount} expenses and ${bCount} budgets.`, { autoClose: 5000 });
    } else {
      toast.success(`Currency updated to ${newCurrency}!`);
    }
    if (onCurrencyChangeComplete) await onCurrencyChangeComplete();
  };

  const showConversionPrompt = (existingData, newCurrency) => {
    setConversion({
      currentCurrency: currency,
      newCurrency,
      expenseCount: existingData?.expenseCount || 0,
      budgetCount: existingData?.budgetCount || 0,
    });
  };

  const handleCurrencyChange = async (newCurrency) => {
    if (newCurrency === currency) return;
    setIsSavingCurrency(true);
    try {
      // Without convertExisting the API either switches straight away or asks what to do with existing data
      const result = await changeCurrency(newCurrency, undefined);
      if (result?.requiresConversion) {
        showConversionPrompt(result.existingData, newCurrency);
        return;
      }
      await finishCurrencyChange(result, newCurrency);
    } catch (error) {
      if (error?.data?.requiresConversion) {
        showConversionPrompt(error.data.existingData, newCurrency);
      } else {
        console.error('Currency change error:', error);
        toast.error(error.message || 'Failed to update currency');
      }
    } finally {
      setIsSavingCurrency(false);
    }
  };

  const handleConfirmConversion = async (convertExisting) => {
    const newCurrency = conversion.newCurrency;
    setIsSavingCurrency(true);
    try {
      const result = await changeCurrency(newCurrency, convertExisting);
      if (result?.success !== false) {
        setConversion(null);
        await finishCurrencyChange(result, newCurrency);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error(error.message || 'Failed to update currency');
    } finally {
      setIsSavingCurrency(false);
    }
  };

  return (
    <Card>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        <SettingRow label="Theme">
          <OptionGroup
            name="theme"
            label="Theme"
            value={preferences.theme || 'light'}
            onChange={(theme) => updatePreferences({ theme })}
            options={[
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
            ]}
          />
        </SettingRow>

        <SettingRow label="Currency" description="Used for new expenses and budgets">
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            disabled={isSavingCurrency}
            aria-label="Currency"
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} – {curr.name} ({curr.symbol})
              </option>
            ))}
          </select>
        </SettingRow>

        <SettingRow label="Show amounts as">
          <OptionGroup
            name="currencyFormat"
            label="Show amounts as"
            value={preferences.currencyFormat || 'symbol'}
            onChange={(currencyFormat) => updatePreferences({ currencyFormat })}
            options={[
              { value: 'symbol', label: formatSample('symbol') },
              { value: 'code', label: formatSample('code') },
            ]}
          />
        </SettingRow>

        <SettingRow label="Text size">
          <OptionGroup
            name="fontSize"
            label="Text size"
            value={preferences.fontSize || 'md'}
            onChange={(fontSize) => updatePreferences({ fontSize })}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
        </SettingRow>
      </div>

      <CurrencyConversionModal
        conversion={conversion}
        isSaving={isSavingCurrency}
        onConfirm={handleConfirmConversion}
        onCancel={() => setConversion(null)}
      />
    </Card>
  );
};

export default PreferencesSection;
