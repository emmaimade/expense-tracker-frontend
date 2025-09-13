import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsDashboard = ({ 
  categoryData = [], 
  monthlyData = [], 
  dateRange = 'month',
  setDateRange,
  customDateRange = { startDate: '', endDate: '' }
}) => {
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    const RADIS = outerRadius + 25;
    const x = cx + RADIS * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + RADIS * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <g>
        <text
          x={x}
          y={y}
          fill="black"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          <tspan x={x} dy="-0.5em" fontWeight="medium">{`${name}`}</tspan>
          <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
        </text>
      </g>
    );
  };

  const getDateRangeLabel = (range) => {
    switch (range) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'quarter':
        return 'This Quarter';
      case 'year':
        return 'This Year';
      default:
        return 'This Month';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Spending by Category Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Spending by Category
          </h2>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="h-80">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <p className="text-center">
                No expense data available for {getDateRangeLabel(dateRange).toLowerCase()}
              </p>
              <p className="text-sm text-center mt-2">
                Try selecting a different time period or adding some expenses
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Spending Trends Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Monthly Spending Trends
          </h2>
          <div className="text-sm text-gray-500">
            {customDateRange.startDate && customDateRange.endDate
              ? `${new Date(customDateRange.startDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                )} - ${new Date(customDateRange.endDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                )}`
              : "Last 6 months"}
          </div>
        </div>
        <div className="h-80">
          {monthlyData.length > 0 &&
          monthlyData.some((month) => month.amount > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Amount"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="amount" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <p className="text-center">
                No monthly spending data available
              </p>
              <p className="text-sm text-center mt-2">
                Start adding expenses to see trends
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;