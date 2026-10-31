import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, ReferenceLine } from 'recharts';
import { useChartData } from '../hooks/useChartData';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

// One color for categories: the bars are already labelled, so extra hues add noise
const BAR_COLOR = '#4f46e5';
const OVER_BUDGET_COLOR = '#ef4444';
const CHART_HEIGHT = 320;
const CATEGORY_CHART_HEIGHT = 280;

// ────── Reusable Empty State Component ──────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
    <svg className="w-12 h-12 mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <p className="text-sm font-medium">No data available</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add expenses to see insights</p>
  </div>
);

// ────── Stats Grid Component ──────
const StatsGrid = ({ avg, max, min, formatCurrency }) => (
  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Average</p>
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(Math.round(avg))}</p>
    </div>
    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Highest</p>
      <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(max)}</p>
    </div>
    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Lowest</p>
      <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(min)}</p>
    </div>
  </div>
);

// ────── Main Component ──────
const AnalyticsDashboard = ({ categoryData = [], monthlyData = [], timeRange = '6months', monthlyBudget = 0 }) => {
  const chartData = useChartData(categoryData, monthlyData, timeRange);
  const { formatCurrency, getCurrencySymbol, theme, currencyFormat } = usePreferencesContext();

  const isDark = theme === 'dark';

  const TOOLTIP_STYLE = {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
  };

  const tooltipLabelStyle = { color: isDark ? '#d1d5db' : '#374151', fontWeight: 500 };
  const tooltipItemStyle  = { color: isDark ? '#f9fafb' : '#111827' };
  const CURSOR_FILL       = isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)';
  const axisTickColor     = isDark ? '#9ca3af' : '#6b7280';
  const axisLineColor     = isDark ? '#4b5563' : '#d1d5db';
  const gridColor         = isDark ? '#374151' : '#e5e7eb';

  const axisFormatter = (v) => {
    const num = Number(v);
    if (isNaN(num)) return formatCurrency(0);
    const joiner = currencyFormat === 'code' ? ' ' : '';
    return num >= 1000
      ? `${getCurrencySymbol()}${joiner}${(num / 1000).toFixed(0)}k`
      : `${getCurrencySymbol()}${joiner}${num}`;
  };

  const { top5, catTotal, hasCategoryData, monthlyDataFiltered, monthlyAvg, monthMax, monthMin, hasMonthlyData, monthsCount } = chartData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* ────── Monthly Trends Chart ────── */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Trends</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Last {monthsCount} months • {formatCurrency(Math.round(monthlyAvg))} avg
            {monthlyBudget > 0 && <> • dashed line is your {formatCurrency(monthlyBudget)} monthly budget</>}
          </p>
        </div>
        <div style={{ height: CHART_HEIGHT }} role="img" aria-label="Monthly spending trends chart">
          {hasMonthlyData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDataFiltered} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: axisTickColor }} axisLine={{ stroke: axisLineColor }} />
                <YAxis tick={{ fontSize: 12, fill: axisTickColor }} axisLine={{ stroke: axisLineColor }} tickFormatter={axisFormatter} />
                <Tooltip
                  formatter={(v) => [formatCurrency(v), 'Spending']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                  cursor={{ fill: CURSOR_FILL }}
                />
                {monthlyBudget > 0 && (
                  <ReferenceLine
                    y={monthlyBudget}
                    stroke={axisTickColor}
                    strokeDasharray="6 4"
                    ifOverflow="extendDomain"
                    label={{ value: 'Budget', position: 'insideTopRight', fill: axisTickColor, fontSize: 12 }}
                  />
                )}
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} minPointSize={5}>
                  {/* Months over budget stand out in red */}
                  {monthlyDataFiltered.map((m) => (
                    <Cell key={m.key} fill={monthlyBudget > 0 && m.amount > monthlyBudget ? OVER_BUDGET_COLOR : BAR_COLOR} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState />}
        </div>
        {hasMonthlyData && <StatsGrid avg={monthlyAvg} max={monthMax} min={monthMin} formatCurrency={formatCurrency} />}
      </Card>
      {/* ────── Top Spending Categories Chart ────── */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Spending Categories</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Last {monthsCount} months • Top {top5.length} categories • {formatCurrency(catTotal)} total
          </p>
        </div>
        <div style={{ height: CATEGORY_CHART_HEIGHT }} role="img" aria-label={`Top ${top5.length} spending categories chart`}>
          {hasCategoryData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5} layout="vertical" margin={{ top: 10, right: 70, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: axisTickColor, fontWeight: 'medium' }} width={90} />
                <XAxis type="number" axisLine={{ stroke: axisLineColor }} tickLine={false} tickFormatter={axisFormatter} tick={{ fontSize: 12, fill: axisTickColor }} />
                <Tooltip
                  cursor={{ fill: CURSOR_FILL }}
                  formatter={(v) => [
                    `${formatCurrency(v)} (${catTotal > 0 ? ((v / catTotal) * 100).toFixed(0) : 0}% of top ${top5.length})`,
                    'Spending',
                  ]}
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                />
                <Bar dataKey="value" fill={BAR_COLOR} radius={[0, 4, 4, 0]} barSize={20} minPointSize={2}>
                  <LabelList
                    dataKey="value"
                    position="right"
                    formatter={(v) => formatCurrency(v)}
                    style={{ fontSize: 12, fill: axisTickColor, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState />}
        </div>
      </Card>

    </div>
  );
};

export default AnalyticsDashboard;
