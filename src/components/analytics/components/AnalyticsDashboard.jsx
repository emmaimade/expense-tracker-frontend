import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useChartData } from '../hooks/useChartData';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

const BAR_COLOR = '#4f46e5';
const OVER_BUDGET_COLOR = '#ef4444';
const CHART_HEIGHT = 320;

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

// ────── One "label ... value" row in the period summary ──────
const SummaryRow = ({ label, value, detail, valueClass = 'text-gray-900 dark:text-gray-100' }) => (
  <div className="flex items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
    <div className="min-w-0">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      {detail && <p className="text-xs text-gray-400 dark:text-gray-500">{detail}</p>}
    </div>
    <p className={`text-base font-semibold shrink-0 ${valueClass}`}>{value}</p>
  </div>
);

// ────── Main Component ──────
// Monthly trends take two thirds of the row; the period summary and top categories stack beside it
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

  const { top5, hasCategoryData, monthlyDataFiltered, monthlyAvg, monthMax, monthMin, hasMonthlyData, monthsCount } = chartData;

  // Share of all spending in the period (not just the top 5)
  const allCategoriesTotal = categoryData.reduce((sum, c) => sum + (Number(c.value) || 0), 0);
  const monthLabelFor = (amount) => monthlyDataFiltered.find((m) => m.amount === amount)?.month;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ────── Monthly Trends Chart ────── */}
      <Card className="lg:col-span-2 flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Trends</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Last {monthsCount} months
            {monthlyBudget > 0 && <> • dashed line is your {formatCurrency(monthlyBudget)} monthly budget</>}
          </p>
        </div>
        <div className="flex-1" style={{ minHeight: CHART_HEIGHT }} role="img" aria-label="Monthly spending trends chart">
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
      </Card>

      <div className="flex flex-col gap-6">
        {/* ────── Period summary ────── */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">This period</h2>
          {hasMonthlyData ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <SummaryRow label="Average per month" value={formatCurrency(Math.round(monthlyAvg))} />
              <SummaryRow
                label="Highest month"
                detail={monthLabelFor(monthMax)}
                value={formatCurrency(monthMax)}
                valueClass="text-red-600 dark:text-red-400"
              />
              <SummaryRow
                label="Lowest month"
                detail={monthLabelFor(monthMin)}
                value={formatCurrency(monthMin)}
                valueClass="text-green-600 dark:text-green-400"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No spending in this period yet.</p>
          )}
        </Card>

        {/* ────── Top categories as a simple list ────── */}
        <Card className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Top categories</h2>
          {hasCategoryData ? (
            <ul className="space-y-3">
              {top5.map((cat) => {
                const pct = allCategoriesTotal > 0 ? (cat.value / allCategoriesTotal) * 100 : 0;
                return (
                  <li key={cat.name}>
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{cat.name}</span>
                      <span className="shrink-0 text-gray-900 dark:text-gray-100 font-semibold">
                        {formatCurrency(cat.value)}
                        <span className="ml-1.5 text-xs font-normal text-gray-500 dark:text-gray-400">{pct.toFixed(0)}%</span>
                      </span>
                    </div>
                    <div className="mt-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No spending in this period yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
