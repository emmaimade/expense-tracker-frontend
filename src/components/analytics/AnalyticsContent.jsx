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

const TIME_RANGES = [
  { value: '3months', label: '3 months' },
  { value: '6months', label: '6 months' },
  { value: '1year', label: '12 months' },
];

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

      {/* ── Toolbar ── */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="radiogroup" aria-label="Time range" className="inline-flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {TIME_RANGES.map((option) => {
            const selected = timeRange === option.value;
            return (
              <button
                key={option.value}
                role="radio"
                aria-checked={selected}
                onClick={() => setTimeRange(option.value)}
                disabled={isLoading}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-60 ${
                  selected
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={exportToCSV}
          disabled={isLoading || !hasData}
          aria-label="Export analytics data as CSV"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

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
