import { useState } from 'react';
import { Download, Calendar, AlertCircle } from 'lucide-react';
import { useAnalytics } from './hooks/useAnalytics';
import AnalyticsMetricsCards from './components/AnalyticsMetricsCards';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AnalyticsInsights from './components/AnalyticsInsights';
import Card from '../common/Card';
import { AnalyticsPageSkeleton } from '../common/AnalyticsSkeletons';

const TIME_RANGES = [
  { value: '3months', label: '3 months' },
  { value: '6months', label: '6 months' },
  { value: '1year', label: '12 months' },
];

// Trends over time; category budgets live on the Budgets page
const AnalyticsContent = ({ onAddExpense }) => {
  const [timeRange, setTimeRange] = useState('6months');

  const { analytics, isLoading, isSwitching, error, trendInsight, exportToCSV } =
    useAnalytics(timeRange);

  const isInitialLoad = analytics === null || analytics === undefined;
  const hasData             = analytics && (
    (analytics.categoryData?.length > 0) ||
    (analytics.monthlyData?.length > 0)
  );

  // ── Full page skeleton on initial load ──
  // ── Error state ──
  if (error) {
    return (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
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

  // ── Full page skeleton on initial load ──
  if (isInitialLoad) return <AnalyticsPageSkeleton />;

  return (
    <div className={`space-y-6 transition-opacity ${isSwitching ? 'opacity-60' : ''}`} aria-busy={isSwitching}>

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
        timeRange={timeRange}
        monthlyBudget={analytics?.monthlyBudget || 0}
      />

      {/* ── Insights: a slim row under the charts ── */}
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
            No expenses in this period
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Add expenses to see how your spending changes over time.
          </p>
          {onAddExpense && (
            <button
              onClick={onAddExpense}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Add expense
            </button>
          )}
        </Card>
      )}

    </div>
  );
};

export default AnalyticsContent;
