import { X } from 'lucide-react';

const DateRangeModal = ({ 
  isOpen, 
  onClose, 
  customDateRange, 
  onFetch, 
  loading, 
  error, 
  setError,
  setCustomDateRange
}) => {
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
        startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 
          new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate());
    }

    if (endDate > today) {
      endDate = today;
    }

    if (startDate > endDate) {
      setError && setError('Start date cannot be after end date.');
      return;
    }

    // Update the date range state immediately when quick range is selected
    const dateRangeUpdate = {
       startDate: startDate.toISOString().split("T")[0],
       endDate: endDate.toISOString().split("T")[0],
    };

    setCustomDateRange(dateRangeUpdate);
    setError && setError(null);
    
    // Then fetch with the range type
    onFetch(rangeType, dateRangeUpdate);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    const currentEndDate = customDateRange.endDate || new Date().toISOString().split('T')[0];
    
    if (new Date(newStartDate) <= new Date(currentEndDate)) {
      setCustomDateRange({ 
        ...customDateRange, 
        startDate: newStartDate 
      });
      setError && setError(null);
    } else {
      setError && setError('Start date cannot be after end date.');
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    const currentStartDate = customDateRange.startDate || new Date().toISOString().split('T')[0];
    
    if (new Date(currentStartDate) <= new Date(newEndDate)) {
      setCustomDateRange({ 
        ...customDateRange, 
        endDate: newEndDate 
      });
      setError && setError(null);
    } else {
      setError && setError('Start date cannot be after end date.');
    }
  };

  const handleReset = () => {
    // Clear the custom date range
    setCustomDateRange({ startDate: '', endDate: '' });
    setError && setError(null);
    
    // Fetch default data (reset to original state)
    onFetch('reset');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Date Range
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
        <div className="p-6 space-y-4">
          {/* Quick Date Range Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setQuickDateRange("weekly")}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setQuickDateRange("monthly")}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Last Month
            </button>
            <button
              type="button"
              onClick={() => setQuickDateRange("three-months")}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Last 3 Months
            </button>
          </div>

          {/* Custom Date Range Inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              onChange={handleStartDateChange}
              type="date"
              value={customDateRange?.startDate || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              onChange={handleEndDateChange}
              type="date"
              value={customDateRange.endDate || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          {/* Current Selection Display */}
          {(customDateRange.startDate || customDateRange.endDate) && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Current Selection:</p>
              <p className="text-sm text-blue-700">
                {customDateRange.startDate && customDateRange.endDate 
                  ? `${new Date(customDateRange.startDate).toLocaleDateString()} - ${new Date(customDateRange.endDate).toLocaleDateString()}`
                  : customDateRange.startDate 
                    ? `From: ${new Date(customDateRange.startDate).toLocaleDateString()}`
                    : `Until: ${new Date(customDateRange.endDate).toLocaleDateString()}`
                }
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setError && setError(null);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onFetch("custom")}
              className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={loading || (!customDateRange.startDate || !customDateRange.endDate)}
            >
              {loading ? "Fetching..." : "Apply Range"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangeModal;