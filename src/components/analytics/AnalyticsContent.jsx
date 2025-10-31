import { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { useAnalytics } from './hooks/useAnalytics';
import AnalyticsMetricsCards from './components/AnalyticsMetricsCards';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CategoryBudgets from './components/CategoryBudgets';
import AnalyticsInsights from './components/AnalyticsInsights';

const AnalyticsContent = ({ setActiveTab, recentTransactions = [] }) => {
  const [timeRange, setTimeRange] = useState('6months');
  const [dateRangeType, setDateRangeType] = useState('month');

  // Use custom hook for all analytics logic
  const {
    analytics,
    categoryBudgets,
    isLoading,
    error,
    trendInsight,
    exportToCSV,
  } = useAnalytics(recentTransactions, timeRange);

  // Error state
  if (error) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Analytics</h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Analyze your spending patterns and trends
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              aria-label="Select time range for analytics"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Export analytics data as CSV"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <AnalyticsMetricsCards
        analytics={analytics}
        isLoading={isLoading}
        timeRange={timeRange}
      />

      {/* Charts Section */}
      <AnalyticsDashboard
        categoryData={analytics.categoryData}
        monthlyData={analytics.monthlyData}
        dateRange={dateRangeType}
        setDateRange={setDateRangeType}
        timeRange={timeRange}
      />

      {/* Category Budgets */}
      <CategoryBudgets
        categoryData={analytics.categoryData}
        categoryBudgets={categoryBudgets}
        isLoading={isLoading}
        setActiveTab={setActiveTab}
      />

      {/* Insights Section */}
      {analytics.categoryData.length > 0 && (
        <AnalyticsInsights analytics={analytics} trendInsight={trendInsight} />
      )}

      {/* Empty State */}
      {analytics.categoryData.length === 0 && !isLoading && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Analytics Data Available
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start tracking your expenses to see detailed analytics and insights
            about your spending patterns.
          </p>
          <button
            onClick={() => setActiveTab("expenses")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            aria-label="Add your first expense"
          >
            Add Your First Expense
          </button>
        </div>
      )}

      {/* Quick Actions */}
      {analytics.categoryData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("expenses")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              aria-label="Add a new expense"
            >
              Add Expense
            </button>
            <button
              onClick={() => setActiveTab("budgets")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Manage budgets"
            >
              Manage Budgets
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Return to dashboard"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsContent;