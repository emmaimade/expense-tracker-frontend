import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useChartData } from '../hooks/useChartData';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

// ────── Constants ──────
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const CHART_HEIGHT = 320;
const CATEGORY_CHART_HEIGHT = 280;

// Tooltip styling
const TOOLTIP_STYLE = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '13px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

// ────── Utility Functions ──────
// Currency formatting is provided by PreferencesContext (formatCurrency, getCurrencySymbol)

// ────── Reusable Empty State Component ──────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500">
    <svg
      className="w-12 h-12 mb-2 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
    <p className="text-sm font-medium">No data available</p>
    <p className="text-xs text-gray-400 mt-1">Add expenses to see insights</p>
  </div>
);

// ────── Category Legend Component ──────
const CategoryLegend = ({ categories, total, colors, formatCurrency }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
      {categories.map((cat, i) => {
        const pct = total > 0
          ? ((cat.value / total) * 100).toFixed(1)
          : '0.0';
        
        return (
          <div key={`${cat.name}-${i}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: colors[i % colors.length] }}
                aria-hidden="true"
              />
              <span className="text-sm text-gray-700 font-medium truncate">
                {cat.name}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-sm text-gray-900 font-semibold">
                {formatCurrency(cat.value)}
              </span>
              <span className="text-xs text-gray-500 min-w-[45px] text-right">
                {pct}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

CategoryLegend.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  total: PropTypes.number.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// ────── Stats Grid Component ──────
const StatsGrid = ({ avg, max, min, formatCurrency }) => (
  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3">
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Average</p>
      <p className="text-lg font-bold text-gray-900">
        {formatCurrency(Math.round(avg))}
      </p>
    </div>
    <div className="text-center p-3 bg-red-50 rounded-lg">
      <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Highest</p>
      <p className="text-lg font-bold text-red-600">
        {formatCurrency(max)}
      </p>
    </div>
    <div className="text-center p-3 bg-green-50 rounded-lg">
      <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Lowest</p>
      <p className="text-lg font-bold text-green-600">
        {formatCurrency(min)}
      </p>
    </div>
  </div>
);

StatsGrid.propTypes = {
  avg: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
};

// ────── Main Component ──────
const AnalyticsDashboard = ({
  categoryData = [],
  monthlyData = [],
  timeRange = '6months',
}) => {
  // Use custom hook for data transformation
  const chartData = useChartData(categoryData, monthlyData, timeRange);

  const { formatCurrency, getCurrencySymbol } = usePreferencesContext();

  const axisFormatter = (v) => {
    const num = Number(v);
    if (isNaN(num)) return formatCurrency(0);
    return num >= 1000 ? `${getCurrencySymbol()}${(num / 1000).toFixed(0)}k` : `${getCurrencySymbol()}${num}`;
  };
  
  const {
    top5,
    catTotal,
    hasCategoryData,
    monthlyDataFiltered,
    monthlyAvg,
    monthMax,
    monthMin,
    hasMonthlyData,
    monthsCount,
  } = chartData;

  // ────── Render ──────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ────── Top Spending Categories Chart ────── */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Top Spending Categories
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Last {monthsCount} months • Top {top5.length} categories • {formatCurrency(catTotal)} total
          </p>
        </div>

        <div 
          style={{ height: CATEGORY_CHART_HEIGHT }} 
          role="img" 
          aria-label={`Top ${top5.length} spending categories chart`}
        >
          {hasCategoryData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top5}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#111827', fontWeight: 'medium' }}
                  width={90}
                />
                <XAxis
                  type="number"
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={false}
                  tickFormatter={axisFormatter}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    formatter={(v) => [formatCurrency(v), 'Spending']}
                    contentStyle={TOOLTIP_STYLE}
                  />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20} 
                  minPointSize={2}
                >
                  {top5.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </div>

        <CategoryLegend categories={top5} total={catTotal} colors={COLORS} formatCurrency={formatCurrency} />
      </Card>

      {/* ────── Monthly Trends Chart ────── */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Trends</h2>
            <p className="text-sm text-gray-500 mt-1">
            Last {monthsCount} months • {formatCurrency(Math.round(monthlyAvg))} avg
          </p>
        </div>

        <div 
          style={{ height: CHART_HEIGHT }} 
          role="img" 
          aria-label="Monthly spending trends chart"
        >
          {hasMonthlyData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={monthlyDataFiltered} 
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db' }}
                  tickFormatter={axisFormatter}
                />
                <Tooltip
                  formatter={(v) => [formatCurrency(v), 'Spending']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#4f46e5" 
                  radius={[8, 8, 0, 0]} 
                  minPointSize={5} 
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </div>

        {hasMonthlyData && (
          <StatsGrid 
            avg={monthlyAvg} 
            max={monthMax} 
            min={monthMin} 
            formatCurrency={formatCurrency}
          />
        )}
      </Card>
    </div>
  );
};

// ────── PropTypes ──────
AnalyticsDashboard.propTypes = {
  categoryData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  monthlyData: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string,
      amount: PropTypes.number,
    })
  ),
  timeRange: PropTypes.oneOf(['3months', '6months', '1year']),
};

export default AnalyticsDashboard;