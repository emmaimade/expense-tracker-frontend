import { Plus, Upload, Download } from 'lucide-react';

const ExpensesHeader = ({ onAddExpense, onExport, loading }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Manage and track your spending</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAddExpense}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:bg-gray-500 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={onExport}
            disabled={loading}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:bg-gray-500 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpensesHeader;