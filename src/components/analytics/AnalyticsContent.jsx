import { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { useAnalytics } from './hooks/useAnalytics';
import AnalyticsMetricsCards from './components/AnalyticsMetricsCards';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CategoryBudgets from './components/CategoryBudgets';
import AnalyticsInsights from './components/AnalyticsInsights';
import Card from '../common/Card';
import {
  AnalyticsPageSkeleton,
  AnalyticsMetricsSkeleton,
  AnalyticsDashboardSkeleton,
  CategoryBudgetsSkeleton
} from '../common/AnalyticsSkeletons';

// ✅ REMOVED default parameter - let parent pass null explicitly
const AnalyticsContent = ({ setActiveTab, recentTransactions }) => {
  const [timeRange, setTimeRange] = useState('6months');
  const [dateRangeType, setDateRangeType] = useState('month');

  const {
    analytics,
    categoryBudgets,
    isLoading,
    error,
    trendInsight,
    exportToCSV,
  } = useAnalytics(recentTransactions, timeRange);

  // ✅ INDUSTRY STANDARD: Robust loading state detection
  // Check if transactions from parent haven't loaded yet
  const transactionsNotReady = recentTransactions === null || recentTransactions === undefined;
  
  // Check if analytics data hasn't been computed yet
  const analyticsNotReady = analytics === null || analytics === undefined;
  
  // Initial load: Either transactions or analytics not ready
  const isInitialLoad = transactionsNotReady || (isLoading && analyticsNotReady);

  // Background refetch: Has data but loading new data
  const isRefetching = isLoading && !transactionsNotReady && !analyticsNotReady;

  // Check if we have actual data (empty array means fetched but no data, null means not fetched)
  const hasData = analytics && (
    (analytics.categoryData && analytics.categoryData.length > 0) ||
    (analytics.monthlyData && analytics.monthlyData.length > 0)
  );

  // Show full page skeleton on initial load
  if (isInitialLoad) {
    return <AnalyticsPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
          Error Loading Analytics
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Analyze your spending patterns and trends
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-label="Select time range for analytics"
              disabled={isLoading}
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={exportToCSV}
              disabled={isLoading || !hasData}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Export analytics data as CSV"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </Card>

      {/* Background Refetch Indicator */}
      {isRefetching && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Updating analytics...
            </p>
          </div>
        </div>
      )}

      {/* Key Metrics Overview - Show skeleton only if loading AND data is null */}
      {isLoading && (analytics?.categoryData === null || analytics?.categoryData === undefined) ? (
        <AnalyticsMetricsSkeleton />
      ) : (
        <AnalyticsMetricsCards
          analytics={analytics || { categoryData: [], monthlyData: [] }}
          isLoading={false}
          timeRange={timeRange}
        />
      )}

      {/* Charts Section - Show skeleton only if loading AND data is null */}
      {isLoading && (analytics?.monthlyData === null || analytics?.monthlyData === undefined) ? (
        <AnalyticsDashboardSkeleton />
      ) : (
        <AnalyticsDashboard
          categoryData={analytics?.categoryData || []}
          monthlyData={analytics?.monthlyData || []}
          dateRange={dateRangeType}
          setDateRange={setDateRangeType}
          timeRange={timeRange}
        />
      )}

      {/* Category Budgets - Show skeleton only if loading AND data is null */}
      {isLoading && (categoryBudgets === null || categoryBudgets === undefined) ? (
        <CategoryBudgetsSkeleton />
      ) : (
        <CategoryBudgets
          categoryData={analytics?.categoryData || []}
          categoryBudgets={categoryBudgets}
          isLoading={false}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Insights Section - Only show when data exists and not loading */}
      {!isLoading && hasData && (
        <AnalyticsInsights analytics={analytics} trendInsight={trendInsight} />
      )}

      {/* Empty State - Show when not loading and no data (empty arrays, not null) */}
      {!isLoading && !hasData && analytics && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Analytics Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
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
        </Card>
      )}

      {/* Quick Actions - Only show when data exists */}
      {!isLoading && hasData && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
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
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Manage budgets"
            >
              Manage Budgets
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Return to dashboard"
            >
              Back to Dashboard
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsContent;