import { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from './hooks/useAnalytics';
import AnalyticsMetricsCards from './components/AnalyticsMetricsCards';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CategoryBudgets from './components/CategoryBudgets';
import AnalyticsInsights from './components/AnalyticsInsights';
import Card from '../common/Card';
import { AnalyticsPageSkeleton } from '../common/AnalyticsSkeletons';

const AnalyticsContent = ({ recentTransactions }) => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('6months');
  const [dateRangeType, setDateRangeType] = useState('month');

  const { analytics, categoryBudgets, isLoading, error, trendInsight, exportToCSV } =
    useAnalytics(recentTransactions, timeRange);

  const transactionsNotReady = recentTransactions === null || recentTransactions === undefined;
  const analyticsNotReady   = analytics === null || analytics === undefined;
  const isInitialLoad       = transactionsNotReady || (isLoading && analyticsNotReady);
  const isRefetching        = isLoading && !transactionsNotReady && !analyticsNotReady;
  const hasData             = analytics && (
    (analytics.categoryData?.length > 0) ||
    (analytics.monthlyData?.length > 0)
  );

  // ── Full page skeleton on initial load ──
  if (isInitialLoad) return <AnalyticsPageSkeleton />;

  // ── Error state ──
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

      {/* ── Header ── */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Analyze your spending patterns and trends
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              disabled={isLoading}
              aria-label="Select time range for analytics"
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={exportToCSV}
              disabled={isLoading || !hasData}
              aria-label="Export analytics data as CSV"
              className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </Card>

      {/* ── Subtle refetch banner ── */}
      {isRefetching && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <p className="text-sm text-blue-700 dark:text-blue-300">Updating analytics...</p>
          </div>
        </div>
      )}

      {/* ── Metrics ── */}
      <AnalyticsMetricsCards
        analytics={analytics || { categoryData: [], monthlyData: [] }}
        isLoading={false}
        timeRange={timeRange}
      />

      {/* ── Charts ── */}
      <AnalyticsDashboard
        categoryData={analytics?.categoryData || []}
        monthlyData={analytics?.monthlyData || []}
        dateRange={dateRangeType}
        setDateRange={setDateRangeType}
        timeRange={timeRange}
      />

      {/* ── Category Budgets ── */}
      <CategoryBudgets
        categoryData={analytics?.categoryData || []}
        categoryBudgets={categoryBudgets}
        isLoading={false}
        setActiveTab={(tab) => navigate(`/dashboard/${tab}`)}
      />

      {/* ── Insights ── */}
      {!isLoading && hasData && (
        <AnalyticsInsights analytics={analytics} trendInsight={trendInsight} />
      )}

      {/* ── Empty state ── */}
      {!isLoading && !hasData && analytics && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Analytics Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start tracking your expenses to see detailed analytics and insights about your spending patterns.
          </p>
          <button
            onClick={() => navigate('/dashboard/expenses')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Add Your First Expense
          </button>
        </Card>
      )}

      {/* ── Quick Actions ── */}
      {!isLoading && hasData && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/dashboard/expenses')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Expense
            </button>
            <button
              onClick={() => navigate('/dashboard/budgets')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Manage Budgets
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
