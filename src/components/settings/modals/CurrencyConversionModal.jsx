import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { getCurrencySymbol } from '../currencies';

// Asks whether existing expenses and budgets should be converted when the currency changes
const CurrencyConversionModal = ({ conversion, isSaving, onConfirm, onCancel }) => {
  const [convertExisting, setConvertExisting] = useState(false);

  useEffect(() => {
    if (conversion) setConvertExisting(false);
  }, [conversion]);

  if (!conversion) return null;

  const optionClass = (selected) =>
    `flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
      selected
        ? 'border-indigo-500 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
    }`;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="currency-conversion-title"
      >
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 id="currency-conversion-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Switch from {conversion.currentCurrency} to {conversion.newCurrency}?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              You have {conversion.expenseCount} expenses and {conversion.budgetCount} budgets
              in {conversion.currentCurrency} ({getCurrencySymbol(conversion.currentCurrency)}).
              What should happen to them?
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <label className={optionClass(convertExisting)}>
            <input
              type="radio"
              name="conversionChoice"
              checked={convertExisting === true}
              onChange={() => setConvertExisting(true)}
              className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Convert all existing data
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                All expenses and budgets will be converted using current exchange rates.
                Original amounts will be preserved for reference.
              </p>
            </div>
          </label>

          <label className={optionClass(!convertExisting)}>
            <input
              type="radio"
              name="conversionChoice"
              checked={convertExisting === false}
              onChange={() => setConvertExisting(false)}
              className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Keep amounts unchanged
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Only new expenses will use {conversion.newCurrency}.
                Existing amounts stay the same (numbers won't change).
              </p>
            </div>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-900 dark:text-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(convertExisting)}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSaving ? 'Processing...' : 'Change currency'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConversionModal;
