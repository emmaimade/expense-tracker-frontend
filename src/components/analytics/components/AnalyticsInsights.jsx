import { usePreferencesContext } from '../../../context/PreferencesContext';

const AnalyticsInsights = ({ analytics, trendInsight }) => {
  const { budgetAdherence, categoryData } = analytics;
  const { formatCurrency } = usePreferencesContext();

  if (categoryData.length === 0) return null;

  const insights = [];

  // Budget alerts
  if (budgetAdherence > 100) {
    insights.push({
      type: 'error',
      icon: '⚠️',
      title: 'Over Budget Alert',
      message: `You've exceeded your budget by ${budgetAdherence - 100}%. Consider reviewing your spending.`,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      descColor: 'text-red-700',
    });
  } else if (budgetAdherence > 80) {
    insights.push({
      type: 'warning',
      icon: '⚡',
      title: 'Budget Warning',
      message: `You're approaching your budget limit at ${budgetAdherence}% usage.`,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-900',
      descColor: 'text-yellow-700',
    });
  } else if (budgetAdherence > 0) {
    insights.push({
      type: 'success',
      icon: '✅',
      title: 'Great Job!',
      message: `You're managing your budget well with ${100 - budgetAdherence}% remaining.`,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      descColor: 'text-green-700',
    });
  }

  // Top category insight
  if (categoryData.length > 0) {
    insights.push({
      type: 'info',
      icon: '📊',
      title: 'Top Category',
      message: `Your highest spending is in ${categoryData[0]?.name} at ${formatCurrency(categoryData[0]?.value)}.`,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      descColor: 'text-blue-700',
    });
  }

  // Trend insight
  if (trendInsight) {
    const trendColors = {
      warning: {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-900',
        descColor: 'text-yellow-700',
      },
      success: {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-900',
        descColor: 'text-green-700',
      },
    };

    const colors = trendColors[trendInsight.type];
    insights.push({
      type: trendInsight.type,
      icon: trendInsight.icon,
      title: trendInsight.title,
      message: trendInsight.message,
      ...colors,
    });
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}
          >
            <h3 className={`font-medium ${insight.textColor} flex items-center gap-2`}>
              <span className="text-lg">{insight.icon}</span>
              {insight.title}
            </h3>
            <p className={`text-sm ${insight.descColor} mt-1`}>
              {insight.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsInsights;