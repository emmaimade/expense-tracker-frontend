import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

const AnalyticsInsights = ({ analytics, trendInsight }) => {
  const { budgetAdherence, categoryData } = analytics;
  const { formatCurrency } = usePreferencesContext();

  if (categoryData.length === 0) return null;

  const insights = [];

  if (budgetAdherence > 100) {
    insights.push({
      type: 'error', icon: '⚠️', title: 'Over Budget Alert',
      message: `You've exceeded your budget by ${budgetAdherence - 100}%. Consider reviewing your spending.`,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-900 dark:text-red-300',
      descColor: 'text-red-700 dark:text-red-400',
    });
  } else if (budgetAdherence > 80) {
    insights.push({
      type: 'warning', icon: '⚡', title: 'Budget Warning',
      message: `You're approaching your budget limit at ${budgetAdherence}% usage.`,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-900 dark:text-yellow-300',
      descColor: 'text-yellow-700 dark:text-yellow-400',
    });
  } else if (budgetAdherence > 0) {
    insights.push({
      type: 'success', icon: '✅', title: 'Great Job!',
      message: `You're managing your budget well with ${100 - budgetAdherence}% remaining.`,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-900 dark:text-green-300',
      descColor: 'text-green-700 dark:text-green-400',
    });
  }

  if (categoryData.length > 0) {
    insights.push({
      type: 'info', icon: '📊', title: 'Top Category',
      message: `Your highest spending is in ${categoryData[0]?.name} at ${formatCurrency(categoryData[0]?.value)}.`,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-900 dark:text-blue-300',
      descColor: 'text-blue-700 dark:text-blue-400',
    });
  }

  if (trendInsight) {
    const trendColors = {
      warning: {
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        textColor: 'text-yellow-900 dark:text-yellow-300',
        descColor: 'text-yellow-700 dark:text-yellow-400',
      },
      success: {
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-900 dark:text-green-300',
        descColor: 'text-green-700 dark:text-green-400',
      },
    };
    insights.push({
      type: trendInsight.type, icon: trendInsight.icon,
      title: trendInsight.title, message: trendInsight.message,
      ...trendColors[trendInsight.type],
    });
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Key Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}>
            <h3 className={`font-medium ${insight.textColor} flex items-center gap-2`}>
              <span className="text-lg">{insight.icon}</span>
              {insight.title}
            </h3>
            <p className={`text-sm ${insight.descColor} mt-1`}>{insight.message}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AnalyticsInsights;