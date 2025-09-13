import { useState } from 'react';
import { X } from 'lucide-react';

const ExportModal = ({ isOpen, onClose, onExport, loading, error, setError }) => {
  const [exportOptions, setExportOptions] = useState({
    fileFormat: 'csv',
    category: 'all',
    startDate: '',
    endDate: ''
  });

  const setQuickDateRange = (rangeType) => {
    const today = new Date();
    let startDate, endDate;

    switch (rangeType) {
      case 'weekly':
        endDate = today;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        endDate = today;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case 'three-months':
        endDate = today;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        return;
    }

    if (endDate > today) {
      endDate = today;
    }

    if (startDate > endDate) {
      setError && setError('Start date cannot be after end date.');
      return;
    }

    const dateRangeUpdate = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };

    setExportOptions(prev => ({
      ...prev,
      ...dateRangeUpdate
    }));
    setError && setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onExport(exportOptions);
    
    // Reset form on success
    setExportOptions({ 
      fileFormat: 'csv', 
      category: 'all', 
      startDate: '', 
      endDate: '' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Export Expenses
          </h3>
          <button
            onClick={() => {
              onClose();
              setError && setError(null);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select
              value={exportOptions.fileFormat}
              onChange={(e) => setExportOptions({ ...exportOptions, fileFormat: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            >
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={exportOptions.category}
              onChange={(e) => setExportOptions({ ...exportOptions, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            >
              <option value="all">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Leisure">Leisure</option>
              <option value="Electronics">Electronics</option>
              <option value="Utilities">Utilities</option>
              <option value="Clothing">Clothing</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setQuickDateRange("weekly")}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setQuickDateRange("monthly")}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Last Month
            </button>
            <button
              type="button"
              onClick={() => setQuickDateRange("three-months")}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Last 3 Months
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={exportOptions.startDate}
              onChange={(e) => {
                setExportOptions({ ...exportOptions, startDate: e.target.value });
                setError && setError(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={exportOptions.endDate}
              onChange={(e) => {
                setExportOptions({ ...exportOptions, endDate: e.target.value });
                setError && setError(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setError && setError(null);
              }}
              className="flex-1 px-3 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Exporting..." : "Export"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportModal;